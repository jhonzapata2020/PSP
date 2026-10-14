import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import ordersApi from '../services/ordersApi';
import { getToken } from '../services/api';

const CartContext = createContext();

const LOCAL_CART_KEY = 'psp_local_cart';

export const CartProvider = ({ children }) => {
  const [cartGroups, setCartGroups] = useState([]);
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_CART_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cartError, setCartError] = useState(null);

  // Reconstruir grupos por Empresa Aliada a partir de los ítems locales
  const buildGroupsFromItems = (items) => {
    const grouped = {};
    for (const item of items) {
      const key = item.companyId || 'psp-global';
      if (!grouped[key]) {
        grouped[key] = {
          companyId: item.companyId || null,
          companyName: item.empresa || item.companyName || item.proveedor || 'Comercio Local PSP',
          items: [],
          subtotal: 0
        };
      }
      grouped[key].items.push(item);
      grouped[key].subtotal += (item.precio || item.unitPrice || 0) * item.quantity;
    }
    return Object.values(grouped);
  };

  // Guardar en localStorage siempre que cambie cartItems
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(cartItems));
      setCartGroups(buildGroupsFromItems(cartItems));
    } catch { }
  }, [cartItems]);

  // Sincronizar con la API si hay sesión iniciada
  const syncWithApi = useCallback(async () => {
    const token = getToken();
    if (!token) return;

    try {
      setLoading(true);
      const serverCart = await ordersApi.getCart();
      if (serverCart && serverCart.groups) {
        setCartGroups(serverCart.groups);
        // Aplanar los grupos para cartItems retrocompatible
        const flatItems = serverCart.groups.flatMap(g =>
          g.items.map(i => ({
            id: i.productId || i.id,
            productId: i.productId,
            nombre: i.productName,
            sku: i.sku,
            precio: i.unitPrice,
            imagen: i.productImage,
            companyId: i.companyId,
            empresa: i.companyName,
            proveedor: i.companyName,
            quantity: i.quantity
          }))
        );
        setCartItems(flatItems);
      }
    } catch (err) {
      // Degrada elegantemente a local sin bloquear al usuario
      console.warn('Sincronización de carrito en segundo plano no disponible:', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    syncWithApi();
  }, [syncWithApi]);

  const addToCart = async (product, qty = 1) => {
    setCartError(null);
    const productId = product.id;
    const unitPrice = product.precio || product.price || 0;
    const companyId = product.companyId || product.CompanyId || null;
    const companyName = product.empresa || product.companyName || product.proveedor || 'Comercio Local PSP';
    const mainImg = product.imagen || (product.imagenes && product.imagenes[0]) || '';

    // 1. Actualización optimista local
    setCartItems(prev => {
      const existing = prev.find(item => item.id === productId || item.productId === productId);
      if (existing) {
        return prev.map(item =>
          (item.id === productId || item.productId === productId)
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      }
      return [...prev, {
        id: productId,
        productId,
        nombre: product.nombre || product.name || 'Producto',
        sku: product.sku || '',
        precio: unitPrice,
        imagen: mainImg,
        companyId,
        empresa: companyName,
        proveedor: companyName,
        quantity: qty
      }];
    });

    setIsCartOpen(true);

    // 2. Si hay token, sincronizar con la API de pedidos
    if (getToken()) {
      try {
        await ordersApi.addToCart(productId, qty);
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
    localStorage.removeItem(LOCAL_CART_KEY);

    if (getToken()) {
      try {
        await ordersApi.clearCart();
      } catch { }
    }
  };

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + (item.precio || item.unitPrice || 0) * item.quantity,
    0
  );

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
      totalAmount,
      totalItemsCount,
      isCartOpen,
      setIsCartOpen,
      syncWithApi,
      loading,
      cartError,
      setCartError
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
export default CartContext;
