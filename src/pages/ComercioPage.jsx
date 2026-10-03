import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Store, ShoppingBag, Wrench, Utensils, Bus, Compass, Search, Plus, PhoneCall, Eye, MapPin, Navigation, ArrowRight, Bike, Loader2, RefreshCw, AlertCircle } from 'lucide-react';
import { SERVICIOS, RESTAURANTES, TRANSPORTE_RUTAS, TURISMO_DESTINOS } from '../data/mockData';
import { productService } from '../services/api';
import { useCart } from '../context/CartContext';
import ProductDetailView from '../components/comercio/ProductDetailView';
import CommerceDetailView from '../components/comercio/CommerceDetailView';
import PSPExpressHub from '../components/comercio/PSPExpressHub';

const ComercioPage = () => {
  const location = useLocation();
  const { addToCart } = useCart();

  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productsError, setProductsError] = useState(null);

  const fetchRealProducts = async () => {
    try {
      setLoadingProducts(true);
      setProductsError(null);
      const data = await productService.getProducts();
      setProducts(data);
    } catch (err) {
      setProductsError(err.message || 'Error al conectar con la API de productos');
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    fetchRealProducts();
  }, []);

  const getTabFromLocation = () => {
    const searchParams = new URLSearchParams(location.search);
    const tabParam = searchParams.get('tab');
    const path = location.pathname.toLowerCase();

    if (tabParam) {
      if (tabParam === 'transporte' || tabParam === 'domicilios' || tabParam === 'rappi' || tabParam === 'express') return 'transporte';
      if (tabParam === 'restaurantes' || tabParam === 'comida') return 'restaurantes';
      if (tabParam === 'servicios') return 'servicios';
      if (tabParam === 'turismo') return 'turismo';
      if (tabParam === 'productos') return 'productos';
    }

    if (path.includes('domicilio') || path.includes('express') || path.includes('rappi') || path.includes('movilidad') || path.includes('transporte')) {
      return 'transporte';
    }
    if (path.includes('restaurante')) return 'restaurantes';
    if (path.includes('servicio')) return 'servicios';
    if (path.includes('turismo')) return 'turismo';

    return 'productos';
  };

  const [activeTab, setActiveTab] = useState(getTabFromLocation);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedCommerceItem, setSelectedCommerceItem] = useState(null);

  // Sync activeTab when URL or search parameters change
  useEffect(() => {
    const tab = getTabFromLocation();
    setActiveTab(tab);
    setSelectedProduct(null);
    setSelectedCommerceItem(null);
  }, [location.pathname, location.search]);

  const tabs = [
    { id: 'productos', label: 'Productos Locales', icon: ShoppingBag },
    { id: 'servicios', label: 'Servicios Especializados', icon: Wrench },
    { id: 'restaurantes', label: 'Restaurantes & Gastronomía', icon: Utensils },
    { id: 'transporte', label: 'Movilidad & Domicilios Express (Uber/Rappi)', icon: Bike },
    { id: 'turismo', label: 'Turismo & Experiencias', icon: Compass },
  ];

  // Render Product Detail View if a product is selected
  if (selectedProduct) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <ProductDetailView 
          product={selectedProduct} 
          onBack={() => setSelectedProduct(null)} 
          allProducts={products}
          onSelectProduct={(p) => setSelectedProduct(p)}
        />
      </div>
    );
  }


  // Render Commerce Detail View (with Map & "Cómo Llegar") if a Service, Restaurant, Transport or Tourism item is selected
  if (selectedCommerceItem) {
    let currentCategoryList = [];
    if (activeTab === 'servicios') currentCategoryList = SERVICIOS;
    else if (activeTab === 'restaurantes') currentCategoryList = RESTAURANTES;
    else if (activeTab === 'transporte') currentCategoryList = TRANSPORTE_RUTAS;
    else if (activeTab === 'turismo') currentCategoryList = TURISMO_DESTINOS;
    else currentCategoryList = [...SERVICIOS, ...RESTAURANTES, ...TURISMO_DESTINOS];

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <CommerceDetailView
          item={selectedCommerceItem}
          categoryType={activeTab}
          onBack={() => setSelectedCommerceItem(null)}
          allItems={currentCategoryList}
          onSelectItem={(item) => setSelectedCommerceItem(item)}
        />
      </div>
    );
  }

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
          Encuentra productos artesanales, logística de transporte subregional, gastronomía del Caribe antioqueño y asesoría técnica especializada con mapas interactivos de ubicación.
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
              onClick={() => {
                setActiveTab(t.id);
                setSelectedProduct(null);
                setSelectedCommerceItem(null);
              }}
              className={`px-4 py-3 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
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

      {/* TAB 1: PRODUCTOS (API Render MySQL en vivo) */}
      {activeTab === 'productos' && (
        <div>
          {loadingProducts ? (
            <div className="flex flex-col items-center justify-center py-16 text-center space-y-3">
              <Loader2 className="w-10 h-10 text-psp-cyan animate-spin" />
              <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
                Cargando productos en vivo desde la API de Render (MySQL)...
              </p>
              <p className="text-xs text-slate-400">
                Conectando a {import.meta.env.VITE_PRODUCTS_URL || 'https://products-psp.onrender.com'}
              </p>
            </div>
          ) : productsError ? (
            <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-500 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-6 h-6 shrink-0" />
                <div>
                  <h4 className="text-sm font-bold">No se pudieron obtener los productos reales</h4>
                  <p className="text-xs opacity-90">{productsError}</p>
                </div>
              </div>
              <button
                onClick={fetchRealProducts}
                className="px-4 py-2 rounded-xl bg-rose-500 text-white text-xs font-bold flex items-center gap-2 hover:bg-rose-600 transition-colors shrink-0"
              >
                <RefreshCw className="w-4 h-4" /> Reintentar
              </button>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16 text-slate-500">
              No hay productos disponibles actualmente en la API.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((prod) => (
                <div 
                  key={prod.id} 
                  className="rounded-2xl bg-white dark:bg-psp-dark-card border border-slate-200 dark:border-slate-800 overflow-hidden shadow-psp-soft flex flex-col justify-between hover:shadow-xl transition-all group relative"
                >
                  <div 
                    onClick={() => setSelectedProduct(prod)}
                    className="cursor-pointer"
                  >
                    <div className="relative overflow-hidden">
                      <img 
                        src={prod.imagen} 
                        alt={prod.nombre} 
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                      <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="px-3 py-1.5 rounded-xl bg-white/90 dark:bg-slate-900/90 text-slate-900 dark:text-teal-300 text-xs font-bold shadow-lg flex items-center gap-1.5">
                          <Eye className="w-3.5 h-3.5" /> Ver Detalles
                        </span>
                      </div>
                    </div>

                    <div className="p-5">
                      <span className="text-[10px] font-bold text-psp-cyan uppercase tracking-wider">{prod.categoria}</span>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-1 group-hover:text-teal-500 transition-colors">
                        {prod.nombre}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed line-clamp-2">
                        {prod.descripcion}
                      </p>
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
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(prod);
                      }}
                      className="px-4 py-2 rounded-xl bg-psp-cyan text-slate-950 text-xs font-bold hover:bg-psp-cyan-hover transition-colors shadow-md cursor-pointer"
                    >
                      Añadir al carrito
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SERVICIOS */}
      {activeTab === 'servicios' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SERVICIOS.map((serv) => (
            <div 
              key={serv.id} 
              onClick={() => setSelectedCommerceItem(serv)}
              className="rounded-2xl bg-white dark:bg-psp-dark-card border border-slate-200 dark:border-slate-800 overflow-hidden shadow-psp-soft p-6 flex flex-col justify-between hover:shadow-xl transition-all cursor-pointer group"
            >
              <div>
                <div className="relative overflow-hidden rounded-xl mb-4">
                  <img src={serv.imagen} alt={serv.nombre} className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="px-3 py-1.5 rounded-xl bg-white/90 dark:bg-slate-900/90 text-slate-900 dark:text-teal-300 text-xs font-bold shadow-lg flex items-center gap-1.5">
                      <Navigation className="w-3.5 h-3.5" /> Ver Comercio & Mapa
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-extrabold text-psp-cyan uppercase">{serv.categoria}</span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1 mb-2 group-hover:text-teal-500 transition-colors">{serv.nombre}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4 line-clamp-2">{serv.descripcion}</p>
              </div>
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block">Tarifa Estimada</span>
                  <span className="text-xs font-extrabold text-psp-cyan">{serv.precioEstimado}</span>
                </div>
                <button className="px-3 py-1.5 rounded-lg bg-slate-900 dark:bg-slate-800 text-white text-xs font-bold group-hover:bg-psp-cyan group-hover:text-slate-950 transition-colors flex items-center gap-1">
                  <span>Ver Detalle</span>
                  <ArrowRight className="w-3 h-3" />
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
            <div 
              key={rest.id} 
              onClick={() => setSelectedCommerceItem(rest)}
              className="rounded-2xl bg-white dark:bg-psp-dark-card border border-slate-200 dark:border-slate-800 p-6 flex flex-col sm:flex-row gap-6 shadow-psp-soft hover:shadow-xl transition-all cursor-pointer group"
            >
              <div className="w-full sm:w-44 h-44 rounded-xl overflow-hidden shrink-0 relative">
                <img src={rest.imagen} alt={rest.nombre} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="px-2.5 py-1 rounded-lg bg-white/90 dark:bg-slate-900/90 text-slate-900 dark:text-teal-300 text-[10px] font-bold shadow-md">
                    Ver Menú & Mapa
                  </span>
                </div>
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-teal-500 transition-colors">{rest.nombre}</h3>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 text-[10px] font-extrabold shrink-0">★ {rest.calificacion}</span>
                  </div>
                  <p className="text-xs text-psp-cyan font-medium mt-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {rest.ubicación}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-2"><strong>Especialidad:</strong> {rest.especialidad}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Horario: {rest.horario}</span>
                  <button className="px-3 py-1.5 rounded-lg bg-psp-cyan text-slate-950 font-bold hover:bg-psp-cyan-hover flex items-center gap-1">
                    <span>Ver Menú & Ubicación</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: MOVILIDAD & DOMICILIOS EXPRESS (UBER / RAPPI URABÁ) */}
      {activeTab === 'transporte' && (
        <PSPExpressHub 
          transportRoutes={TRANSPORTE_RUTAS} 
          onSelectRoute={(ruta) => setSelectedCommerceItem(ruta)} 
        />
      )}

      {/* TAB 5: TURISMO */}
      {activeTab === 'turismo' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {TURISMO_DESTINOS.map((dest) => (
            <div 
              key={dest.id} 
              onClick={() => setSelectedCommerceItem(dest)}
              className="rounded-2xl bg-white dark:bg-psp-dark-card border border-slate-200 dark:border-slate-800 overflow-hidden shadow-psp-soft flex flex-col justify-between hover:shadow-xl transition-all cursor-pointer group"
            >
              <div className="relative overflow-hidden">
                <img src={dest.imagen} alt={dest.nombre} className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="px-3 py-1.5 rounded-xl bg-white/90 dark:bg-slate-900/90 text-slate-900 dark:text-teal-300 text-xs font-bold shadow-lg flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5" /> Ver Itinerario & Mapa
                  </span>
                </div>
              </div>

              <div className="p-6 space-y-3">
                <span className="text-[10px] font-extrabold text-psp-cyan uppercase">{dest.categoria}</span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-teal-500 transition-colors">{dest.nombre}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{dest.descripcion}</p>
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                  <span className="text-xs font-bold text-emerald-400">{dest.precio}</span>
                  <button className="px-4 py-2 rounded-xl bg-psp-cyan text-slate-950 text-xs font-extrabold flex items-center gap-1">
                    <span>Ver Detalles & Mapa</span>
                    <ArrowRight className="w-3.5 h-3.5" />
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
