import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  Store, 
  AlertCircle, 
  Sparkles, 
  Flame, 
  ShieldCheck, 
  Package, 
  Truck 
} from 'lucide-react';
import { useCart } from '../../context/CartContext';

const CartDrawer = () => {
  const {
    cartGroups,
    cartItems,
    removeFromCart,
    updateQuantity,
    totalAmount,
    totalItemsCount,
    isCartOpen,
    setIsCartOpen,
    cartError,
    clearCartError
  } = useCart();

  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const handleGoToCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  const handleExploreCatalog = () => {
    setIsCartOpen(false);
    navigate('/comercio?tab=productos');
  };

  const isMultiVendor = cartGroups.length > 1;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => {
          setIsCartOpen(false);
          if (cartError) clearCartError();
        }}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-4 sm:pl-10">
        <div className="w-full sm:w-[440px] max-w-md bg-white dark:bg-[#131c1a] shadow-2xl flex flex-col border-l border-slate-200 dark:border-[#203330]">
          
          {/* Header */}
          <div className="p-4 sm:p-5 bg-[#0c4236] text-white flex items-center justify-between border-b border-[#0f5144]">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-teal-400/20 text-teal-300 flex items-center justify-center font-bold shadow-inner">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-extrabold leading-tight">Carrito de Compras</h2>
                <p className="text-[11px] text-teal-200 font-medium">
                  {totalItemsCount} {totalItemsCount === 1 ? 'producto' : 'productos'} seleccionados
                </p>
              </div>
            </div>
            <button 
              onClick={() => {
                setIsCartOpen(false);
                if (cartError) clearCartError();
              }}
              className="p-1.5 rounded-xl text-slate-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Cerrar carrito"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Multi-Vendor Alert / Banner */}
          {isMultiVendor && (
            <div className="bg-teal-50 dark:bg-teal-950/40 border-b border-teal-100 dark:border-teal-900/50 px-4 py-2 flex items-center gap-2 text-[11px] font-semibold text-teal-900 dark:text-teal-200">
              <Package className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
              <span>
                Compra combinada: Recibirás <strong>{cartGroups.length} paquetes separados</strong> de cada comercio aliad@.
              </span>
            </div>
          )}

          {/* Cart Error Banner */}
          {cartError && (
            <div className="mx-4 mt-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-300 text-xs flex items-center justify-between gap-2 shadow-sm animate-fadeIn">
              <div className="flex items-center gap-2 min-w-0">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
                <span className="font-semibold leading-snug">{cartError}</span>
              </div>
              <button 
                onClick={clearCartError}
                className="text-rose-500 hover:text-rose-700 dark:hover:text-rose-200 p-1 shrink-0 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Items List (Grouped by Empresa Aliada) */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 py-12 px-4 space-y-4">
                <div className="w-20 h-20 rounded-3xl bg-slate-100 dark:bg-slate-800/80 flex items-center justify-center text-slate-400 dark:text-slate-500 shadow-inner">
                  <ShoppingBag className="w-10 h-10 stroke-1" />
                </div>
                <div className="space-y-1.5 max-w-xs">
                  <p className="text-base font-bold text-slate-800 dark:text-slate-200">Tu carrito está vacío</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Explora productos de banano, café especial, artesanías de Urabá y apoya a los emprendedores locales.
                  </p>
                </div>
                <button
                  onClick={handleExploreCatalog}
                  className="px-5 py-2.5 rounded-xl bg-[#0c4236] hover:bg-[#0f5144] dark:bg-teal-400 dark:hover:bg-teal-300 text-white dark:text-slate-950 text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <span>Explorar Catálogo</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              cartGroups.map((group, gIdx) => (
                <div 
                  key={group.companyId || `group-${gIdx}`} 
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/40 p-3.5 space-y-3 shadow-xs"
                >
                  {/* Encabezado del Paquete / Vendedor (Marketplace Split-Orders) */}
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200/80 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white">
                    <div className="flex items-center gap-2 truncate">
                      <div className="w-6 h-6 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-teal-400 flex items-center justify-center shrink-0">
                        <Store className="w-3.5 h-3.5" />
                      </div>
                      <span className="truncate">
                        Vendido por: <strong className="text-[#0c4236] dark:text-teal-400">{group.companyName}</strong>
                      </span>
                    </div>
                    {isMultiVendor && (
                      <span className="px-2 py-0.5 rounded-full bg-slate-200/80 dark:bg-slate-800 text-[10px] text-slate-600 dark:text-slate-400 shrink-0 font-medium">
                        Paquete {gIdx + 1}
                      </span>
                    )}
                  </div>

                  {/* Lista de productos de esta empresa */}
                  <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {group.items.map((item) => {
                      const maxStock = typeof item.stock === 'number' ? item.stock : 99;
                      const isMaxReached = item.quantity >= maxStock;
                      const isLowStock = maxStock <= 5 && maxStock > 0;
                      const hasDiscount = item.precioAnterior && item.precioAnterior > item.precio;

                      return (
                        <div key={item.id || item.productId} className="py-3 flex gap-3 items-start">
                          <img 
                            src={item.imagen || item.productImage || '/icon.png'} 
                            alt={item.nombre || item.productName} 
                            className="w-14 h-14 rounded-xl object-cover border border-slate-200 dark:border-slate-800 shrink-0 mt-0.5"
                          />
                          <div className="flex-1 min-w-0 space-y-1">
                            <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                              {item.nombre || item.productName}
                            </h4>

                            {/* Precios y Ahorro */}
                            <div className="flex items-baseline gap-2">
                              <span className="text-xs font-extrabold text-[#0c4236] dark:text-teal-400">
                                ${((item.precio || item.unitPrice || 0) * item.quantity).toLocaleString()} COP
                              </span>
                              {hasDiscount && (
                                <span className="text-[10px] text-slate-400 line-through">
                                  ${((item.precioAnterior || 0) * item.quantity).toLocaleString()}
                                </span>
                              )}
                            </div>

                            {/* Alertas de Stock */}
                            <div className="flex flex-wrap gap-1.5 pt-0.5">
                              {isLowStock && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded-md">
                                  <Flame className="w-3 h-3" />
                                  ¡Solo quedan {maxStock} en bodega!
                                </span>
                              )}
                              {isMaxReached && (
                                <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-200/60 dark:bg-slate-800 px-1.5 py-0.5 rounded-md">
                                  Máximo disponible ({maxStock})
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Controles de Cantidad y Eliminación */}
                          <div className="flex flex-col items-end gap-2 shrink-0">
                            <div className="flex items-center gap-1 bg-white dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-xs">
                              <button 
                                onClick={() => updateQuantity(item.id || item.productId, -1)}
                                className="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors cursor-pointer"
                                title={item.quantity === 1 ? 'Eliminar del carrito' : 'Reducir cantidad'}
                              >
                                {item.quantity === 1 ? (
                                  <Trash2 className="w-3 h-3 text-rose-500" />
                                ) : (
                                  <Minus className="w-3 h-3" />
                                )}
                              </button>
                              <span className="text-xs font-extrabold text-slate-900 dark:text-white min-w-[18px] text-center">
                                {item.quantity}
                              </span>
                              <button 
                                onClick={() => updateQuantity(item.id || item.productId, 1)}
                                disabled={isMaxReached}
                                className={`p-1 rounded transition-colors ${
                                  isMaxReached 
                                    ? 'text-slate-300 dark:text-slate-600 cursor-not-allowed' 
                                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer'
                                }`}
                                title={isMaxReached ? `Máximo alcanzado (${maxStock})` : 'Agregar una unidad más'}
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            <button 
                              onClick={() => removeFromCart(item.id || item.productId)}
                              className="text-slate-400 hover:text-rose-500 p-0.5 transition-colors cursor-pointer text-[10px] flex items-center gap-1"
                              title="Eliminar producto"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>Quitar</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between text-[11px] font-semibold text-slate-500">
                    <span className="flex items-center gap-1">
                      <Truck className="w-3 h-3 text-slate-400" />
                      Despacho local Urabá
                    </span>
                    <span>
                      Subtotal comercio: <strong className="font-extrabold text-slate-900 dark:text-white">${group.subtotal.toLocaleString()} COP</strong>
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary */}
          {cartItems.length > 0 && (
            <div className="p-4 sm:p-5 bg-slate-50 dark:bg-[#0e1514] border-t border-slate-200 dark:border-slate-800 flex flex-col gap-3 shadow-lg">
              
              <div className="space-y-1">
                <div className="flex justify-between items-center text-sm font-bold text-slate-900 dark:text-white">
                  <span>Total Estimado:</span>
                  <span className="text-xl text-[#0c4236] dark:text-teal-400 font-black">
                    ${totalAmount.toLocaleString()} COP
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Impuestos incluidos. El costo de envío se calculará en el checkout según el municipio de destino.
                </p>
              </div>

              <button
                onClick={handleGoToCheckout}
                className="w-full py-3.5 rounded-xl bg-[#0c4236] hover:bg-[#0f5144] dark:bg-gradient-to-r dark:from-teal-400 dark:to-emerald-400 dark:hover:from-teal-300 dark:hover:to-emerald-300 text-white dark:text-slate-950 font-black text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Continuar al Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-3 pt-1 text-[11px] font-semibold text-slate-400">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  Compra protegida
                </span>
                <span>•</span>
                <span>Productores locales de Urabá</span>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
