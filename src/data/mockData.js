export const EMPRESAS_ALIADAS = [
  {
    id: '1',
    nombre: 'Puerto Antioquia S.A.',
    sector: 'Infraestructura & Logística',
    categoria: 'Privado',
    ods: [8, 9, 11],
    ubicación: 'Bahía Colombia, Turbo, Urabá',
    descripcion: 'Terminal multipropósito que transforma el comercio exterior de Colombia y genera oportunidades de desarrollo socioeconómico en Urabá.',
    proyectos: 'Creación de 1,800+ empleos directos y programa de capacitación para comunidades locales.',
    logo: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=300&auto=format&fit=crop&q=80',
    sitioWeb: 'https://puertoantioquia.my',
    destacada: true
  },
  {
    id: '2',
    nombre: 'Augura - Asociación de Bananeros de Colombia',
    sector: 'Agroindustria & Sostenibilidad',
    categoria: 'Gremial',
    ods: [1, 8, 13, 15],
    ubicación: 'Apartadó, Urabá',
    descripcion: 'Agremia a productores e investiga mejores prácticas medioambientales para el cultivo sostenible del banano.',
    proyectos: 'Biofábricas comunitarias y conservación de cuencas hidrográficas en Urabá.',
    logo: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=300&auto=format&fit=crop&q=80',
    sitioWeb: 'https://augura.com.co',
    destacada: true
  },
  {
    id: '3',
    nombre: 'Fundauniban',
    sector: 'Desarrollo Social & Educación',
    categoria: 'Fundación',
    ods: [4, 5, 10, 17],
    ubicación: 'Apartadó, Carepa, Chigorodó, Turbo',
    descripcion: 'Fundación social del grupo Uniban orientada a mejorar la calidad de vida de las comunidades bananeras y plataneras.',
    proyectos: 'Escuelas de emprendimiento, vivienda digna y fortalecimiento a la primera infancia.',
    logo: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=300&auto=format&fit=crop&q=80',
    sitioWeb: 'https://fundauniban.org.co',
    destacada: true
  },
  {
    id: '4',
    nombre: 'Comfenalco Antioquia (Regional Urabá)',
    sector: 'Servicios Sociales & Empleo',
    categoria: 'Caja de Compensación',
    ods: [3, 4, 8],
    ubicación: 'Apartadó, Urabá',
    descripcion: 'Brinda cobertura de subsidios, empleo, cultura y recreación a trabajadores y sus familias en la subregión de Urabá.',
    proyectos: 'Agencia de Empleo Urabá y programa de becas en educación superior.',
    logo: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=300&auto=format&fit=crop&q=80',
    sitioWeb: 'https://comfenalcoantioquia.com.co',
    destacada: false
  },
  {
    id: '5',
    nombre: 'SENA Regional Urabá - Complejo Tecnológico',
    sector: 'Educación & Emprendimiento',
    categoria: 'Público',
    ods: [4, 8, 9],
    ubicación: 'Apartadó, Urabá',
    descripcion: 'Formación técnica y tecnológica gratuita orientada a las necesidades productivas y sociales de la región.',
    proyectos: 'Fondo Emprender Urabá e incubación de agro-startups tecnológicas.',
    logo: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=300&auto=format&fit=crop&q=80',
    sitioWeb: 'https://sena.edu.co',
    destacada: true
  },
  {
    id: '6',
    nombre: 'EPM - Empresas Públicas de Medellín (Urabá)',
    sector: 'Servicios Públicos & Energía Sostenible',
    categoria: 'Público',
    ods: [6, 7, 11, 13],
    ubicación: 'Región Urabá',
    descripcion: 'Líder en provisión de agua potable, saneamiento básico y energía renovable para los municipios de Urabá.',
    proyectos: 'Electrificación rural mediante paneles solares y adecuación de alcantarillado costero.',
    logo: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=300&auto=format&fit=crop&q=80',
    sitioWeb: 'https://epm.com.co',
    destacada: false
  }
];

export const PRODUCTOS = [
  {
    id: 'p1',
    nombre: 'Snacks de Plátano Mofongo Criollo (Pack x6)',
    categoria: 'Alimentos & Agro',
    precio: 28000,
    precioAnterior: 32000,
    proveedor: 'Agroemprendedores de Turbo',
    municipio: 'Turbo, Urabá',
    calificacion: 4.9,
    reseñasCount: 142,
    imagen: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=800&auto=format&fit=crop&q=80',
    imagenes: [
      'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1528751014936-863e6e7a319c?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=800&auto=format&fit=crop&q=80'
    ],
    descripcion: 'Chips artesanalmente elaborados con plátano de Urabá 100% natural, sazonados con sal marina y ajo de origen sostenible.',
    descripcionDetallada: 'Nuestros snacks de plátano mofongo criollo son producidos por familias plataneras del municipio de Turbo, Urabá. Horneados a fuego controlado con aceite de girasol no transgénico y sazonados artesanalmente con ajo criollo y sal marina pura. Preservan toda la fibra natural y el sabor característico de los suelos del Caribe antioqueño.',
    caracteristicas: [
      'Plátano Hartón seleccionado de parcelas con certificación social',
      'Libre de gluten, grasa trans y conservantes químicos',
      'Empaque bilaminado de alta barrera para conservar crujencia por 6 meses',
      'Comercio justo que beneficia directamente a 18 pequeños campesinos'
    ],
    especificaciones: {
      'Presentación': 'Caja de 6 paquetes individuales (80g c/u)',
      'Origen': 'Turbo, Antioquia (Subregión Urabá)',
      'Registro Sanitario': 'INVIMA NSA-0012948-2022',
      'Vida útil': '180 días a temperatura ambiente'
    },
    ods: [8, 12, 15],
    stock: 45
  },
  {
    id: 'p2',
    nombre: 'Miel Orgánica de Bosque Húmedo (500g)',
    categoria: 'Alimentos & Agro',
    precio: 35000,
    precioAnterior: 38000,
    proveedor: 'Asociación de Apicultores de Mutatá',
    municipio: 'Mutatá, Urabá',
    calificacion: 5.0,
    reseñasCount: 98,
    imagen: 'https://images.unsplash.com/photo-1587049352851-8d4e89133924?w=800&auto=format&fit=crop&q=80',
    imagenes: [
      'https://images.unsplash.com/photo-1587049352851-8d4e89133924?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1471943311424-646960669fbc?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=800&auto=format&fit=crop&q=80'
    ],
    descripcion: 'Miel multifloral recolectada en reservas naturales de Urabá, sin aditivos ni azúcares añadidos.',
    descripcionDetallada: 'Cosechada a mano en colmenas apícolas situadas en el pie de monte de la Serranía del Abibe en Mutatá. Esta miel multifloral de bosque húmedo tropical destaca por su tono ámbar profundo, aroma floral autóctono y alta concentración de antioxidantes y enzimas naturales.',
    caracteristicas: [
      'Miel 100% cruda, no pasteurizada y filtrada en frío',
      'Cosecha sostenible que protege las abejas nativas sin aguijón',
      'Frasco de vidrio esterilizado con sellado térmico de garantía',
      'Fortalece el sistema inmunológico y es endulzante natural de bajo índice glucémico'
    ],
    especificaciones: {
      'Contenido Neto': '500g (Frasco de Vidrio Reciclable)',
      'Origen': 'Mutatá, Antioquia (Subregión Urabá)',
      'Registro Sanitario': 'INVIMA RSA-0004521-2021',
      'Cosecha': 'Bosque Húmedo Neotropical 2026'
    },
    ods: [13, 15],
    stock: 20
  },
  {
    id: 'p3',
    nombre: 'Bolso Artesanal Tejido en Caña Flecha y Palma',
    categoria: 'Artesanías & Moda',
    precio: 120000,
    precioAnterior: 140000,
    proveedor: 'Colectivo Artesanas de Necoclí',
    municipio: 'Necoclí, Urabá',
    calificacion: 4.8,
    reseñasCount: 76,
    imagen: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&auto=format&fit=crop&q=80',
    imagenes: [
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80'
    ],
    descripcion: 'Diseño exclusivo elaborado a mano por mujeres artesanas de la costa caribeña de Urabá. Resiste uso diario.',
    descripcionDetallada: 'Bolso estructurado de mano tejido hilo a hilo por maestras artesanas de la etnia Zenú y comunidades afrodescendientes de Necoclí. Emplea la tradicional trenza de caña flecha entrelazada con palma iraca teñida con tintes vegetales botánicos.',
    caracteristicas: [
      'Tejido ancestral hecho 100% a mano durante 14 días de trabajo',
      'Asas reforzadas con cuero ecológico vegetal',
      'Forro interno de lienzo con bolsillo interno con cremallera',
      'Pieza única e irrepetible con sello de origen artesanal'
    ],
    especificaciones: {
      'Dimensiones': '35cm (Alto) x 40cm (Ancho) x 12cm (Profundidad)',
      'Materiales': 'Caña Flecha, Palma Iraca y Cuero Vegetal',
      'Origen': 'Necoclí, Antioquia (Golfo de Urabá)',
      'Cuidados': 'Limpieza con paño seco y protección contra humedad extrema'
    },
    ods: [5, 8, 10],
    stock: 12
  },
  {
    id: 'p4',
    nombre: 'Café Especial Serranía del Abibe (Pack 450g)',
    categoria: 'Alimentos & Agro',
    precio: 42000,
    precioAnterior: 45000,
    proveedor: 'Café de Origen Chigorodó',
    municipio: 'Chigorodó, Urabá',
    calificacion: 4.9,
    reseñasCount: 164,
    imagen: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&auto=format&fit=crop&q=80',
    imagenes: [
      'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1610889556528-9a770e32642f?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80'
    ],
    descripcion: 'Granos arábicos cultivados a más de 1.400 msnm con notas a cacao, frutas silvestres y panela.',
    descripcionDetallada: 'Cultivado en las laderas orientales de la Serranía del Abibe en Chigorodó. Granos de varietales Castillo y Caturra beneficiados por vía húmeda con fermentación prolongada de 36 horas y tostión media artesanal que exalta sus notas dulces a melaza y frutos rojos.',
    caracteristicas: [
      'Café de alta montaña (Puntaje de Taza SCA: 86.5 puntos)',
      'Tostado semanalmente para garantizar máxima frescura aromática',
      'Empaque multilaminado con válvula desgasificadora unidireccional',
      'Cosecha por micro-lotes de agricultura de conservación'
    ],
    especificaciones: {
      'Presentación': 'Bolsa de 450g en Grano o Molido (Seleccionable)',
      'Tostión': 'Media (City Plus)',
      'Origen': 'Finca La Esperanza, Chigorodó (1.450 msnm)',
      'Certificación': 'Café de Colombia & Comercio Sostenible'
    },
    ods: [8, 12],
    stock: 30
  }
];

export const SERVICIOS = [
  {
    id: 's1',
    nombre: 'Consultoría en Certificación ODS y Sostenibilidad Empresarial',
    proveedor: 'Red Sostenible Urabá',
    categoria: 'Asesoría Empresarial',
    precioEstimado: 'Desde $1,500,000 COP',
    modalidad: 'Híbrida',
    municipio: 'Apartadó, Urabá',
    lat: 7.8829,
    lng: -76.6256,
    direccion: 'Calle 98 #102-15, Centro Empresarial Plaza, Apartadó, Antioquia',
    telefono: '+57 (604) 828-4500',
    whatsapp: '+573124567890',
    horario: 'Lunes a Viernes: 8:00 AM - 5:30 PM',
    calificacion: 4.9,
    imagen: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=80',
    imagenes: [
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&auto=format&fit=crop&q=80'
    ],
    descripcion: 'Acompañamiento a PYMES y grandes empresas en la medición de huella de carbono, reporte ODS e impacto social.',
    descripcionDetallada: 'Red Sostenible Urabá es una firma consultora especializada en guiar la transición ecológica e industrial de las organizaciones en Urabá. Ofrecemos auditorías energéticas, diseño de reportes GRI y alineación estratégica con los Objetivos de Desarrollo Sostenible (ODS).',
    serviciosOfrecidos: [
      'Medición y compensación de Huella de Carbono Corporativa',
      'Certificación en Estándares de Sostenibilidad ODS 8, 12, 13',
      'Auditoría y Gestión de Residuos Agroindustriales',
      'Formación ejecutiva en Gobierno Corporativo y ESG'
    ],
    metodosPago: 'Transferencia Bancaria, Nequi, Facturación Electrónica'
  },
  {
    id: 's2',
    nombre: 'Capacitación en Habilidades Digitales para Emprendedores',
    proveedor: 'Hub de Innovación Apartadó',
    categoria: 'Educación & TIC',
    precioEstimado: 'Gratuito (Subvencionado)',
    modalidad: 'Virtual / Presencial',
    municipio: 'Apartadó, Urabá',
    lat: 7.8860,
    lng: -76.6280,
    direccion: 'Cra 100 #95-30, Parque Tecnológico & Creativo, Apartadó, Antioquia',
    telefono: '+57 (604) 828-9000',
    whatsapp: '+573145678901',
    horario: 'Lunes a Sábado: 8:00 AM - 6:00 PM',
    calificacion: 4.8,
    imagen: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
    imagenes: [
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80'
    ],
    descripcion: 'Talleres prácticos de marketing digital, comercio electrónico y finanzas para microempresas de Urabá.',
    descripcionDetallada: 'Programa impulsado para acelerar la digitalización del ecosistema emprendedor de Urabá. Los participantes aprenden a configurar su tienda virtual, procesar pagos digitales, gestionar redes sociales y dominar herramientas de inteligencia artificial.',
    serviciosOfrecidos: [
      'Bootcamp de Comercio Electrónico y E-Commerce',
      'Taller de Marketing Digital y Redes Sociales',
      'Asesoría en Facturación Digital y Medios de Pago (Nequi/Daviplata)',
      'Mentores personalizados en estrategia de ventas online'
    ],
    metodosPago: '100% Gratuito mediante alianza PSP & Gobernación'
  },
  {
    id: 's3',
    nombre: 'Transporte de Carga Refrigerada & Logística Agroindustrial',
    proveedor: 'Logística de los Mares',
    categoria: 'Transporte & Carga',
    precioEstimado: 'Cotización por Tonelada',
    modalidad: 'Presencial',
    municipio: 'Turbo, Urabá',
    lat: 8.0926,
    lng: -76.7281,
    direccion: 'Sector Zona Portuaria Bahía Colombia, Turbo, Antioquia',
    telefono: '+57 (604) 827-3400',
    whatsapp: '+573186789012',
    horario: 'Atención 24/7 Operaciones Portuarias',
    calificacion: 5.0,
    imagen: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800&auto=format&fit=crop&q=80',
    imagenes: [
      'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=800&auto=format&fit=crop&q=80'
    ],
    descripcion: 'Servicio con flota monitoreada por GPS y control térmico estricto para frutas tropicales y productos perecederos.',
    descripcionDetallada: 'Líderes en logística de cadena de frío para el eje bananero y de exportación agrícola de Urabá. Flota moderna equipada con sensores termográficos IoT y rastreo en tiempo real.',
    serviciosOfrecidos: [
      'Transporte en furgones termoking de 5 a 24 toneladas',
      'Consolidación de carga seca y perecedera hacia el interior del país',
      'Agenciamiento de aduanas en Puerto Antioquia y Turbo',
      'Monitoreo satelital 24/7 con botón de pánico y póliza de carga'
    ],
    metodosPago: 'Transferencia Crédito 30 días, PSE, Tarjeta Corporativa'
  }
];

export const RESTAURANTES = [
  {
    id: 'r1',
    nombre: 'Restaurante Mar y Tierra - Sabor del Golfo',
    ubicación: 'Malecón Turístico, Turbo',
    municipio: 'Turbo, Urabá',
    lat: 8.0945,
    lng: -76.7320,
    direccion: 'Av. Malecón Turístico #12-40, Frente al Golfo, Turbo, Antioquia',
    telefono: '+57 (604) 827-1122',
    whatsapp: '+573112345678',
    especialidad: 'Cazuela de mariscos, Pescado frito con arroz de coco',
    rangoPrecio: '$$',
    calificacion: 4.9,
    horario: 'Lunes a Domingo: 11:00 AM - 10:00 PM',
    imagen: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80',
    imagenes: [
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&auto=format&fit=crop&q=80'
    ],
    descripcion: 'Ubicado frente al atardecer del Golfo de Urabá en el malecón de Turbo. Gastronomía marina auténtica con pesca del día.',
    descripcionDetallada: 'Mar y Tierra ofrece una experiencia gastronómica Caribe-Antioqueña inolvidable. Nuestros chefs locales preparan mariscos frescos traídos directamente por los pescadores artesanales de la bahía, acompañados de patacones de plátano verde y arroz con coco artesanal.',
    menuDestacado: [
      { nombre: 'Cazuela de Mariscos Golfo de Urabá', precio: 45000, descripcion: 'Camarones, langostinos y pesca del día con gratén de queso y crema de coco' },
      { nombre: 'Pargo Rojo Frito Artesanal', precio: 40000, descripcion: 'Servido con arroz de coco titoté, patacón gigante y ensalada de aguacate' },
      { nombre: 'Ceviche de Camarón a la Costeña', precio: 28000, descripcion: 'Camarones marinados en limón criollo, suero costeño y cebolla morada' }
    ],
    metodosPago: 'Efectivo, Nequi, Daviplata, Tarjetas Débito y Crédito'
  },
  {
    id: 'r2',
    nombre: 'Donde Checho - Asados & Tradición',
    ubicación: 'Zona Rosa, Apartadó',
    municipio: 'Apartadó, Urabá',
    lat: 7.8850,
    lng: -76.6240,
    direccion: 'Cra 102 #97-15, Zona Rosa, Apartadó, Antioquia',
    telefono: '+57 (604) 828-9988',
    whatsapp: '+573133456789',
    especialidad: 'Cortes finos, Sancocho de gallina criolla los domingos',
    rangoPrecio: '$$$',
    calificacion: 4.7,
    horario: 'Lunes a Domingo: 12:00 PM - 11:00 PM',
    imagen: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80',
    imagenes: [
      'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1558030006-450675393462?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=800&auto=format&fit=crop&q=80'
    ],
    descripcion: 'El restaurante pionero en cortes de carne madurada al carbón de leña y tradición culinaria antioqueña en Apartadó.',
    descripcionDetallada: 'Donde Checho combina la tradición de la parrilla madurada con la calidez del servicio de Urabá. Famoso por su sancocho trillado en leña de los domingos y sus platos familiares.',
    menuDestacado: [
      { nombre: 'Punta de Anca Madurada (400g)', precio: 48000, descripcion: 'Corte magro a la parrilla con chimichurri casero y papas criollas' },
      { nombre: 'Sancocho Trifásico Criollo', precio: 35000, descripcion: 'Servido en olla de barro con gallina, costilla de cerdo, plátano y yuca' },
      { nombre: 'Picada Mar y Tierra (Para 3 personas)', precio: 65000, descripcion: 'Carne de res, chicharrón crujiente, chorizo, patacones y suero' }
    ],
    metodosPago: 'Efectivo, Nequi, Daviplata, Tarjetas Débito y Crédito'
  }
];

export const TRANSPORTE_RUTAS = [
  {
    id: 't1',
    origen: 'Apartadó',
    destino: 'Turbo / Puerto Antioquia',
    empresa: 'Cootransuroeste',
    categoria: 'Transporte Intermunicipal',
    municipio: 'Apartadó - Turbo',
    lat: 7.8835,
    lng: -76.6265,
    direccion: 'Terminal de Transportes de Apartadó, Módulo 2, Taquilla 14',
    telefono: '+57 (604) 828-1010',
    whatsapp: '+573154567890',
    tiempoEstimado: '45 minutos',
    frecuencia: 'Cada 15 minutos',
    precio: 9000,
    horario: '4:30 AM - 9:00 PM (Diario)',
    calificacion: 4.8,
    imagen: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=80',
    imagenes: [
      'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800&auto=format&fit=crop&q=80'
    ],
    descripcion: 'Conexión continua en microbuses climatizados con WiFi y carga USB entre el centro urbano de Apartadó y la zona portuaria de Turbo.',
    descripcionDetallada: 'Ruta principal que conecta el corazón comercial de Apartadó con el puerto comercial en Turbo. Unidades modernas con aire acondicionado y conductores capacitados en seguridad vial.',
    metodosPago: 'Efectivo en Taquilla, Reserva Digital PSP, Nequi'
  },
  {
    id: 't2',
    origen: 'Apartadó',
    destino: 'Necoclí (Playas)',
    empresa: 'Sotraurabá',
    categoria: 'Transporte Turístico & Pasajeros',
    municipio: 'Apartadó - Necoclí',
    lat: 7.8835,
    lng: -76.6265,
    direccion: 'Terminal de Transportes de Apartadó, Taquilla 5',
    telefono: '+57 (604) 828-2020',
    whatsapp: '+573165678901',
    tiempoEstimado: '1 hora 15 min',
    frecuencia: 'Cada 30 minutos',
    precio: 18000,
    horario: '5:00 AM - 7:30 PM (Diario)',
    calificacion: 4.9,
    imagen: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800&auto=format&fit=crop&q=80',
    imagenes: [
      'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=80'
    ],
    descripcion: 'Ruta costera con paradas directas en las playas de Necoclí, hoteles y terminal marítimo para embarcaciones a Capurganá.',
    descripcionDetallada: 'Flota cómoda para viajeros y turistas que se dirigen al norte del golfo de Urabá. Equipados con portaequipajes amplio y aire acondicionado.',
    metodosPago: 'Efectivo en Taquilla, Nequi, Daviplata'
  },
  {
    id: 't3',
    origen: 'Medellín',
    destino: 'Apartadó (Eje Bananero)',
    empresa: 'Expreso Bolivariano / Sotramur',
    categoria: 'Transporte Interdepartamental',
    municipio: 'Medellín - Apartadó',
    lat: 7.8835,
    lng: -76.6265,
    direccion: 'Terminal del Norte Medellín / Terminal de Apartadó',
    telefono: '+57 (604) 828-3030',
    whatsapp: '+573176789012',
    tiempoEstimado: '6 horas',
    frecuencia: 'Salidas cada hora',
    precio: 85000,
    horario: '24 Horas con salidas nocturnas',
    calificacion: 4.9,
    imagen: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=80',
    imagenes: [
      'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=80'
    ],
    descripcion: 'Servicio preferencial de bus de dos pisos con pantallas individuales, reclinación 160°, WiFi y conector de energía.',
    descripcionDetallada: 'Conecta la capital antioqueña con la próspera región de Urabá a través de las nuevas autopistas de 4ta generación.',
    metodosPago: 'Efectivo, PSE, Tarjeta de Crédito, Nequi'
  }
];

export const TURISMO_DESTINOS = [
  {
    id: 'tu1',
    nombre: 'Playas de Necoclí y Ciénaga de la Marimonda',
    categoria: 'Ecoturismo & Sol',
    ubicacion: 'Necoclí, Golfo de Urabá',
    municipio: 'Necoclí, Urabá',
    lat: 8.4246,
    lng: -76.7865,
    direccion: 'Sector Playa El Almejal & Ciénaga de Marimonda, Necoclí, Antioquia',
    telefono: '+57 (604) 821-5050',
    whatsapp: '+573109876543',
    horario: 'Abierto todos los días: 7:00 AM - 6:00 PM',
    calificacion: 4.9,
    precio: 'Tours desde $85,000 COP',
    imagen: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
    imagenes: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&auto=format&fit=crop&q=80'
    ],
    descripcion: 'Disfruta del mar cálido del golfo, volcanes de lodo curativo y avistamiento de aves acuáticas en reservorio ecológico.',
    descripcionDetallada: 'Necoclí ofrece una combinación idílica de playas doradas, manglares vírgenes y la mágica Ciénaga de la Marimonda. Guías comunitarios locales te llevarán en recorridos en lancha ecológica.',
    itinerario: [
      { titulo: 'Recepción en Muelle de Necoclí', detalle: 'Bienvenida con jugo de fruta tropical y charla de conservación' },
      { titulo: 'Navegación por Ciénaga de Marimonda', detalle: 'Avistamiento de monos aulladores, garzas reales y flora endémica' },
      { titulo: 'Baño Curativo en Volcán de Lodo', detalle: 'Masaje de fango natural rico en minerales y baño de mar' },
      { titulo: 'Almuerzo Típico Caribeño', detalle: 'Pescado fresco, arroz de coco y patacón con limonada de panela' }
    ],
    metodosPago: 'Efectivo, Nequi, Daviplata'
  },
  {
    id: 'tu2',
    nombre: 'Reserva Natural Serranía del Abibe',
    categoria: 'Senderismo & Biodiversidad',
    ubicacion: 'Carepa - Chigorodó',
    municipio: 'Chigorodó, Urabá',
    lat: 7.6672,
    lng: -76.6806,
    direccion: 'Vereda La Sombra, Pie de Monte Serranía del Abibe, Chigorodó',
    telefono: '+57 (604) 825-7070',
    whatsapp: '+573208765432',
    horario: 'Tours guiados previa reserva: 6:00 AM - 4:00 PM',
    calificacion: 4.9,
    precio: 'Tours desde $60,000 COP',
    imagen: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&auto=format&fit=crop&q=80',
    imagenes: [
      'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&auto=format&fit=crop&q=80'
    ],
    descripcion: 'Caminatas guiadas por selva húmeda tropical con cascadas naturales y avistamiento de fauna autóctona.',
    descripcionDetallada: 'Un santuario de biodiversidad neotropical en los límites montañosos del Chocó biogeográfico. Asciende por senderos ecológicos hasta pozos cristalinos y cascadas de más de 20 metros de altura.',
    itinerario: [
      { titulo: 'Punto de Encuentro Chigorodó', detalle: 'Traslado 4x4 hasta la vereda La Sombra' },
      { titulo: 'Trek por Selva Húmeda Tropical', detalle: 'Caminata de 3.5 km con interpretación ambiental de flora medicinal' },
      { titulo: 'Baño de Cascada & Poza Azul', detalle: 'Tiempo libre para natación en aguas puras de montaña' },
      { titulo: 'Refrigerio de Frutas de Urabá & Café', detalle: 'Degustación de café orgánico y plátano horneado local' }
    ],
    metodosPago: 'Efectivo, Nequi, Daviplata'
  }
];

export const FORO_POSTS = [
  {
    id: 'post-1',
    autor: 'Ing. Carmen Rosa Valencia',
    cargo: 'Coordinadora de Proyectos Ambientales - Augura',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    titulo: '¿Cómo involucrar más a las PYMEs locales en la cadena de valor de Puerto Antioquia?',
    contenido: 'Con la próxima apertura de operaciones de Puerto Antioquia en Turbo, es indispensable fortalecer a los proveedores locales en normas ISO, transporte limpio y facturación electrónica. ¿Qué iniciativas podemos articular desde la Plataforma Social?',
    categoria: 'Desarrollo Regional',
    fecha: 'Hace 2 horas',
    likes: 34,
    likedBy: ['usr-05', 'usr-08'],
    comentariosCount: 3,
    etiquetas: ['PuertoAntioquia', 'Logistica', 'UrabáEmprende'],
    comentarios: [
      {
        id: 'c-101',
        autor: 'Carlos Eduardo Ramírez',
        cargo: 'Asesor PyME - Cámara de Comercio',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        fecha: 'Hace 1 hora',
        contenido: 'Podríamos organizar mesas de trabajo mensuales para certificar a los transportadores locales de carga pesada.',
        imagenUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=500&auto=format&fit=crop&q=80',
        likes: 5,
        likedBy: [],
        respuestas: [
          {
            id: 'r-101-1',
            autor: 'Ing. Carmen Rosa Valencia',
            cargo: 'Coordinadora de Proyectos Ambientales - Augura',
            avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
            fecha: 'Hace 45 min',
            contenido: '¡Excelente idea Carlos! Desde Augura podemos apoyar con los consultores ambientales.',
            likes: 3,
            likedBy: []
          }
        ]
      },
      {
        id: 'c-102',
        autor: 'Mariana Ospina',
        cargo: 'Directora de Logística Urabá',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        fecha: 'Hace 30 min',
        contenido: 'También es clave capacitar en plataformas digitales de facturación electrónica y seguimiento en tiempo real.',
        likes: 4,
        likedBy: [],
        respuestas: []
      }
    ]
  },
  {
    id: 'post-2',
    autor: 'Julián Esteban Murillo',
    cargo: 'Líder Juvenil & Emprendedor Tecnológico',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    titulo: 'Convocatoria abierta: Hackathon de Soluciones Agro-sostenibles para Urabá',
    contenido: 'Organizamos junto al SENA y Fundauniban un encuentro de desarrolladores y creativos para diseñar soluciones de monitoreo hídrico y comercialización sin intermediarios. ¡Inscripciones abiertas!',
    categoria: 'Innovación & TIC',
    fecha: 'Hace 5 horas',
    likes: 58,
    likedBy: [],
    comentariosCount: 1,
    etiquetas: ['Hackathon', 'SENA', 'Sostenibilidad'],
    comentarios: [
      {
        id: 'c-201',
        autor: 'David Restrepo',
        cargo: 'Instructor SENA Apartadó',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
        fecha: 'Hace 3 horas',
        contenido: 'Contamos con los laboratorios de prototipado rápido en la sede Apartadó listos para recibir a los equipos.',
        imagenUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=500&auto=format&fit=crop&q=80',
        likes: 8,
        likedBy: [],
        respuestas: []
      }
    ]
  }
];


export const METRICAS_IMPACTO = [
  { label: 'Organizaciones Aliadas', valor: '120+', icono: 'Building2' },
  { label: 'Empleos Impulsados', valor: '4,500+', icono: 'Users' },
  { label: 'Municipios en Urabá', valor: '11 Municipios', icono: 'MapPin' },
  { label: 'Proyectos ODS Activos', valor: '38 Proyectos', icono: 'Target' },
];

export const LUGARES_MAPA = [
  {
    id: 'm1',
    nombre: 'Playa Dulce',
    municipio: 'Turbo, Antioquia',
    categoria: 'Playa',
    tipo: 'playa',
    lat: 8.0945,
    lng: -76.7320,
    descripcion: 'Playa en el litoral de Turbo, Golfo de Urabá. Zona costera ideal para disfrutar del mar y la gastronomía marina.',
    calificacion: 4.5,
    resenas: 312,
    etiquetas: ['playa', 'mar', 'costa', 'turbo'],
    imagen: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&auto=format&fit=crop&q=80',
    googleMapsUrl: 'https://maps.google.com/?q=Playa+Dulce+Turbo'
  },
  {
    id: 'm2',
    nombre: 'Éxito Turbo',
    municipio: 'Turbo, Antioquia',
    categoria: 'Lugar / Comercio',
    tipo: 'comercio',
    lat: 8.0968,
    lng: -76.7260,
    descripcion: 'Centro comercial e hipermercado con amplia variedad de insumos, alimentos y servicios bancarios en el casco urbano.',
    calificacion: 4.3,
    resenas: 185,
    etiquetas: ['comercio', 'supermercado', 'compras'],
    imagen: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=500&auto=format&fit=crop&q=80',
    googleMapsUrl: 'https://maps.google.com/?q=Exito+Turbo'
  },
  {
    id: 'm3',
    nombre: 'Parque La Bombilla',
    municipio: 'Turbo, Antioquia',
    categoria: 'Parque',
    tipo: 'parque',
    lat: 8.0920,
    lng: -76.7230,
    descripcion: 'Parque recreativo comunal y punto de encuentro cultural e integrador en la zona urbana de Turbo.',
    calificacion: 4.4,
    resenas: 98,
    etiquetas: ['parque', 'recreacion', 'comunidad'],
    imagen: 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?w=500&auto=format&fit=crop&q=80',
    googleMapsUrl: 'https://maps.google.com/?q=Parque+La+Bombilla+Turbo'
  },
  {
    id: 'm4',
    nombre: 'Puerto Antioquia S.A.',
    municipio: 'Bahía Colombia, Turbo',
    categoria: 'Puerto / Logística',
    tipo: 'puerto',
    lat: 8.0250,
    lng: -76.7450,
    descripcion: 'Terminal marítima multipropósito que transforma el comercio exterior de Colombia y genera desarrollo en Urabá.',
    calificacion: 4.9,
    resenas: 540,
    etiquetas: ['puerto', 'logistica', 'exportacion'],
    imagen: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=500&auto=format&fit=crop&q=80',
    googleMapsUrl: 'https://maps.google.com/?q=Puerto+Antioquia'
  },
  {
    id: 'm5',
    nombre: 'Playas y Volcanes de Necoclí',
    municipio: 'Necoclí, Antioquia',
    categoria: 'Playa & Ecoturismo',
    tipo: 'playa',
    lat: 8.4230,
    lng: -76.7860,
    descripcion: 'Playas cristalinas en el norte de Urabá con volcanes de lodo curativo y oferta gastronómica afrocolombiana.',
    calificacion: 4.8,
    resenas: 420,
    etiquetas: ['playa', 'necocli', 'volcan', 'turismo'],
    imagen: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&auto=format&fit=crop&q=80',
    googleMapsUrl: 'https://maps.google.com/?q=Necocli+Antioquia'
  },
  {
    id: 'm6',
    nombre: 'Parque Principal de Apartadó',
    municipio: 'Apartadó, Antioquia',
    categoria: 'Lugar / Comercio',
    tipo: 'comercio',
    lat: 7.8840,
    lng: -76.6270,
    descripcion: 'Plaza central de Apartadó, epicentro bancario, gastronómico y comercial del Eje Bananero.',
    calificacion: 4.6,
    resenas: 230,
    etiquetas: ['apartado', 'parque', 'comercio'],
    imagen: 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?w=500&auto=format&fit=crop&q=80',
    googleMapsUrl: 'https://maps.google.com/?q=Parque+Principal+Apartado'
  },
  {
    id: 'm7',
    nombre: 'Reserva Serranía del Abibe',
    municipio: 'Carepa - Chigorodó, Urabá',
    categoria: 'Naturaleza & Senderismo',
    tipo: 'naturaleza',
    lat: 7.7800,
    lng: -76.5500,
    descripcion: 'Reserva biológica de bosque húmedo tropical con avistamiento de fauna silvestre y cascadas de montaña.',
    calificacion: 4.9,
    resenas: 160,
    etiquetas: ['reserva', 'naturaleza', 'senderismo'],
    imagen: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=500&auto=format&fit=crop&q=80',
    googleMapsUrl: 'https://maps.google.com/?q=Serrania+del+Abibe'
  }
];

export const ENTIDADES_AFILIADAS = [
  { id: 'ea-corplex', nombre: 'Corplex Solutions S.A.S.', categoria: 'Tecnología & Comercio', sector: 'Automatización & Software (Desarrollador Oficial)', sigla: 'CS', color: 'from-cyan-500 to-blue-700', logo: '/aliados/corplex.png', sitioWeb: 'https://www.corplexsolutions.co/', descripcion: 'Empresa especializada en ingeniería de software, automatización de procesos y firma desarrolladora oficial de la Plataforma Social con Propósito.' },
  { id: 'ea-3', nombre: 'American Dream English', categoria: 'Educación & Cultura', sector: 'Bilingüismo y Formación en Idiomas', sigla: 'ADE', color: 'from-red-500 to-blue-700', logo: '/aliados/ea-3.png', sitioWeb: 'https://www.americandreamenglish.com/', descripcion: 'Academia especializada en la enseñanza del idioma inglés para niños, jóvenes y profesionales.' },
  { id: 'ea-1', nombre: 'Ecosistemas Urabá', categoria: 'Educación & Cultura', sector: 'Educación para el Trabajo y Desarrollo Humano', sigla: 'ECO', color: 'from-blue-600 to-teal-600', logo: '/aliados/ea-1.png', sitioWeb: 'https://www.facebook.com/ecosistemas.uraba/?locale=es_LA', ubicacion: 'Turbo (Sede Ppal.), Nueva Colonia, Necoclí', descripcion: 'Institución líder en Urabá en educación para el trabajo y desarrollo humano, ofreciendo formación técnica e integral en Turbo, Nueva Colonia y Necoclí.' },
  { id: 'ea-2', nombre: 'Jóvenes+ Organización', categoria: 'Fundaciones & Juventud', sector: 'Liderazgo Juvenil y Transformación Social', sigla: 'J+', color: 'from-blue-500 to-indigo-600', logo: '/aliados/jovenes-mas/logo.png', rutaInterna: '/aliados/jovenes-mas', sitioWeb: '/aliados/jovenes-mas', descripcion: 'Plataforma para el fortalecimiento del liderazgo y proyectos juveniles en la subregión.' },
  { id: 'ea-4', nombre: 'Órganos Acciones Campesinas Urabá', categoria: 'Agro & Campo', sector: 'Desarrollo Agrícola y Comunitario', sigla: 'OACU', color: 'from-green-600 to-emerald-800', logo: '/aliados/ea-4.png', descripcion: 'Asociación orientada al fortalecimiento agropecuario de los pequeños campesinos.' },
  { id: 'ea-5', nombre: 'Pisisí S.A.', categoria: 'Tecnología & Comercio', sector: 'Desarrollo Marítimo e Industrial', sigla: 'PIS', color: 'from-cyan-600 to-blue-800', logo: '/aliados/ea-5.png', descripcion: 'Impulso al desarrollo portuario y proyectos logísticos de gran escala en Turbo.' },
  { id: 'ea-6', nombre: 'Alma de Fénix Fundación', categoria: 'Fundaciones & Juventud', sector: 'Resiliencia Social y Apoyo Comunitario', sigla: 'FAF', color: 'from-amber-500 to-orange-600', logo: '/aliados/ea-6.png', descripcion: 'Organización dedicada a la recuperación socioafectiva y proyectos productivos de resiliencia.' },
  { id: 'ea-7', nombre: 'Sercaynco', categoria: 'Tecnología & Comercio', sector: 'Servicios Logísticos y Construcción', sigla: 'SYC', color: 'from-slate-600 to-slate-800', logo: '/aliados/ea-7.png', descripcion: 'Prestación de servicios de ingeniería, infraestructura y apoyo a obras civiles.' },
  { id: 'ea-8', nombre: 'Ágora Co-working', categoria: 'Tecnología & Comercio', sector: 'Espacios Colaborativos y Emprendimiento', sigla: 'AGO', color: 'from-purple-500 to-indigo-600', logo: '/aliados/ea-8.png', descripcion: 'Espacio moderno de trabajo colaborativo e incubación de startups en Urabá.' },
  { id: 'ea-9', nombre: 'BP (Bienestar & Promoción)', categoria: 'Salud & Bienestar', sector: 'Salud Ocupacional y Gestión Humana', sigla: 'BP', color: 'from-teal-500 to-cyan-700', logo: '/aliados/ea-9.png', descripcion: 'Servicios integrales en seguridad, salud en el trabajo y medicina preventiva.' },
  { id: 'ea-10', nombre: 'D&D Delivery & Distribution', categoria: 'Tecnología & Comercio', sector: 'Mensajería y Logística Urbana', sigla: 'D&D', color: 'from-amber-600 to-red-600', logo: '/aliados/ea-10.png', descripcion: 'Red de envíos rápidos y entrega de productos para comercios e e-commerce en Urabá.' },
  { id: 'ea-11', nombre: 'Fundación Casa de Reposo Renacer', categoria: 'Fundaciones & Juventud', sector: 'Atención Integral al Adulto Mayor', sigla: 'FCRR', color: 'from-pink-500 to-rose-600', logo: '/aliados/ea-11.png', descripcion: 'Atención humanizada, alojamiento y apoyo integral a la población de la tercera edad.' },
  { id: 'ea-12', nombre: 'Juventud con Propósito', categoria: 'Fundaciones & Juventud', sector: 'Empoderamiento y Voluntariado Juvenil', sigla: 'JCP', color: 'from-violet-500 to-purple-700', logo: '/aliados/ea-12.png', descripcion: 'Organización comisionada al empoderamiento, valores y oportunidades para la juventud.' },
  { id: 'ea-13', nombre: 'Leidy Marulanda Technology', categoria: 'Tecnología & Comercio', sector: 'Venta de Celulares & Dispositivos Móviles', sigla: 'LMT', color: 'from-blue-600 to-cyan-600', logo: '/aliados/ea-13.png', sitioWeb: 'https://www.facebook.com/leidy.marulanda.7731', ubicacion: 'Turbo, Antioquia (Antigua Olímpica y Pirámides de la Moda)', descripcion: 'Comercio líder en Turbo especializado en venta de teléfonos inteligentes iPhone nuevos y semi-nuevos, equipos móviles y accesorios con envíos a nivel nacional.' },
  { id: 'ea-14', nombre: 'Colonia Stereo 103.5 FM', categoria: 'Educación & Cultura', sector: 'Medios de Comunicación y Radio Comunitaria', sigla: 'CS', color: 'from-orange-500 to-amber-600', logo: '/aliados/ea-14.png', descripcion: 'Emisora radial comunitaria que promueve la cultura, noticias e integración regional.' },
  { id: 'ea-15', nombre: 'CEPRODENT', categoria: 'Salud & Bienestar', sector: 'Salud Oral y Odontología Especializada', sigla: 'CPD', color: 'from-sky-500 to-blue-600', logo: '/aliados/ea-15.png', descripcion: 'Centro odontológico especializado en diseño de sonrisa, implantes y prevención.' },
  { id: 'ea-16', nombre: 'Orthomedic Sonrisas', categoria: 'Salud & Bienestar', sector: 'Ortodoncia y Estética Dental', sigla: 'OMS', color: 'from-teal-400 to-emerald-600', logo: '/aliados/ea-16.png', descripcion: 'Clínica dental enfocada en ortodoncia avanzada y estética dental integral.' },
  { id: 'ea-17', nombre: 'Lizcano Fotografía', categoria: 'Educación & Cultura', sector: 'Producción Audiovisual y Arte Fotográfico', sigla: 'LF', color: 'from-zinc-700 to-black', logo: '/aliados/ea-17.png', descripcion: 'Estudio de fotografía profesional, cobertura de eventos y contenidos audiovisuales.' },
  { id: 'ea-18', nombre: 'S.DC Servicios Digitales', categoria: 'Tecnología & Comercio', sector: 'Marketing Digital y Soluciones Web', sigla: 'SDC', color: 'from-indigo-600 to-blue-800', logo: '/aliados/ea-18.png', descripcion: 'Agencia creativa de marketing digital, posicionamiento de marcas y gestión de redes.' },
  { id: 'ea-19', nombre: 'Maar Travel', categoria: 'Tecnología & Comercio', sector: 'Turismo, Agencias de Viaje y Experiencias', sigla: 'MT', color: 'from-cyan-500 to-teal-600', logo: '/aliados/ea-19.png', descripcion: 'Agencia de viajes dedicada a promocionar el ecoturismo y destinos en Urabá y Colombia.' },
  { id: 'ea-20', nombre: 'LV Centro de Negocios', categoria: 'Tecnología & Comercio', sector: 'Oficinas Virtuales y Asesoría Legal/Contable', sigla: 'LV', color: 'from-emerald-700 to-teal-900', logo: '/aliados/ea-20.png', descripcion: 'Centro de servicios empresariales, alquiler de oficinas y consultoría corporativa.' },
  { id: 'ea-21', nombre: 'Mahoz Consultoría SST', categoria: 'Salud & Bienestar', sector: 'Seguridad y Salud en el Trabajo', sigla: 'SST', color: 'from-orange-600 to-yellow-600', logo: '/aliados/ea-21.png', descripcion: 'Consultora en implementación de SG-SST y normatividad laboral para pymes.' },
  { id: 'ea-22', nombre: 'CDBC Caribe', categoria: 'Fundaciones & Juventud', sector: 'Centro de Desarrollo Base Comunitaria', sigla: 'CDBC', color: 'from-blue-600 to-cyan-700', logo: '/aliados/ea-22.png', descripcion: 'Impulso al bienestar comunitario y fortalecimiento de las organizaciones locales del Caribe.' },
  { id: 'ea-23', nombre: 'Emikayu', categoria: 'Agro & Campo', sector: 'Productos Artesanales y Agroecológicos', sigla: 'EMI', color: 'from-amber-600 to-emerald-700', logo: '/aliados/ea-23.png', descripcion: 'Emprendimiento dedicado a la transformación agroecológica de materias primas locales.' },
  { id: 'ea-24', nombre: 'Juan de Noriega', categoria: 'Agro & Campo', sector: 'Tradición Gastronómica y Productos del Campo', sigla: 'JDN', color: 'from-yellow-700 to-amber-900', logo: '/aliados/ea-24.png', descripcion: 'Promoción del patrimonio gastronómico ancestral y apoyo a productores rurales.' },
  { id: 'ea-25', nombre: 'Movimiento Nacional Cimarrón', categoria: 'Educación & Cultura', sector: 'Derechos Humanos y Cultura Afrocolombiana', sigla: 'MNC', color: 'from-red-600 to-amber-700', logo: '/aliados/ea-25.png', descripcion: 'Organización social impulsora de la identidad, derechos e inclusión de la comunidad afro.' },
  { id: 'ea-26', nombre: 'Corporación Niñez Diversa', categoria: 'Fundaciones & Juventud', sector: 'Protección Infantil e Inclusión Social', sigla: 'CND', color: 'from-purple-500 to-pink-500', logo: '/aliados/ea-26.png', descripcion: 'Iniciativa enfocada en los derechos de la niñez, educación inclusiva y ludotecas.' },
  { id: 'ea-27', nombre: 'ASOCAFE Urabá', categoria: 'Agro & Campo', sector: 'Asociación de Caficultores y Calidad de Origen', sigla: 'ACF', color: 'from-amber-800 to-yellow-900', logo: '/aliados/ea-27.png', descripcion: 'Gremio de caficultores de las serranías de Urabá enfocado en café de alta calidad.' },
  { id: 'ea-28', nombre: 'Thalmor Fonoaudiológico', categoria: 'Salud & Bienestar', sector: 'Terapia del Lenguaje y Audio-Fonoaudiología', sigla: 'TF', color: 'from-blue-400 to-indigo-600', logo: '/aliados/ea-28.png', descripcion: 'Atención especializada en aprendizaje, foniatría y rehabilitación del habla.' },
  { id: 'ea-29', nombre: 'Urabá Darién F.C.', categoria: 'Educación & Cultura', sector: 'Deporte, Formación de Talentos y Fútbol', sigla: 'UDFC', color: 'from-emerald-600 to-blue-700', logo: '/aliados/ea-29.png', descripcion: 'Club deportivo enfocado en el desarrollo de jóvenes talentos del fútbol regional.' },
  { id: 'ea-30', nombre: 'Aura Moda & Arte', categoria: 'Tecnología & Comercio', sector: 'Confección Textil y Diseño de Moda local', sigla: 'AUR', color: 'from-rose-500 to-purple-600', logo: '/aliados/ea-30.png', descripcion: 'Taller de diseño de modas y prendas exclusivas producidas por talento local.' },
  { id: 'ea-31', nombre: 'El Rincón de los Sueños', categoria: 'Educación & Cultura', sector: 'Espacio Cultural y Literatura Infantil', sigla: 'ERS', color: 'from-indigo-500 to-purple-600', logo: '/aliados/ea-31.png', descripcion: 'Biblioteca y centro cultural enfocado en fomentar la lectura en familias y niños.' },
  { id: 'ea-32', nombre: 'Fundación Formando Generación Victoriosa', categoria: 'Fundaciones & Juventud', sector: 'Educación en Valores y Proyección Social', sigla: 'FGV', color: 'from-blue-600 to-emerald-600', logo: '/aliados/ea-32.png', descripcion: 'Formación espiritual, ética y técnica de niños y adolescentes en condición vulnerada.' },
  { id: 'ea-33', nombre: 'Almacén y Taller Agroindustrial El Manco', categoria: 'Agro & Campo', sector: 'Maquinaria, Repuestos y Soporte Agrícola', sigla: 'ELM', color: 'from-orange-700 to-red-800', logo: '/aliados/ea-33.png', descripcion: 'Suministro de repuestos, mantenimiento de maquinaria agrícola e insumos de taller.' },
  { id: 'ea-34', nombre: 'Cuida tu Templo', categoria: 'Salud & Bienestar', sector: 'Bienestar Físico, Nutrición y Vida Saludable', sigla: 'CTT', color: 'from-teal-500 to-emerald-600', logo: '/aliados/ea-34.png', descripcion: 'Centro de asesoría nutricional, entrenamiento integral y acondicionamiento de salud.' }
];
