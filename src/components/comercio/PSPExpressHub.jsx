import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Bike,
  Car,
  Package,
  MapPin,
  Navigation,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Phone,
  MessageCircle,
  ArrowRight,
  Search,
  Zap,
  Briefcase,
  Bus,
  LayoutDashboard,
  FileText,
  Users,
  Bell,
  Plus,
  Filter,
  Download,
  ChevronRight,
  Star,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Play,
  RotateCcw,
  CreditCard,
  Compass,
  Check,
  Camera,
  CloudRain,
  Sun,
  Wind,
  Maximize2,
  Minimize2,
  Radio,
  LocateFixed,
  Video,
  Crown,
  Upload,
  ExternalLink,
  Receipt,
  Lock,
  Building2,
  Sparkles,
  Calculator,
  Percent,
  Plane,
  DollarSign,
  Award,
  AlertTriangle,
  X
} from 'lucide-react';

// ============================================================
// MODELO DE NEGOCIO CORPLEX SOLUTION SAS & PSP EXPRESS
// ============================================================
// Tarifa tecnológica por carrera para Corplex Solution SAS (Monitoreo GPS, Cámaras en Vivo & Sistema de Verificación de Repartidores)
const CORP_SOLUTION_FEE = 500;
// Deducción de plataforma PSP para repartidores SIN membresía Gold/Plata ($300 COP por viaje para Janier)
const PSP_NON_MEMBER_RIDER_FEE = 300;
// Matrícula de inscripción directa para repartidores sin membresía anual
const RIDER_DIRECT_ENROLLMENT_FEE = 30000;
// FlexDrive: Comisión total de plataforma sobre el viaje en carro particular (12% vs 25% de Uber)
const FLEXDRIVE_COMMISSION_PCT = 0.12;
// FlexDrive Alianza: 60% Corplex Solution SAS (Jhon - Desarrollo & Software) / 40% PSP (Janier - Comercialización)
const CORP_FLEX_SPLIT = 0.60;
const PSP_FLEX_SPLIT = 0.40;

// Real GPS coordinates & verified geotagged street-level imagery sequences for Urabá municipalities
const URABA_GEO_DATA = {
  Apartadó: {
    originCoords: [7.8832, -76.6258], // Parque Principal / Centro Apartadó
    destCoords: [7.8898, -76.6335],   // Barrio Ortíz / Av. Alfonso López
    waypointsCoords: [
      [7.8832, -76.6258],
      [7.8849, -76.6279],
      [7.8862, -76.6283],
      [7.8881, -76.6312],
      [7.8898, -76.6335]
    ],
    streetFrames: [
      {
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b3/Apartad%C3%B3%2C_Antioquia%2C_Colombia_-_panoramio.jpg/960px-Apartad%C3%B3%2C_Antioquia%2C_Colombia_-_panoramio.jpg',
        caption: 'Carrera 100 • Troncal Central, Apartadó',
        coords: '7.8862° N, 76.6283° W'
      },
      {
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b9/Apartad%C3%B3%2C_Antioquia%2C_Colombia_-_panoramio_%281%29.jpg/960px-Apartad%C3%B3%2C_Antioquia%2C_Colombia_-_panoramio_%281%29.jpg',
        caption: 'Av. Alfonso López • Sector Comercial, Apartadó',
        coords: '7.8767° N, 76.6331° W'
      },
      {
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/44/Apartad%C3%B3%2C_Antioquia%2C_Colombia_-_panoramio_%282%29.jpg/960px-Apartad%C3%B3%2C_Antioquia%2C_Colombia_-_panoramio_%282%29.jpg',
        caption: 'Puente Peatonal & Eje Vial • Apartadó',
        coords: '7.8766° N, 76.6330° W'
      },
      {
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/63/Apartad%C3%B3%2C_Antioquia%2C_Colombia_-_panoramio_%283%29.jpg/960px-Apartad%C3%B3%2C_Antioquia%2C_Colombia_-_panoramio_%283%29.jpg',
        caption: 'Acceso Urbano • Vía Barrio Ortíz, Apartadó',
        coords: '7.8764° N, 76.6328° W'
      }
    ]
  },
  Turbo: {
    originCoords: [8.0926, -76.7282], // Muelle El Waffe, Turbo
    destCoords: [8.0985, -76.7194],   // Barrio Obrero, Turbo
    waypointsCoords: [
      [8.0926, -76.7282],
      [8.0941, -76.7260],
      [8.0958, -76.7235],
      [8.0972, -76.7212],
      [8.0985, -76.7194]
    ],
    streetFrames: [
      {
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/63/Turbo%2C_Antioquia%2C_Colombia_-_panoramio_%281%29.jpg/960px-Turbo%2C_Antioquia%2C_Colombia_-_panoramio_%281%29.jpg',
        caption: 'Calle 101 Portuaria • Centro Urbano, Turbo',
        coords: '8.0931° N, 76.7274° W'
      },
      {
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/89/Turbo%2C_Antioquia%2C_Colombia_-_panoramio_%282%29.jpg/960px-Turbo%2C_Antioquia%2C_Colombia_-_panoramio_%282%29.jpg',
        caption: 'Avenida La Playa • Distrito de Turbo',
        coords: '8.0948° N, 76.7251° W'
      },
      {
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/26/La_Victoria%2C_Turbo%2C_Antioquia%2C_Colombia_-_panoramio_%281%29.jpg/960px-La_Victoria%2C_Turbo%2C_Antioquia%2C_Colombia_-_panoramio_%281%29.jpg',
        caption: 'Corredor Vial La Victoria • Turbo',
        coords: '7.9698° N, 76.6477° W'
      },
      {
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4f/Puerto_de_Turbo_%28sur%29.JPG/960px-Puerto_de_Turbo_%28sur%29.JPG',
        caption: 'Muelle El Waffe • Zona Portuaria, Turbo',
        coords: '8.0926° N, 76.7282° W'
      }
    ]
  },
  Carepa: {
    originCoords: [7.7582, -76.6554], // Centro / Mercado Carepa
    destCoords: [7.7645, -76.6490],   // Urb. Papagayo, Carepa
    waypointsCoords: [
      [7.7582, -76.6554],
      [7.7598, -76.6538],
      [7.7615, -76.6522],
      [7.7630, -76.6505],
      [7.7645, -76.6490]
    ],
    streetFrames: [
      {
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/87/Entrada_politecnico_jic_-_panoramio.jpg/960px-Entrada_politecnico_jic_-_panoramio.jpg',
        caption: 'Troncal de Urabá • Entrada Politécnico JIC, Carepa',
        coords: '7.8034° N, 76.6516° W'
      },
      {
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/96/Bellavista%2C_Carepa%2C_Antioquia%2C_Colombia_-_panoramio.jpg/960px-Bellavista%2C_Carepa%2C_Antioquia%2C_Colombia_-_panoramio.jpg',
        caption: 'Sector Bellavista • Vía Nacional, Carepa',
        coords: '7.8034° N, 76.6524° W'
      },
      {
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b9/Apartad%C3%B3%2C_Antioquia%2C_Colombia_-_panoramio_%281%29.jpg/960px-Apartad%C3%B3%2C_Antioquia%2C_Colombia_-_panoramio_%281%29.jpg',
        caption: 'Carrera 68 • Eje Comercial Carepa',
        coords: '7.7598° N, 76.6538° W'
      }
    ]
  },
  Chigorodó: {
    originCoords: [7.6672, -76.6811], // Centro Acopio Chigorodó
    destCoords: [7.8810, -76.6250],   // Terminal Apartadó
    waypointsCoords: [
      [7.6672, -76.6811],
      [7.7120, -76.6680],
      [7.7580, -76.6550],
      [7.8210, -76.6410],
      [7.8810, -76.6250]
    ],
    streetFrames: [
      {
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5e/Chigorod%C3%B3%2C_Antioquia%2C_Colombia_-_panoramio_%281%29.jpg/960px-Chigorod%C3%B3%2C_Antioquia%2C_Colombia_-_panoramio_%281%29.jpg',
        caption: 'Vía Principal • Casco Urbano, Chigorodó',
        coords: '7.6672° N, 76.6811° W'
      },
      {
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b0/Chigorod%C3%B3%2C_Antioquia%2C_Colombia_-_panoramio_%283%29.jpg/960px-Chigorod%C3%B3%2C_Antioquia%2C_Colombia_-_panoramio_%283%29.jpg',
        caption: 'Carrera 96 Comercial • Chigorodó',
        coords: '7.6685° N, 76.6802° W'
      },
      {
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e2/Chigorod%C3%B3%2C_Antioquia%2C_Colombia_-_panoramio_%287%29.jpg/960px-Chigorod%C3%B3%2C_Antioquia%2C_Colombia_-_panoramio_%287%29.jpg',
        caption: 'Troncal de Urabá • Salida hacia Carepa/Apartadó',
        coords: '7.6710° N, 76.6789° W'
      },
      {
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/89/Chigorod%C3%B3%2C_Antioquia%2C_Colombia_-_panoramio_%288%29.jpg/960px-Chigorod%C3%B3%2C_Antioquia%2C_Colombia_-_panoramio_%288%29.jpg',
        caption: 'Corredor Agroindustrial • Río Chigorodó',
        coords: '7.6659° N, 76.6825° W'
      }
    ]
  },
  Necoclí: {
    originCoords: [8.4258, -76.7839], // Malecón Necoclí
    destCoords: [8.3610, -76.7420],   // Sector El Totumo
    waypointsCoords: [
      [8.4258, -76.7839],
      [8.4110, -76.7740],
      [8.3950, -76.7620],
      [8.3780, -76.7510],
      [8.3610, -76.7420]
    ],
    streetFrames: [
      {
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0f/HOSPITAL_NECOCLI_-_panoramio.jpg/960px-HOSPITAL_NECOCLI_-_panoramio.jpg',
        caption: 'Calle 50 Principal • Sector Hospital, Necoclí',
        coords: '8.4258° N, 76.7839° W'
      },
      {
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/60/Wedding_Sunset_Sea_%28214618179%29.jpeg/960px-Wedding_Sunset_Sea_%28214618179%29.jpeg',
        caption: 'Av. del Mar • Malecón Turístico, Necoclí',
        coords: '8.4271° N, 76.7855° W'
      },
      {
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/be/Paisaje_en_Colombia.jpg/960px-Paisaje_en_Colombia.jpg',
        caption: 'Corredor Costero Vía El Totumo • Necoclí',
        coords: '8.3820° N, 76.7540° W'
      }
    ]
  }
};

const INITIAL_SHIPMENTS = [
  {
    id: '#D20800C',
    shipmentId: 'PSP-78521-URA',
    serviceType: 'mandado',
    serviceLabel: 'Domicilio Express',
    status: 'out_for_delivery',
    statusLabel: 'En reparto',
    origin: 'Parque Principal, Apartadó',
    destination: 'Barrio Ortíz, Apartadó',
    municipio: 'Apartadó',
    neighborhoodLabel: 'BARRIO ORTÍZ • APARTADÓ',
    estimatedDelivery: 'Hoy, 04:30 PM',
    etaMinutes: '8 min',
    payment: 'Prepago • Nequi',
    amount: 6500,
    customer: {
      name: 'Camila Restrepo',
      phone: '+57 314 620 8810',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'
    },
    rider: {
      name: 'Carlos Andrés Rivas',
      role: 'Domiciliario Verificado • Yamaha FZ-150 (URA-45D)',
      phone: '+573129876543',
      rating: 4.9,
      trips: 418,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
    },
    progressStep: 3, // 0..4
    streetPreview: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b3/Apartad%C3%B3%2C_Antioquia%2C_Colombia_-_panoramio.jpg/960px-Apartad%C3%B3%2C_Antioquia%2C_Colombia_-_panoramio.jpg',
    streets: {
      ave1: 'Calle 100 Comercial',
      ave2: 'Av. Alfonso López',
      ave3: 'Carrera 100 • Centro',
      ave4: 'Diagonal 98 • Ortíz',
      landmark1: 'Hospital Antonio Roldán',
      landmark2: 'Clínica Urabá',
      landmark3: 'Plaza del Río'
    },
    timeline: [
      { title: 'Pedido confirmado', location: 'Comercio Local, Apartadó', date: '17 Oct', time: '03:50 PM' },
      { title: 'Recogido en origen', location: 'Parque Principal, Apartadó', date: '17 Oct', time: '04:02 PM' },
      { title: 'En tránsito urbano', location: 'Av. Alfonso López, Apartadó', date: '17 Oct', time: '04:12 PM' },
      { title: 'En camino a entrega', location: 'Barrio Ortíz, Apartadó', date: '17 Oct', time: '04:20 PM' },
      { title: 'Entregado', location: 'Barrio Ortíz, Apartadó', date: '17 Oct', time: '04:30 PM' }
    ]
  },
  {
    id: '#B30400E',
    shipmentId: 'PSP-78549-TRB',
    serviceType: 'mototaxi',
    serviceLabel: 'Mototaxi Express',
    status: 'in_transit',
    statusLabel: 'En tránsito',
    origin: 'Muelle El Waffe, Turbo',
    destination: 'Barrio Obrero, Turbo',
    municipio: 'Turbo',
    neighborhoodLabel: 'DISTRITO PORTUARIO • TURBO',
    estimatedDelivery: 'Hoy, 04:35 PM',
    etaMinutes: '6 min',
    payment: 'Efectivo Contraentrega',
    amount: 5000,
    customer: {
      name: 'Jhon Jairo Córdoba',
      phone: '+57 311 408 1920',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80'
    },
    rider: {
      name: 'Fabián Mosquera',
      role: 'Mototaxista Aliado • Bajaj Boxer CT100 (TRB-89A)',
      phone: '+573104567891',
      rating: 4.8,
      trips: 520,
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80'
    },
    progressStep: 2,
    streetPreview: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/63/Turbo%2C_Antioquia%2C_Colombia_-_panoramio_%281%29.jpg/960px-Turbo%2C_Antioquia%2C_Colombia_-_panoramio_%281%29.jpg',
    streets: {
      ave1: 'Av. La Playa',
      ave2: 'Calle 101 Portuaria',
      ave3: 'Carrera 13 • Waffe',
      ave4: 'Vía Barrio Obrero',
      landmark1: 'Capitanía de Puerto',
      landmark2: 'Estadio JJ Tréllez',
      landmark3: 'Parque Central Turbo'
    },
    timeline: [
      { title: 'Solicitud aceptada', location: 'Muelle El Waffe, Turbo', date: '17 Oct', time: '04:15 PM' },
      { title: 'Pasajero / Paquete a bordo', location: 'Muelle El Waffe, Turbo', date: '17 Oct', time: '04:21 PM' },
      { title: 'En tránsito urbano', location: 'Calle 101 Portuaria, Turbo', date: '17 Oct', time: '04:27 PM' },
      { title: 'Llegando al destino', location: 'Barrio Obrero, Turbo', date: '17 Oct', time: '04:32 PM' },
      { title: 'Finalizado', location: 'Barrio Obrero, Turbo', date: '17 Oct', time: '04:35 PM' }
    ]
  },
  {
    id: '#C40200H',
    shipmentId: 'PSP-78610-CRP',
    serviceType: 'bici',
    serviceLabel: 'Bici Eléctrica Eco',
    status: 'delivered',
    statusLabel: 'Entregado',
    origin: 'Mercado Campesino, Carepa',
    destination: 'Urbanización Papagayo, Carepa',
    municipio: 'Carepa',
    neighborhoodLabel: 'ZONA URBANA • CAREPA',
    estimatedDelivery: 'Hoy, 03:45 PM',
    etaMinutes: 'Completado',
    payment: 'Prepago • Daviplata',
    amount: 4500,
    customer: {
      name: 'Luisa Fernanda Mena',
      phone: '+57 320 519 3340',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80'
    },
    rider: {
      name: 'Mateo Durango',
      role: 'Repartidor Eco • Bici Eléctrica PSP #14',
      phone: '+573158765432',
      rating: 5.0,
      trips: 189,
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80'
    },
    progressStep: 4,
    streetPreview: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/87/Entrada_politecnico_jic_-_panoramio.jpg/960px-Entrada_politecnico_jic_-_panoramio.jpg',
    streets: {
      ave1: 'Calle Principal Carepa',
      ave2: 'Vía Aeropuerto Los Cedros',
      ave3: 'Carrera 68',
      ave4: 'Av. Papagayo',
      landmark1: 'Alcaldía de Carepa',
      landmark2: 'Parque Acacia',
      landmark3: 'Estadio Municipal'
    },
    timeline: [
      { title: 'Pedido confirmado', location: 'Mercado Campesino, Carepa', date: '17 Oct', time: '03:15 PM' },
      { title: 'Recogido en origen', location: 'Mercado Campesino, Carepa', date: '17 Oct', time: '03:22 PM' },
      { title: 'En tránsito ecológico', location: 'Carrera 68, Carepa', date: '17 Oct', time: '03:31 PM' },
      { title: 'En punto de entrega', location: 'Urb. Papagayo, Carepa', date: '17 Oct', time: '03:41 PM' },
      { title: 'Entregado', location: 'Urb. Papagayo, Carepa', date: '17 Oct', time: '03:45 PM' }
    ]
  },
  {
    id: '#E50912M',
    shipmentId: 'PSP-78702-CHG',
    serviceType: 'encomienda',
    serviceLabel: 'Encomienda Moto Express',
    status: 'pending',
    statusLabel: 'Asignando',
    origin: 'Centro Acopio, Chigorodó',
    destination: 'Terminal de Transporte, Apartadó',
    municipio: 'Chigorodó',
    neighborhoodLabel: 'CORREDOR VIAL • CHIGORODÓ',
    estimatedDelivery: 'Hoy, 05:10 PM',
    etaMinutes: '22 min',
    payment: 'Transferencia PSP',
    amount: 8000,
    customer: {
      name: 'Asociación Cacaotera Urabá',
      phone: '+57 318 220 9104',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80'
    },
    rider: {
      name: 'Robinson Palacio',
      role: 'Repartidor Moto • Boxer CT100 (URA-912)',
      phone: '+573142345678',
      rating: 4.9,
      trips: 615,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
    },
    progressStep: 1,
    streetPreview: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5e/Chigorod%C3%B3%2C_Antioquia%2C_Colombia_-_panoramio_%281%29.jpg/960px-Chigorod%C3%B3%2C_Antioquia%2C_Colombia_-_panoramio_%281%29.jpg',
    streets: {
      ave1: 'Troncal de Urabá',
      ave2: 'Puente Río Chigorodó',
      ave3: 'Carrera 96 Comercial',
      ave4: 'Vía Carepa - Apartadó',
      landmark1: 'Casa de la Cultura',
      landmark2: 'Parque Los Fundadores',
      landmark3: 'Zona Industrial'
    },
    timeline: [
      { title: 'Pedido confirmado', location: 'Centro Acopio, Chigorodó', date: '17 Oct', time: '04:25 PM' },
      { title: 'Recogido en origen', location: 'Centro Acopio, Chigorodó', date: '17 Oct', time: '04:34 PM' },
      { title: 'En tránsito intermunicipal', location: 'Troncal de Urabá', date: '17 Oct', time: 'Pendiente' },
      { title: 'En camino a entrega', location: 'Terminal Apartadó', date: '17 Oct', time: 'Pendiente' },
      { title: 'Entregado', location: 'Terminal Apartadó', date: '17 Oct', time: 'Est. 05:10 PM' }
    ]
  },
  {
    id: '#N60118K',
    shipmentId: 'PSP-78890-NEC',
    serviceType: 'mandado',
    serviceLabel: 'Encomienda Costera',
    status: 'in_transit',
    statusLabel: 'En tránsito',
    origin: 'Malecón Turístico, Necoclí',
    destination: 'Sector El Totumo, Necoclí',
    municipio: 'Necoclí',
    neighborhoodLabel: 'ZONA COSTERA • NECOCLÍ',
    estimatedDelivery: 'Hoy, 04:50 PM',
    etaMinutes: '14 min',
    payment: 'Prepago • Nequi',
    amount: 7500,
    customer: {
      name: 'Hotel Miramar Urabá',
      phone: '+57 316 890 4412',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80'
    },
    rider: {
      name: 'Yeferson Berrío',
      role: 'Domiciliario Moto • Akt NKD 125 (NEC-31F)',
      phone: '+573139988776',
      rating: 4.9,
      trips: 274,
      avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80'
    },
    progressStep: 2,
    streetPreview: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0f/HOSPITAL_NECOCLI_-_panoramio.jpg/960px-HOSPITAL_NECOCLI_-_panoramio.jpg',
    streets: {
      ave1: 'Av. del Mar • Malecón',
      ave2: 'Calle 50 Principal',
      ave3: 'Vía Ciénaga de Marimonda',
      ave4: 'Corredor El Totumo',
      landmark1: 'Muelle Turístico Necoclí',
      landmark2: 'Parque Educativo',
      landmark3: 'Playa Principal'
    },
    timeline: [
      { title: 'Pedido confirmado', location: 'Malecón Turístico, Necoclí', date: '17 Oct', time: '04:10 PM' },
      { title: 'Recogido en origen', location: 'Malecón Turístico, Necoclí', date: '17 Oct', time: '04:19 PM' },
      { title: 'En tránsito costero', location: 'Vía El Totumo, Necoclí', date: '17 Oct', time: '04:31 PM' },
      { title: 'En camino a entrega', location: 'Sector El Totumo, Necoclí', date: '17 Oct', time: 'Pendiente' },
      { title: 'Entregado', location: 'Sector El Totumo, Necoclí', date: '17 Oct', time: 'Est. 04:50 PM' }
    ]
  }
];

// Coordinates along the SVG route path from Start (bottom-left) to Finish (top-center)
const ROUTE_WAYPOINTS = [
  { x: 255, y: 472, label: 'Origen' },
  { x: 350, y: 505, label: 'Punto 1' },
  { x: 408, y: 390, label: 'En tránsito' },
  { x: 452, y: 245, label: 'En reparto' },
  { x: 382, y: 120, label: 'Destino' }
];

const STATUS_BADGE_STYLES = {
  out_for_delivery: {
    bg: 'bg-orange-50 dark:bg-orange-500/15',
    text: 'text-orange-600 dark:text-orange-400',
    dot: 'bg-orange-500',
    label: 'Out for delivery • En reparto'
  },
  in_transit: {
    bg: 'bg-sky-50 dark:bg-sky-500/15',
    text: 'text-sky-600 dark:text-sky-400',
    dot: 'bg-sky-500',
    label: 'In Transit • En tránsito'
  },
  delivered: {
    bg: 'bg-emerald-50 dark:bg-emerald-500/15',
    text: 'text-emerald-600 dark:text-emerald-400',
    dot: 'bg-emerald-500',
    label: 'Delivered • Entregado'
  },
  pending: {
    bg: 'bg-amber-50 dark:bg-amber-500/15',
    text: 'text-amber-600 dark:text-amber-400',
    dot: 'bg-amber-500',
    label: 'Pending • Asignando'
  }
};

const PSPExpressHub = ({ transportRoutes = [], onSelectRoute }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Detect default role view: if not logged in, start in 'guest' demo mode; otherwise 'admin' so Jhon sees everything
  const [viewRole, setViewRole] = useState(() => (!user ? 'guest' : 'admin'));

  // Sidebar navigation state: 'tracking' | 'orders' | 'new_order' | 'riders' | 'rutas'
  const [activeNav, setActiveNav] = useState('tracking');
  const [shipments, setShipments] = useState(INITIAL_SHIPMENTS);
  const [selectedOrderId, setSelectedOrderId] = useState('#D20800C');
  const [isSimulatingLive, setIsSimulatingLive] = useState(() => !user);

  // Invoice Ticket preview toggle & Membership Gate Modal
  const [showInvoiceTicket, setShowInvoiceTicket] = useState(true);
  const [membershipModal, setMembershipModal] = useState({ open: false, reason: '' });

  // Live Box Mode ('street_seq' | 'osm_live' | 'rider_cam') & Expanded state
  const [liveBoxMode, setLiveBoxMode] = useState('street_seq');
  const [isLiveExpanded, setIsLiveExpanded] = useState(false);
  const [frameIndex, setFrameIndex] = useState(0);
  const [isDashcamPlaying, setIsDashcamPlaying] = useState(true);

  // Real API Telemetry State (Open-Meteo + OSRM Routing + Browser GPS)
  const [liveWeather, setLiveWeather] = useState({ temp: 29, wind: 11, isRain: false, loaded: false });
  const [liveRouteInfo, setLiveRouteInfo] = useState({ distanceKm: '2.4', durationMin: '8', roadSummary: 'Carrera 100 • Av. Alfonso López' });
  const [userRealCoords, setUserRealCoords] = useState(null);
  const [cameraError, setCameraError] = useState(null);
  const videoRef = useRef(null);
  const mediaStreamRef = useRef(null);

  // Filters for Orders Table
  const [statusFilter, setStatusFilter] = useState('all');
  const [municipioFilter, setMunicipioFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // New Order / Ride Request Form
  const [serviceType, setServiceType] = useState('mandado');
  const [newMunicipio, setNewMunicipio] = useState('Apartadó');
  const [pickupLocation, setPickupLocation] = useState('Parque Principal, Apartadó');
  const [dropoffLocation, setDropoffLocation] = useState('Barrio Ortíz, Apartadó');
  const [customerName, setCustomerName] = useState('');
  const [packageNotes, setPackageNotes] = useState('');
  const [paymentMethodChoice, setPaymentMethodChoice] = useState('Wompi • PSE / Nequi');

  // Driver Registration & Verification Form State (Domicilios & Mototaxis)
  const [driverName, setDriverName] = useState('');
  const [driverDoc, setDriverDoc] = useState('');
  const [driverMunicipio, setDriverMunicipio] = useState('Apartadó');
  const [driverVehicle, setDriverVehicle] = useState('mototaxi');
  const [driverBrandModel, setDriverBrandModel] = useState('');
  const [driverPlaca, setDriverPlaca] = useState('');
  const [driverPhone, setDriverPhone] = useState('');
  const [riderEnrollMode, setRiderEnrollMode] = useState('membership'); // 'membership' ($50k/año, $0 descuento) | 'direct_enrollment' ($30k única, -$300/viaje a PSP)
  const [certPoliciaFile, setCertPoliciaFile] = useState('');
  const [cedulaFile, setCedulaFile] = useState('');
  const [riderSoatFile, setRiderSoatFile] = useState('');
  const [riderTecnoFile, setRiderTecnoFile] = useState('');
  const [riderLicenciaFile, setRiderLicenciaFile] = useState('');
  const [vehiculoPhotoFile, setVehiculoPhotoFile] = useState('');
  const [acceptVerificationTerms, setAcceptVerificationTerms] = useState(true);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  // ============================================================
  // ESTADOS DE FLEXDRIVE (By Corplex Solution SAS • Alianza 60/40)
  // ============================================================
  const [flexSubTab, setFlexSubTab] = useState('request'); // 'request' | 'partnership' | 'register_car'
  const [flexRouteKey, setFlexRouteKey] = useState('airport_turbo'); // 'airport_turbo' | 'airport_apartado' | 'urban_ride' | 'car_cargo'
  const [flexPassengerName, setFlexPassengerName] = useState('');
  const [flexPassengerPhone, setFlexPassengerPhone] = useState('');
  const [flexPickupAddress, setFlexPickupAddress] = useState('Turbo Centro • Zona Residencial');
  const [flexDropoffAddress, setFlexDropoffAddress] = useState('Aeropuerto Antonio Roldán Betancur (Los Cedros - Carepa)');
  const [flexFlightTime, setFlexFlightTime] = useState('14:30');
  const [flexPaymentChoice, setFlexPaymentChoice] = useState('Wompi • Nequi / Bancolombia');
  const [flexSuccessModal, setFlexSuccessModal] = useState(false);

  // Registro de Conductores de Carros Particulares FlexDrive (Modelos 2010 a 2026)
  const [carDriverName, setCarDriverName] = useState('');
  const [carDriverDoc, setCarDriverDoc] = useState('');
  const [carDriverPhone, setCarDriverPhone] = useState('');
  const [carMunicipio, setCarMunicipio] = useState('Turbo');
  const [carBrandModel, setCarBrandModel] = useState('Renault Logan / Sandero');
  const [carYear, setCarYear] = useState('2018');
  const [carPlaca, setCarPlaca] = useState('');
  const [carHasAC, setCarHasAC] = useState(true);
  const [carSoatFile, setCarSoatFile] = useState('');
  const [carTecnoFile, setCarTecnoFile] = useState('');
  const [carLicenciaFile, setCarLicenciaFile] = useState('');
  const [carPropiedadFile, setCarPropiedadFile] = useState('');
  const [carCertPoliciaFile, setCarCertPoliciaFile] = useState('');
  const [carAcceptTerms, setCarAcceptTerms] = useState(true);
  const [carRegisterSuccess, setCarRegisterSuccess] = useState(false);

  // Sync guest mode if user logs in/out
  useEffect(() => {
    if (!user) {
      setViewRole('guest');
      setIsSimulatingLive(true);
    } else if (viewRole === 'guest') {
      setViewRole('admin');
    }
  }, [user]);

  const activeOrder = shipments.find((s) => s.id === selectedOrderId) || shipments[0];
  const currentWaypoint = ROUTE_WAYPOINTS[Math.min(activeOrder.progressStep, ROUTE_WAYPOINTS.length - 1)];
  const currentGeo = URABA_GEO_DATA[activeOrder.municipio] || URABA_GEO_DATA['Apartadó'];
  const currentGpsCoord =
    currentGeo.waypointsCoords[Math.min(activeOrder.progressStep, currentGeo.waypointsCoords.length - 1)] ||
    currentGeo.originCoords;
  const activeFrames = currentGeo.streetFrames || URABA_GEO_DATA['Apartadó'].streetFrames;
  const currentStreetFrame = activeFrames[frameIndex % activeFrames.length] || activeFrames[0];

  // Sync street frame when rider advances along the route
  useEffect(() => {
    setFrameIndex(activeOrder.progressStep % activeFrames.length);
  }, [activeOrder.progressStep, activeOrder.municipio, activeFrames.length]);

  // Dashcam sequence auto-player (cycles consecutive road photos like Mapillary sequence)
  useEffect(() => {
    if (!isDashcamPlaying || liveBoxMode !== 'street_seq') return;
    const interval = setInterval(() => {
      setFrameIndex((prev) => (prev + 1) % activeFrames.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [isDashcamPlaying, liveBoxMode, activeFrames.length]);

  // LIVE API #1: Open-Meteo Real-Time Weather & Road Condition in Urabá
  useEffect(() => {
    let cancelled = false;
    const [lat, lon] = currentGpsCoord;
    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,precipitation,weather_code,wind_speed_10m&timezone=America%2FBogota`
    )
      .then((res) => res.json())
      .then((data) => {
        if (cancelled || !data?.current) return;
        const code = Number(data.current.weather_code || 0);
        const precip = Number(data.current.precipitation || 0);
        setLiveWeather({
          temp: Math.round(Number(data.current.temperature_2m || 29)),
          wind: Math.round(Number(data.current.wind_speed_10m || 10)),
          isRain: precip > 0 || code >= 51,
          loaded: true
        });
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [activeOrder.municipio, currentGpsCoord[0], currentGpsCoord[1]]);

  // LIVE API #2: OSRM Real Road Routing Engine (Calculates real km, ETA & street summary in Urabá)
  useEffect(() => {
    let cancelled = false;
    const [lat1, lon1] = currentGeo.originCoords;
    const [lat2, lon2] = currentGeo.destCoords;
    fetch(
      `https://router.project-osrm.org/route/v1/driving/${lon1},${lat1};${lon2},${lat2}?overview=false&steps=true`
    )
      .then((res) => res.json())
      .then((data) => {
        if (cancelled || !data?.routes?.[0]) return;
        const route = data.routes[0];
        const distKm = Math.max(0.8, route.distance / 1000).toFixed(1);
        const durMin = Math.max(4, Math.round((route.duration / 60) * 1.15));
        const legSummary = route.legs?.[0]?.summary || activeOrder.streets.ave1;
        setLiveRouteInfo({
          distanceKm: distKm,
          durationMin: String(durMin),
          roadSummary: legSummary.replace(/,/g, ' • ') || activeOrder.streets.ave1
        });
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [activeOrder.id, activeOrder.municipio]);

  // LIVE API #3: WebRTC Courier Camera Stream when 'rider_cam' tab is selected
  useEffect(() => {
    if (liveBoxMode !== 'rider_cam') {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((t) => t.stop());
        mediaStreamRef.current = null;
      }
      return;
    }

    setCameraError(null);
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: 'environment' }, audio: false })
        .then((stream) => {
          mediaStreamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch(() => {
          setCameraError('Permiso de cámara no concedido. Mostrando secuencia vial GPS.');
        });
    } else {
      setCameraError('Cámara no disponible en este navegador.');
    }

    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((t) => t.stop());
        mediaStreamRef.current = null;
      }
    };
  }, [liveBoxMode]);

  // Request user's real browser GPS location
  const handleLocateMe = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserRealCoords([
          Number(pos.coords.latitude.toFixed(4)),
          Number(pos.coords.longitude.toFixed(4))
        ]);
      },
      () => {}
    );
  };

  // Live simulation interval when user clicks "Simular Recorrido en Vivo"
  useEffect(() => {
    if (!isSimulatingLive) return;
    const timer = setInterval(() => {
      setShipments((prev) =>
        prev.map((item) => {
          if (item.id !== activeOrder.id) return item;
          const nextStep = item.progressStep >= 4 ? 0 : item.progressStep + 1;
          const nextStatus =
            nextStep === 4
              ? 'delivered'
              : nextStep === 3
              ? 'out_for_delivery'
              : nextStep >= 1
              ? 'in_transit'
              : 'pending';
          const nextLabel =
            nextStep === 4
              ? 'Entregado'
              : nextStep === 3
              ? 'En reparto'
              : nextStep >= 1
              ? 'En tránsito'
              : 'Asignando';
          return {
            ...item,
            progressStep: nextStep,
            status: nextStatus,
            statusLabel: nextLabel,
            etaMinutes: nextStep === 4 ? 'Completado' : `${(4 - nextStep) * 3} min`
          };
        })
      );
    }, 2400);
    return () => clearInterval(timer);
  }, [isSimulatingLive, activeOrder.id]);

  const getEstimatedFare = () => {
    switch (serviceType) {
      case 'mototaxi':
        return { price: 5000, time: '8-12 min', label: 'Mototaxi Express Urbano' };
      case 'bici':
        return { price: 4000, time: '12-18 min', label: 'Bici Eléctrica Eco (0 Emisiones)' };
      case 'encomienda':
        return { price: 8000, time: '15-25 min', label: 'Encomienda Comercial Moto' };
      case 'mandado':
      default:
        return { price: 6500, time: '12-20 min', label: 'Domicilio / Supermercado Express' };
    }
  };

  const currentFare = getEstimatedFare();
  // Lo que paga el cliente incluye los +$500 del Sistema de Verificación de Repartidores y Monitoreo GPS en Vivo (Corplex Solution SAS)
  const clientTotalFare = currentFare.price + CORP_SOLUTION_FEE;

  const handleCreateOrder = (e) => {
    e.preventDefault();
    // Si es visitante sin cuenta o sin membresía activa, abrimos el Modal de Conversión a Membresía PSP
    if (!user || viewRole === 'guest') {
      setMembershipModal({
        open: true,
        reason: `Para despachar y pagar tu ${currentFare.label} (${pickupLocation} ➔ ${dropoffLocation}) con rastreo GPS y cámara en vivo, activa tu Membresía PSP.`
      });
      return;
    }

    const randomNum = Math.floor(10000 + Math.random() * 89999);
    const newId = `#PSP${String(randomNum).slice(0, 4)}U`;
    const now = new Date();
    const timeStr = now.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });

    const createdOrder = {
      id: newId,
      shipmentId: `PSP-${randomNum}-URA`,
      serviceType,
      serviceLabel: currentFare.label,
      status: 'out_for_delivery',
      statusLabel: 'En reparto',
      origin: pickupLocation,
      destination: dropoffLocation,
      municipio: newMunicipio,
      neighborhoodLabel: `RUTA ACTIVA • ${newMunicipio.toUpperCase()}`,
      estimatedDelivery: `Hoy, en ${currentFare.time}`,
      etaMinutes: '9 min',
      payment: paymentMethodChoice,
      amount: currentFare.price,
      customer: {
        name: customerName.trim() || user?.name || 'Usuario PSP Urabá',
        phone: user?.phone || '+57 312 000 0000',
        avatar: user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'
      },
      rider: {
        name: 'Pedro Manuel Morales',
        role:
          serviceType === 'bici'
            ? 'Repartidor Eco • Bici Eléctrica PSP'
            : serviceType === 'encomienda'
            ? 'Repartidor Moto • Boxer CT100 (URA-456)'
            : 'Domiciliario Moto • Yamaha FZ-150 (ABC-12D)',
        phone: '+573129876543',
        rating: 4.9,
        trips: 342,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
      },
      progressStep: 2,
      streetPreview: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b3/Apartad%C3%B3%2C_Antioquia%2C_Colombia_-_panoramio.jpg/960px-Apartad%C3%B3%2C_Antioquia%2C_Colombia_-_panoramio.jpg',
      streets: {
        ave1: 'Vía Principal Urbana',
        ave2: 'Troncal de Urabá',
        ave3: pickupLocation.slice(0, 22),
        ave4: dropoffLocation.slice(0, 22),
        landmark1: `Centro ${newMunicipio}`,
        landmark2: 'Punto Comercio PSP',
        landmark3: 'Zona Residencial'
      },
      timeline: [
        { title: 'Pedido confirmado', location: pickupLocation, date: 'Hoy', time: timeStr },
        { title: 'Domiciliario asignado', location: pickupLocation, date: 'Hoy', time: timeStr },
        { title: 'En tránsito por Urabá', location: `Ruta hacia ${dropoffLocation}`, date: 'Hoy', time: 'En curso' },
        { title: 'En camino a entrega', location: dropoffLocation, date: 'Hoy', time: 'Próximo' },
        { title: 'Entregado', location: dropoffLocation, date: 'Hoy', time: `Est. ${currentFare.time}` }
      ]
    };

    setShipments((prev) => [createdOrder, ...prev]);
    setSelectedOrderId(newId);
    setActiveNav('tracking');
    setIsSimulatingLive(true);
  };

  // Sidebar items filtered dynamically by the active role view
  const allNavItems = [
    { id: 'tracking', label: 'Rastreo en Vivo', icon: Navigation, badge: 'Live', roles: ['admin', 'client', 'company', 'rider_member', 'rider_non_member', 'guest'] },
    {
      id: 'orders',
      label: viewRole === 'company' ? 'Mis Despachos' : viewRole.startsWith('rider') ? 'Bolsa de Viajes' : 'Envíos y Pedidos',
      icon: Package,
      count: shipments.length,
      roles: ['admin', 'company', 'rider_member', 'rider_non_member']
    },
    {
      id: 'new_order',
      label: viewRole === 'company' ? 'Despachar Pedido' : 'Pedir Domicilio',
      icon: Plus,
      roles: ['admin', 'client', 'company', 'guest']
    },
    {
      id: 'riders',
      label: viewRole.startsWith('rider') ? 'Mi Verificación' : 'Ser Repartidor',
      icon: Users,
      count: viewRole === 'admin' ? 148 : undefined,
      roles: ['admin', 'client', 'rider_member', 'rider_non_member', 'guest']
    },
    {
      id: 'flexdrive',
      label: 'FlexDrive • Carros',
      badge: 'Alianza 60/40',
      icon: Car,
      roles: ['admin', 'client', 'company', 'rider_member', 'rider_non_member', 'guest']
    }
  ];

  const visibleNavItems = allNavItems.filter((item) => item.roles.includes(viewRole));

  const filteredShipments = shipments.filter((item) => {
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesMunicipio = municipioFilter === 'all' || item.municipio === municipioFilter;
    const q = searchQuery.trim().toLowerCase();
    const matchesQuery =
      !q ||
      item.id.toLowerCase().includes(q) ||
      item.shipmentId.toLowerCase().includes(q) ||
      item.origin.toLowerCase().includes(q) ||
      item.destination.toLowerCase().includes(q) ||
      item.customer.name.toLowerCase().includes(q) ||
      item.rider.name.toLowerCase().includes(q);
    return matchesStatus && matchesMunicipio && matchesQuery;
  });

  const badgeStyle = STATUS_BADGE_STYLES[activeOrder.status] || STATUS_BADGE_STYLES.out_for_delivery;
  // Valor total que ve y paga el cliente (Tarifa base repartidor + $500 de verificación y monitoreo en vivo)
  const activeOrderClientTotal = activeOrder.amount + CORP_SOLUTION_FEE;

  return (
    <div className="w-full space-y-3">
      
      {/* ============================================================
          TOP ROLE SIMULATOR & DEMO SHOWCASE BANNER
      ============================================================ */}
      <div className="bg-white dark:bg-[#111917] rounded-2xl border border-slate-200/90 dark:border-[#1f302d] px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2 text-xs">
          <span className="px-2 py-0.5 rounded-md bg-[#ff5a1f]/15 text-[#ff5a1f] font-extrabold uppercase tracking-wider text-[10px]">
            {viewRole === 'guest' ? 'Modo Demo Visitante' : 'Simulador de Vista por Rol'}
          </span>
          <span className="text-slate-600 dark:text-slate-300 font-medium hidden sm:inline">
            {viewRole === 'admin' && '👑 Admin Total: Auditoría completa + liquidación +$500 Corplex SAS + $300 PSP + FlexDrive Alianza 60/40.'}
            {viewRole === 'client' && '👤 Cliente: Factura con +$500 COP por Sistema de Verificación de Repartidores & Monitoreo GPS en Vivo.'}
            {viewRole === 'rider_member' && '🛵 Repartidor Gold/Plata: Recibe $5.000 libres (100% de la tarifa sin descuentos de plataforma).'}
            {viewRole === 'rider_non_member' && '🛵 Repartidor Sin Membresía: Recibe $4.700 netos (-$300 COP plataforma PSP).'}
            {viewRole === 'company' && '🏪 Empresa Aliada: Despachos sin comisiones por venta.'}
            {viewRole === 'guest' && '👀 Visitante Nuevo: Explora el mapa y cámaras en vivo; activa Membresía PSP al pagar o inscribirse.'}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: 'admin', label: '👑 Admin Total' },
            { id: 'client', label: '👤 Cliente ($5.500)' },
            { id: 'rider_member', label: '🛵 Repartidor Gold ($5.000 libres)' },
            { id: 'rider_non_member', label: '🛵 Repartidor Libre ($4.700)' },
            { id: 'company', label: '🏪 Empresa Aliada' },
            { id: 'guest', label: '👀 Visitante Sin Cuenta' }
          ].map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => {
                setViewRole(r.id);
                if (r.id === 'guest') setIsSimulatingLive(true);
                if (r.id === 'company' && activeNav === 'riders') setActiveNav('tracking');
                if (r.id === 'client' && activeNav === 'orders') setActiveNav('tracking');
              }}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                viewRole === r.id
                  ? 'bg-slate-900 dark:bg-teal-500 text-white dark:text-slate-950 shadow-xs'
                  : 'bg-slate-100 dark:bg-[#172320] text-slate-600 dark:text-slate-300 hover:bg-slate-200/70'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Guest Conversion Top Strip when viewing without membership */}
      {viewRole === 'guest' && (
        <div className="bg-gradient-to-r from-slate-900 via-[#132a26] to-slate-900 text-white rounded-2xl px-4 py-3 flex flex-wrap items-center justify-between gap-3 shadow-md border border-teal-500/30">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#ff5a1f] text-white flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-extrabold">
                Estás viendo en tiempo real la red de Domicilios y Mototaxis Verificados de Urabá
              </p>
              <p className="text-[11px] text-slate-300">
                Con tu <strong>Membresía Plata ($50.000/año)</strong> o <strong>Gold ($100.000/año)</strong> pides domicilios con cámara en vivo o trabajas como repartidor todo el año.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigate('/registro')}
            className="px-4 py-2 rounded-xl bg-[#ff5a1f] hover:bg-[#e04812] text-white text-xs font-extrabold shadow-md cursor-pointer shrink-0"
          >
            Adquirir Membresía ($50.000/año)
          </button>
        </div>
      )}

      <div className="w-full bg-[#F4F5F7] dark:bg-[#0b1110] rounded-3xl border border-slate-200/90 dark:border-[#1e2f2c] shadow-xl overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[720px]">
        
        {/* ============================================================
            LEFT SIDEBAR (Parclgo Style Navigation + Promo Card)
        ============================================================ */}
        <aside className="lg:col-span-2 bg-white dark:bg-[#111917] border-b lg:border-b-0 lg:border-r border-slate-200/80 dark:border-[#1f302d] p-4 sm:p-5 flex flex-col justify-between">
          <div className="space-y-6">
            {/* Brand Logo Header (Parclgo -> PSPGo) */}
            <div className="flex items-center justify-between lg:justify-start gap-2.5 px-1">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#ff5a1f] to-[#ea580c] flex items-center justify-center text-white shadow-md shadow-orange-500/20">
                  <Bike className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white leading-none block">
                    psp<span className="text-[#ff5a1f]">go</span>
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400 block mt-0.5">
                    Urabá Express
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveNav('new_order')}
                className="lg:hidden px-3 py-1.5 rounded-xl bg-[#ff5a1f] text-white text-xs font-bold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Pedir
              </button>
            </div>

            {/* Sidebar Navigation Menu (Filtered by Role View) */}
            <nav className="flex lg:flex-col gap-1.5 overflow-x-auto pb-1 lg:pb-0">
              {visibleNavItems.map((item) => {
                const IconComp = item.icon;
                const isActive = activeNav === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveNav(item.id)}
                    className={`w-full px-3 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-between gap-2 whitespace-nowrap cursor-pointer ${
                      isActive
                        ? 'bg-slate-900 dark:bg-teal-500 text-white dark:text-slate-950 shadow-sm font-bold'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#182422] hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <IconComp
                        className={`w-4 h-4 shrink-0 ${
                          isActive ? 'text-[#ff5a1f] dark:text-slate-950' : 'text-slate-400'
                        }`}
                      />
                      <span>{item.label}</span>
                    </span>
                    {item.badge && (
                      <span className="px-1.5 py-0.5 rounded-md text-[10px] font-extrabold bg-[#ff5a1f]/15 text-[#ff5a1f] dark:bg-slate-950/20 dark:text-slate-950">
                        {item.badge}
                      </span>
                    )}
                    {item.count !== undefined && (
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                          isActive
                            ? 'bg-white/15 text-white dark:bg-slate-950/15 dark:text-slate-950'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                        }`}
                      >
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Bottom Promo Card adapted to Role */}
          <div className="hidden lg:block mt-6 p-4 rounded-2xl bg-[#F8F9FB] dark:bg-[#16211f] border border-slate-200/70 dark:border-[#223532] text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 dark:from-orange-500/20 dark:to-amber-500/10 flex items-center justify-center mx-auto shadow-inner relative">
              {viewRole === 'company' ? (
                <Building2 className="w-6 h-6 text-emerald-600" />
              ) : activeNav === 'flexdrive' ? (
                <Car className="w-6 h-6 text-[#ff5a1f]" />
              ) : (
                <Package className="w-6 h-6 text-[#ff5a1f]" />
              )}
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#ff5a1f] text-white flex items-center justify-center shadow">
                <ShieldCheck className="w-3 h-3" />
              </span>
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-extrabold text-slate-900 dark:text-white leading-snug">
                {viewRole === 'company'
                  ? 'Beneficio Empresa Aliada'
                  : viewRole === 'rider_member'
                  ? '100% de tu Carrera Libre'
                  : viewRole === 'rider_non_member'
                  ? 'Tarifa con Descuento PSP'
                  : 'Repartidores Verificados'}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                {viewRole === 'company'
                  ? 'Despacha todos los pedidos de tu comercio sin pagar comisiones por venta.'
                  : viewRole === 'rider_member'
                  ? `Recibes $${activeOrder.amount.toLocaleString()} COP libres sin ningún descuento por tener Membresía.`
                  : viewRole === 'rider_non_member'
                  ? `Recibes $${(activeOrder.amount - PSP_NON_MEMBER_RIDER_FEE).toLocaleString()} COP netos (-$300 PSP). ¡Pásate a Gold y gana $5.000!`
                  : 'Monitoreo GPS en vivo y conductores con sello de verificación PSP.'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveNav(viewRole.startsWith('rider') ? 'riders' : 'new_order')}
              className="w-full py-2 rounded-xl bg-[#ff5a1f] hover:bg-[#e04812] text-white text-xs font-bold shadow-sm transition-colors cursor-pointer"
            >
              {viewRole.startsWith('rider') ? 'Ver Mi Verificación' : 'Pedir Express'}
            </button>
          </div>
        </aside>

        {/* ============================================================
            MAIN CONTENT WORKSPACE (Cols 3-12)
        ============================================================ */}
        <div className="lg:col-span-10 flex flex-col bg-white dark:bg-[#0e1514]">
          
          {/* TOP WORKSPACE HEADER BAR (Breadcrumbs, Search, Quick Order Selector) */}
          <div className="px-5 sm:px-7 py-4 border-b border-slate-200/80 dark:border-[#1f302d] flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-[#111917]">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm">
              <button
                type="button"
                onClick={() => setActiveNav('tracking')}
                className="font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer"
              >
                Envíos Urabá
              </button>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-extrabold text-slate-900 dark:text-white">
                {activeNav === 'tracking'
                  ? `Orden ${activeOrder.id}`
                  : activeNav === 'orders'
                  ? 'Panel de Órdenes Activas'
                  : activeNav === 'new_order'
                  ? 'Solicitar Domicilio o Mandado'
                  : activeNav === 'riders'
                  ? 'Sistema de Verificación de Repartidores'
                  : '🚘 FlexDrive • By Corplex Solution SAS (Alianza 60/40)'}
              </span>
            </div>

            {/* Quick Municipality / Active Shipment Selector Pills */}
            <div className="hidden xl:flex items-center gap-1.5 bg-slate-100 dark:bg-[#172320] p-1 rounded-xl border border-slate-200/70 dark:border-[#233531]">
              {shipments.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    setSelectedOrderId(s.id);
                    setActiveNav('tracking');
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    selectedOrderId === s.id && activeNav === 'tracking'
                      ? 'bg-white dark:bg-[#0c4236] text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      s.status === 'delivered'
                        ? 'bg-emerald-500'
                        : s.status === 'out_for_delivery'
                        ? 'bg-[#ff5a1f]'
                        : 'bg-sky-500'
                    }`}
                  />
                  <span>{s.municipio}</span>
                  <span className="text-[10px] opacity-60">{s.id}</span>
                </button>
              ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setIsSimulatingLive((prev) => !prev)}
                className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
                  isSimulatingLive
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-700 dark:text-emerald-300'
                    : 'bg-slate-100 dark:bg-[#172320] border-slate-200 dark:border-[#243834] text-slate-700 dark:text-slate-300 hover:bg-slate-200/70'
                }`}
                title="Simular el movimiento del domiciliario en tiempo real"
              >
                <Play className={`w-3.5 h-3.5 ${isSimulatingLive ? 'fill-emerald-500 text-emerald-500 animate-pulse' : ''}`} />
                <span>{isSimulatingLive ? 'Simulando GPS...' : 'Simular Ruta en Vivo'}</span>
              </button>

              {viewRole !== 'rider' && (
                <button
                  type="button"
                  onClick={() => setActiveNav('new_order')}
                  className="px-3.5 py-2 rounded-xl bg-[#ff5a1f] hover:bg-[#e04812] text-white text-xs font-bold shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Nuevo Envío / Viaje</span>
                </button>
              )}
            </div>
          </div>

          {/* ============================================================
              VIEW 1: LIVE SHIPMENT TRACKING + MAP + TIMELINE (Parclgo Top-Left)
          ============================================================ */}
          {activeNav === 'tracking' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 flex-1">
              
              {/* LEFT TRACKING COLUMN (Cols 1-4): Order Details, Courier & Timeline */}
              <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-slate-200/80 dark:border-[#1f302d] p-5 sm:p-6 flex flex-col justify-between space-y-6 bg-white dark:bg-[#111917]">
                
                <div className="space-y-5">
                  {/* Order Header + Status Badge */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-xs font-semibold text-slate-400 block">
                        Orden de Servicio
                      </span>
                      <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        {activeOrder.id}
                      </h2>
                      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5">
                        <span>{activeOrder.origin}</span>
                        <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="text-slate-800 dark:text-slate-200 font-bold">
                          {activeOrder.destination}
                        </span>
                      </p>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold shrink-0 ${badgeStyle.bg} ${badgeStyle.text}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${badgeStyle.dot}`} />
                      {activeOrder.statusLabel}
                    </span>
                  </div>

                  {/* 3 Metadata Rows with Dark Rounded Square Icons (Exact Parclgo Style) */}
                  <div className="space-y-3 pt-1">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-900 dark:bg-slate-800 text-white flex items-center justify-center shrink-0">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[11px] text-slate-400 font-medium block">
                          Entrega estimada
                        </span>
                        <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                          {activeOrder.estimatedDelivery} ({activeOrder.etaMinutes})
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-900 dark:bg-slate-800 text-white flex items-center justify-center shrink-0">
                        <Package className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[11px] text-slate-400 font-medium block">
                          ID de Envío / Modalidad
                        </span>
                        <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                          {activeOrder.shipmentId} • {activeOrder.serviceLabel}
                        </span>
                      </div>
                    </div>

                    {/* Smart Payment & Invoice Row (Adapts to Rider Member vs. Non-Member vs. Client/Admin) */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-slate-900 dark:bg-slate-800 text-white flex items-center justify-center shrink-0">
                            <CreditCard className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-[11px] text-slate-400 font-medium block">
                              {viewRole === 'rider_member'
                                ? 'Tu Pago Neto por Carrera (Membresía Activa)'
                                : viewRole === 'rider_non_member'
                                ? 'Tu Pago Neto por Carrera (Sin Membresía)'
                                : 'Total Factura Servicio (Wompi)'}
                            </span>
                            <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                              {viewRole === 'rider_member'
                                ? `$${activeOrder.amount.toLocaleString()} COP (100% libre para ti)`
                                : viewRole === 'rider_non_member'
                                ? `$${(activeOrder.amount - PSP_NON_MEMBER_RIDER_FEE).toLocaleString()} COP (Base $${activeOrder.amount.toLocaleString()} - $300 PSP)`
                                : `${activeOrder.payment} • $${activeOrderClientTotal.toLocaleString()} COP`}
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => setShowInvoiceTicket((p) => !p)}
                          className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-[#172320] text-[10px] font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200 flex items-center gap-1 cursor-pointer"
                        >
                          <Receipt className="w-3 h-3 text-[#ff5a1f]" />
                          <span>{showInvoiceTicket ? 'Ocultar' : 'Factura'}</span>
                        </button>
                      </div>

                      {/* Clean Mini-Invoice Breakdown (+500 COP Corplex Solution SAS & $300 PSP) */}
                      {showInvoiceTicket && (
                        <div className="p-3 rounded-xl bg-[#F8F9FB] dark:bg-[#15201e] border border-dashed border-slate-300 dark:border-[#263935] text-[11px] space-y-1.5">
                          {viewRole === 'rider_non_member' ? (
                            <>
                              <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                                <span>Tarifa Base del Servicio:</span>
                                <span className="font-bold">${activeOrder.amount.toLocaleString()} COP</span>
                              </div>
                              <div className="flex items-center justify-between text-amber-600 dark:text-amber-400">
                                <span>Cuota Plataforma PSP (Repartidor Libre):</span>
                                <span className="font-bold">-${PSP_NON_MEMBER_RIDER_FEE} COP</span>
                              </div>
                              <div className="pt-1 border-t border-slate-200 dark:border-[#243834] flex items-center justify-between font-extrabold text-emerald-600 dark:text-emerald-400">
                                <span>Tu Pago Neto a Cobrar:</span>
                                <span>${(activeOrder.amount - PSP_NON_MEMBER_RIDER_FEE).toLocaleString()} COP</span>
                              </div>
                              <div className="pt-1 text-[10px] text-slate-500 dark:text-slate-400 bg-amber-500/10 p-1.5 rounded-lg border border-amber-500/20">
                                💡 <strong>Tip:</strong> Pásate a <strong>Membresía Plata ($50.000/año)</strong> y recibe los <strong>$5.000 completos</strong> en todos tus viajes sin pagar los $300 de cuota.
                              </div>
                            </>
                          ) : viewRole === 'rider_member' ? (
                            <>
                              <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                                <span>Tarifa Base del Servicio:</span>
                                <span className="font-bold">${activeOrder.amount.toLocaleString()} COP</span>
                              </div>
                              <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400">
                                <span>Descuento de Plataforma (Beneficio Gold/Plata):</span>
                                <span className="font-bold">$0 COP</span>
                              </div>
                              <div className="pt-1 border-t border-slate-200 dark:border-[#243834] flex items-center justify-between font-extrabold text-slate-900 dark:text-white">
                                <span>Pago Neto para Ti (100% Libre):</span>
                                <span className="text-emerald-600 dark:text-emerald-400">${activeOrder.amount.toLocaleString()} COP</span>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                                <span>Tarifa Servicio Repartidor:</span>
                                <span className="font-bold">${activeOrder.amount.toLocaleString()} COP</span>
                              </div>
                              <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                                <span>Sistema de Verificación de Repartidores & GPS Live:</span>
                                <span className="font-bold text-[#ff5a1f]">+${CORP_SOLUTION_FEE} COP</span>
                              </div>
                              <div className="pt-1 border-t border-slate-200 dark:border-[#243834] flex items-center justify-between font-extrabold text-slate-900 dark:text-white">
                                <span>Total Factura Cliente:</span>
                                <span>${activeOrderClientTotal.toLocaleString()} COP</span>
                              </div>
                              {viewRole === 'admin' && (
                                <div className="pt-1.5 mt-1 border-t border-slate-200/60 dark:border-[#243834] space-y-1 text-[10px]">
                                  <div className="text-emerald-600 dark:text-emerald-400 flex items-center justify-between font-bold">
                                    <span>• Corplex Solution SAS (APIs / Cámaras / IA):</span>
                                    <span>+${CORP_SOLUTION_FEE} COP</span>
                                  </div>
                                  <div className="text-sky-600 dark:text-sky-400 flex items-center justify-between font-bold">
                                    <span>• Plataforma PSP (si no tiene Membresía):</span>
                                    <span>+${PSP_NON_MEMBER_RIDER_FEE} COP</span>
                                  </div>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Assigned Courier / Rider Card + Call & WhatsApp Buttons */}
                  <div className="pt-2 border-t border-slate-100 dark:border-[#1f302d] space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={activeOrder.rider.avatar}
                          alt={activeOrder.rider.name}
                          className="w-11 h-11 rounded-full object-cover border-2 border-[#ff5a1f]"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-xs font-extrabold text-slate-900 dark:text-white truncate">
                              {activeOrder.rider.name}
                            </h4>
                            <span className="px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[9px] font-extrabold shrink-0">
                              Verificado PSP
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-400 block truncate">
                            {activeOrder.rider.role}
                          </span>
                          <span className="text-[10px] font-bold text-amber-500">
                            ★ {activeOrder.rider.rating} ({activeOrder.rider.trips} entregas en {activeOrder.municipio})
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            if (!user || viewRole === 'guest') {
                              setMembershipModal({
                                open: true,
                                reason: `Para llamar o contactar directamente a ${activeOrder.rider.name} y despachar domicilios en Urabá, activa tu Membresía PSP.`
                              });
                              return;
                            }
                            window.location.href = `tel:${activeOrder.rider.phone}`;
                          }}
                          title="Llamar al repartidor"
                          className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 flex items-center justify-center transition-colors cursor-pointer"
                        >
                          <Phone className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (!user || viewRole === 'guest') {
                              setMembershipModal({
                                open: true,
                                reason: `Para chatear por WhatsApp con el repartidor verificado ${activeOrder.rider.name}, activa tu Membresía PSP.`
                              });
                              return;
                            }
                            const msg = encodeURIComponent(
                              `Hola ${activeOrder.rider.name}, sigo en vivo el pedido ${activeOrder.id} (${activeOrder.origin} -> ${activeOrder.destination}) en PSPGo Urabá.`
                            );
                            window.open(
                              `https://wa.me/${activeOrder.rider.phone.replace(/[^0-9]/g, '')}?text=${msg}`,
                              '_blank'
                            );
                          }}
                          title="Chatear por WhatsApp"
                          className="w-9 h-9 rounded-full bg-slate-900 dark:bg-teal-500 hover:opacity-90 text-white dark:text-slate-950 flex items-center justify-center transition-opacity cursor-pointer"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Prominent Orange Button ("View Details" / Advance Step) */}
                    <button
                      type="button"
                      onClick={() => {
                        setShipments((prev) =>
                          prev.map((item) => {
                            if (item.id !== activeOrder.id) return item;
                            const nextStep = item.progressStep >= 4 ? 0 : item.progressStep + 1;
                            return {
                              ...item,
                              progressStep: nextStep,
                              status: nextStep === 4 ? 'delivered' : nextStep === 3 ? 'out_for_delivery' : 'in_transit',
                              statusLabel: nextStep === 4 ? 'Entregado' : nextStep === 3 ? 'En reparto' : 'En tránsito'
                            };
                          })
                        );
                      }}
                      className="w-full py-2.5 rounded-xl bg-[#ff5a1f] hover:bg-[#e04812] text-white text-xs font-bold shadow-md shadow-orange-500/20 transition-all cursor-pointer"
                    >
                      Avanzar Estado en Tiempo Real ({activeOrder.progressStep + 1}/5)
                    </button>
                  </div>

                  {/* TRACKING TIMELINE (Exact Parclgo Vertical Timeline) */}
                  <div className="pt-2 border-t border-slate-100 dark:border-[#1f302d] space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                        Tracking Timeline • Seguimiento
                      </h3>
                      <span className="text-[10px] font-bold text-slate-400">
                        Paso {activeOrder.progressStep + 1} de 5
                      </span>
                    </div>

                    <div className="relative pl-1 space-y-4">
                      {activeOrder.timeline.map((step, index) => {
                        const isCompleted = index < activeOrder.progressStep;
                        const isCurrent = index === activeOrder.progressStep;
                        return (
                          <div key={step.title} className="relative flex items-start justify-between gap-3">
                            {/* Vertical connecting line */}
                            {index < activeOrder.timeline.length - 1 && (
                              <div
                                className={`absolute left-3 top-6 bottom-[-16px] w-[1.5px] ${
                                  isCompleted
                                    ? 'bg-slate-900 dark:bg-teal-400'
                                    : 'border-l border-dashed border-slate-300 dark:border-slate-700'
                                }`}
                              />
                            )}

                            <div className="flex items-start gap-3 min-w-0">
                              {/* Step Icon Circle */}
                              <div
                                className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 z-10 transition-all ${
                                  isCompleted
                                    ? 'bg-slate-900 dark:bg-teal-400 text-white dark:text-slate-950'
                                    : isCurrent
                                    ? 'bg-[#ff5a1f] text-white ring-4 ring-orange-500/20'
                                    : 'bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 text-slate-400'
                                }`}
                              >
                                {isCompleted ? (
                                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                                ) : isCurrent ? (
                                  <Bike className="w-3.5 h-3.5" />
                                ) : (
                                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                                )}
                              </div>

                              <div className="min-w-0">
                                <span
                                  className={`text-xs block truncate ${
                                    isCurrent
                                      ? 'font-extrabold text-[#ff5a1f]'
                                      : isCompleted
                                      ? 'font-bold text-slate-900 dark:text-white'
                                      : 'font-semibold text-slate-400 dark:text-slate-500'
                                  }`}
                                >
                                  {step.title}
                                </span>
                                <span className="text-[11px] text-slate-400 dark:text-slate-500 block truncate">
                                  {step.location}
                                </span>
                              </div>
                            </div>

                            <div className="text-right shrink-0">
                              <span className="text-[10px] font-semibold text-slate-400 block">
                                {step.date}
                              </span>
                              <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 block">
                                {step.time}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

              </div>

              {/* RIGHT INTERACTIVE ROUTE MAP OF URABÁ (Cols 5-12) */}
              <div className="lg:col-span-8 relative bg-[#F3F2EE] dark:bg-[#131d1b] min-h-[480px] lg:min-h-full overflow-hidden select-none">
                
                {/* Stylized Parclgo Vector Street Map of Urabá */}
                <svg
                  viewBox="0 0 800 600"
                  preserveAspectRatio="xMidYMid slice"
                  className="w-full h-full object-cover"
                >
                  {/* Warm Urban Map Background Blocks */}
                  <rect width="800" height="600" fill="#F2EFE9" className="dark:fill-[#121b19]" />

                  {/* Urban Neighborhood Blocks */}
                  <g fill="#EAE6DF" className="dark:fill-[#172320]">
                    <rect x="20" y="20" width="190" height="120" rx="12" />
                    <rect x="240" y="15" width="210" height="95" rx="12" />
                    <rect x="480" y="20" width="280" height="130" rx="12" />
                    <rect x="30" y="170" width="175" height="150" rx="12" />
                    <rect x="235" y="140" width="205" height="175" rx="14" />
                    <rect x="475" y="180" width="160" height="190" rx="14" />
                    <rect x="660" y="180" width="120" height="220" rx="12" />
                    <rect x="25" y="350" width="200" height="210" rx="14" />
                    <rect x="255" y="345" width="195" height="220" rx="14" />
                    <rect x="480" y="400" width="280" height="170" rx="14" />
                  </g>

                  {/* Green Park / River Zones of Urabá */}
                  <path
                    d="M 520 20 Q 590 120 550 260 L 650 260 Q 670 120 610 20 Z"
                    fill="#E2ECE4"
                    className="dark:fill-[#162923]"
                  />
                  <circle cx="130" cy="240" r="42" fill="#E2ECE4" className="dark:fill-[#162923]" />

                  {/* Major White Avenues & Streets */}
                  <g stroke="#FFFFFF" className="dark:stroke-[#21332f]" strokeLinecap="round">
                    <line x1="0" y1="150" x2="800" y2="120" strokeWidth="18" />
                    <line x1="0" y1="335" x2="800" y2="395" strokeWidth="16" />
                    <line x1="222" y1="0" x2="245" y2="600" strokeWidth="18" />
                    <line x1="462" y1="0" x2="465" y2="600" strokeWidth="22" />
                    <line x1="120" y1="600" x2="480" y2="0" strokeWidth="14" />
                    <line x1="465" y1="160" x2="800" y2="480" strokeWidth="16" />
                  </g>

                  {/* Street & Avenue Labels Adapted to Selected Urabá Municipality */}
                  <g
                    fill="#78756E"
                    className="dark:fill-slate-400"
                    fontSize="11"
                    fontWeight="600"
                    fontFamily="Figtree, sans-serif"
                  >
                    <text x="115" y="138" transform="rotate(-3 115 138)">
                      {activeOrder.streets.ave1}
                    </text>
                    <text x="105" y="330" transform="rotate(4 105 330)">
                      {activeOrder.streets.ave2}
                    </text>
                    <text x="200" y="455" transform="rotate(-55 200 455)">
                      {activeOrder.streets.ave3}
                    </text>
                    <text x="530" y="215" transform="rotate(42 530 215)">
                      {activeOrder.streets.ave4}
                    </text>
                  </g>

                  {/* Large District Watermark Label ("ASHOK NAGAR" -> Urabá Neighborhood) */}
                  <text
                    x="490"
                    y="320"
                    fill="#9E9A91"
                    className="dark:fill-slate-500"
                    fontSize="21"
                    fontWeight="700"
                    letterSpacing="3"
                    fontFamily="Figtree, sans-serif"
                  >
                    {activeOrder.municipio.toUpperCase()}
                  </text>
                  <text
                    x="490"
                    y="344"
                    fill="#B0ACA3"
                    className="dark:fill-slate-600"
                    fontSize="13"
                    fontWeight="600"
                    letterSpacing="2.5"
                    fontFamily="Figtree, sans-serif"
                  >
                    URABÁ • ANTIOQUIA
                  </text>

                  {/* Landmarks (Hospitals, Plazas, Ports) */}
                  <g fill="#6E6B64" className="dark:fill-slate-400" fontSize="10" fontWeight="600">
                    <circle cx="515" cy="65" r="7" fill="#9E9A91" />
                    <text x="515" y="85" textAnchor="middle">
                      {activeOrder.streets.landmark1}
                    </text>

                    <circle cx="195" cy="378" r="7" fill="#9E9A91" />
                    <text x="195" y="365" textAnchor="middle">
                      {activeOrder.streets.landmark2}
                    </text>

                    <circle cx="190" cy="518" r="7" fill="#9E9A91" />
                    <text x="190" y="538" textAnchor="middle">
                      {activeOrder.streets.landmark3}
                    </text>
                  </g>

                  {/* ====================================================
                      ACTIVE DELIVERY ROUTE PATH (Parclgo Orange Dashed + Solid)
                  ==================================================== */}
                  {/* Full Planned Route (Dashed Orange Line) */}
                  <path
                    d="M 255 472 C 280 515, 345 525, 365 495 C 390 455, 398 415, 408 390 C 425 340, 460 280, 452 245 C 445 205, 382 185, 382 120"
                    fill="none"
                    stroke="#ff5a1f"
                    strokeWidth="3.5"
                    strokeDasharray="6 6"
                  />

                  {/* Completed Portion of Route (Solid Orange Line up to Rider) */}
                  {activeOrder.progressStep >= 1 && (
                    <path
                      d={
                        activeOrder.progressStep === 1
                          ? 'M 255 472 C 280 515, 335 520, 350 505'
                          : activeOrder.progressStep === 2
                          ? 'M 255 472 C 280 515, 345 525, 365 495 C 390 455, 398 415, 408 390'
                          : activeOrder.progressStep === 3
                          ? 'M 255 472 C 280 515, 345 525, 365 495 C 390 455, 398 415, 408 390 C 425 340, 460 280, 452 245'
                          : 'M 255 472 C 280 515, 345 525, 365 495 C 390 455, 398 415, 408 390 C 425 340, 460 280, 452 245 C 445 205, 382 185, 382 120'
                      }
                      fill="none"
                      stroke="#ff5a1f"
                      strokeWidth="4"
                    />
                  )}

                  {/* Intermediate Route Checkpoints (Orange Rings) */}
                  {ROUTE_WAYPOINTS.slice(1, 4).map((pt, idx) => (
                    <circle
                      key={pt.label}
                      cx={pt.x}
                      cy={pt.y}
                      r="6"
                      fill="#FFFFFF"
                      stroke="#ff5a1f"
                      strokeWidth="3"
                      className="cursor-pointer"
                      onClick={() =>
                        setShipments((prev) =>
                          prev.map((s) => (s.id === activeOrder.id ? { ...s, progressStep: idx + 1 } : s))
                        )
                      }
                    />
                  ))}

                  {/* START PIN (Origen) */}
                  <g transform="translate(255, 472)">
                    <rect x="-26" y="-42" width="52" height="22" rx="6" fill="#262626" />
                    <text
                      x="0"
                      y="-27"
                      textAnchor="middle"
                      fill="#FFFFFF"
                      fontSize="10"
                      fontWeight="700"
                      fontFamily="Figtree, sans-serif"
                    >
                      Origen
                    </text>
                    <circle cx="0" cy="0" r="10" fill="#171717" />
                    <polygon points="-3,3 3,3 0,-4" fill="#FFFFFF" />
                  </g>

                  {/* FINISH PIN (Destino) */}
                  <g transform="translate(382, 120)">
                    <rect x="-28" y="-46" width="56" height="22" rx="6" fill="#171717" />
                    <text
                      x="0"
                      y="-31"
                      textAnchor="middle"
                      fill="#FFFFFF"
                      fontSize="10"
                      fontWeight="700"
                      fontFamily="Figtree, sans-serif"
                    >
                      Destino
                    </text>
                    <path
                      d="M 0 0 C -8 -10, -11 -18, 0 -22 C 11 -18, 8 -10, 0 0 Z"
                      fill="#171717"
                    />
                    <circle cx="0" cy="-14" r="3.5" fill="#FFFFFF" />
                  </g>

                  {/* LIVE ANIMATED RIDER / MOTOTAXI MARKER ALONG THE ROUTE */}
                  <g
                    transform={`translate(${currentWaypoint.x}, ${currentWaypoint.y})`}
                    className="transition-all duration-700 ease-out"
                  >
                    <circle cx="0" cy="0" r="22" fill="#ff5a1f" fillOpacity="0.18" />
                    <circle cx="0" cy="0" r="13" fill="#ff5a1f" stroke="#FFFFFF" strokeWidth="2.5" />
                    <text
                      x="0"
                      y="4"
                      textAnchor="middle"
                      fill="#FFFFFF"
                      fontSize="11"
                      fontWeight="900"
                    >
                      🛵
                    </text>
                  </g>
                </svg>

                {/* Top-Left Map Overlay: Live OSRM Telemetry + Open-Meteo Weather + Real Browser GPS */}
                <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
                  <div className="pointer-events-auto bg-white/95 dark:bg-[#111917]/95 backdrop-blur-md px-3.5 py-2.5 rounded-2xl border border-slate-200/80 dark:border-[#233632] shadow-lg flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-orange-500/10 text-[#ff5a1f] flex items-center justify-center shrink-0">
                      <Navigation className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          GPS OSRM En Vivo • {activeOrder.municipio}
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-orange-500/10 text-[#ff5a1f] text-[10px] font-extrabold">
                          {liveRouteInfo.distanceKm} km • {liveRouteInfo.durationMin} min
                        </span>
                      </div>
                      <span className="text-xs font-extrabold text-slate-900 dark:text-white block">
                        {activeOrder.origin} ➔ {activeOrder.destination}
                      </span>
                    </div>
                  </div>

                  {/* Live Weather from Open-Meteo API + Browser Geolocation Trigger */}
                  <div className="pointer-events-auto flex items-center gap-2">
                    <div className="bg-white/95 dark:bg-[#111917]/95 backdrop-blur-md px-3 py-2 rounded-2xl border border-slate-200/80 dark:border-[#233632] shadow-md flex items-center gap-2 text-xs">
                      {liveWeather.isRain ? (
                        <CloudRain className="w-4 h-4 text-sky-500 shrink-0" />
                      ) : (
                        <Sun className="w-4 h-4 text-amber-500 shrink-0" />
                      )}
                      <div>
                        <span className="font-extrabold text-slate-900 dark:text-white block leading-none">
                          {liveWeather.temp}°C • {activeOrder.municipio}
                        </span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">
                          {liveWeather.isRain ? 'Lluvia en vía • Precaución' : `Vía seca • Viento ${liveWeather.wind} km/h`}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleLocateMe}
                      title="Obtener mi coordenada GPS real del navegador"
                      className="bg-white/95 dark:bg-[#111917]/95 hover:bg-white dark:hover:bg-[#172320] backdrop-blur-md px-3 py-2 rounded-2xl border border-slate-200/80 dark:border-[#233632] shadow-md flex items-center gap-1.5 text-[11px] font-bold text-slate-800 dark:text-slate-200 cursor-pointer transition-all"
                    >
                      <LocateFixed className="w-3.5 h-3.5 text-[#ff5a1f]" />
                      <span className="hidden sm:inline">
                        {userRealCoords ? `${userRealCoords[0]}, ${userRealCoords[1]}` : 'Mi GPS'}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Bottom-Left Compass Rose ("N" Icon like Parclgo) */}
                <div className="absolute bottom-5 left-5 w-11 h-11 rounded-2xl bg-white/90 dark:bg-[#111917]/90 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 shadow-md flex flex-col items-center justify-center text-slate-800 dark:text-slate-200">
                  <span className="text-[10px] font-black leading-none">N</span>
                  <Navigation className="w-4 h-4 fill-slate-800 dark:fill-teal-400 -rotate-45 mt-0.5" />
                </div>

                {/* Bottom-Right Interactive LIVE Road Sequence / Real OSM Street / Courier Camera Card */}
                <div
                  className={`absolute bottom-4 right-4 rounded-2xl overflow-hidden border-2 border-white dark:border-[#263d39] shadow-2xl bg-slate-950 transition-all duration-300 z-20 ${
                    isLiveExpanded ? 'w-80 sm:w-[410px]' : 'w-60 sm:w-72'
                  }`}
                >
                  {/* Top Control Strip inside Live Card */}
                  <div className="px-2.5 py-1.5 bg-slate-950/95 border-b border-slate-800 flex items-center justify-between gap-1">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setLiveBoxMode('street_seq')}
                        className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold transition-colors cursor-pointer ${
                          liveBoxMode === 'street_seq'
                            ? 'bg-[#ff5a1f] text-white'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Vía GPS
                      </button>
                      <button
                        type="button"
                        onClick={() => setLiveBoxMode('osm_live')}
                        className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold transition-colors cursor-pointer ${
                          liveBoxMode === 'osm_live'
                            ? 'bg-[#ff5a1f] text-white'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Calle Real
                      </button>
                      <button
                        type="button"
                        onClick={() => setLiveBoxMode('rider_cam')}
                        className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold transition-colors cursor-pointer flex items-center gap-1 ${
                          liveBoxMode === 'rider_cam'
                            ? 'bg-[#ff5a1f] text-white'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <Video className="w-2.5 h-2.5" />
                        Cámara
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="px-1.5 py-0.5 rounded bg-emerald-500 text-white text-[9px] font-extrabold flex items-center gap-1 shadow">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                        Live
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsLiveExpanded((prev) => !prev)}
                        title={isLiveExpanded ? 'Reducir vista' : 'Ampliar vista de la vía'}
                        className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                      >
                        {isLiveExpanded ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>

                  {/* Visual Feed Body */}
                  <div className={`relative w-full ${isLiveExpanded ? 'h-52' : 'h-32'} bg-slate-900 overflow-hidden`}>
                    {liveBoxMode === 'street_seq' && (
                      <>
                        <img
                          src={currentStreetFrame.url}
                          alt={currentStreetFrame.caption}
                          className="w-full h-full object-cover transition-all duration-700"
                        />
                        {/* Top-left GPS Coordinate + Frame Counter Overlay */}
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-slate-950/75 backdrop-blur-xs text-[9px] font-mono text-emerald-300 border border-white/10">
                          {currentStreetFrame.coords} • Tramo {(frameIndex % activeFrames.length) + 1}/{activeFrames.length}
                        </div>

                        {/* Play/Next Dashcam Sequence Controls */}
                        <div className="absolute bottom-2 right-2 flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => setIsDashcamPlaying((p) => !p)}
                            className="px-2 py-0.5 rounded bg-slate-950/80 hover:bg-slate-900 text-white text-[9px] font-bold border border-white/15 cursor-pointer"
                          >
                            {isDashcamPlaying ? '⏸ Auto' : '▶ Secuencia'}
                          </button>
                          <button
                            type="button"
                            onClick={() => setFrameIndex((prev) => (prev + 1) % activeFrames.length)}
                            className="px-1.5 py-0.5 rounded bg-slate-950/80 hover:bg-slate-900 text-white text-[9px] font-bold border border-white/15 cursor-pointer"
                            title="Siguiente cuadra de la vía"
                          >
                            ⏭
                          </button>
                        </div>
                      </>
                    )}

                    {liveBoxMode === 'osm_live' && (
                      <iframe
                        title={`Mapa Callejero Real ${activeOrder.municipio}`}
                        src={`https://www.openstreetmap.org/export/embed.html?bbox=${
                          currentGpsCoord[1] - 0.008
                        }%2C${currentGpsCoord[0] - 0.006}%2C${currentGpsCoord[1] + 0.008}%2C${
                          currentGpsCoord[0] + 0.006
                        }&layer=mapnik&marker=${currentGpsCoord[0]}%2C${currentGpsCoord[1]}`}
                        className="w-full h-full border-0"
                        loading="lazy"
                      />
                    )}

                    {liveBoxMode === 'rider_cam' && (
                      <div className="w-full h-full flex items-center justify-center bg-slate-950 relative">
                        {!cameraError ? (
                          <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="p-3 text-center space-y-1.5">
                            <Camera className="w-5 h-5 text-[#ff5a1f] mx-auto" />
                            <p className="text-[10px] text-slate-300 leading-tight">{cameraError}</p>
                            <button
                              type="button"
                              onClick={() => setLiveBoxMode('street_seq')}
                              className="px-2 py-1 rounded bg-[#ff5a1f] text-white text-[9px] font-bold cursor-pointer"
                            >
                              Ver Vía Georreferenciada
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Bottom Telemetry Footer inside Live Card */}
                  <div className="px-2.5 py-2 bg-slate-950/95 text-white flex items-center justify-between gap-2 text-[10px]">
                    <div className="min-w-0">
                      <span className="font-extrabold block truncate text-white">
                        {liveBoxMode === 'street_seq'
                          ? currentStreetFrame.caption
                          : `${activeOrder.municipio} • ${liveRouteInfo.roadSummary}`}
                      </span>
                      <span className="text-[9px] text-slate-400 block truncate">
                        {liveWeather.temp}°C • {liveRouteInfo.distanceKm} km restantes en ruta
                      </span>
                    </div>
                    <span className="text-emerald-400 font-extrabold shrink-0 bg-emerald-500/15 px-2 py-0.5 rounded-md">
                      {activeOrder.status === 'delivered' ? 'Entregado' : `${liveRouteInfo.durationMin} min`}
                    </span>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ============================================================
              VIEW 2: ORDERS & SHIPMENTS TABLE + 5 KPI CARDS (Parclgo Top-Right)
          ============================================================ */}
          {activeNav === 'orders' && (
            <div className="p-5 sm:p-7 space-y-6 flex-1">
              
              {/* Top 5 KPI Metric Cards (Exact Parclgo Layout) */}
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3.5">
                {[
                  { title: 'Total Envíos', value: '1,250', trend: '+18.6%', up: true, sub: 'Este mes en Urabá' },
                  { title: 'En Espera', value: '18', trend: '+7.2%', up: true, sub: 'Asignando moto' },
                  { title: 'En Tránsito', value: '42', trend: '+12.4%', up: true, sub: 'Activos en ruta' },
                  { title: 'Entregados', value: '1,178', trend: '+20.8%', up: true, sub: '98.9% efectividad' },
                  { title: 'Incidencias', value: '12', trend: '-5.6%', up: false, sub: 'Reprogramados' }
                ].map((kpi) => (
                  <div
                    key={kpi.title}
                    className="p-4 rounded-2xl bg-[#F8F9FB] dark:bg-[#141f1d] border border-slate-200/80 dark:border-[#223532] flex items-start gap-3"
                  >
                    <div className="w-9 h-9 rounded-xl bg-slate-900 dark:bg-slate-800 text-white flex items-center justify-center shrink-0 mt-0.5">
                      <Package className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">
                        {kpi.title}
                      </span>
                      <div className="flex items-baseline gap-1.5 mt-0.5">
                        <span className="text-lg font-extrabold text-slate-900 dark:text-white">
                          {kpi.value}
                        </span>
                        <span
                          className={`text-[10px] font-bold flex items-center ${
                            kpi.up ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'
                          }`}
                        >
                          {kpi.up ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
                          {kpi.trend}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-0.5">{kpi.sub}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Filters Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Buscar orden, cliente, barrio..."
                      className="pl-8 pr-3 py-2 rounded-xl bg-[#F8F9FB] dark:bg-[#141f1d] border border-slate-200 dark:border-[#223532] text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#ff5a1f]"
                    />
                  </div>

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-[#F8F9FB] dark:bg-[#141f1d] border border-slate-200 dark:border-[#223532] text-xs font-semibold text-slate-700 dark:text-slate-200 cursor-pointer"
                  >
                    <option value="all">Todos los estados</option>
                    <option value="out_for_delivery">En reparto</option>
                    <option value="in_transit">En tránsito</option>
                    <option value="delivered">Entregados</option>
                    <option value="pending">Asignando</option>
                  </select>

                  <select
                    value={municipioFilter}
                    onChange={(e) => setMunicipioFilter(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-[#F8F9FB] dark:bg-[#141f1d] border border-slate-200 dark:border-[#223532] text-xs font-semibold text-slate-700 dark:text-slate-200 cursor-pointer"
                  >
                    <option value="all">Todos los municipios</option>
                    <option value="Apartadó">Apartadó</option>
                    <option value="Turbo">Turbo</option>
                    <option value="Carepa">Carepa</option>
                    <option value="Chigorodó">Chigorodó</option>
                    <option value="Necoclí">Necoclí</option>
                  </select>
                </div>

                <span className="text-xs font-semibold text-slate-400">
                  Haz clic en cualquier orden para abrir su mapa en vivo
                </span>
              </div>

              {/* Orders Table (Parclgo Style) */}
              <div className="overflow-x-auto rounded-2xl border border-slate-200/80 dark:border-[#223532]">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200/80 dark:border-[#223532] bg-[#F8F9FB] dark:bg-[#141f1d] text-[11px] font-bold text-slate-400 uppercase">
                      <th className="py-3.5 px-4">Orden ID</th>
                      <th className="py-3.5 px-4">Cliente / Comercio</th>
                      <th className="py-3.5 px-4">Estado</th>
                      <th className="py-3.5 px-4">Repartidor / Conductor</th>
                      <th className="py-3.5 px-4">Ruta en Urabá</th>
                      <th className="py-3.5 px-4">Tarifa</th>
                      <th className="py-3.5 px-4 text-right">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200/60 dark:divide-[#1f302d] text-xs">
                    {filteredShipments.map((order) => {
                      const st = STATUS_BADGE_STYLES[order.status] || STATUS_BADGE_STYLES.in_transit;
                      return (
                        <tr
                          key={order.id}
                          onClick={() => {
                            setSelectedOrderId(order.id);
                            setActiveNav('tracking');
                          }}
                          className="hover:bg-slate-50/90 dark:hover:bg-[#15211f] transition-colors cursor-pointer"
                        >
                          <td className="py-3.5 px-4 font-extrabold text-slate-900 dark:text-white">
                            {order.id}
                            <span className="block text-[10px] font-normal text-slate-400">
                              {order.serviceLabel}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2.5">
                              <img
                                src={order.customer.avatar}
                                alt={order.customer.name}
                                className="w-8 h-8 rounded-full object-cover"
                              />
                              <div>
                                <span className="font-bold text-slate-900 dark:text-white block">
                                  {order.customer.name}
                                </span>
                                <span className="text-[11px] text-slate-400">
                                  {order.customer.phone}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${st.bg} ${st.text}`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                              {order.statusLabel}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-semibold text-slate-700 dark:text-slate-300">
                            {order.rider.name}
                          </td>
                          <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                            <span className="font-bold text-slate-900 dark:text-white block">
                              {order.municipio}
                            </span>
                            <span className="text-[11px] text-slate-400">
                              {order.origin} ➔ {order.destination}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-extrabold text-slate-900 dark:text-white">
                            {viewRole === 'rider' ? (
                              <>
                                ${order.amount.toLocaleString()} COP
                                <span className="block text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                                  100% libre para ti
                                </span>
                              </>
                            ) : (
                              <>
                                ${(order.amount + CORP_SOLUTION_FEE).toLocaleString()} COP
                                <span className="block text-[10px] font-normal text-slate-400">
                                  Base ${order.amount.toLocaleString()} + ${CORP_SOLUTION_FEE} GPS/Verif.
                                </span>
                              </>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              type="button"
                              className="px-3 py-1.5 rounded-lg bg-slate-900 dark:bg-teal-500 text-white dark:text-slate-950 text-[11px] font-bold hover:opacity-90 cursor-pointer"
                            >
                              Ver Mapa
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* ============================================================
              VIEW 3: SOLICITAR NUEVO DOMICILIO / MOTOTAXI + FACTURITA (+500 COP)
          ============================================================ */}
          {activeNav === 'new_order' && (
            <div className="p-5 sm:p-8 max-w-3xl mx-auto w-full space-y-6 flex-1">
              <div className="space-y-1">
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#ff5a1f]">
                  Despacho Inmediato • PSPGo Urabá
                </span>
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  Solicitar Domicilio, Mandado o Mototaxi
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Al crear tu solicitud se asignará el conductor verificado más cercano y se abrirá automáticamente el mapa de seguimiento con cámara en vivo.
                </p>
              </div>

              {/* 4 Service Modes Strictly Domicilios y Repartidores */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: 'mandado', name: 'Domicilio / Mercado', icon: Package, desc: 'Base $6.500 COP' },
                  { id: 'mototaxi', name: 'Mototaxi Express', icon: Bike, desc: 'Base $5.000 COP' },
                  { id: 'bici', name: 'Bici Eléctrica Eco', icon: Zap, desc: 'Base $4.000 COP' },
                  { id: 'encomienda', name: 'Encomienda Comercial', icon: Package, desc: 'Base $8.000 COP' }
                ].map((opt) => {
                  const IconComp = opt.icon;
                  const isSelected = serviceType === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setServiceType(opt.id)}
                      className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between gap-2 cursor-pointer ${
                        isSelected
                          ? 'border-[#ff5a1f] bg-orange-500/10 text-slate-900 dark:text-white ring-2 ring-orange-500/20'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/50 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <IconComp className={`w-5 h-5 ${isSelected ? 'text-[#ff5a1f]' : 'text-slate-400'}`} />
                      <div>
                        <span className="text-xs font-extrabold block">{opt.name}</span>
                        <span className="text-[10px] text-slate-400 block">{opt.desc}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* FlexDrive Car Trip Banner */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-slate-900 via-[#102420] to-slate-900 text-white flex flex-wrap items-center justify-between gap-3 text-xs border border-teal-500/30">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#ff5a1f] text-white flex items-center justify-center shrink-0">
                    <Car className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-extrabold block">¿Buscas transporte en carro particular o viaje al aeropuerto?</span>
                    <span className="text-[11px] text-slate-300">
                      Usa <strong>FlexDrive</strong>: carros climatizados 2010 a 2026. Turbo/Apartadó ➔ Aeropuerto Los Cedros ($65.000 COP).
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveNav('flexdrive')}
                  className="px-3.5 py-1.5 rounded-xl bg-[#ff5a1f] text-white font-extrabold text-[11px] hover:bg-[#e04812] shrink-0 cursor-pointer shadow-md"
                >
                  Abrir FlexDrive ➔
                </button>
              </div>

              <form onSubmit={handleCreateOrder} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Municipio de Urabá *
                    </label>
                    <select
                      value={newMunicipio}
                      onChange={(e) => setNewMunicipio(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-900 dark:text-white"
                    >
                      <option value="Apartadó">Apartadó</option>
                      <option value="Turbo">Turbo</option>
                      <option value="Carepa">Carepa</option>
                      <option value="Chigorodó">Chigorodó</option>
                      <option value="Necoclí">Necoclí</option>
                      <option value="Mutatá">Mutatá</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Tu Nombre o Comercio
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Ej. Restaurante El Caribe / María López"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Medio de Pago *
                    </label>
                    <select
                      value={paymentMethodChoice}
                      onChange={(e) => setPaymentMethodChoice(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-900 dark:text-white"
                    >
                      <option value="Wompi • PSE / Nequi">Wompi • PSE / Nequi</option>
                      <option value="Wompi • Tarjeta Débito/Crédito">Wompi • Tarjeta Débito/Crédito</option>
                      <option value="Billetera PSP">Billetera Digital PSP</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      📍 Punto de Recogida (Origen) *
                    </label>
                    <input
                      type="text"
                      required
                      value={pickupLocation}
                      onChange={(e) => setPickupLocation(e.target.value)}
                      placeholder="Ej. Parque Principal, Apartadó"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      🏁 Punto de Entrega (Destino) *
                    </label>
                    <input
                      type="text"
                      required
                      value={dropoffLocation}
                      onChange={(e) => setDropoffLocation(e.target.value)}
                      placeholder="Ej. Barrio Ortíz / Clínica Urabá"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Instrucciones para el Domiciliario / Conductor
                  </label>
                  <input
                    type="text"
                    value={packageNotes}
                    onChange={(e) => setPackageNotes(e.target.value)}
                    placeholder="Ej. Paquete frágil / Llamar al llegar a la portería"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                {/* FACTURITA DIGITAL DE SERVICIO (Con los +$500 COP para Sistema de Verificación de Repartidores y Monitoreo GPS) */}
                <div className="p-5 rounded-2xl bg-[#F8F9FB] dark:bg-[#141f1d] border border-slate-200 dark:border-[#223532] space-y-3">
                  <div className="flex items-center justify-between border-b border-dashed border-slate-300 dark:border-[#263935] pb-2.5">
                    <div className="flex items-center gap-2">
                      <Receipt className="w-4 h-4 text-[#ff5a1f]" />
                      <span className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">
                        Resumen de Factura • PSPGo Urabá
                      </span>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                      Tiempo est.: {currentFare.time}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                      <span>Servicio Base ({currentFare.label}):</span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        ${currentFare.price.toLocaleString()} COP
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                      <span className="flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#ff5a1f]" />
                        <span>Sistema de Verificación de Repartidores & Monitoreo GPS en Vivo:</span>
                      </span>
                      <span className="font-bold text-[#ff5a1f]">
                        +${CORP_SOLUTION_FEE.toLocaleString()} COP
                      </span>
                    </div>
                  </div>

                  <div className="pt-2.5 border-t border-slate-200 dark:border-[#243834] flex items-center justify-between">
                    <div>
                      <span className="text-xs font-extrabold text-slate-900 dark:text-white block">
                        Total a Pagar ({paymentMethodChoice})
                      </span>
                      <span className="text-[10px] text-slate-400">
                        Incluye trazabilidad satelital y cámaras de vía en tiempo real
                      </span>
                    </div>
                    <span className="text-2xl font-black text-[#ff5a1f]">
                      ${clientTotalFare.toLocaleString()} COP
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-[#ff5a1f] hover:bg-[#e04812] text-white font-extrabold text-sm shadow-lg shadow-orange-500/25 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Navigation className="w-4 h-4" />
                  <span>
                    {!user || viewRole === 'guest'
                      ? `Pagar $${clientTotalFare.toLocaleString()} COP y Activar Seguimiento en Vivo`
                      : `Confirmar Pago Wompi ($${clientTotalFare.toLocaleString()} COP) y Abrir Mapa`}
                  </span>
                </button>
              </form>
            </div>
          )}

          {/* ============================================================
          {/* ============================================================
              VIEW 4: SISTEMA DE VERIFICACIÓN E INSCRIPCIÓN DE REPARTIDORES (Estilo Rappi)
          ============================================================ */}
          {activeNav === 'riders' && (
            <div className="p-5 sm:p-8 max-w-4xl mx-auto w-full space-y-6 flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-[#1f302d] pb-4">
                <div className="space-y-1">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" />
                    Sistema de Verificación de Repartidores • Sello de Confianza PSP
                  </span>
                  <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                    Inscríbete como Repartidor o Mototaxi Verificado en Urabá
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Conéctate a la red oficial de domicilios y mandados en Apartadó, Turbo, Carepa, Chigorodó y Necoclí.
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-slate-900 dark:bg-[#162522] border border-slate-700 dark:border-[#28423c] shrink-0 text-right text-white">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400 block">
                    Empresas Aliadas PSP
                  </span>
                  <span className="text-xs font-black block">
                    Despachos 100% Incluidos
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Sin comisiones por pedido
                  </span>
                </div>
              </div>

              {/* Dignified Reassurance Notice */}
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div className="space-y-1 text-xs">
                  <h4 className="font-extrabold text-slate-900 dark:text-white">
                    Apoyo al trabajo honesto en Urabá: Multas de tránsito (SIMIT) y Datacrédito NO impiden tu registro
                  </h4>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    Solo verificamos tus documentos vigentes y antecedentes oficiales de la <strong>Policía Nacional o Procuraduría</strong> para garantizar tranquilidad y confianza a las familias y comercios que solicitan envíos.
                  </p>
                </div>
              </div>

              {/* SELECCIÓN DE PLAN DE ACTIVACIÓN PARA REPARTIDOR */}
              <div className="space-y-2.5">
                <label className="block text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                  Selecciona tu Modalidad de Ingreso:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Opción A: Membresía Plata/Gold (100% libre) */}
                  <div
                    onClick={() => setRiderEnrollMode('membership')}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative space-y-2 ${
                      riderEnrollMode === 'membership'
                        ? 'border-[#ff5a1f] bg-orange-500/5 ring-2 ring-orange-500/20'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111917]'
                    }`}
                  >
                    <span className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full bg-[#ff5a1f] text-white text-[9px] font-black uppercase">
                      Recomendado • 100% Libre
                    </span>
                    <div className="flex items-center gap-2">
                      <Crown className="w-4 h-4 text-[#ff5a1f]" />
                      <span className="text-xs font-black text-slate-900 dark:text-white">
                        Membresía Plata ($50.000/año)
                      </span>
                    </div>
                    <p className="text-xl font-black text-slate-900 dark:text-white">
                      $5.000 <span className="text-xs font-semibold text-slate-400">libres por carrera</span>
                    </p>
                    <ul className="text-[11px] text-slate-600 dark:text-slate-300 space-y-1">
                      <li>✓ <strong>$0 descuento</strong> de plataforma en cada viaje</li>
                      <li>✓ Recibes el 100% de la tarifa directa de tus clientes</li>
                      <li>✓ Vigencia por 1 año completo + Carnet Digital PSP</li>
                    </ul>
                  </div>

                  {/* Opción B: Matrícula Directa $30.000 + $300 por viaje para PSP */}
                  <div
                    onClick={() => setRiderEnrollMode('direct_enrollment')}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer space-y-2 ${
                      riderEnrollMode === 'direct_enrollment'
                        ? 'border-teal-500 bg-teal-500/5 ring-2 ring-teal-500/20'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111917]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Bike className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                      <span className="text-xs font-black text-slate-900 dark:text-white">
                        Matrícula Directa ($30.000 COP Pago Único)
                      </span>
                    </div>
                    <p className="text-xl font-black text-slate-900 dark:text-white">
                      $4.700 <span className="text-xs font-semibold text-slate-400">netos por carrera</span>
                    </p>
                    <ul className="text-[11px] text-slate-600 dark:text-slate-300 space-y-1">
                      <li>✓ No pagas membresía anual adelantada</li>
                      <li>✓ Se descuentan solo <strong>$300 COP</strong> por carrera para PSP</li>
                      <li>✓ Puedes subirte a Membresía Plata en cualquier momento</li>
                    </ul>
                  </div>
                </div>
              </div>

              {registrationSuccess ? (
                <div className="p-6 rounded-3xl bg-emerald-500/15 border border-emerald-500/40 text-center space-y-4">
                  <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                  <h4 className="text-lg font-extrabold text-slate-900 dark:text-white">
                    ¡Documentación Recibida en el Sistema de Verificación PSPGo!
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 max-w-lg mx-auto">
                    Bienvenido <strong>{driverName}</strong> ({driverMunicipio} • Placa <strong>{driverPlaca || 'En registro'}</strong>). Modalidad: <strong>{riderEnrollMode === 'membership' ? 'Membresía Anual ($5.000 libres)' : 'Matrícula Directa ($30.000 / -$300 por viaje)'}</strong>. Tus documentos han sido cargados para expedir tu Sello de Verificación.
                  </p>
                  <button
                    type="button"
                    onClick={() => setRegistrationSuccess(false)}
                    className="px-5 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs cursor-pointer"
                  >
                    Registrar otro conductor
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!user || viewRole === 'guest') {
                      setMembershipModal({
                        open: true,
                        reason:
                          riderEnrollMode === 'membership'
                            ? 'Para activar tu credencial con Membresía Plata ($50.000/año) y ganar el 100% de tus carreras todo el año, regístrate en PSP.'
                            : 'Para activar tu Matrícula Directa de Repartidor ($30.000 COP) y comenzar a recibir carreras de PSPGo, activa tu cuenta.'
                      });
                      return;
                    }
                    setRegistrationSuccess(true);
                  }}
                  className="space-y-5"
                >
                  {/* Step 1: Personal & Vehicle Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Nombre Completo *
                      </label>
                      <input
                        type="text"
                        required
                        value={driverName}
                        onChange={(e) => setDriverName(e.target.value)}
                        placeholder="Ej. Juan Carlos Ramos"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Cédula de Ciudadanía *
                      </label>
                      <input
                        type="text"
                        required
                        value={driverDoc}
                        onChange={(e) => setDriverDoc(e.target.value)}
                        placeholder="Ej. 1017123456"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Celular / WhatsApp Activo *
                      </label>
                      <input
                        type="text"
                        required
                        value={driverPhone}
                        onChange={(e) => setDriverPhone(e.target.value)}
                        placeholder="Ej. 312 456 7890"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Municipio Base *
                      </label>
                      <select
                        value={driverMunicipio}
                        onChange={(e) => setDriverMunicipio(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
                      >
                        <option value="Apartadó">Apartadó</option>
                        <option value="Turbo">Turbo</option>
                        <option value="Carepa">Carepa</option>
                        <option value="Chigorodó">Chigorodó</option>
                        <option value="Necoclí">Necoclí</option>
                        <option value="Mutatá">Mutatá</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Vehículo de Reparto *
                      </label>
                      <select
                        value={driverVehicle}
                        onChange={(e) => setDriverVehicle(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
                      >
                        <option value="mototaxi">Motocicleta / Mototaxi</option>
                        <option value="bici">Bici Eléctrica / Bicicleta</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Marca y Modelo *
                      </label>
                      <input
                        type="text"
                        required
                        value={driverBrandModel}
                        onChange={(e) => setDriverBrandModel(e.target.value)}
                        placeholder="Ej. Boxer CT100 / Yamaha FZ"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Placa del Vehículo *
                      </label>
                      <input
                        type="text"
                        required
                        value={driverPlaca}
                        onChange={(e) => setDriverPlaca(e.target.value.toUpperCase())}
                        placeholder="Ej. URA-45D"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-extrabold uppercase text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  {/* Step 2: Document Uploads in PDF / Image with Official Download Links */}
                  <div className="p-5 rounded-2xl bg-[#F8F9FB] dark:bg-[#141f1d] border border-slate-200 dark:border-[#223532] space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                          <FileText className="w-4 h-4 text-[#ff5a1f]" />
                          Documentos para Activación y Sello de Verificación
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          Puedes descargar tu certificado de antecedentes en PDF gratis en los portales oficiales:
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <a
                          href="https://antecedentes.policia.gov.co:7005/WebJudicial/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-xl bg-slate-900 dark:bg-slate-800 text-white text-[11px] font-bold flex items-center gap-1.5 hover:bg-slate-700 transition-colors"
                        >
                          <span>Portal Policía Nacional</span>
                          <ExternalLink className="w-3 h-3 text-[#ff5a1f]" />
                        </a>
                        <a
                          href="https://www.procuraduria.gov.co/Pages/Generacion-de-antecedentes.aspx"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-xl bg-slate-900 dark:bg-slate-800 text-white text-[11px] font-bold flex items-center gap-1.5 hover:bg-slate-700 transition-colors"
                        >
                          <span>Portal Procuraduría</span>
                          <ExternalLink className="w-3 h-3 text-teal-400" />
                        </a>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                      {/* Upload 1: Certificado Policía */}
                      <label className="p-3 rounded-xl border-2 border-dashed border-slate-300 dark:border-[#29403c] hover:border-[#ff5a1f] bg-white dark:bg-[#111917] cursor-pointer transition-colors flex flex-col justify-between gap-1.5">
                        <div className="flex items-center gap-1.5">
                          <Upload className="w-3.5 h-3.5 text-[#ff5a1f] shrink-0" />
                          <span className="text-[11px] font-extrabold text-slate-900 dark:text-white truncate">
                            1. Antecedentes Policía (PDF) *
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 truncate">
                          {certPoliciaFile || 'Subir PDF oficial...'}
                        </span>
                        <input
                          type="file"
                          required
                          accept=".pdf,image/*"
                          onChange={(e) => setCertPoliciaFile(e.target.files?.[0]?.name || '')}
                          className="hidden"
                        />
                      </label>

                      {/* Upload 2: Cédula & Licencia */}
                      <label className="p-3 rounded-xl border-2 border-dashed border-slate-300 dark:border-[#29403c] hover:border-[#ff5a1f] bg-white dark:bg-[#111917] cursor-pointer transition-colors flex flex-col justify-between gap-1.5">
                        <div className="flex items-center gap-1.5">
                          <Upload className="w-3.5 h-3.5 text-teal-500 shrink-0" />
                          <span className="text-[11px] font-extrabold text-slate-900 dark:text-white truncate">
                            2. Cédula y Licencia A2 *
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 truncate">
                          {cedulaFile || 'Subir foto o PDF...'}
                        </span>
                        <input
                          type="file"
                          required
                          accept=".pdf,image/*"
                          onChange={(e) => setCedulaFile(e.target.files?.[0]?.name || '')}
                          className="hidden"
                        />
                      </label>

                      {/* Upload 3: SOAT & Tecnomecánica */}
                      <label className="p-3 rounded-xl border-2 border-dashed border-slate-300 dark:border-[#29403c] hover:border-[#ff5a1f] bg-white dark:bg-[#111917] cursor-pointer transition-colors flex flex-col justify-between gap-1.5">
                        <div className="flex items-center gap-1.5">
                          <Upload className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                          <span className="text-[11px] font-extrabold text-slate-900 dark:text-white truncate">
                            3. SOAT y Tecnomecánica *
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 truncate">
                          {riderSoatFile || 'Subir PDF o foto vigente...'}
                        </span>
                        <input
                          type="file"
                          required
                          accept=".pdf,image/*"
                          onChange={(e) => setRiderSoatFile(e.target.files?.[0]?.name || '')}
                          className="hidden"
                        />
                      </label>

                      {/* Upload 4: Foto Moto con Placa */}
                      <label className="p-3 rounded-xl border-2 border-dashed border-slate-300 dark:border-[#29403c] hover:border-[#ff5a1f] bg-white dark:bg-[#111917] cursor-pointer transition-colors flex flex-col justify-between gap-1.5">
                        <div className="flex items-center gap-1.5">
                          <Camera className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          <span className="text-[11px] font-extrabold text-slate-900 dark:text-white truncate">
                            4. Foto Moto con Placa *
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 truncate">
                          {vehiculoPhotoFile || 'Subir foto legible...'}
                        </span>
                        <input
                          type="file"
                          required
                          accept="image/*,.pdf"
                          onChange={(e) => setVehiculoPhotoFile(e.target.files?.[0]?.name || '')}
                          className="hidden"
                        />
                      </label>
                    </div>

                    <label className="flex items-start gap-2.5 text-[11px] text-slate-600 dark:text-slate-300 cursor-pointer pt-1">
                      <input
                        type="checkbox"
                        required
                        checked={acceptVerificationTerms}
                        onChange={(e) => setAcceptVerificationTerms(e.target.checked)}
                        className="mt-0.5 rounded border-slate-300 text-[#ff5a1f] focus:ring-[#ff5a1f]"
                      />
                      <span>
                        Certifico que mis documentos son verídicos y autorizo al <strong>Sistema de Verificación PSP</strong> a validar mi identidad para recibir despachos de domicilios en Urabá.
                      </span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-2xl bg-[#ff5a1f] hover:bg-[#e04812] text-white font-extrabold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>
                      {riderEnrollMode === 'membership'
                        ? 'Enviar Documentos y Activar con Membresía Plata ($50.000/año)'
                        : 'Enviar Documentos y Activar con Matrícula Directa ($30.000 COP)'}
                    </span>
                  </button>
                </form>
              )}
            </div>
          )}

          {/* ============================================================
              VIEW 5: 🚘 FLEXDRIVE • BY CORPLEX SOLUTION SAS (Alianza 60/40 con PSP)
          ============================================================ */}
          {activeNav === 'flexdrive' && (
            <div className="p-5 sm:p-8 max-w-5xl mx-auto w-full space-y-6 flex-1">
              
              {/* FlexDrive Main Hero & Strategic Partnership Banner */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-950 via-[#0d1a17] to-slate-900 text-white border border-teal-500/30 shadow-xl space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#ff5a1f] to-amber-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/30">
                      <Car className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-black tracking-tight text-white">
                          Flex<span className="text-[#ff5a1f]">Drive</span>
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-[#ff5a1f]/20 text-[#ff5a1f] text-[10px] font-black uppercase tracking-wider">
                          By Corplex Solution SAS
                        </span>
                      </div>
                      <p className="text-xs text-slate-300">
                        Movilidad Climatizada & Aeropuerto • Alianza Comercial 60% Corplex / 40% PSP
                      </p>
                    </div>
                  </div>

                  <div className="px-3.5 py-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-right">
                    <span className="text-[10px] text-teal-300 font-extrabold uppercase block">
                      Comisión Plataforma Justa
                    </span>
                    <span className="text-base font-black text-white">
                      Solo 12% <span className="text-[10px] font-normal text-slate-300">(vs 25% Uber/Cabify)</span>
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
                  Rompemos el monopolio tradicional de taxis hacia el <strong>Aeropuerto Antonio Roldán Betancur (Carepa)</strong> que cobran hasta <strong>$120.000 COP</strong>. Con <strong>FlexDrive</strong> viajas en carros particulares climatizados (modelos 2010 a 2026) desde <strong>$65.000 COP</strong>, con seguimiento GPS en vivo y pago transparente por Wompi (Nequi / Bancolombia).
                </p>

                {/* Sub-Tabs: Solicitar Viaje | Alianza 60/40 | Registro Conductor Carro */}
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/10">
                  {[
                    { id: 'request', label: '✈️ Solicitar Viaje / Aeropuerto', icon: Plane },
                    { id: 'partnership', label: '💼 Alianza 60/40 & Ganancias', icon: Calculator },
                    { id: 'register_car', label: '🚗 Inscribir Mi Carro (2010–2026)', icon: ShieldCheck }
                  ].map((tab) => {
                    const isTabActive = flexSubTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setFlexSubTab(tab.id)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                          isTabActive
                            ? 'bg-[#ff5a1f] text-white shadow-md shadow-orange-500/25 font-extrabold'
                            : 'bg-white/10 text-slate-300 hover:bg-white/15 hover:text-white'
                        }`}
                      >
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* SUB-TAB 1: SOLICITAR VIAJE / AEROPUERTO */}
              {flexSubTab === 'request' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                      Rutas Estrella & Tarifas FlexDrive
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Selecciona tu destino. Todos los viajes incluyen aire acondicionado, baúl amplio y rastreo en tiempo real.
                    </p>
                  </div>

                  {/* 4 FlexDrive Route Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                    {[
                      {
                        key: 'airport_turbo',
                        title: 'Turbo ➔ Aeropuerto Carepa',
                        orig: 'Turbo Centro / Muelle',
                        dest: 'Aeropuerto Antonio Roldán Betancur',
                        price: 65000,
                        taxiComp: 120000,
                        time: '55 min',
                        tag: 'Ahorro $55.000 COP'
                      },
                      {
                        key: 'airport_apartado',
                        title: 'Apartadó ➔ Aeropuerto Carepa',
                        orig: 'Apartadó Urbano',
                        dest: 'Aeropuerto Antonio Roldán Betancur',
                        price: 45000,
                        taxiComp: 75000,
                        time: '25 min',
                        tag: 'Ahorro $30.000 COP'
                      },
                      {
                        key: 'urban_ride',
                        title: 'Carrera Urbana Confort A/C',
                        orig: 'Centro / Comercio',
                        dest: 'Barrio / Destino Urbano',
                        price: 10000,
                        taxiComp: 14000,
                        time: '12 min',
                        tag: 'Confort Climatizado'
                      },
                      {
                        key: 'car_cargo',
                        title: 'Encomienda en Baúl de Carro',
                        orig: 'Cualquier punto Urabá',
                        dest: 'Entrega puerta a puerta',
                        price: 15000,
                        taxiComp: 25000,
                        time: '20 min',
                        tag: 'Carga segura y seca'
                      }
                    ].map((route) => {
                      const isSelected = flexRouteKey === route.key;
                      return (
                        <div
                          key={route.key}
                          onClick={() => {
                            setFlexRouteKey(route.key);
                            setFlexPickupAddress(route.orig);
                            setFlexDropoffAddress(route.dest);
                          }}
                          className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                            isSelected
                              ? 'border-[#ff5a1f] bg-orange-500/5 ring-2 ring-orange-500/20'
                              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111917] hover:border-slate-300'
                          }`}
                        >
                          <div>
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                              {route.tag}
                            </span>
                            <h4 className="text-xs font-black text-slate-900 dark:text-white mt-2">
                              {route.title}
                            </h4>
                            <p className="text-[11px] text-slate-400 mt-1">
                              {route.time} • Climatizado
                            </p>
                          </div>

                          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                            <div className="flex items-baseline justify-between">
                              <span className="text-lg font-black text-[#ff5a1f]">
                                ${route.price.toLocaleString()}
                              </span>
                              <span className="text-[10px] text-slate-400 line-through">
                                Taxi: ${route.taxiComp.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Booking Form for FlexDrive */}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!user || viewRole === 'guest') {
                        setMembershipModal({
                          open: true,
                          reason:
                            'Para confirmar y despachar tu viaje en FlexDrive con conductor verificado y pago por Wompi, activa tu cuenta PSP.'
                        });
                        return;
                      }
                      setFlexSuccessModal(true);
                    }}
                    className="p-6 rounded-3xl bg-white dark:bg-[#111917] border border-slate-200 dark:border-[#223532] shadow-sm space-y-4"
                  >
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                        <Car className="w-4 h-4 text-[#ff5a1f]" />
                        Confirmación de Solicitud de Vehículo
                      </span>
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        Vehículos Disponibles en la Zona: 8
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          📍 Punto de Recogida *
                        </label>
                        <input
                          type="text"
                          required
                          value={flexPickupAddress}
                          onChange={(e) => setFlexPickupAddress(e.target.value)}
                          placeholder="Dirección o barrio de recogida"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          🏁 Destino *
                        </label>
                        <input
                          type="text"
                          required
                          value={flexDropoffAddress}
                          onChange={(e) => setFlexDropoffAddress(e.target.value)}
                          placeholder="Aeropuerto o dirección de destino"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Nombre del Pasajero *
                        </label>
                        <input
                          type="text"
                          required
                          value={flexPassengerName}
                          onChange={(e) => setFlexPassengerName(e.target.value)}
                          placeholder="Nombre y apellido"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Celular de Contacto *
                        </label>
                        <input
                          type="text"
                          required
                          value={flexPassengerPhone}
                          onChange={(e) => setFlexPassengerPhone(e.target.value)}
                          placeholder="Ej. 312 987 6543"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Hora de Vuelo / Recogida *
                        </label>
                        <input
                          type="time"
                          required
                          value={flexFlightTime}
                          onChange={(e) => setFlexFlightTime(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white font-bold"
                        />
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#F8F9FB] dark:bg-[#15201e] border border-dashed border-slate-300 dark:border-[#253935] flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div>
                        <span className="font-extrabold text-slate-900 dark:text-white block">
                          Tarifa Total del Viaje:
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {flexRouteKey === 'airport_turbo'
                            ? 'Turbo ➔ Aeropuerto ($65.000) + $500 Verificación GPS'
                            : flexRouteKey === 'airport_apartado'
                            ? 'Apartadó ➔ Aeropuerto ($45.000) + $500 Verificación GPS'
                            : flexRouteKey === 'urban_ride'
                            ? 'Urbano A/C ($10.000) + $500 Verificación GPS'
                            : 'Encomienda Baúl ($15.000) + $500 Verificación GPS'}
                        </span>
                      </div>
                      <span className="text-2xl font-black text-[#ff5a1f]">
                        $
                        {(
                          (flexRouteKey === 'airport_turbo'
                            ? 65000
                            : flexRouteKey === 'airport_apartado'
                            ? 45000
                            : flexRouteKey === 'urban_ride'
                            ? 10000
                            : 15000) + CORP_SOLUTION_FEE
                        ).toLocaleString()}{' '}
                        COP
                      </span>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-2xl bg-[#ff5a1f] hover:bg-[#e04812] text-white font-extrabold text-xs shadow-lg shadow-orange-500/25 transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Navigation className="w-4 h-4" />
                      <span>Confirmar Viaje FlexDrive con Wompi (Nequi / Bancolombia)</span>
                    </button>
                  </form>
                </div>
              )}

              {/* SUB-TAB 2: ALIANZA 60/40 & CALCULADORA FINANCIERA */}
              {flexSubTab === 'partnership' && (
                <div className="space-y-6">
                  <div className="p-6 rounded-3xl bg-white dark:bg-[#111917] border border-slate-200 dark:border-[#223532] shadow-sm space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                      <div>
                        <span className="text-xs font-black uppercase tracking-wider text-[#ff5a1f]">
                          Propuesta de Negocio y Estructura Financiera
                        </span>
                        <h3 className="text-lg font-black text-slate-900 dark:text-white">
                          Alianza Estratégica: 60% Corplex Solution SAS / 40% PSP
                        </h3>
                      </div>
                      <span className="px-3 py-1 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 text-xs font-extrabold">
                        Modelo Ganar-Ganar
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      FlexDrive opera con una comisión del <strong>12% por viaje</strong> (frente al 20–25% abusivo de plataformas como Uber o Cabify). El conductor particular se queda con el <strong>88% íntegro</strong> de la carrera, y el 12% recaudado se distribuye de manera automatizada:
                    </p>

                    {/* Financial Split Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Card Conductor */}
                      <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
                        <span className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 block">
                          Conductor FlexDrive
                        </span>
                        <p className="text-2xl font-black text-slate-900 dark:text-white">
                          88%
                        </p>
                        <p className="text-xs font-bold text-emerald-700 dark:text-emerald-300">
                          $57.200 COP netos
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          En una carrera al aeropuerto de $65.000 COP, gana mucho más que con cualquier otra app.
                        </p>
                      </div>

                      {/* Card Corplex Solution SAS (60%) */}
                      <div className="p-4 rounded-2xl bg-orange-500/10 border border-orange-500/30 space-y-2">
                        <span className="text-[10px] font-black uppercase text-[#ff5a1f] block">
                          Corplex Solution SAS (60%)
                        </span>
                        <p className="text-2xl font-black text-[#ff5a1f]">
                          $4.680 COP
                        </p>
                        <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          Por carrera de aeropuerto
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          Cubre desarrollo de software, servidores en la nube, APIs satelitales, IA y soporte.
                        </p>
                      </div>

                      {/* Card PSP (40%) */}
                      <div className="p-4 rounded-2xl bg-sky-500/10 border border-sky-500/30 space-y-2">
                        <span className="text-[10px] font-black uppercase text-sky-600 dark:text-sky-400 block">
                          PSP Urabá - Janier (40%)
                        </span>
                        <p className="text-2xl font-black text-sky-600 dark:text-sky-400">
                          $3.120 COP
                        </p>
                        <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          Por carrera de aeropuerto
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          Ingreso pasivo por comercialización, base de usuarios y difusión en la plataforma.
                        </p>
                      </div>
                    </div>

                    {/* Proyección Mensual */}
                    <div className="p-5 rounded-2xl bg-[#F8F9FB] dark:bg-[#141f1d] border border-slate-200 dark:border-[#223532] space-y-3">
                      <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                        <Calculator className="w-4 h-4 text-[#ff5a1f]" />
                        Proyección de Ingresos Mensuales por Volumen de Viajes (Aeropuerto / Urbanos)
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        <div className="p-3 rounded-xl bg-white dark:bg-[#111917] border border-slate-200 dark:border-slate-800 space-y-1">
                          <span className="font-extrabold block text-slate-900 dark:text-white">Escenario 20 viajes / día:</span>
                          <span className="text-slate-500 block">• Corplex SAS: <strong>$2.808.000 / mes</strong></span>
                          <span className="text-slate-500 block">• PSP (Janier): <strong>$1.872.000 / mes</strong></span>
                        </div>
                        <div className="p-3 rounded-xl bg-white dark:bg-[#111917] border border-slate-200 dark:border-slate-800 space-y-1">
                          <span className="font-extrabold block text-slate-900 dark:text-white">Escenario 50 viajes / día:</span>
                          <span className="text-[#ff5a1f] block font-bold">• Corplex SAS: $7.020.000 / mes</span>
                          <span className="text-sky-600 dark:text-sky-400 block font-bold">• PSP (Janier): $4.680.000 / mes</span>
                        </div>
                        <div className="p-3 rounded-xl bg-white dark:bg-[#111917] border border-slate-200 dark:border-slate-800 space-y-1">
                          <span className="font-extrabold block text-slate-900 dark:text-white">Escenario 100 viajes / día:</span>
                          <span className="text-emerald-600 dark:text-emerald-400 block font-black">• Corplex SAS: $14.040.000 / mes</span>
                          <span className="text-emerald-600 dark:text-emerald-400 block font-black">• PSP (Janier): $9.360.000 / mes</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SUB-TAB 3: REGISTRO DE CONDUCTORES DE CARROS PARTICULARES (2010 A 2026) */}
              {flexSubTab === 'register_car' && (
                <div className="space-y-6">
                  <div className="p-6 rounded-3xl bg-white dark:bg-[#111917] border border-slate-200 dark:border-[#223532] shadow-sm space-y-5">
                    <div className="space-y-1">
                      <span className="text-xs font-black uppercase tracking-wider text-[#ff5a1f]">
                        Únete a FlexDrive como Conductor Particular
                      </span>
                      <h3 className="text-xl font-black text-slate-900 dark:text-white">
                        Inscripción de Vehículos Confort Climatizados (Modelos 2010 a 2026)
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Monetiza tu carro particular en tus tiempos libres realizando viajes al aeropuerto y carreras urbanas en Urabá.
                      </p>
                    </div>

                    {/* Vehicle Quality & Year Constraint Notice */}
                    <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 text-xs">
                      <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <h4 className="font-extrabold text-slate-900 dark:text-white">
                          Estándar de Calidad: Solo modelos 2010 en adelante con A/C
                        </h4>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                          Para brindar una experiencia superior al taxi tradicional, no se aceptan vehículos antiguos descontinuados (ej. Chevrolet Sprint 2001/2002 quedan excluidos). Tu carro debe contar con aire acondicionado activo y baúl espacioso para maletas.
                        </p>
                      </div>
                    </div>

                    {carRegisterSuccess ? (
                      <div className="p-6 rounded-3xl bg-emerald-500/15 border border-emerald-500/40 text-center space-y-4">
                        <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                        <h4 className="text-lg font-extrabold text-slate-900 dark:text-white">
                          ¡Solicitud de Conductor FlexDrive Recibida!
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-slate-300 max-w-lg mx-auto">
                          Gracias <strong>{carDriverName}</strong>. Hemos recibido los documentos de tu <strong>{carBrandModel} ({carYear})</strong> con placa <strong>{carPlaca}</strong>. Nuestro equipo técnico validará tu SOAT y antecedentes para darte de alta en la bolsa de viajes.
                        </p>
                        <button
                          type="button"
                          onClick={() => setCarRegisterSuccess(false)}
                          className="px-5 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs cursor-pointer"
                        >
                          Inscribir otro vehículo
                        </button>
                      </div>
                    ) : (
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          if (!user || viewRole === 'guest') {
                            setMembershipModal({
                              open: true,
                              reason:
                                'Para darte de alta como conductor de FlexDrive y recibir comisiones directas por Wompi, crea tu cuenta en la plataforma.'
                            });
                            return;
                          }
                          setCarRegisterSuccess(true);
                        }}
                        className="space-y-4"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                              Nombre Completo *
                            </label>
                            <input
                              type="text"
                              required
                              value={carDriverName}
                              onChange={(e) => setCarDriverName(e.target.value)}
                              placeholder="Ej. Carlos Alberto Torres"
                              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                              Cédula de Ciudadanía *
                            </label>
                            <input
                              type="text"
                              required
                              value={carDriverDoc}
                              onChange={(e) => setCarDriverDoc(e.target.value)}
                              placeholder="Ej. 1017894561"
                              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                              Celular / WhatsApp *
                            </label>
                            <input
                              type="text"
                              required
                              value={carDriverPhone}
                              onChange={(e) => setCarDriverPhone(e.target.value)}
                              placeholder="Ej. 314 555 1234"
                              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                              Municipio Base *
                            </label>
                            <select
                              value={carMunicipio}
                              onChange={(e) => setCarMunicipio(e.target.value)}
                              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white font-semibold"
                            >
                              <option value="Turbo">Turbo</option>
                              <option value="Apartadó">Apartadó</option>
                              <option value="Carepa">Carepa</option>
                              <option value="Chigorodó">Chigorodó</option>
                              <option value="Necoclí">Necoclí</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                              Marca y Línea *
                            </label>
                            <input
                              type="text"
                              required
                              value={carBrandModel}
                              onChange={(e) => setCarBrandModel(e.target.value)}
                              placeholder="Ej. Renault Logan / Duster"
                              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                              Año / Modelo (2010 a 2026) *
                            </label>
                            <select
                              value={carYear}
                              onChange={(e) => setCarYear(e.target.value)}
                              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-black text-slate-900 dark:text-white"
                            >
                              {Array.from({ length: 17 }, (_, i) => 2026 - i).map((y) => (
                                <option key={y} value={y}>
                                  Modelo {y}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                              Placa del Carro *
                            </label>
                            <input
                              type="text"
                              required
                              value={carPlaca}
                              onChange={(e) => setCarPlaca(e.target.value.toUpperCase())}
                              placeholder="Ej. ABC-123"
                              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-black uppercase text-slate-900 dark:text-white"
                            />
                          </div>
                        </div>

                        {/* File Uploads for FlexDrive Car */}
                        <div className="p-5 rounded-2xl bg-[#F8F9FB] dark:bg-[#141f1d] border border-slate-200 dark:border-[#223532] space-y-4">
                          <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                            <FileText className="w-4 h-4 text-[#ff5a1f]" />
                            Carga de Documentos del Vehículo (PDF / Imagen)
                          </h4>

                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                            <label className="p-3 rounded-xl border-2 border-dashed border-slate-300 dark:border-[#29403c] hover:border-[#ff5a1f] bg-white dark:bg-[#111917] cursor-pointer transition-colors flex flex-col justify-between gap-1.5">
                              <span className="text-[11px] font-extrabold text-slate-900 dark:text-white truncate">
                                1. SOAT Vigente *
                              </span>
                              <span className="text-[10px] text-slate-400 truncate">
                                {carSoatFile || 'Subir PDF de SOAT...'}
                              </span>
                              <input
                                type="file"
                                required
                                accept=".pdf,image/*"
                                onChange={(e) => setCarSoatFile(e.target.files?.[0]?.name || '')}
                                className="hidden"
                              />
                            </label>

                            <label className="p-3 rounded-xl border-2 border-dashed border-slate-300 dark:border-[#29403c] hover:border-[#ff5a1f] bg-white dark:bg-[#111917] cursor-pointer transition-colors flex flex-col justify-between gap-1.5">
                              <span className="text-[11px] font-extrabold text-slate-900 dark:text-white truncate">
                                2. Tecnomecánica Vigente *
                              </span>
                              <span className="text-[10px] text-slate-400 truncate">
                                {carTecnoFile || 'Subir PDF CDA...'}
                              </span>
                              <input
                                type="file"
                                required
                                accept=".pdf,image/*"
                                onChange={(e) => setCarTecnoFile(e.target.files?.[0]?.name || '')}
                                className="hidden"
                              />
                            </label>

                            <label className="p-3 rounded-xl border-2 border-dashed border-slate-300 dark:border-[#29403c] hover:border-[#ff5a1f] bg-white dark:bg-[#111917] cursor-pointer transition-colors flex flex-col justify-between gap-1.5">
                              <span className="text-[11px] font-extrabold text-slate-900 dark:text-white truncate">
                                3. Licencia B1 / C1 *
                              </span>
                              <span className="text-[10px] text-slate-400 truncate">
                                {carLicenciaFile || 'Subir foto de licencia...'}
                              </span>
                              <input
                                type="file"
                                required
                                accept=".pdf,image/*"
                                onChange={(e) => setCarLicenciaFile(e.target.files?.[0]?.name || '')}
                                className="hidden"
                              />
                            </label>

                            <label className="p-3 rounded-xl border-2 border-dashed border-slate-300 dark:border-[#29403c] hover:border-[#ff5a1f] bg-white dark:bg-[#111917] cursor-pointer transition-colors flex flex-col justify-between gap-1.5">
                              <span className="text-[11px] font-extrabold text-slate-900 dark:text-white truncate">
                                4. Antecedentes Policía (PDF) *
                              </span>
                              <span className="text-[10px] text-slate-400 truncate">
                                {carCertPoliciaFile || 'Subir PDF oficial...'}
                              </span>
                              <input
                                type="file"
                                required
                                accept=".pdf,image/*"
                                onChange={(e) => setCarCertPoliciaFile(e.target.files?.[0]?.name || '')}
                                className="hidden"
                              />
                            </label>
                          </div>

                          <div className="space-y-2 pt-2">
                            <label className="flex items-center gap-2.5 text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer">
                              <input
                                type="checkbox"
                                required
                                checked={carHasAC}
                                onChange={(e) => setCarHasAC(e.target.checked)}
                                className="rounded text-[#ff5a1f] focus:ring-[#ff5a1f]"
                              />
                              <span>Mi vehículo cuenta con Aire Acondicionado (A/C) 100% operativo y en óptimo estado.</span>
                            </label>

                            <label className="flex items-start gap-2.5 text-[11px] text-slate-500 dark:text-slate-400 cursor-pointer">
                              <input
                                type="checkbox"
                                required
                                checked={carAcceptTerms}
                                onChange={(e) => setCarAcceptTerms(e.target.checked)}
                                className="mt-0.5 rounded text-[#ff5a1f] focus:ring-[#ff5a1f]"
                              />
                              <span>
                                Acepto los términos de FlexDrive: comisión del 12% por viaje recaudada por Wompi y 88% transferido semanalmente a mi cuenta.
                              </span>
                            </label>
                          </div>
                        </div>

                        <button
                          type="submit"
                          className="w-full py-3.5 rounded-2xl bg-slate-900 dark:bg-teal-500 text-white dark:text-slate-950 font-extrabold text-xs shadow-md cursor-pointer flex items-center justify-center gap-2"
                        >
                          <ShieldCheck className="w-4 h-4" />
                          <span>Enviar Documentación para Alta como Conductor FlexDrive</span>
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              )}

              {/* FlexDrive Booking Success Modal */}
              {flexSuccessModal && (
                <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
                  <div className="bg-white dark:bg-[#111917] border border-slate-200 dark:border-[#243834] rounded-3xl max-w-md w-full p-6 text-center space-y-4 shadow-2xl">
                    <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                    <h4 className="text-lg font-black text-slate-900 dark:text-white">
                      ¡Viaje FlexDrive Confirmado!
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      Hemos asignado un vehículo climatizado 2018 para recoger a <strong>{flexPassengerName || 'Pasajero'}</strong> en <strong>{flexPickupAddress}</strong> con destino <strong>{flexDropoffAddress}</strong> a las <strong>{flexFlightTime}</strong>.
                    </p>
                    <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
                      Pago registrado por Wompi • Ahorraste más de $40.000 COP vs el taxi tradicional.
                    </div>
                    <button
                      type="button"
                      onClick={() => setFlexSuccessModal(false)}
                      className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-teal-500 text-white dark:text-slate-950 text-xs font-bold cursor-pointer"
                    >
                      Entendido
                    </button>
                  </div>
                </div>
              )}

            </div>
          )}

        </div>
      </div>
      </div>

      {/* ============================================================
          MODAL DE CONVERSIÓN A MEMBRESÍA PSP (Para Visitantes Sin Cuenta)
      ============================================================ */}
      {membershipModal.open && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111917] border border-slate-200 dark:border-[#243834] rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl space-y-5 relative animate-in fade-in zoom-in-95 duration-200">
            <button
              type="button"
              onClick={() => setMembershipModal({ open: false, reason: '' })}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#ff5a1f] to-amber-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-orange-500/20">
                <Crown className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#ff5a1f] block">
                  Acceso Exclusivo Red PSPGo Urabá
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  Activa tu Membresía PSP para Continuar
                </h3>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-[#162220] p-3.5 rounded-2xl border border-slate-200/80 dark:border-[#243834]">
              {membershipModal.reason}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Plan Plata */}
              <div className="p-4 rounded-2xl border-2 border-slate-200 dark:border-[#253935] bg-slate-50/70 dark:bg-[#15201e] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                    Membresía Plata
                  </span>
                  <ShieldCheck className="w-4 h-4 text-teal-500" />
                </div>
                <p className="text-lg font-black text-slate-900 dark:text-white">
                  $50.000 <span className="text-xs font-semibold text-slate-400">/ año</span>
                </p>
                <ul className="text-[11px] text-slate-600 dark:text-slate-300 space-y-1">
                  <li>✓ Pide domicilios y mototaxis con cámara y GPS en vivo</li>
                  <li>✓ Te habilita 1 año como Repartidor Verificado (0% comisión)</li>
                  <li>✓ Descuentos automáticos en comercios de Urabá</li>
                </ul>
              </div>

              {/* Plan Gold */}
              <div className="p-4 rounded-2xl border-2 border-[#ff5a1f] bg-orange-500/5 space-y-2 relative">
                <span className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full bg-[#ff5a1f] text-white text-[9px] font-extrabold uppercase">
                  Más Popular
                </span>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                    Membresía Gold
                  </span>
                  <Crown className="w-4 h-4 text-amber-500" />
                </div>
                <p className="text-lg font-black text-[#ff5a1f]">
                  $100.000 <span className="text-xs font-semibold text-slate-400">/ año</span>
                </p>
                <ul className="text-[11px] text-slate-600 dark:text-slate-300 space-y-1">
                  <li>✓ Prioridad #1 en despachos y pedidos empresariales</li>
                  <li>✓ Insignia Repartidor Gold en los 5 municipios de Urabá</li>
                  <li>✓ Máximo descuento en todo el catálogo PSP</li>
                </ul>
              </div>
            </div>

            <div className="text-[11px] text-center text-slate-500 dark:text-slate-400">
              ¿Tienes una <strong>Empresa Aliada PSP</strong>? Los despachos de tu comercio están <strong>100% incluidos sin costo</strong>.
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => navigate('/registro', { state: { from: '/domicilios' } })}
                className="w-full py-3 rounded-xl bg-[#ff5a1f] hover:bg-[#e04812] text-white text-xs font-extrabold shadow-lg shadow-orange-500/20 cursor-pointer"
              >
                Adquirir Membresía / Registrarme Ahora
              </button>
              <button
                type="button"
                onClick={() => navigate('/ingresar', { state: { from: '/domicilios' } })}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold cursor-pointer whitespace-nowrap"
              >
                Ya tengo cuenta
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PSPExpressHub;
