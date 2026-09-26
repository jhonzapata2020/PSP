import React, { useState } from 'react';
import { Store, ShoppingBag, Wrench, Utensils, Bus, Compass, Search, Plus, PhoneCall } from 'lucide-react';
import { PRODUCTOS, SERVICIOS, RESTAURANTES, TRANSPORTE_RUTAS, TURISMO_DESTINOS } from '../data/mockData';
import { useCart } from '../context/CartContext';

const ComercioPage = () => {
  const [activeTab, setActiveTab] = useState('productos');
  const [searchTerm, setSearchTerm] = useState('');
  const { addToCart } = useCart();

  const tabs = [
    { id: 'productos', label: 'Productos Locales', icon: ShoppingBag },
    { id: 'servicios', label: 'Servicios Especializados', icon: Wrench },
    { id: 'restaurantes', label: 'Restaurantes & Gastronomía', icon: Utensils },
    { id: 'transporte', label: 'Rutas & Transporte', icon: Bus },
    { id: 'turismo', label: 'Turismo & Experiencias', icon: Compass },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 space-y-6 sm:space-y-8">
      
      {/* Page Header */}
      <div className="space-y-3 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-bold">
          <Store className="w-3.5 h-3.5" />
          Directorio Comercial & Servicios Urabá
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Comercio, Transporte y Experiencias Locales
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Encuentra productos artesanales, logística de transporte subregional, gastronomía del Caribe antioqueño y asesoría técnica especializada.
        </p>
      </div>

      {/* Tabs bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800">
        {tabs.map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-4 py-3 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                isActive
                  ? 'bg-psp-cyan text-slate-950 shadow-lg shadow-psp-cyan/20'
                  : 'bg-white dark:bg-psp-dark-card text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: PRODUCTOS */}
      {activeTab === 'productos' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PRODUCTOS.map((prod) => (
            <div key={prod.id} className="rounded-2xl bg-white dark:bg-psp-dark-card border border-slate-200 dark:border-slate-800 overflow-hidden shadow-psp-soft flex flex-col justify-between hover:shadow-xl transition-all">
              <div>
                <img src={prod.imagen} alt={prod.nombre} className="w-full h-48 object-cover" />
                <div className="p-5">
                  <span className="text-[10px] font-bold text-psp-cyan uppercase tracking-wider">{prod.categoria}</span>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-1">{prod.nombre}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">{prod.descripcion}</p>
                  <p className="text-[11px] font-semibold text-emerald-500 mt-3">Por: {prod.proveedor}</p>
                </div>
              </div>

              <div className="p-5 pt-0 flex items-center justify-between">
                <div>
                  <span className="text-base font-extrabold text-slate-900 dark:text-white">${prod.precio.toLocaleString()} COP</span>
                  {prod.precioAnterior && (
                    <span className="block text-[10px] text-slate-400 line-through">${prod.precioAnterior.toLocaleString()}</span>
                  )}
                </div>
                <button
                  onClick={() => addToCart(prod)}
                  className="px-4 py-2 rounded-xl bg-psp-cyan text-slate-950 text-xs font-bold hover:bg-psp-cyan-hover transition-colors shadow-md"
                >
                  Añadir al carrito
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: SERVICIOS */}
      {activeTab === 'servicios' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SERVICIOS.map((serv) => (
            <div key={serv.id} className="rounded-2xl bg-white dark:bg-psp-dark-card border border-slate-200 dark:border-slate-800 overflow-hidden shadow-psp-soft p-6 flex flex-col justify-between">
              <div>
                <img src={serv.imagen} alt={serv.nombre} className="w-full h-40 rounded-xl object-cover mb-4" />
                <span className="text-[10px] font-extrabold text-psp-cyan uppercase">{serv.categoria}</span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1 mb-2">{serv.nombre}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">{serv.descripcion}</p>
              </div>
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block">Tarifa Estimada</span>
                  <span className="text-xs font-extrabold text-psp-cyan">{serv.precioEstimado}</span>
                </div>
                <button className="px-3 py-1.5 rounded-lg bg-slate-900 dark:bg-slate-800 text-white text-xs font-bold hover:bg-psp-cyan hover:text-slate-950 transition-colors">
                  Solicitar Información
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: RESTAURANTES */}
      {activeTab === 'restaurantes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {RESTAURANTES.map((rest) => (
            <div key={rest.id} className="rounded-2xl bg-white dark:bg-psp-dark-card border border-slate-200 dark:border-slate-800 p-6 flex flex-col sm:flex-row gap-6 shadow-psp-soft">
              <img src={rest.imagen} alt={rest.nombre} className="w-full sm:w-44 h-44 rounded-xl object-cover" />
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">{rest.nombre}</h3>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 text-[10px] font-extrabold">★ {rest.calificacion}</span>
                  </div>
                  <p className="text-xs text-psp-cyan font-medium mt-1">{rest.ubicación}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-2"><strong>Especialidad:</strong> {rest.especialidad}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Horario: {rest.horario}</span>
                  <button className="px-3 py-1.5 rounded-lg bg-psp-cyan text-slate-950 font-bold hover:bg-psp-cyan-hover">
                    Reservar Mesa
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: TRANSPORTE */}
      {activeTab === 'transporte' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-psp-teal-dark to-slate-900 p-6 rounded-2xl text-white flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <h3 className="text-lg font-bold">Solicitud de Transporte & Envíos Urabá</h3>
              <p className="text-xs text-slate-300 mt-1">Conecta con cooperativas de transporte de carga y pasajeros para Apartadó, Turbo, Necoclí y Medellín.</p>
            </div>
            <button className="px-5 py-2.5 rounded-xl bg-psp-cyan text-slate-950 font-extrabold text-xs shadow-lg whitespace-nowrap">
              Cotizar Envío Especial
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TRANSPORTE_RUTAS.map((ruta) => (
              <div key={ruta.id} className="p-6 rounded-2xl bg-white dark:bg-psp-dark-card border border-slate-200 dark:border-slate-800 shadow-psp-soft space-y-4">
                <div className="flex justify-between items-center text-xs font-bold text-psp-cyan">
                  <span>Ruta Directa</span>
                  <span className="px-2 py-0.5 rounded bg-psp-cyan/15">{ruta.empresa}</span>
                </div>
                <h4 className="text-lg font-extrabold text-slate-900 dark:text-white">
                  {ruta.origen} ➔ {ruta.destino}
                </h4>
                <div className="text-xs text-slate-500 space-y-1">
                  <p>⏱ Tiempo estimado: <strong>{ruta.tiempoEstimado}</strong></p>
                  <p>🔄 Frecuencia: <strong>{ruta.frecuencia}</strong></p>
                </div>
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                  <span className="text-base font-extrabold text-slate-900 dark:text-white">${ruta.precio.toLocaleString()} COP</span>
                  <button className="px-3 py-1.5 rounded-lg bg-slate-900 dark:bg-slate-800 text-white text-xs font-bold hover:bg-psp-cyan hover:text-slate-950 transition-colors">
                    Ver Horarios
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: TURISMO */}
      {activeTab === 'turismo' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {TURISMO_DESTINOS.map((dest) => (
            <div key={dest.id} className="rounded-2xl bg-white dark:bg-psp-dark-card border border-slate-200 dark:border-slate-800 overflow-hidden shadow-psp-soft flex flex-col justify-between">
              <img src={dest.imagen} alt={dest.nombre} className="w-full h-56 object-cover" />
              <div className="p-6 space-y-3">
                <span className="text-[10px] font-extrabold text-psp-cyan uppercase">{dest.categoria}</span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{dest.nombre}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{dest.descripcion}</p>
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                  <span className="text-xs font-bold text-emerald-400">{dest.precio}</span>
                  <button className="px-4 py-2 rounded-xl bg-psp-cyan text-slate-950 text-xs font-extrabold">
                    Reservar Guía
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default ComercioPage;
