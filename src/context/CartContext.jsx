import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import ordersApi from '../services/ordersApi';
import { getToken } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

const getCartStorageKey = (userId) => (userId ? `psp_cart_${userId}` : 'psp_cart_guest');

const readLocalCart = (userId) => {
  try {
    const key = getCartStorageKey(userId);
    const saved = localStorage.getItem(key);
    if (saved) return JSON.parse(saved);
    // Legacy fallback only for guest if psp_local_cart exists
    if (!userId) {
      const legacy = localStorage.getItem('psp_local_cart');
      if (legacy) return JSON.parse(legacy);
    }
    return [];
  } catch {
    return [];
  }
};

// Reconstruir grupos por Empresa Aliada a partir de los ítems locales
const buildGroupsFromItems = (items) => {
  if (!items || !items.length) return [];
  const grouped = {};
  for (const item of items) {
    const key = item.companyId || 'psp-global';
    if (!grouped[key]) {
      grouped[key] = {
        companyId: item.companyId || null,
        companyName: item.empresa || item.companyName || item.proveedor || 'Comercio Local PSP',
        items: [],
        subtotal: 0,
        totalItems: 0
      };
    }
    grouped[key].items.push(item);
    grouped[key].subtotal += (item.precio || item.unitPrice || 0) * item.quantity;
    grouped[key].totalItems += item.quantity;
  }
  return Object.values(grouped);
};

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const userId = user?.id || null;
  const [prevUserId, setPrevUserId] = useState(userId);

  const [cartItems, setCartItems] = useState(() => readLocalCart(userId));
  const [cartGroups, setCartGroups] = useState(() => buildGroupsFromItems(readLocalCart(userId)));
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cartError, setCartError] = useState(null);

  // Sincronización instantánea de estado ante cambio de usuario o logout (evita fugas entre sesiones)
  if (prevUserId !== userId) {
    setPrevUserId(userId);
    const freshItems = userId ? readLocalCart(userId) : [];
    setCartItems(freshItems);
    setCartGroups(buildGroupsFromItems(freshItems));
    setCartError(null);
  }

  // Guardar en localStorage siempre que cambie cartItems o el usuario activo
  useEffect(() => {
    try {
      const key = getCartStorageKey(userId);
      localStorage.setItem(key, JSON.stringify(cartItems));
      setCartGroups(buildGroupsFromItems(cartItems));
    } catch { }
  }, [cartItems, userId]);

  // Limpieza estricta de localStorage al cerrar sesión (no dejar rastro en guest)
  useEffect(() => {
    if (!userId) {
      try {
        localStorage.removeItem('psp_cart_guest');
        localStorage.removeItem('psp_local_cart');
      } catch { }
    }
  }, [userId]);

  // Limpiar mensaje de error tras 6 segundos automáticamente
  useEffect(() => {
    if (!cartError) return;
    const timer = setTimeout(() => setCartError(null), 6000);
    return () => clearTimeout(timer);
  }, [cartError]);

  // Sincronizar con la API si hay sesión iniciada
  const syncWithApi = useCallback(async () => {
    const token = getToken();
    if (!token) return;

    try {
      setLoading(true);
      const serverCart = await ordersApi.getCart();
      if (serverCart) {
        if (typeof serverCart.discountPercentage === 'number') {
          setServerDiscountPct(serverCart.discountPercentage);
        }
        const groups = serverCart.groups || [];
        setCartGroups(groups);
        if (groups.length === 0) {
          setCartItems([]);
        } else {
          // Aplanar los grupos para cartItems preservando stock y metadata enriquecida
          setCartItems(prev => {
            const flatItems = groups.flatMap(g =>
              g.items.map(i => {
                const localExisting = prev.find(p => (p.id === i.productId || p.productId === i.productId));
                return {
                  id: i.productId || i.id,
                  productId: i.productId,
                  nombre: i.productName,
                  sku: i.sku,
                  precio: i.unitPrice,
                  precioAnterior: localExisting?.precioAnterior ?? null,
                  descuentoGold: i.descuentoGold ?? localExisting?.descuentoGold ?? 15,
                  descuentoPlata: i.descuentoPlata ?? localExisting?.descuentoPlata ?? 10,
                  descuentoSocial: i.descuentoSocial ?? localExisting?.descuentoSocial ?? 3,
                  appliedDiscountPercentage: i.appliedDiscountPercentage,
                  stock: localExisting?.stock ?? 99,
                  imagen: i.productImage || localExisting?.imagen || '',
                  companyId: i.companyId,
                  empresa: i.companyName,
                  proveedor: i.companyName,
                  quantity: i.quantity
                };
              })
            );
            return flatItems;
          });
        }
      }
    } catch (err) {
      console.warn('Sincronización de carrito en segundo plano no disponible:', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Sincronización con backend ante montaje o cambio a un usuario autenticado
  useEffect(() => {
    if (userId && getToken()) {
      syncWithApi();
    }
  }, [userId, syncWithApi]);

  const addToCart = async (product, qty = 1) => {
    setCartError(null);
    const productId = product.id;
    const unitPrice = product.precio || product.price || 0;
    const companyId = product.companyId || product.CompanyId || null;
    const companyName = product.empresa || product.companyName || product.proveedor || 'Comercio Local PSP';
    const mainImg = product.imagen || (product.imagenes && product.imagenes[0]) || '';
    const availableStock = typeof product.stock === 'number' ? product.stock : 99;

    // Validación 1: Producto agotado en inventario
    if (availableStock <= 0) {
      setCartError(`Lo sentimos, '${product.nombre || 'el producto'}' se encuentra agotado temporalmente.`);
      setIsCartOpen(true);
      return;
    }

    // Validación 2: Control de cantidades según stock disponible
    let finalQtyToAdd = qty;
    const existing = cartItems.find(item => item.id === productId || item.productId === productId);

    if (existing) {
      const maxAllowed = typeof existing.stock === 'number' ? existing.stock : availableStock;
      const currentInCart = existing.quantity;

      if (currentInCart >= maxAllowed) {
        setCartError(`Ya tienes en el carrito el límite de ${maxAllowed} unidades disponibles de '${product.nombre}'.`);
        setIsCartOpen(true);
        return;
      }

      if (currentInCart + qty > maxAllowed) {
        finalQtyToAdd = maxAllowed - currentInCart;
        setCartError(`Solo se agregaron ${finalQtyToAdd} unidad(es) adicional(es). Alcanzaste el límite de stock (${maxAllowed}) de '${product.nombre}'.`);
      }
    } else {
      if (qty > availableStock) {
        finalQtyToAdd = availableStock;
        setCartError(`Solo hay ${availableStock} unidad(es) disponible(s) de '${product.nombre}'. Se ajustó la cantidad agregada.`);
      }
    }

    if (finalQtyToAdd <= 0) return;

    // 1. Actualización optimista local
    setCartItems(prev => {
      const prevExisting = prev.find(item => item.id === productId || item.productId === productId);
      if (prevExisting) {
        return prev.map(item =>
          (item.id === productId || item.productId === productId)
            ? {
                ...item,
                quantity: item.quantity + finalQtyToAdd,
                stock: availableStock,
                descuentoGold: product.descuentoGold ?? item.descuentoGold ?? 15,
                descuentoPlata: product.descuentoPlata ?? item.descuentoPlata ?? 10,
                descuentoSocial: product.descuentoSocial ?? item.descuentoSocial ?? 3
              }
            : item
        );
      }
      return [...prev, {
        id: productId,
        productId,
        nombre: product.nombre || product.name || 'Producto',
        sku: product.sku || '',
        precio: unitPrice,
        precioAnterior: product.precioAnterior || null,
        descuentoGold: product.descuentoGold ?? 15,
        descuentoPlata: product.descuentoPlata ?? 10,
        descuentoSocial: product.descuentoSocial ?? 3,
        stock: availableStock,
        imagen: mainImg,
        companyId,
        empresa: companyName,
        proveedor: companyName,
        quantity: finalQtyToAdd
      }];
    });

    setIsCartOpen(true);

    // 2. Si hay token, sincronizar con la API de pedidos
    if (getToken()) {
      try {
        await ordersApi.addToCart(productId, finalQtyToAdd);
        await syncWithApi();
      } catch (err) {
        setCartError(err.message);
      }
    }
  };

  const removeFromCart = async (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id && item.productId !== id));

    if (getToken()) {
      try {
        await ordersApi.removeFromCart(id);
        await syncWithApi();
      } catch (err) {
        console.warn('Error al eliminar de la API de carrito:', err.message);
      }
    }
  };

  const updateQuantity = async (id, delta) => {
    const currentItem = cartItems.find(item => item.id === id || item.productId === id);
    if (!currentItem) return;

    const maxStock = typeof currentItem.stock === 'number' ? currentItem.stock : 99;

    // Control de límite superior por stock
    if (delta > 0 && currentItem.quantity + delta > maxStock) {
      setCartError(`No puedes agregar más unidades de '${currentItem.nombre}'. Límite máximo en bodega: ${maxStock}.`);
      return;
    }

    const newQty = currentItem.quantity + delta;

    if (newQty <= 0) {
      removeFromCart(id);
      return;
    }

    setCartItems(prev =>
      prev.map(item => {
        if (item.id === id || item.productId === id) {
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );

    if (getToken()) {
      try {
        await ordersApi.updateQuantity(id, newQty);
        await syncWithApi();
      } catch (err) {
        setCartError(err.message);
      }
    }
  };

  const clearCart = async () => {
    setCartItems([]);
    setCartGroups([]);
    try {
      localStorage.removeItem(getCartStorageKey(userId));
      localStorage.removeItem('psp_cart_guest');
      localStorage.removeItem('psp_local_cart');
    } catch { }

    if (getToken()) {
      try {
        await ordersApi.clearCart();
      } catch { }
    }
  };

  const [, setServerDiscountPct] = useState(null);

  // Resolver el Nivel de Beneficio (Tier) del comprador según sus roles y empresa
  // Gold: empresa_aliada (companyId o personType juridica), admin, admin_sistema, membresia_gold
  // Plata: membresia_plata, coordinador, moderador
  // Social: emprendedor_social
  const resolveUserDiscountTier = () => {
    if (!user) return 'none';

    // Cualquier Empresa Aliada (con companyId o registrada como persona jurídica) accede directamente al beneficio Gold
    if (user.companyId || user.personType === 'juridica') {
      return 'gold';
    }

    const rawRoles = [
      ...(Array.isArray(user.roles) ? user.roles : []),
      ...(Array.isArray(user.roleDisplayNames) ? user.roleDisplayNames : []),
      user.role
    ].filter(Boolean).map(r => String(r).toLowerCase().trim().replace(/_/g, ' '));

    const plan = String(user.membershipPlan || '').toLowerCase().trim().replace(/_/g, ' ');

    if (
      plan.includes('gold') ||
      rawRoles.some(r => ['membresia gold', 'gold', 'admin', 'admin sistema', 'administrador', 'empresa aliada', 'empresa'].includes(r))
    ) {
      return 'gold';
    }

    if (
      plan.includes('plata') ||
      rawRoles.some(r => ['membresia plata', 'plata', 'coordinador', 'moderador'].includes(r))
    ) {
      return 'plata';
    }

    if (
      plan.includes('social') ||
      rawRoles.some(r => ['emprendedor social', 'social', 'emprendedor'].includes(r))
    ) {
      return 'social';
    }

    return 'none';
  };

  const discountTier = resolveUserDiscountTier();

  const resolveItemDiscountPct = (item) => {
    const tier = resolveUserDiscountTier();
    if (tier === 'none') return 0;

    // Si viene sincronizado desde el backend y tiene descuento positivo calculado
    if (typeof item.appliedDiscountPercentage === 'number' && item.appliedDiscountPercentage > 0) {
      return Math.min(100, Math.max(0, item.appliedDiscountPercentage));
    }

    // Resolver directamente a partir de las columnas de descuento por membresía del producto
    if (tier === 'gold') return Math.min(100, Math.max(0, Number(item.descuentoGold ?? 15)));
    if (tier === 'plata') return Math.min(100, Math.max(0, Number(item.descuentoPlata ?? 10)));
    if (tier === 'social') return Math.min(100, Math.max(0, Number(item.descuentoSocial ?? 3)));
    return 0;
  };

  const subtotalAmount = cartItems.reduce(
    (sum, item) => sum + (item.precio || item.unitPrice || 0) * item.quantity,
    0
  );

  const discountAmount = cartItems.reduce((sum, item) => {
    const itemSub = (item.precio || item.unitPrice || 0) * item.quantity;
    const pct = resolveItemDiscountPct(item);
    return sum + Math.round((itemSub * pct) / 100);
  }, 0);

  const discountPercentage = subtotalAmount > 0 && discountAmount > 0
    ? Math.round((discountAmount / subtotalAmount) * 10000) / 100
    : (discountTier === 'gold' ? 15 : discountTier === 'plata' ? 10 : discountTier === 'social' ? 3 : 0);

  const payableAmount = Math.max(0, subtotalAmount - discountAmount);
  // Mantiene totalAmount como el subtotal bruto para las validaciones de compra mínima ($20,000 COP)
  const totalAmount = subtotalAmount;

  const totalItemsCount = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
    <CartContext.Provider value={{
      cartItems,
      cartGroups,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      subtotalAmount,
      discountPercentage,
      discountAmount,
      payableAmount,
      totalAmount,
      totalItemsCount,
      isCartOpen,
      setIsCartOpen,
      syncWithApi,
      loading,
      cartError,
      setCartError,
      clearCartError: () => setCartError(null)
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
export default CartContext;
