import React, { useState, useEffect, useRef } from 'react';
import { 
  MapPin, 
  Search, 
  Star, 
  ExternalLink, 
  Filter, 
  Compass, 
  Building2, 
  Trees, 
  ShoppingBag, 
  Anchor,
  Layers,
  ChevronRight
} from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { LUGARES_MAPA } from '../data/mockData';
import { useTheme } from '../context/ThemeContext';

const MapaPage = () => {
  const { theme } = useTheme();
  const mapRef = useRef(null);
  const leafletMapRef = useRef(null);
  const markersRef = useRef([]);

  const [selectedLugar, setSelectedLugar] = useState(LUGARES_MAPA[0]);
  const [selectedCategoria, setSelectedCategoria] = useState('Todas');
  const [searchTerm, setSearchTerm] = useState('');

  // Filtered places
  const lugaresFiltrados = LUGARES_MAPA.filter((loc) => {
    const matchesCat = selectedCategoria === 'Todas' || loc.tipo === selectedCategoria;
    const matchesSearch = 
      loc.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loc.municipio.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loc.etiquetas.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapRef.current) return;

    if (!leafletMapRef.current) {
      // Center near Turbo & Urabá (8.0945, -76.7320)
      const map = L.map(mapRef.current, {
        center: [8.0945, -76.7320],
        zoom: 12,
        zoomControl: false
      });

      // Add Zoom Control to top-right
      L.control.zoom({ position: 'topright' }).addTo(map);

      leafletMapRef.current = map;
    }

    const map = leafletMapRef.current;

    // Tile Layer based on theme
    const tileUrl = theme === 'dark' 
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

    // Remove existing tile layers
    map.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer);
      }
    });

    L.tileLayer(tileUrl, {
      maxZoom: 19,
      attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap'
    }).addTo(map);

  }, [theme]);

  // Update Markers when filtered list or selected location changes
  useEffect(() => {
    const map = leafletMapRef.current;
    if (!map) return;

    // Clear previous markers
    markersRef.current.forEach(m => map.removeLayer(m));
    markersRef.current = [];

    lugaresFiltrados.forEach((loc) => {
      const isSelected = selectedLugar?.id === loc.id;

      // Custom DivIcon badge matching the Vercel screenshot style
      const customIcon = L.divIcon({
        className: 'custom-map-pin',
        html: `
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full shadow-lg border transition-all duration-300 transform ${
            isSelected 
              ? 'bg-amber-400 text-slate-950 border-amber-300 scale-110 ring-4 ring-amber-400/30 font-black' 
              : 'bg-white dark:bg-[#131c1a] text-slate-900 dark:text-slate-100 border-slate-200 dark:border-[#203330] hover:scale-105 font-bold'
          }">
            <span className="w-2 h-2 rounded-full ${isSelected ? 'bg-slate-950 animate-pulse' : 'bg-[#0c4236] dark:bg-teal-400'}"></span>
            <span className="text-xs whitespace-nowrap">${loc.nombre}</span>
          </div>
        `,
        iconSize: [120, 36],
        iconAnchor: [60, 18]
      });

      const marker = L.marker([loc.lat, loc.lng], { icon: customIcon }).addTo(map);
      
      marker.on('click', () => {
        setSelectedLugar(loc);
        map.flyTo([loc.lat, loc.lng], 13, { duration: 1 });
      });

      markersRef.current.push(marker);
    });

  }, [lugaresFiltrados, selectedLugar]);

  const handleSelectLugar = (loc) => {
    setSelectedLugar(loc);
    if (leafletMapRef.current) {
      leafletMapRef.current.flyTo([loc.lat, loc.lng], 13, { duration: 1 });
    }
  };

  return (
    <div className="relative w-full h-[calc(100vh-5rem)] min-h-[500px] overflow-hidden flex flex-col md:flex-row bg-slate-900 text-white">
      
      {/* MAP CONTAINER */}
      <div className="w-full h-full relative z-0 flex-grow" ref={mapRef}></div>

      {/* FLOATING LOCATION DETAILS CARD (Side Panel matching psp-front-peach screenshot) */}
      {selectedLugar && (
        <div className="absolute top-4 left-4 z-20 w-80 sm:w-96 bg-white/95 dark:bg-[#131c1a]/95 backdrop-blur-xl border border-slate-200 dark:border-[#203330] rounded-3xl shadow-2xl p-6 text-slate-900 dark:text-slate-100 animate-in fade-in slide-in-from-left-4 duration-300 max-h-[calc(100vh-7rem)] overflow-y-auto">
          
          {/* Badge & Category */}
          <div className="flex items-center justify-between mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-teal-950/80 text-[#0c4236] dark:text-teal-300 text-[10px] font-black uppercase tracking-wider border border-emerald-300 dark:border-teal-500/30">
              🏖️ {selectedLugar.categoria}
            </span>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              {selectedLugar.calificacion} • {selectedLugar.resenas} reseñas
            </span>
          </div>

          {/* Location Title & Municipality */}
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
            {selectedLugar.nombre}
          </h2>
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-1 mb-4 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-[#0c4236] dark:text-teal-400" />
            {selectedLugar.municipio}
          </p>

          {/* Location Photo */}
          <div className="relative h-44 rounded-2xl overflow-hidden mb-4 border border-slate-200 dark:border-[#203330] shadow-md">
            <img 
              src={selectedLugar.imagen} 
              alt={selectedLugar.nombre}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Description */}
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium mb-4">
            {selectedLugar.descripcion}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-5">
            {selectedLugar.etiquetas.map(t => (
              <span key={t} className="px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-[#182422] text-slate-600 dark:text-slate-400 text-[11px] font-bold">
                #{t}
              </span>
            ))}
          </div>

          {/* Actions: Direct Link to Google Maps */}
          <a
            href={selectedLugar.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 rounded-xl bg-[#0c4236] hover:bg-[#0f5144] dark:bg-gradient-to-r dark:from-teal-400 dark:to-emerald-400 dark:hover:from-teal-300 text-white dark:text-slate-950 text-xs font-black shadow-md flex items-center justify-center gap-2 transition-all"
          >
            <span>Ver en Google Maps</span>
            <ExternalLink className="w-4 h-4" />
          </a>

        </div>
      )}

      {/* FLOATING CONTROLS & FILTER BAR (Bottom Right matching psp-front-peach) */}
      <div className="absolute bottom-6 right-6 z-20 flex flex-col sm:flex-row items-end sm:items-center gap-3">
        
        {/* Search input */}
        <div className="relative w-60 sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar lugar en Urabá..."
            className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-white/95 dark:bg-[#131c1a]/95 backdrop-blur-md border border-slate-200 dark:border-[#203330] text-xs font-bold text-slate-900 dark:text-slate-100 shadow-xl focus:outline-none focus:ring-2 focus:ring-[#0c4236]"
          />
        </div>

        {/* Category Filter Dropdown */}
        <div className="relative">
          <select
            value={selectedCategoria}
            onChange={(e) => setSelectedCategoria(e.target.value)}
            className="px-4 py-2.5 rounded-2xl bg-white/95 dark:bg-[#131c1a]/95 backdrop-blur-md border border-slate-200 dark:border-[#203330] text-xs font-extrabold text-slate-900 dark:text-slate-100 shadow-xl focus:outline-none cursor-pointer appearance-none pr-8"
          >
            <option value="Todas">🎛️ Todas las Categorías</option>
            <option value="playa">🏖️ Playas & Costa</option>
            <option value="comercio">🛒 Comercio & Compras</option>
            <option value="puerto">🚢 Puertos & Logística</option>
            <option value="parque">🌳 Parques & Plazas</option>
            <option value="naturaleza">🏞️ Reservas Naturales</option>
          </select>
          <Filter className="w-4 h-4 absolute right-2.5 top-3 text-slate-400 pointer-events-none" />
        </div>

      </div>

    </div>
  );
};

export default MapaPage;
