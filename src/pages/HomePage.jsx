import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Store, 
  MessageSquare, 
  ArrowRight, 
  CheckCircle2, 
  BookOpen, 
  Globe2, 
  Users, 
  Search,
  ShoppingBag,
  PlusCircle,
  LogIn,
  Eye,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';
import { PRODUCTOS } from '../data/mockData';
import productsApi from '../services/productsApi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import ProductDetailView from '../components/comercio/ProductDetailView';

const HERO_SLIDES = [
  {
    id: 'psp-comunidad',
    src: '/hero-banner-psp.png',
    alt: 'Plataforma Social con Propósito - Conectamos empresas y sociedad civil',
  },
  {
    id: 'psp-ecommerce',
    src: '/hero-slide-ecommerce.png',
    alt: 'Tienda Online y Pagos Seguros - Pasarela de pago rápida y protegida PSP',
  },
  {
    id: 'psp-aliadas',
    src: '/hero-slide-aliadas.png',
    alt: 'Empresas y Fundaciones Aliadas - Directorio de Entidades Afiliadas a la Corporación',
  },
  {
    id: 'psp-comercio',
    src: '/hero-slide-comercio.png',
    alt: 'Comercio Justo y Sin Intermediarios - Emprendedores de Urabá',
  },
];

const HomePage = () => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isCarouselPaused, setIsCarouselPaused] = useState(false);

  useEffect(() => {
    if (isCarouselPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [isCarouselPaused]);

  const [selectedMunicipio, setSelectedMunicipio] = useState('Todos los municipios');
  const [selectedSector, setSelectedSector] = useState('Todos los sectores');

  // Estado de la Tienda en la Home conectado al Backend (productsApi)
  const [products, setProducts] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedCategoryCode, setSelectedCategoryCode] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const pageSize = 8;

  // Cargar categorías activas para el filtro rápido en la Home
  useEffect(() => {
    let active = true;
    productsApi.categories()
      .then((res) => {
        if (active) setCategoriesList(res || []);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  // Debounce para el buscador de productos en la Home
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchInput.trim());
      setPage(1);
    }, 600);
    return () => clearTimeout(handler);
  }, [searchInput]);

  // Cargar productos reales desde la API psp.products (con fallback a PRODUCTOS locales si falla la red)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoadingProducts(true);
      try {
        const res = await productsApi.list({
          q: debouncedQuery,
          categoryCode: selectedCategoryCode,
          page,
          pageSize
        });
        if (!cancelled) {
          setProducts(res.items || []);
          setTotal(res.total || 0);
          setTotalPages(res.totalPages || 1);
        }
      } catch {
        if (!cancelled) {
          setProducts(PRODUCTOS);
          setTotal(PRODUCTOS.length);
          setTotalPages(1);
        }
      } finally {
        if (!cancelled) setLoadingProducts(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery, selectedCategoryCode, page]);

  const openProduct = (prod) => {
    if (!user) {
      navigate('/registro', { state: { from: '/' } });
      return;
    }
    setSelectedProduct(prod);
    productsApi
      .get(prod.id)
      .then((full) => setSelectedProduct(full))
      .catch(() => {});
  };

  const handleAddProductToCart = (e, prod) => {
    e.stopPropagation();
    if (!user) {
      navigate('/registro', { state: { from: '/' } });
      return;
    }
    addToCart(prod);
  };

  const handleConsultar = (e) => {
    e.preventDefault();
    navigate('/comercio');
  };

  // Si el usuario selecciona un producto en la Home, muestra su ficha completa sin salir de la experiencia
  if (selectedProduct) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <ProductDetailView
          product={selectedProduct}
          onBack={() => setSelectedProduct(null)}
          allProducts={products}
          onSelectProduct={openProduct}
        />
      </div>
    );
  }

  return (
    <div className="flex-grow w-full max-w-full overflow-hidden relative">
      
      {/* Ambient Light Effects */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-brand-mint/60 dark:bg-teal-500/10 rounded-full soft-blur-glow pointer-events-none -z-10"></div>
      <div className="absolute top-1/4 right-0 w-[24rem] sm:w-[32rem] h-[24rem] sm:h-[32rem] bg-emerald-100/40 dark:bg-emerald-500/10 rounded-full soft-blur-glow pointer-events-none -z-10"></div>

      {/* 1. MAIN HERO CAROUSEL BANNER SHOWCASE AT THE VERY BEGINNING */}
      <section className="pt-6 pb-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="relative w-full aspect-[16/7.8] overflow-hidden rounded-3xl border border-slate-200 dark:border-[#203330] shadow-xl dark:shadow-2xl dark:shadow-emerald-950/40 bg-white dark:bg-[#131c1a] group select-none"
          onMouseEnter={() => setIsCarouselPaused(true)}
          onMouseLeave={() => setIsCarouselPaused(false)}
        >
          {HERO_SLIDES.map((slide, idx) => {
            const isActive = idx === currentSlide;
            return (
              <img
                key={slide.id}
                src={slide.src}
                alt={slide.alt}
                className={`absolute inset-0 w-full h-full object-cover object-top brightness-[1.01] contrast-[1.03] transition-all duration-700 ease-out ${
                  isActive
                    ? 'opacity-100 scale-100 z-10'
                    : 'opacity-0 scale-[1.02] z-0 pointer-events-none'
                }`}
              />
            );
          })}

          {/* Botón Anterior */}
          <button
            type="button"
            onClick={() =>
              setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)
            }
            aria-label="Banner anterior"
            className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/85 dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-900 text-[#0c4236] dark:text-teal-300 shadow-lg border border-slate-200/80 dark:border-slate-700 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-105"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Botón Siguiente */}
          <button
            type="button"
            onClick={() => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length)}
            aria-label="Siguiente banner"
            className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/85 dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-900 text-[#0c4236] dark:text-teal-300 shadow-lg border border-slate-200/80 dark:border-slate-700 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-105"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Indicadores inferiores (Píldoras) */}
          <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950/35 backdrop-blur-md border border-white/20">
            {HERO_SLIDES.map((slide, idx) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => setCurrentSlide(idx)}
                aria-label={`Ir al banner ${idx + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === currentSlide
                    ? 'w-7 bg-teal-400 shadow-sm'
                    : 'w-2 bg-white/70 hover:bg-white'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 2. TIENDA PRINCIPAL JUSTO DEBAJO DE LA IMAGEN HERO */}
      <section id="tienda-home" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-14">
        
        {/* Cabecera Destacada del Marketplace + Acciones Rápidas */}
        <div className="mb-6 p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#131c1a] border-2 border-emerald-500/30 dark:border-teal-500/40 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#0c4236] text-white dark:bg-teal-400 dark:text-slate-950 flex items-center justify-center font-extrabold shadow-lg shadow-[#0c4236]/20 shrink-0">
              <Store className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#0c4236] dark:text-teal-300">
                  Tienda Oficial • Marketplace Urabá
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-teal-950 text-[#0c4236] dark:text-teal-300 text-[10px] font-black border border-emerald-300 dark:border-teal-500/40">
                  Compra Directa
                </span>
              </div>
              <h2 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-slate-100">
                Productos y Servicios de Urabá sin Intermediarios
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
                Explora el catálogo, filtra por categoría y añade productos directamente a tu carrito de compras.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full md:w-auto">
            <Link
              to="/comercio"
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#0c4236] hover:bg-[#0f5144] dark:bg-teal-400 dark:hover:bg-teal-300 text-white dark:text-slate-950 text-xs font-black shadow-md flex items-center justify-center gap-2 whitespace-nowrap transition-colors"
            >
              <ShoppingBag className="w-4 h-4 text-white dark:text-slate-950" />
              <span>Ver Tienda Completa</span>
            </Link>
            
            {user ? (
              <Link
                to="/mi-cuenta"
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-[#182422] dark:hover:bg-teal-950 text-[#0c4236] dark:text-teal-300 text-xs font-extrabold border border-emerald-300 dark:border-[#203330] flex items-center justify-center gap-2 whitespace-nowrap transition-colors shadow-sm"
              >
                <PlusCircle className="w-4 h-4 text-[#0c4236] dark:text-teal-400" />
                <span>Subir Producto</span>
              </Link>
            ) : (
              <Link
                to="/ingresar"
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-100 dark:bg-[#182422] hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold border border-slate-300 dark:border-[#203330] flex items-center justify-center gap-2 whitespace-nowrap transition-colors"
                title="Inicia sesión para subir tus productos"
              >
                <LogIn className="w-4 h-4 text-slate-500" />
                <span>Inicia sesión para publicar</span>
              </Link>
            )}
          </div>
        </div>

        {/* Barra de Búsqueda Rápida y Filtro por Categorías en la Home */}
        <div className="mb-6 flex flex-col sm:flex-row gap-3 bg-white dark:bg-[#131c1a] p-4 rounded-2xl border border-slate-200 dark:border-[#203330] shadow-sm">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar producto por nombre, marca o código SKU..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setDebouncedQuery(searchInput.trim());
                  setPage(1);
                }
              }}
              className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-slate-200 dark:border-[#203330] bg-slate-50 dark:bg-[#0e1514] text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0c4236] dark:focus:ring-teal-400"
            />
            {searchInput && (
              <button
                onClick={() => {
                  setSearchInput('');
                  setDebouncedQuery('');
                  setPage(1);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="sm:w-64">
            <select
              value={selectedCategoryCode}
              onChange={(e) => {
                setSelectedCategoryCode(e.target.value);
                setPage(1);
              }}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#203330] bg-slate-50 dark:bg-[#0e1514] text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0c4236] dark:focus:ring-teal-400"
            >
              <option value="">Todas las Categorías</option>
              {categoriesList.map((cat) => (
                <option key={cat.id} value={cat.codigo}>
                  {cat.nombre} ({cat.totalProductos})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Estado de Carga */}
        {loadingProducts && (
          <div className="rounded-2xl border border-slate-200 dark:border-[#203330] bg-white dark:bg-[#131c1a] p-10 text-center text-sm font-semibold text-slate-500 dark:text-slate-400 flex items-center justify-center gap-2">
            <div className="animate-spin h-5 w-5 border-2 border-[#0c4236] dark:border-teal-400 border-t-transparent rounded-full" />
            <span>Cargando productos de la tienda…</span>
          </div>
        )}

        {/* Sin Resultados */}
        {!loadingProducts && products.length === 0 && (
          <div className="rounded-2xl border border-slate-200 dark:border-[#203330] bg-white dark:bg-[#131c1a] p-10 text-center space-y-3">
            <p className="text-base font-bold text-slate-700 dark:text-slate-200">No se encontraron productos con ese filtro</p>
            <button
              onClick={() => {
                setSearchInput('');
                setDebouncedQuery('');
                setSelectedCategoryCode('');
                setPage(1);
              }}
              className="px-4 py-2 rounded-xl bg-[#0c4236] dark:bg-teal-400 text-white dark:text-slate-950 text-xs font-extrabold cursor-pointer"
            >
              Ver todos los productos
            </button>
          </div>
        )}

        {/* Grilla de Productos Conectada al Carrito y Vista de Detalle */}
        {!loadingProducts && products.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {products.map((prod) => {
                const price = Number(prod.precio || 0);
                const oldPrice = prod.precioAnterior
                  ? Number(prod.precioAnterior)
                  : Math.round(price * 1.12);
                const discountPct =
                  oldPrice > price ? Math.round(((oldPrice - price) / oldPrice) * 100) : 10;

                return (
                  <div
                    key={prod.id}
                    style={{ fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif" }}
                    className="group rounded-2xl bg-white dark:bg-[#131c1a] border border-slate-200/90 dark:border-[#203330] overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                  >
                    <div
                      onClick={() => openProduct(prod)}
                      className="cursor-pointer flex-1 flex flex-col"
                    >
                      <div className="relative h-52 overflow-hidden bg-slate-50 dark:bg-[#0e1514] border-b border-slate-100 dark:border-[#203330]">
                        <img
                          src={prod.imagen}
                          alt={prod.nombre}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {prod.calificacion && (
                          <span className="absolute top-2.5 right-2.5 px-2 py-0.5 bg-white/95 dark:bg-slate-900/90 text-slate-800 dark:text-white text-[11px] font-semibold rounded-md shadow-xs">
                            ★ {prod.calificacion}
                          </span>
                        )}
                      </div>

                      <div className="p-4 pb-3 flex-1 flex flex-col justify-between">
                        {/* Título estilo Mercado Libre: 14px, peso regular (400), 2 líneas limpias */}
                        <p className="text-[14px] leading-[1.35] font-normal text-[#333333] dark:text-slate-200 line-clamp-2 group-hover:text-[#0c4236] dark:group-hover:text-teal-300 transition-colors">
                          {prod.nombre}
                        </p>

                        {/* Bloque de Precio estilo Mercado Libre */}
                        <div className="mt-3 space-y-0.5">
                          <span className="block text-[12px] font-normal text-slate-400 line-through">
                            $ {oldPrice.toLocaleString('es-CO')}
                          </span>

                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[22px] leading-tight font-normal tracking-tight text-slate-900 dark:text-white">
                              $ {price.toLocaleString('es-CO')}
                            </span>
                            <span className="px-1.5 py-0.5 rounded bg-[#00a650] text-white text-[11px] font-bold leading-none">
                              {discountPct}% OFF
                            </span>
                          </div>

                          <p className="text-[12px] font-medium text-[#00a650] dark:text-emerald-400 pt-0.5">
                            Beneficio Membresía PSP activo
                          </p>

                          <p className="text-[12px] text-slate-500 dark:text-slate-400 pt-1">
                            <span className="font-bold text-[#00a650] dark:text-emerald-400">
                              Envío directo ⚡
                            </span>{' '}
                            {prod.municipio || prod.categoria || 'Urabá'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="px-4 pb-4 pt-1">
                      {prod.stock !== undefined && prod.stock <= 0 ? (
                        <span className="block w-full text-center py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 text-xs font-semibold">
                          Agotado
                        </span>
                      ) : (
                        <button
                          onClick={(e) => handleAddProductToCart(e, prod)}
                          className="w-full py-2.5 rounded-xl bg-[#0c4236] hover:bg-[#0f5144] dark:bg-teal-400 dark:hover:bg-teal-300 text-white dark:text-slate-950 text-xs font-bold transition-colors shadow-xs cursor-pointer"
                        >
                          Añadir al carrito
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Paginación y Enlace a Tienda Completa */}
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 bg-white dark:bg-[#131c1a] rounded-2xl border border-slate-200 dark:border-[#203330]">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                Mostrando <strong>{products.length}</strong> de <strong>{total}</strong> productos disponibles
              </span>

              <div className="flex items-center gap-3">
                {totalPages > 1 && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-[#203330] disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1 text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" /> Anterior
                    </button>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      {page} / {totalPages}
                    </span>
                    <button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-[#203330] disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1 text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
                    >
                      Siguiente <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}

                <Link
                  to="/comercio"
                  className="text-xs font-black text-[#0c4236] dark:text-teal-400 hover:underline flex items-center gap-1 ml-2"
                >
                  Ir al catálogo completo <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </>
        )}
      </section>

      {/* 3. SECCIÓN INSTITUCIONAL Y MÉTRICAS REGIONALES */}
      <section className="relative pt-4 pb-20 lg:pt-8 lg:pb-24 overflow-hidden border-t border-slate-200/60 dark:border-[#203330]/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Institutional Pitch & CTAs */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Category Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 dark:bg-teal-950/70 border border-emerald-300 dark:border-teal-500/30 text-[#0c4236] dark:text-teal-300 text-xs font-extrabold tracking-wide max-w-full">
                <span className="w-2 h-2 rounded-full bg-[#0c4236] dark:bg-teal-400 animate-pulse flex-shrink-0"></span>
                <span className="truncate">ECOSISTEMA SOCIAL & PRODUCTIVO DE URABÁ • ALIANZA PÚBLICO-PRIVADA</span>
              </div>

              {/* Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-slate-100 tracking-tight leading-[1.15]">
                Conectamos empresas <br className="hidden sm:inline" />
                público-privadas y la <br className="hidden sm:inline" />
                sociedad civil en{' '}
                <span className="text-[#0c4236] dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-teal-300 dark:to-emerald-400 relative">
                  Urabá y Colombia.
                  <span className="absolute bottom-1 left-0 w-full h-2 bg-emerald-100 dark:bg-teal-400/10 -z-10 rounded"></span>
                </span>
              </h1>

              {/* Description */}
              <p className="text-slate-700 dark:text-slate-400 text-base sm:text-lg leading-relaxed max-w-2xl font-medium">
                Una red colaborativa orientada a impulsar el comercio local, la sostenibilidad agroindustrial, el transporte subregional y el diálogo comunitario en la zona de mayor proyección portuaria del país.
              </p>

              {/* CTAs */}
              <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
                <Link
                  to="/empresas-aliadas"
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#0c4236] hover:bg-[#0f5144] dark:bg-gradient-to-r dark:from-teal-400 dark:to-emerald-400 dark:hover:from-teal-300 dark:hover:to-emerald-300 text-white dark:text-slate-950 font-black text-sm rounded-xl shadow-lg shadow-[#0c4236]/25 dark:shadow-teal-500/20 hover:shadow-xl transform hover:-translate-y-0.5 transition duration-200"
                >
                  <Building2 className="w-4 h-4 text-emerald-200 dark:text-slate-950" />
                  <span>Empresas Aliadas</span>
                </Link>

                <Link
                  to="/foro"
                  className="inline-flex items-center gap-2 px-5 py-3.5 bg-slate-100 dark:bg-[#182422] hover:bg-slate-200 dark:hover:bg-teal-950/60 text-slate-800 dark:text-slate-300 font-extrabold text-sm rounded-xl border border-slate-300 dark:border-transparent dark:hover:border-teal-500/20 transition duration-200"
                >
                  <MessageSquare className="w-4 h-4 text-[#0c4236] dark:text-teal-400" />
                  <span>Foro Social</span>
                </Link>
              </div>

              {/* Trust Badge Bar */}
              <div className="pt-6 flex flex-wrap items-center gap-6 border-t border-slate-200 dark:border-[#203330] text-xs text-slate-600 dark:text-slate-400">
                <span className="flex items-center gap-1.5 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-[#0c4236] dark:text-teal-400" />
                  Gobernanza transparente
                </span>
                <span className="flex items-center gap-1.5 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-[#0c4236] dark:text-teal-400" />
                  Certificación Agroexportadora
                </span>
                <span className="flex items-center gap-1.5 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-[#0c4236] dark:text-teal-400" />
                  Integración Comunitaria
                </span>
              </div>

            </div>

            {/* Right Column: Regional Development Milestone Card */}
            <div className="lg:col-span-5">
              <div className="relative bg-white dark:bg-[#131c1a] rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/70 dark:shadow-2xl dark:shadow-black/60 border border-slate-200 dark:border-[#203330] overflow-hidden">
                
                {/* Decorative accent */}
                <div className="absolute -top-16 -right-16 w-36 h-36 bg-emerald-100 dark:bg-teal-500/10 rounded-full blur-xl pointer-events-none"></div>

                {/* Card Header Badges */}
                <div className="flex items-center justify-between gap-2 mb-5">
                  <span className="text-[11px] font-black uppercase tracking-wider text-[#0c4236] dark:text-teal-300 bg-emerald-100 dark:bg-teal-950/80 dark:border dark:border-teal-500/20 px-3 py-1 rounded-full">
                    Hito de Desarrollo Regional
                  </span>
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-[#182422] border border-slate-200 dark:border-[#203330] px-3 py-1 rounded-full flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-teal-400"></span>
                    Puerto Antioquia 2026
                  </span>
                </div>

                {/* Card Title & Body */}
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 leading-snug mb-3">
                  Transformación Agroindustrial & Portuaria de Urabá
                </h2>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6 font-medium">
                  Articulamos más de 120 empresas y comunidades locales en Turbo, Apartadó, Carepa y Necoclí para potenciar la exportación de banano, plátano y cacao hacia mercados globales con trazabilidad comunitaria.
                </p>

                {/* Statistics Grid */}
                <div className="grid grid-cols-2 gap-3.5 mb-6">
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0e1514] border border-slate-200 dark:border-[#203330] hover:border-emerald-300 dark:hover:border-teal-500/40 transition duration-150">
                    <span className="block text-2xl sm:text-3xl font-black text-[#0c4236] dark:text-teal-400">1,800+</span>
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-400 tracking-wide uppercase">Empleos Directos</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0e1514] border border-slate-200 dark:border-[#203330] hover:border-emerald-300 dark:hover:border-teal-500/40 transition duration-150">
                    <span className="block text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">11</span>
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-400 tracking-wide uppercase">Municipios Urabá</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0e1514] border border-slate-200 dark:border-[#203330] hover:border-emerald-300 dark:hover:border-teal-500/40 transition duration-150">
                    <span className="block text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">+120</span>
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-400 tracking-wide uppercase">Empresas Aliadas</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0e1514] border border-slate-200 dark:border-[#203330] hover:border-emerald-300 dark:hover:border-teal-500/40 transition duration-150">
                    <span className="block text-2xl sm:text-3xl font-black text-[#0c4236] dark:text-emerald-400">94%</span>
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-400 tracking-wide uppercase">Impacto Comunitario</span>
                  </div>
                </div>

                {/* Footer link */}
                <div className="pt-4 border-t border-slate-100 dark:border-[#203330] flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Actualización mensual de métricas</span>
                  <Link to="/empresas-aliadas" className="text-[#0c4236] dark:text-teal-400 font-black hover:underline inline-flex items-center gap-1">
                    Ver reporte oficial <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. STRATEGIC PILLARS SECTION */}
      <section className="py-16 bg-white dark:bg-[#0e1514] border-y border-slate-200 dark:border-[#203330] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#0c4236] dark:text-teal-300 bg-emerald-100 dark:bg-teal-950/80 dark:border dark:border-teal-500/20 px-3 py-1 rounded-full">
              Ejes Estratégicos
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 mt-3 tracking-tight">
              Pilares de Impacto Socioeconómico
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-2 font-medium">
              Articulación entre sector público, productores agrícolas, comercio local y sociedad civil.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Pillar 1 */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-[#131c1a] border border-slate-200 dark:border-[#203330] hover:border-emerald-300 dark:hover:border-teal-500/40 transition duration-200">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-teal-950 text-[#0c4236] dark:text-teal-300 flex items-center justify-center mb-4 font-bold">
                <BookOpen className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2">Agroindustria Sostenible</h4>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Modelos de producción limpia para banano, plátano, cacao y frutales con acompañamiento técnico continuo.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-[#131c1a] border border-slate-200 dark:border-[#203330] hover:border-emerald-300 dark:hover:border-teal-500/40 transition duration-200">
              <div className="w-12 h-12 rounded-xl bg-teal-100 dark:bg-emerald-950 text-[#0c4236] dark:text-emerald-300 flex items-center justify-center mb-4 font-bold">
                <Store className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2">Comercio & Emprendimiento</h4>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Visibilización digital y encadenamientos comerciales para micro, medianas y grandes empresas locales.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-[#131c1a] border border-slate-200 dark:border-[#203330] hover:border-emerald-300 dark:hover:border-teal-500/40 transition duration-200">
              <div className="w-12 h-12 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 flex items-center justify-center mb-4 font-bold">
                <Globe2 className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2">Conectividad Portuaria</h4>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Preparación de capital humano e infraestructura logística de cara a la operación de Puerto Antioquia.
              </p>
            </div>

            {/* Pillar 4 */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-[#131c1a] border border-slate-200 dark:border-[#203330] hover:border-emerald-300 dark:hover:border-teal-500/40 transition duration-200">
              <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 flex items-center justify-center mb-4 font-bold">
                <Users className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2">Diálogo Comunitario</h4>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Mecanismos participativos y foros abiertos para escuchar las prioridades de los corregimientos y veredas.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 5. QUICK DIRECTORY SECTION */}
      <section className="py-14 bg-slate-50 dark:bg-[#0c1312] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-[#131c1a] rounded-2xl border border-slate-200 dark:border-[#203330] p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm dark:shadow-xl">
            
            <div>
              <span className="text-xs font-black text-[#0c4236] dark:text-teal-400 tracking-wider uppercase">Directorio Productivo</span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">Encuentra iniciativas y aliados por municipio</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 font-medium">Busca cooperativas bananeras, prestadores turísticos, puertos y servicios especializados.</p>
            </div>

            <form onSubmit={handleConsultar} className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <select 
                value={selectedMunicipio}
                onChange={(e) => setSelectedMunicipio(e.target.value)}
                className="rounded-xl border-slate-300 dark:border-[#203330] text-sm font-semibold focus:border-[#0c4236] dark:focus:border-teal-400 focus:ring-[#0c4236] dark:focus:ring-teal-400 bg-slate-50 dark:bg-[#0e1514] text-slate-800 dark:text-slate-200 py-2.5 px-3"
              >
                <option>Todos los municipios</option>
                <option>Apartadó</option>
                <option>Turbo</option>
                <option>Necoclí</option>
                <option>Carepa</option>
                <option>Chigorodó</option>
                <option>San Pedro de Urabá</option>
                <option>Arboletes</option>
                <option>San Juan de Urabá</option>
                <option>Mutatá</option>
                <option>Vigía del Fuerte</option>
                <option>Murindó</option>
              </select>

              <select 
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
                className="rounded-xl border-slate-300 dark:border-[#203330] text-sm font-semibold focus:border-[#0c4236] dark:focus:border-teal-400 focus:ring-[#0c4236] dark:focus:ring-teal-400 bg-slate-50 dark:bg-[#0e1514] text-slate-800 dark:text-slate-200 py-2.5 px-3"
              >
                <option>Todos los sectores</option>
                <option>Agroindustria & Exportación</option>
                <option>Logística & Puertos</option>
                <option>Servicios Empresariales</option>
                <option>Turismo & Cultura</option>
                <option>Organizaciones Sociales</option>
              </select>

              <button 
                type="submit"
                className="px-5 py-2.5 bg-[#0c4236] hover:bg-[#0f5144] dark:bg-gradient-to-r dark:from-teal-400 dark:to-emerald-400 dark:hover:from-teal-300 text-white dark:text-slate-950 rounded-xl text-sm font-extrabold transition whitespace-nowrap shadow-md"
              >
                Consultar
              </button>
            </form>

          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;
