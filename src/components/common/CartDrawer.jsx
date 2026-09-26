import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const CartDrawer = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, totalAmount, isCartOpen, setIsCartOpen } = useCart();
  const [purchased, setPurchased] = React.useState(false);

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    setPurchased(true);
    setTimeout(() => {
      clearCart();
      setPurchased(false);
      setIsCartOpen(false);
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-4 sm:pl-10">
        <div className="w-full sm:w-96 max-w-md bg-white dark:bg-[#131c1a] shadow-2xl flex flex-col border-l border-slate-200 dark:border-[#203330]">
          
          {/* Header */}
          <div className="p-6 bg-[#0c4236] text-white flex items-center justify-between border-b border-[#0f5144]">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-teal-300" />
              <h2 className="text-lg font-bold">Carrito de Compras</h2>
            </div>
            <button 
              onClick={() => setIsCartOpen(false)}
              className="p-1 rounded-lg text-slate-200 hover:text-white hover:bg-white/10"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Purchased Success Overlay */}
          {purchased ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-in zoom-in duration-300">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-10 h-10 animate-bounce" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">¡Pedido Realizado con Éxito!</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Gracias por apoyar a los productores y comercios de Urabá & Colombia.
              </p>
            </div>
          ) : (
            <>
              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-6 divide-y divide-slate-200 dark:divide-slate-800">
                {cartItems.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center text-slate-500">
                    <ShoppingBag className="w-16 h-16 text-slate-300 dark:text-slate-700 mb-4 stroke-1" />
                    <p className="text-base font-semibold text-slate-700 dark:text-slate-300">Tu carrito está vacío</p>
                    <p className="text-xs text-slate-400 mt-1">Explora productos y servicios locales en el directorio de comercio.</p>
                  </div>
                ) : (
                  cartItems.map((item) => (
                    <div key={item.id} className="py-4 flex gap-4 items-center">
                      <img 
                        src={item.imagen} 
                        alt={item.nombre} 
                        className="w-16 h-16 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{item.nombre}</h4>
                        <p className="text-[11px] text-[#0c4236] dark:text-teal-400 font-bold mt-0.5">{item.proveedor}</p>
                        <p className="text-xs font-extrabold text-slate-900 dark:text-white mt-1">
                          ${(item.precio * item.quantity).toLocaleString()} COP
                        </p>
                      </div>

                      {/* Quantity controls */}
                      <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-lg">
                        <button 
                          onClick={() => updateQuantity(item.id, -1)}
                          className="p-1 text-slate-600 dark:text-slate-300 hover:text-slate-900"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-bold text-slate-900 dark:text-white min-w-[16px] text-center">
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => updateQuantity(item.id, 1)}
                          className="p-1 text-slate-600 dark:text-slate-300 hover:text-slate-900"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-slate-400 hover:text-rose-500 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Footer Summary */}
              {cartItems.length > 0 && (
                <div className="p-6 bg-slate-50 dark:bg-[#0e1514] border-t border-slate-200 dark:border-slate-800 flex flex-col gap-4">
                  <div className="flex justify-between items-center text-sm font-bold text-slate-900 dark:text-white">
                    <span>Total Estimado:</span>
                    <span className="text-lg text-[#0c4236] dark:text-teal-400 font-extrabold">${totalAmount.toLocaleString()} COP</span>
                  </div>

                  <button
                    onClick={handleCheckout}
                    className="w-full py-3.5 rounded-xl bg-[#0c4236] hover:bg-[#0f5144] dark:bg-gradient-to-r dark:from-teal-400 dark:to-emerald-400 dark:hover:from-teal-300 dark:hover:to-emerald-300 text-white dark:text-slate-950 font-black text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <span>Finalizar Compra Directa</span>
                    <ArrowRight className="w-4 h-4 text-white dark:text-slate-950" />
                  </button>
                </div>
              )}
            </>
          )}

        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
