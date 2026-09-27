import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  MapPin, 
  Phone, 
  MessageCircle, 
  Clock, 
  Star, 
  Globe, 
  Navigation, 
  Share2, 
  Heart, 
  ShieldCheck, 
  Award, 
  Sparkles,
  CheckCircle2,
  Calendar,
  Utensils,
  Wrench,
  Bus,
  Compass,
  Check
} from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const CommerceDetailView = ({ item, categoryType, onBack, allItems = [], onSelectItem }) => {
  const mapContainerRef = useRef(null);
  const leafletMapRef = useRef(null);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState('informacion');
  const [bookingToast, setBookingToast] = useState(false);

  // Gallery array
  const gallery = item.imagenes || [item.imagen];
  const mainImage = gallery[activeImageIndex] || item.imagen;

  // Coordinate defaults in Urabá
  const lat = item.lat || (item.municipio?.includes('Turbo') ? 8.0945 : item.municipio?.includes('Necoclí') ? 8.4246 : 7.8829);
  const lng = item.lng || (item.municipio?.includes('Turbo') ? -76.7320 : item.municipio?.includes('Necoclí') ? -76.7865 : -76.6256);
  const addressString = item.direccion || `${item.ubicación || item.municipio || 'Urabá'}, Antioquia, Colombia`;

  // Initialize Leaflet Map for "Cómo Llegar"
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Clean up existing map instance if any
    if (leafletMapRef.current) {
      leafletMapRef.current.remove();
      leafletMapRef.current = null;
    }

    try {
      const map = L.map(mapContainerRef.current, {
        center: [lat, lng],
        zoom: 14,
        zoomControl: true,
        scrollWheelZoom: false,
      });

      leafletMapRef.current = map;

      // OpenStreetMap Tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors | PSP Urabá'
      }).addTo(map);

      // Custom Icon for Leaflet
      const customIcon = L.divIcon({
        className: 'custom-map-marker',
        html: `
          <div style="background-color: #0c4236; color: white; border: 2px solid #2dd4bf; width: 38px; height: 38px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.3);">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
          </div>
        `,
        iconSize: [38, 38],
        iconAnchor: [19, 38],
        popupAnchor: [0, -38]
      });

      const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);
      marker.bindPopup(`
        <div style="font-family: system-ui; padding: 4px;">
          <strong style="font-size: 13px; color: #0f172a;">${item.nombre || item.empresa}</strong>
          <p style="font-size: 11px; color: #64748b; margin-top: 2px;">${addressString}</p>
        </div>
      `).openPopup();

    } catch (err) {
      console.error('Error loading Leaflet map:', err);
    }

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, [lat, lng, item]);

  const handleOpenGoogleMaps = () => {
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=${encodeURIComponent(item.nombre || 'Urabá')}`;
    window.open(googleMapsUrl, '_blank', 'noopener,noreferrer');
  };

  const handleWhatsAppContact = () => {
    const phone = item.whatsapp || '+573124567890';
    const message = encodeURIComponent(`Hola, vi su perfil en la Plataforma Social con Propósito Urabá y me gustaría obtener más información sobre: ${item.nombre || item.empresa}`);
    window.open(`https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${message}`, '_blank');
  };

  const handleBookService = () => {
    setBookingToast(true);
    setTimeout(() => setBookingToast(false), 3000);
  };

  // Recommendations of same category
  const relatedItems = allItems
    .filter(i => i.id !== item.id)
    .slice(0, 3);

  return (
    <div className="space-y-10 sm:space-y-12 animate-fadeIn">
      
      {/* Top Bar: Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Volver al Directorio Comercial</span>
        </button>

        <span className="px-3 py-1 rounded-full bg-teal-500/15 text-teal-700 dark:text-teal-300 text-xs font-bold uppercase tracking-wider">
          {item.categoria || categoryType || 'Establecimiento Comercial'}
        </span>
      </div>

      {/* Hero Cover & Establishment Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl bg-slate-900 group">
        <img
          src={mainImage}
          alt={item.nombre || item.empresa}
          className="w-full h-64 sm:h-80 lg:h-96 object-cover brightness-[0.85] transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />

        {/* Floating Badges */}
        <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/90 text-slate-950 text-xs font-extrabold shadow-lg backdrop-blur-md">
            <ShieldCheck className="w-4 h-4" /> Aliado Verificado Urabá
          </span>
          {item.rangoPrecio && (
            <span className="px-3 py-1.5 rounded-full bg-white/90 dark:bg-slate-900/90 text-slate-900 dark:text-teal-300 text-xs font-extrabold shadow-md backdrop-blur-md">
              Rango: {item.rangoPrecio}
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            aria-label="Guardar negocio"
            className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-all shadow-md ${
              isFavorite ? 'bg-rose-500 text-white' : 'bg-white/80 dark:bg-slate-900/80 text-white hover:bg-white hover:text-slate-900'
            }`}
          >
            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Hero Title & Info Overlay */}
        <div className="absolute bottom-6 left-6 right-6 z-10 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div className="space-y-2 max-w-2xl text-white">
            <div className="flex items-center gap-2 text-xs font-semibold text-teal-300">
              <MapPin className="w-4 h-4 text-teal-400" />
              <span>{item.ubicación || item.ubicacion || item.municipio || 'Urabá, Antioquia'}</span>
              <span className="text-slate-400">•</span>
              <span className="text-emerald-300 flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-current text-amber-400" />
                {item.calificacion || 4.9} (Reseñas Verificadas)
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              {item.nombre || item.empresa || `${item.origen} ➔ ${item.destino}`}
            </h1>

            {item.proveedor && (
              <p className="text-xs sm:text-sm text-slate-300 font-medium">
                Operado por: <strong className="text-white">{item.proveedor}</strong>
              </p>
            )}
          </div>

          {/* Direct CTA Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleWhatsAppContact}
              className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold shadow-lg flex items-center gap-2 transition-all transform active:scale-95"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp</span>
            </button>

            <button
              onClick={handleOpenGoogleMaps}
              className="px-4 py-2.5 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 text-xs font-extrabold shadow-lg flex items-center gap-2 transition-all transform active:scale-95"
            >
              <Navigation className="w-4 h-4" />
              <span>Cómo Llegar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid Section (2 Columns: Left Details + Right Map & Contact Ficha) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* Left Column (Cols 1-7): Detailed Information & Offerings */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Gallery Thumbnails if available */}
          {gallery.length > 1 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Galería de Instalaciones & Experiencia
              </h3>
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {gallery.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${
                      activeImageIndex === idx
                        ? 'border-teal-500 ring-2 ring-teal-500/30 scale-105 shadow-md'
                        : 'border-slate-200 dark:border-slate-800 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={imgUrl} alt="Vista galería" className="w-24 h-24 object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Detailed Narrative */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Acerca del Establecimiento / Servicio
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {item.descripcionDetallada || item.descripcion || 'Este negocio forma parte del nodo comercial y socioeconómico de la subregión de Urabá. Ofrece atención personalizada con altos estándares de calidad, apoyando la articulación regional y el desarrollo sostenible local.'}
            </p>
          </div>

          {/* Category-Specific Highlight Boxes */}
          {/* RESTAURANTES MENU */}
          {item.menuDestacado && (
            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center gap-2">
                <Utensils className="w-5 h-5 text-teal-500" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Especialidades & Platos Destacados del Menú
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {item.menuDestacado.map((dish, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 flex justify-between items-center text-xs">
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white block">{dish.nombre}</span>
                      <span className="text-[11px] text-slate-500">{dish.descripcion}</span>
                    </div>
                    <span className="font-extrabold text-teal-600 dark:text-teal-400 shrink-0 ml-2">${dish.precio.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SERVICIOS ESPECIALIZADOS */}
          {item.serviciosOfrecidos && (
            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center gap-2">
                <Wrench className="w-5 h-5 text-teal-500" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Servicios y Cobertura Técnica
                </h3>
              </div>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                {item.serviciosOfrecidos.map((s, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* TURISMO ITINERARIO */}
          {item.itinerario && (
            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-teal-500" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Itinerario & Experiencia Guiada
                </h3>
              </div>
              <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                {item.itinerario.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-teal-500/15 text-teal-700 dark:text-teal-300 font-bold text-xs flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <div>
                      <strong className="text-slate-900 dark:text-white block">{step.titulo}</strong>
                      <span className="text-slate-500 text-xs">{step.detalle}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Button: Solicitar Servicio / Reserva */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-[#0c4236] to-teal-500 text-white space-y-3 shadow-lg">
            <h3 className="text-base font-bold">¿Deseas agendar o cotizar directamente?</h3>
            <p className="text-xs text-slate-200 leading-relaxed">
              Ponte en contacto con el equipo encargado para coordinar horarios, requerimientos especiales o reservas personalizadas.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={handleBookService}
                className="px-5 py-3 rounded-xl bg-white text-slate-950 font-extrabold text-xs hover:bg-slate-100 transition-colors shadow-md flex items-center gap-2"
              >
                <Calendar className="w-4 h-4 text-teal-600" />
                <span>Solicitar Reserva / Cotización</span>
              </button>
            </div>

            {bookingToast && (
              <div className="p-3 rounded-xl bg-emerald-400 text-slate-950 font-bold text-xs text-center animate-bounce flex items-center justify-center gap-2 mt-2">
                <Check className="w-4 h-4" />
                <span>¡Solicitud enviada! El establecimiento se comunicará contigo vía WhatsApp.</span>
              </div>
            )}
          </div>

        </div>

        {/* Right Column (Cols 8-12): Interactive Map "Cómo Llegar" & Ficha de Datos */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Interactive Map Box ("Cómo Llegar") */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Navigation className="w-5 h-5 text-teal-500" />
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                  Ubicación & Cómo Llegar
                </h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[10px] font-black">
                GPS Urabá
              </span>
            </div>

            {/* Leaflet Map Viewport Container */}
            <div 
              ref={mapContainerRef} 
              className="w-full h-56 sm:h-64 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-inner z-0" 
            />

            {/* Address & Direct Directions Button */}
            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
                <MapPin className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
                <span className="font-semibold">{addressString}</span>
              </div>

              <button
                onClick={handleOpenGoogleMaps}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-white font-extrabold text-xs shadow-md shadow-teal-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Navigation className="w-4 h-4" />
                <span>Abrir Indicaciones en Google Maps / Waze</span>
              </button>
            </div>
          </div>

          {/* Ficha Informativa de Contacto */}
          <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-4 text-xs">
            <h3 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 pb-2">
              Datos de Atención & Canales
            </h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 flex items-center gap-2 font-medium">
                  <Clock className="w-4 h-4 text-teal-500" /> Horarios de Atención:
                </span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {item.horario || 'Lunes a Sábado: 8:00 AM - 7:00 PM'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 flex items-center gap-2 font-medium">
                  <Phone className="w-4 h-4 text-teal-500" /> Línea Telefónica:
                </span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {item.telefono || '+57 (604) 828-1234'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 flex items-center gap-2 font-medium">
                  <Globe className="w-4 h-4 text-teal-500" /> Municipio Sede:
                </span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {item.municipio || item.ubicación || 'Apartadó, Urabá'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 flex items-center gap-2 font-medium">
                  <Award className="w-4 h-4 text-teal-500" /> Métodos de Pago:
                </span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {item.metodosPago || 'Nequi, Daviplata, Efectivo, Tarjetas'}
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Related Establishments Recommendation Carousel */}
      {relatedItems.length > 0 && (
        <div className="space-y-6 pt-8 border-t border-slate-200 dark:border-slate-800">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Otros Negocios y Servicios Relacionados en Urabá
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedItems.map((rel) => (
              <div
                key={rel.id}
                onClick={() => {
                  setActiveImageIndex(0);
                  onSelectItem(rel);
                }}
                className="rounded-2xl bg-white dark:bg-psp-dark-card border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <img src={rel.imagen} alt={rel.nombre || rel.empresa} className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="p-4 space-y-1">
                    <span className="text-[10px] font-bold text-teal-500 uppercase">{rel.categoria}</span>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">{rel.nombre || rel.empresa}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">{rel.descripcion}</p>
                  </div>
                </div>

                <div className="p-4 pt-0 flex justify-between items-center text-xs">
                  <span className="text-emerald-500 font-bold">★ {rel.calificacion || 4.8}</span>
                  <span className="px-3 py-1 rounded-lg bg-teal-500/15 text-teal-700 dark:text-teal-300 font-bold">Ver Negocio & Mapa</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default CommerceDetailView;
