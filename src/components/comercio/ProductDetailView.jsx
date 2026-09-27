import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Star, 
  ShoppingBag, 
  Check, 
  ShieldCheck, 
  Truck, 
  Heart, 
  Share2, 
  MapPin, 
  Award, 
  Clock, 
  ChevronRight,
  Plus,
  Minus,
  Sparkles
} from 'lucide-react';
import { useCart } from '../../context/CartContext';

const ProductDetailView = ({ product, onBack, allProducts = [], onSelectProduct }) => {
  const { addToCart } = useCart();
  
  // Gallery state: active main image
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedToast, setAddedToast] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState('descripcion');

  if (!product) return null;

  const gallery = product.imagenes || [product.imagen];
  const mainImage = gallery[activeImageIndex] || product.imagen;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2500);
  };

  const discountPercent = product.precioAnterior 
    ? Math.round(((product.precioAnterior - product.precio) / product.precioAnterior) * 100) 
    : 0;

  // Filter related products (excluding current)
  const relatedProducts = allProducts
    .filter(p => p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="space-y-10 sm:space-y-12 animate-fadeIn">
      
      {/* Top Bar: Breadcrumb Navigation & Back Button */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Volver al Catálogo de Comercio</span>
        </button>

        {/* Breadcrumb */}
        <nav className="hidden sm:flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span>Comercio</span>
          <ChevronRight className="w-3 h-3" />
          <span>{product.categoria}</span>
          <ChevronRight className="w-3 h-3" />
          <span className="font-semibold text-slate-900 dark:text-white truncate max-w-[200px]">{product.nombre}</span>
        </nav>
      </div>

      {/* Main Product Showcase Section (Two Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* Left Column (Cols 1-7): Image Gallery Showcase */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Main Large Photo Container */}
          <div className="relative overflow-hidden rounded-3xl bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl group">
            <img
              src={mainImage}
              alt={product.nombre}
              className="w-full h-[380px] sm:h-[480px] lg:h-[520px] object-cover transition-transform duration-500 group-hover:scale-105"
            />

            {/* Badges Overlays */}
            <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
              {discountPercent > 0 && (
                <span className="px-3 py-1 rounded-full bg-rose-500 text-white text-xs font-extrabold shadow-lg">
                  -{discountPercent}% DESCUENTO
                </span>
              )}
              {product.municipio && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-slate-900 dark:text-teal-300 text-xs font-extrabold shadow-md border border-slate-200 dark:border-slate-700">
                  <MapPin className="w-3.5 h-3.5 text-teal-500" />
                  {product.municipio}
                </span>
              )}
            </div>

            {/* Wishlist & Share Floating Buttons */}
            <div className="absolute top-4 right-4 flex gap-2 z-10">
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                aria-label="Guardar en favoritos"
                className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-all shadow-md ${
                  isFavorite 
                    ? 'bg-rose-500 text-white' 
                    : 'bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-300 hover:bg-white'
                }`}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>

          {/* Thumbnail Gallery Strip (1 Large + 2/3 Small Interactive Thumbnails) */}
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            {gallery.map((imgUrl, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`relative rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${
                  activeImageIndex === idx
                    ? 'border-teal-500 ring-2 ring-teal-500/30 scale-105 shadow-md'
                    : 'border-slate-200 dark:border-slate-800 opacity-70 hover:opacity-100 hover:border-slate-300'
                }`}
              >
                <img
                  src={imgUrl}
                  alt={`${product.nombre} vista ${idx + 1}`}
                  className="w-20 h-20 sm:w-24 sm:h-24 object-cover"
                />
              </button>
            ))}
          </div>

        </div>

        {/* Right Column (Cols 8-12): Product Info, Pricing & Buying Options */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Category & Producer Header */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <span className="px-3 py-1 rounded-full bg-teal-500/15 text-teal-700 dark:text-teal-300 text-xs font-bold uppercase tracking-wider">
                {product.categoria}
              </span>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Productor Verificado
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
              {product.nombre}
            </h1>

            <div className="flex items-center gap-3 pt-1">
              <div className="flex items-center gap-1 text-amber-400">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  {product.calificacion || 4.9}
                </span>
              </div>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium underline">
                {product.reseñasCount || 128} opiniones de compradores
              </span>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 space-y-2">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black text-slate-900 dark:text-white">
                ${product.precio.toLocaleString()} COP
              </span>
              {product.precioAnterior && (
                <span className="text-sm text-slate-400 line-through font-semibold">
                  ${product.precioAnterior.toLocaleString()}
                </span>
              )}
            </div>
            
            {product.precioAnterior && (
              <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                Ahorras ${(product.precioAnterior - product.precio).toLocaleString()} COP en esta compra
              </p>
            )}

            <p className="text-[11px] text-slate-500 dark:text-slate-400 pt-1">
              Por: <strong className="text-slate-700 dark:text-slate-200">{product.proveedor}</strong>
            </p>
          </div>

          {/* Short Summary Description */}
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {product.descripcionDetallada || product.descripcion}
          </p>

          {/* Key Product Features (Bullet list) */}
          {product.caracteristicas && product.caracteristicas.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Destacados del Producto:
              </h3>
              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                {product.caracteristicas.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Quantity Selector & Stock Info */}
          <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Cantidad:</span>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                ✓ En stock ({product.stock || 30} unidades en bodega Urabá)
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 p-1">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center text-sm font-extrabold text-slate-900 dark:text-white">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Primary Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                className="flex-1 py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#0c4236] via-[#0d5c4b] to-teal-400 hover:opacity-95 text-white font-bold text-xs sm:text-sm shadow-lg shadow-teal-500/25 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Añadir al Carrito (${(product.precio * quantity).toLocaleString()})</span>
              </button>
            </div>

            {/* Added Toast Alert */}
            {addedToast && (
              <div className="p-3 rounded-xl bg-emerald-500 text-slate-950 font-extrabold text-xs text-center shadow-lg animate-bounce flex items-center justify-center gap-2">
                <Check className="w-4 h-4" />
                <span>¡Producto añadido al carrito con éxito!</span>
              </div>
            )}
          </div>

          {/* E-Commerce Trust Badges */}
          <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-200 dark:border-slate-800 text-center">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800">
              <ShieldCheck className="w-5 h-5 text-teal-500 mx-auto mb-1" />
              <span className="text-[10px] font-extrabold text-slate-700 dark:text-slate-300 block">Origen 100% Garantizado</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800">
              <Truck className="w-5 h-5 text-teal-500 mx-auto mb-1" />
              <span className="text-[10px] font-extrabold text-slate-700 dark:text-slate-300 block">Envío Urabá & Nacional</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800">
              <Award className="w-5 h-5 text-teal-500 mx-auto mb-1" />
              <span className="text-[10px] font-extrabold text-slate-700 dark:text-slate-300 block">Comercio Justo ODS</span>
            </div>
          </div>

        </div>
      </div>

      {/* Tabs Section Below Product (Detailed Information, Specs & Reviews) */}
      <div className="pt-8 border-t border-slate-200 dark:border-slate-800 space-y-6">
        
        {/* Tab Headers */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 space-x-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('descripcion')}
            className={`pb-3 text-xs sm:text-sm font-extrabold transition-all border-b-2 whitespace-nowrap ${
              activeTab === 'descripcion'
                ? 'border-teal-500 text-teal-600 dark:text-teal-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Descripción Ampliada
          </button>
          <button
            onClick={() => setActiveTab('especificaciones')}
            className={`pb-3 text-xs sm:text-sm font-extrabold transition-all border-b-2 whitespace-nowrap ${
              activeTab === 'especificaciones'
                ? 'border-teal-500 text-teal-600 dark:text-teal-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Especificaciones Técnicas
          </button>
          <button
            onClick={() => setActiveTab('reseñas')}
            className={`pb-3 text-xs sm:text-sm font-extrabold transition-all border-b-2 whitespace-nowrap ${
              activeTab === 'reseñas'
                ? 'border-teal-500 text-teal-600 dark:text-teal-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Reseñas & Opiniones ({product.reseñasCount || 128})
          </button>
        </div>

        {/* Tab Contents */}
        <div className="bg-slate-50 dark:bg-slate-900/40 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800">
          
          {activeTab === 'descripcion' && (
            <div className="space-y-4 max-w-3xl text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Acerca de {product.nombre}
              </h3>
              <p>
                {product.descripcionDetallada || product.descripcion}
              </p>
              <p>
                Cada compra realizada a través de la Plataforma Social con Propósito impacta directamente a los productores locales de la región de Urabá, fortaleciendo la sostenibilidad ecológica y la independencia económica de las familias rurales.
              </p>
            </div>
          )}

          {activeTab === 'especificaciones' && (
            <div className="max-w-2xl">
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
                Ficha Técnica de Calidad
              </h3>
              {product.especificaciones ? (
                <div className="divide-y divide-slate-200 dark:divide-slate-800">
                  {Object.entries(product.especificaciones).map(([key, val], idx) => (
                    <div key={idx} className="py-2.5 flex justify-between text-xs sm:text-sm">
                      <span className="font-bold text-slate-500 dark:text-slate-400">{key}:</span>
                      <span className="font-semibold text-slate-900 dark:text-white text-right">{val}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500">Origen: Urabá, Colombia. Certificación Agroecológica Local.</p>
              )}
            </div>
          )}

          {activeTab === 'reseñas' && (
            <div className="space-y-4 max-w-2xl">
              <div className="flex items-center gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
                <span className="text-4xl font-black text-slate-900 dark:text-white">
                  {product.calificacion || 4.9}
                </span>
                <div>
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Basado en {product.reseñasCount || 128} opiniones de compradores verificados
                  </span>
                </div>
              </div>

              {/* Sample Review */}
              <div className="space-y-2 text-xs sm:text-sm">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white">Carlos M. (Comprador Verificado)</span>
                  <span className="text-[10px] text-slate-400">Hace 2 días</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300">
                  "Excelente producto de origen Urabá, llegó súper fresco a Medellín en menos de 48 horas. Apoyar a los emprendedores locales valió 100% la pena."
                </p>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Related Products Recommendations Carousel Grid */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6 pt-8 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Otros Productos Recomendados de Urabá
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relProd) => (
              <div
                key={relProd.id}
                onClick={() => {
                  setActiveImageIndex(0);
                  setQuantity(1);
                  onSelectProduct(relProd);
                }}
                className="rounded-2xl bg-white dark:bg-psp-dark-card border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="overflow-hidden">
                    <img
                      src={relProd.imagen}
                      alt={relProd.nombre}
                      className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <span className="text-[10px] font-bold text-teal-500 uppercase">{relProd.categoria}</span>
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white mt-1 line-clamp-1">
                      {relProd.nombre}
                    </h3>
                    <p className="text-[11px] font-semibold text-emerald-500 mt-2">
                      Por: {relProd.proveedor}
                    </p>
                  </div>
                </div>

                <div className="p-4 pt-0 flex items-center justify-between">
                  <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                    ${relProd.precio.toLocaleString()} COP
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-teal-500/15 text-teal-700 dark:text-teal-300 text-xs font-bold group-hover:bg-teal-500 group-hover:text-white transition-colors">
                    Ver Detalles
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default ProductDetailView;
