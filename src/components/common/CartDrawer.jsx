import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Store, AlertCircle } from 'lucide-react';
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
    setCartError
  } = useCart();

  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const handleGoToCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => {
          setIsCartOpen(false);
          if (cartError) setCartError(null);
        }}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-4 sm:pl-10">
        <div className="w-full sm:w-[420px] max-w-md bg-white dark:bg-[#131c1a] shadow-2xl flex flex-col border-l border-slate-200 dark:border-[#203330]">
          
          {/* Header */}
          <div className="p-5 bg-[#0c4236] text-white flex items-center justify-between border-b border-[#0f5144]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-teal-400/20 text-teal-300 flex items-center justify-center font-bold">
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
                if (cartError) setCartError(null);
              }}
              className="p-1.5 rounded-xl text-slate-200 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Error Banner */}
          {cartError && (
            <div className="mx-4 mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span className="font-semibold">{cartError}</span>
            </div>
          )}

          {/* Items List (Grouped by Empresa Aliada) */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 py-12">
                <ShoppingBag className="w-16 h-16 text-slate-300 dark:text-slate-700 mb-4 stroke-1" />
                <p className="text-base font-bold text-slate-700 dark:text-slate-300">Tu carrito está vacío</p>
                <p className="text-xs text-slate-400 mt-1 max-w-xs">
                  Explora las artesanías, gastronomía y productos de los productores de Urabá.
                </p>
              </div>
            ) : (
              cartGroups.map((group, gIdx) => (
                <div 
                  key={group.companyId || `group-${gIdx}`} 
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 p-3.5 space-y-3"
                >
                  {/* Encabezado del Paquete / Vendedor (Estilo Mercado Libre / Falabella) */}
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-200/80 dark:border-slate-800 text-[11px] font-bold text-[#0c4236] dark:text-teal-400">
                    <Store className="w-3.5 h-3.5 text-emerald-600 dark:text-teal-400" />
                    <span className="truncate">Vendido por: <strong className="text-slate-900 dark:text-white">{group.companyName}</strong></span>
                  </div>

                  {/* Lista de productos de esta empresa */}
                  <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {group.items.map((item) => (
                      <div key={item.id || item.productId} className="py-2.5 flex gap-3 items-center">
                        <img 
                          src={item.imagen || item.productImage || '/icon.png'} 
                          alt={item.nombre || item.productName} 
                          className="w-14 h-14 rounded-xl object-cover border border-slate-200 dark:border-slate-800 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {item.nombre || item.productName}
                          </h4>
                          <p className="text-xs font-extrabold text-[#0c4236] dark:text-teal-400 mt-0.5">
                            ${((item.precio || item.unitPrice || 0) * item.quantity).toLocaleString()} COP
                          </p>
                        </div>

                        {/* Controles de Cantidad */}
                        <div className="flex items-center gap-1.5 bg-white dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm shrink-0">
                          <button 
                            onClick={() => updateQuantity(item.id || item.productId, -1)}
                            className="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-extrabold text-slate-900 dark:text-white min-w-[14px] text-center">
                            {item.quantity}
                          </span>
                          <button 
                            onClick={() => updateQuantity(item.id || item.productId, 1)}
                            className="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button 
                          onClick={() => removeFromCart(item.id || item.productId)}
                          className="text-slate-400 hover:text-rose-500 p-1 transition-colors shrink-0"
                          title="Eliminar producto"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 text-right text-[11px] font-semibold text-slate-500">
                    Subtotal paquete: <span className="font-extrabold text-slate-900 dark:text-white">${group.subtotal.toLocaleString()} COP</span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary */}
          {cartItems.length > 0 && (
            <div className="p-5 bg-slate-50 dark:bg-[#0e1514] border-t border-slate-200 dark:border-slate-800 flex flex-col gap-3.5">
              <div className="flex justify-between items-center text-sm font-bold text-slate-900 dark:text-white">
                <span>Total Estimado:</span>
                <span className="text-xl text-[#0c4236] dark:text-teal-400 font-black">
                  ${totalAmount.toLocaleString()} COP
                </span>
              </div>

              <button
                onClick={handleGoToCheckout}
                className="w-full py-3.5 rounded-xl bg-[#0c4236] hover:bg-[#0f5144] dark:bg-gradient-to-r dark:from-teal-400 dark:to-emerald-400 dark:hover:from-teal-300 dark:hover:to-emerald-300 text-white dark:text-slate-950 font-black text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Continuar al Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
