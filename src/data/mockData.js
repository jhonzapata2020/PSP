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
    calificacion: 4.9,
    imagen: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=500&auto=format&fit=crop&q=80',
    descripcion: 'Chips artesanalmente elaborados con plátano de Urabá 100% natural, sazonados con sal marina y ajo de origen sostenible.',
    stock: 45
  },
  {
    id: 'p2',
    nombre: 'Miel Orgánica de Bosque Húmedo (500g)',
    categoria: 'Alimentos & Agro',
    precio: 35000,
    precioAnterior: 38000,
    proveedor: 'Asociación de Apicultores de Mutatá',
    calificacion: 5.0,
    imagen: 'https://images.unsplash.com/photo-1587049352851-8d4e89133924?w=500&auto=format&fit=crop&q=80',
    descripcion: 'Miel multifloral recolectada en reservas naturales de Urabá, sin aditivos ni azúcares añadidos.',
    stock: 20
  },
  {
    id: 'p3',
    nombre: 'Bolso Artesanal Tejido en Caña Flecha y Palma',
    categoria: 'Artesanías & Moda',
    precio: 120000,
    precioAnterior: 140000,
    proveedor: 'Colectivo Artesanas de Necoclí',
    calificacion: 4.8,
    imagen: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=500&auto=format&fit=crop&q=80',
    descripcion: 'Diseño exclusivo elaborado a mano por mujeres artesanas de la costa caribeña de Urabá. Resiste uso diario.',
    stock: 12
  },
  {
    id: 'p4',
    nombre: 'Café Especial Serranía del Abibe (Pack 450g)',
    categoria: 'Alimentos & Agro',
    precio: 42000,
    precioAnterior: 45000,
    proveedor: 'Café de Origen Chigorodó',
    calificacion: 4.9,
    imagen: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500&auto=format&fit=crop&q=80',
    descripcion: 'Granos arábicos cultivados a más de 1.400 msnm con notas a cacao, frutas silvestres y panela.',
    stock: 30
  }
];

export const SERVICIOS = [
  {
    id: 's1',
    nombre: 'Consultoría en Certificación ODS y Sostenibilidad empresarial',
    proveedor: 'Red Sostenible Urabá',
    categoria: 'Asesoría Empresarial',
    precioEstimado: 'Desde $1,500,000 COP',
    modalidad: 'Híbrida',
    imagen: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=500&auto=format&fit=crop&q=80',
    descripcion: 'Acompañamiento a PYMES y grandes empresas en la medición de huella de carbono, reporte ODS e impacto social.'
  },
  {
    id: 's2',
    nombre: 'Capacitación en Habilidades Digitales para Emprendedores',
    proveedor: 'Hub de Innovación Apartadó',
    categoria: 'Educación & TIC',
    precioEstimado: 'Gratuito (Subvencionado)',
    modalidad: 'Virtual / Presencial',
    imagen: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&auto=format&fit=crop&q=80',
    descripcion: 'Talleres prácticos de marketing digital, comercio electrónico y finanzas para microempresas de Urabá.'
  },
  {
    id: 's3',
    nombre: 'Transporte de Carga Refrigerada & Logística Agroindustrial',
    proveedor: 'Logística de los Mares',
    categoria: 'Transporte & Carga',
    precioEstimado: 'Cotización por Tonelada',
    modalidad: 'Presencial',
    imagen: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=500&auto=format&fit=crop&q=80',
    descripcion: 'Servicio con flota monitoreada por GPS y control térmico estricto para frutas tropicales y productos perecederos.'
  }
];

export const RESTAURANTES = [
  {
    id: 'r1',
    nombre: 'Restaurante Mar y Tierra - Sabor del Golfo',
    ubicación: 'Malecón Turístico, Turbo',
    especialidad: 'Cazuela de mariscos, Pescado frito con arroz de coco',
    rangoPrecio: '$$',
    calificacion: 4.9,
    horario: '11:00 AM - 10:00 PM',
    imagen: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'r2',
    nombre: 'Donde Checho - Asados & Tradición',
    ubicación: 'Zona Rosa, Apartadó',
    especialidad: 'Cortes finos, Sancocho de gallina criolla los domingos',
    rangoPrecio: '$$$',
    calificacion: 4.7,
    horario: '12:00 PM - 11:00 PM',
    imagen: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=80'
  }
];

export const TRANSPORTE_RUTAS = [
  {
    id: 't1',
    origen: 'Apartadó',
    destino: 'Turbo / Puerto Antioquia',
    tiempoEstimado: '45 minutos',
    frecuencia: 'Cada 15 min',
    precio: 9000,
    empresa: 'Cootransuroeste'
  },
  {
    id: 't2',
    origen: 'Apartadó',
    destino: 'Necoclí (Playas)',
    tiempoEstimado: '1 hora 15 min',
    frecuencia: 'Cada 30 min',
    precio: 18000,
    empresa: 'Sotraurabá'
  },
  {
    id: 't3',
    origen: 'Medellín',
    destino: 'Apartadó (Eje Bananero)',
    tiempoEstimado: '6 horas',
    frecuencia: 'Salidas diarias',
    precio: 85000,
    empresa: 'Expreso Bolivariano / Sotramur'
  }
];

export const TURISMO_DESTINOS = [
  {
    id: 'tu1',
    nombre: 'Playas de Necoclí y Ciénaga de la Marimonda',
    categoria: 'Ecoturismo & Sol',
    ubicacion: 'Necoclí, Golfo de Urabá',
    descripcion: 'Disfruta del mar cálido, volcanes de lodo curativo y avistamiento de aves acuáticas en reservorio ecológico.',
    precio: 'Tours desde $85,000 COP',
    imagen: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'tu2',
    nombre: 'Reserva Natural Serranía del Abibe',
    categoria: 'Senderismo & Biodiversidad',
    ubicacion: 'Carepa - Chigorodó',
    descripcion: 'Caminatas guiadas por selva húmeda tropical con cascadas naturales y avistamiento de fauna autóctona.',
    precio: 'Tours desde $60,000 COP',
    imagen: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=500&auto=format&fit=crop&q=80'
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
    comentariosCount: 12,
    etiquetas: ['PuertoAntioquia', 'Logistica', 'UrabáEmprende']
  },
  {
    id: 'post-2',
    autor: 'Julián Esteban Murillo',
    cargo: 'Líder Juvenil & Emprendedor Tecnológico',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    titulo: 'Convocatoria abierta: Hackathon de Soluciones Agro-sostenibles para Urabá',
    contenido: 'Organizamos junto al SENA y Fundauniban un encuentro de desarrolladores y creativos para diseñar soluciones de monitoreo hídrico y comercialización sin intermediarios. ¡Inscripciones abiertas!',
    categoria: 'Innovación & TIC',
    fecha: 'Hace 5 horas',
    likes: 58,
    comentariosCount: 19,
    etiquetas: ['Hackathon', 'SENA', 'Sostenibilidad']
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
  { id: 'ea-1', nombre: 'Ecosistemas Urabá', categoria: 'Educación & Cultura', sector: 'Educación para el Trabajo y Desarrollo Humano', sigla: 'ECO', color: 'from-blue-600 to-teal-600', logo: '/aliados/ea-1.png', ubicacion: 'Turbo (Sede Ppal.), Nueva Colonia, Necoclí', descripcion: 'Institución líder en Urabá en educación para el trabajo y desarrollo humano, ofreciendo formación técnica e integral en Turbo, Nueva Colonia y Necoclí.' },
  { id: 'ea-2', nombre: 'Jóvenes+ Organización', categoria: 'Fundaciones & Juventud', sector: 'Liderazgo Juvenil y Transformación Social', sigla: 'J+', color: 'from-blue-500 to-indigo-600', logo: '/aliados/ea-2.png', descripcion: 'Plataforma para el fortalecimiento del liderazgo y proyectos juveniles en la subregión.' },
  { id: 'ea-4', nombre: 'Órganos Acciones Campesinas Urabá', categoria: 'Agro & Campo', sector: 'Desarrollo Agrícola y Comunitario', sigla: 'OACU', color: 'from-green-600 to-emerald-800', logo: '/aliados/ea-4.png', descripcion: 'Asociación orientada al fortalecimiento agropecuario de los pequeños campesinos.' },
  { id: 'ea-5', nombre: 'Pisisí S.A.', categoria: 'Tecnología & Comercio', sector: 'Desarrollo Marítimo e Industrial', sigla: 'PIS', color: 'from-cyan-600 to-blue-800', logo: '/aliados/ea-5.png', descripcion: 'Impulso al desarrollo portuario y proyectos logísticos de gran escala en Turbo.' },
  { id: 'ea-6', nombre: 'Alma de Fénix Fundación', categoria: 'Fundaciones & Juventud', sector: 'Resiliencia Social y Apoyo Comunitario', sigla: 'FAF', color: 'from-amber-500 to-orange-600', logo: '/aliados/ea-6.png', descripcion: 'Organización dedicada a la recuperación socioafectiva y proyectos productivos de resiliencia.' },
  { id: 'ea-7', nombre: 'Sercaynco', categoria: 'Tecnología & Comercio', sector: 'Servicios Logísticos y Construcción', sigla: 'SYC', color: 'from-slate-600 to-slate-800', logo: '/aliados/ea-7.png', descripcion: 'Prestación de servicios de ingeniería, infraestructura y apoyo a obras civiles.' },
  { id: 'ea-8', nombre: 'Ágora Co-working', categoria: 'Tecnología & Comercio', sector: 'Espacios Colaborativos y Emprendimiento', sigla: 'AGO', color: 'from-purple-500 to-indigo-600', logo: '/aliados/ea-8.png', descripcion: 'Espacio moderno de trabajo colaborativo e incubación de startups en Urabá.' },
  { id: 'ea-9', nombre: 'BP (Bienestar & Promoción)', categoria: 'Salud & Bienestar', sector: 'Salud Ocupacional y Gestión Humana', sigla: 'BP', color: 'from-teal-500 to-cyan-700', logo: '/aliados/ea-9.png', descripcion: 'Servicios integrales en seguridad, salud en el trabajo y medicina preventiva.' },
  { id: 'ea-10', nombre: 'D&D Delivery & Distribution', categoria: 'Tecnología & Comercio', sector: 'Mensajería y Logística Urbana', sigla: 'D&D', color: 'from-amber-600 to-red-600', logo: '/aliados/ea-10.png', descripcion: 'Red de envíos rápidos y entrega de productos para comercios e e-commerce en Urabá.' },
  { id: 'ea-11', nombre: 'Fundación Casa de Reposo Renacer', categoria: 'Fundaciones & Juventud', sector: 'Atención Integral al Adulto Mayor', sigla: 'FCRR', color: 'from-pink-500 to-rose-600', logo: '/aliados/ea-11.png', descripcion: 'Atención humanizada, alojamiento y apoyo integral a la población de la tercera edad.' },
  { id: 'ea-12', nombre: 'Juventud con Propósito', categoria: 'Fundaciones & Juventud', sector: 'Empoderamiento y Voluntariado Juvenil', sigla: 'JCP', color: 'from-violet-500 to-purple-700', logo: '/aliados/ea-12.png', descripcion: 'Organización comisionada al empoderamiento, valores y oportunidades para la juventud.' },
  { id: 'ea-13', nombre: 'Leidy Marulanda Technology', categoria: 'Tecnología & Comercio', sector: 'Desarrollo de Software y Consultoría TIC', sigla: 'LMT', color: 'from-blue-600 to-cyan-600', logo: '/aliados/ea-13.png', descripcion: 'Soluciones tecnológicas a medida, desarrollo web y transformación digital corporativa.' },
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
