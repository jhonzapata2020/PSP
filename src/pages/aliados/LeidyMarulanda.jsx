import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Search,
  Heart,
  ShoppingBag,
  User,
  CheckCircle2,
  Lock,
  Maximize2,
  X,
  ShieldCheck,
  CreditCard
} from 'lucide-react';
import MockPaymentModal from '../../components/comercio/MockPaymentModal';
import ordersApi from '../../services/ordersApi';
import { getToken } from '../../services/api';

const PLATFORM_FEE_RATE = 0.02; // 2% para la plataforma PSP

const FEATURED_CATEGORIES = [
  {
    id: 'cat-iphones',
    label: 'TIENDA OFICIAL',
    title: 'iPhones & Mac',
    filter: 'iPhones & Mac',
    image: '/aliados/leidy-marulanda/ramo-bouquet-iphone-cases.jpg'
  },
  {
    id: 'cat-android',
    label: 'NUEVOS EQUIPOS',
    title: 'Samsung & iPads',
    filter: 'Android & Tablets',
    image: '/aliados/leidy-marulanda/samsung-galaxy-a17-5g.png'
  },
  {
    id: 'cat-audio',
    label: 'SONIDO & CARGA',
    title: 'AirPods & USB-C',
    filter: 'Audio & Carga',
    image: '/aliados/leidy-marulanda/airpods-anc.png'
  },
  {
    id: 'cat-cases',
    label: 'COLECCIÓN EXCLUSIVA',
    title: 'Cases & Accesorios',
    filter: 'Cases & Accesorios',
    image: '/aliados/leidy-marulanda/cases-magsafe-diamond.jpg'
  }
];

const CATALOG_PRODUCTS = [
  {
    id: 'lm-ramo-bouquet-iphone',
    title: 'Bouquet VIP iPhone + 7 Cases',
    subtitle: 'Edición Especial de Regalo • Compra Directa PSP',
    category: 'iPhones & Mac',
    tag: 'EDICIÓN VIP',
    image: '/aliados/leidy-marulanda/ramo-bouquet-iphone-cases.jpg',
    options: ['Bouquet iPhone + 7 Cases ($3.850.000)', 'Solo Bouquet 7 Cases ($280.000)', 'Separar Cupo ($250.000)'],
    optionPrices: {
      'Bouquet iPhone + 7 Cases ($3.850.000)': 3850000,
      'Solo Bouquet 7 Cases ($280.000)': 280000,
      'Separar Cupo ($250.000)': 250000
    },
    price: 3850000,
    suggestedDeposit: 250000,
    description:
      'Ramo de lujo elaborado a mano con un iPhone en el centro rodeado de 7 estuches exclusivos. Compra o sepáralo directamente en la plataforma con Wompi PSP.',
    pspBenefit: '10% Beneficio PSP'
  },
  {
    id: 'lm-iphones-coleccion',
    title: 'Colección iPhone 12 / 13 / 15 / 16',
    subtitle: 'Nuevos en Caja & Semi-Nuevos Garantizados',
    category: 'iPhones & Mac',
    tag: 'DESTACADO',
    image: '/aliados/leidy-marulanda/iphones-coleccion.png',
    options: ['iPhone 12 ($1.650.000)', 'iPhone 13 ($2.150.000)', 'iPhone 15 ($3.290.000)', 'Separar Equipo ($200.000)'],
    optionPrices: {
      'iPhone 12 ($1.650.000)': 1650000,
      'iPhone 13 ($2.150.000)': 2150000,
      'iPhone 15 ($3.290.000)': 3290000,
      'Separar Equipo ($200.000)': 200000
    },
    price: 2150000,
    suggestedDeposit: 200000,
    description:
      'Equipos Apple verificados con garantía oficial a través de PSP. Paga el valor total o separa tu equipo en línea mediante Wompi PSP.',
    pspBenefit: '10% Beneficio PSP'
  },
  {
    id: 'lm-airpods-anc',
    title: 'AirPods Pro (Cancelación ANC)',
    subtitle: 'Audio Espacial & Estuche MagSafe',
    category: 'Audio & Carga',
    tag: '100% ANC',
    hasCountdown: true,
    image: '/aliados/leidy-marulanda/airpods-anc.png',
    options: ['Compra Total ($145.000)', 'Separar Unidad ($50.000)'],
    optionPrices: {
      'Compra Total ($145.000)': 145000,
      'Separar Unidad ($50.000)': 50000
    },
    price: 145000,
    suggestedDeposit: 145000,
    description:
      'Audífonos inalámbricos en caja sellada con cancelación activa de ruido (100% ANC), modo transparencia y almohadillas intercambiables.',
    pspBenefit: '10% OFF Afiliados'
  },
  {
    id: 'lm-cables-usbc-60w',
    title: 'Cable Apple USB-C 60W (1m)',
    subtitle: 'Carga Rápida Trenzada en Caja',
    category: 'Audio & Carga',
    tag: 'ORIGINAL',
    image: '/aliados/leidy-marulanda/cables-usbc-60w.png',
    options: ['Cable USB-C 60W ($65.000)', 'Combo Cubo 20W + Cable ($130.000)'],
    optionPrices: {
      'Cable USB-C 60W ($65.000)': 65000,
      'Combo Cubo 20W + Cable ($130.000)': 130000
    },
    price: 65000,
    suggestedDeposit: 65000,
    description:
      'Cables originales USB-C de 60W (1 metro) en caja sellada para carga rápida segura de iPhone 15/16, iPad y MacBook.',
    pspBenefit: '10% OFF Afiliados'
  },
  {
    id: 'lm-macbook-apple',
    title: 'MacBook Apple Edición Pro / Air',
    subtitle: 'Portátil Nuevo en Caja Sellada',
    category: 'iPhones & Mac',
    tag: 'PREMIUM',
    image: '/aliados/leidy-marulanda/macbook-apple.png',
    options: ['256 GB SSD ($4.290.000)', '512 GB SSD ($5.190.000)', 'Abono Reserva ($300.000)'],
    optionPrices: {
      '256 GB SSD ($4.290.000)': 4290000,
      '512 GB SSD ($5.190.000)': 5190000,
      'Abono Reserva ($300.000)': 300000
    },
    price: 4290000,
    suggestedDeposit: 300000,
    description:
      'Rendimiento profesional y batería de larga duración. Producto 100% original con compra protegida por Wompi PSP.',
    pspBenefit: 'Bono Afiliado PSP'
  },
  {
    id: 'lm-samsung-a17-5g',
    title: 'Samsung Galaxy A17 5G',
    subtitle: 'Nuevo Sellado • Crédito o Contado PSP',
    category: 'Android & Tablets',
    tag: '5G NUEVO',
    image: '/aliados/leidy-marulanda/samsung-galaxy-a17-5g.png',
    options: ['Contado Galaxy A17 5G ($890.000)', 'Cuota Inicial Crédito PSP ($150.000)'],
    optionPrices: {
      'Contado Galaxy A17 5G ($890.000)': 890000,
      'Cuota Inicial Crédito PSP ($150.000)': 150000
    },
    price: 890000,
    suggestedDeposit: 150000,
    description:
      'Smartphone Samsung Galaxy A17 5G nuevo en caja sellada. Adquiérelo de contado o paga tu cuota inicial en línea con Wompi PSP.',
    pspBenefit: 'Vidrio Gratis PSP'
  },
  {
    id: 'lm-lenovo-tab-one',
    title: 'Lenovo Tab One + Folio Case',
    subtitle: 'Tablet con Estuche Original Incluido',
    category: 'Android & Tablets',
    tag: 'KIT COMPLETO',
    image: '/aliados/leidy-marulanda/lenovo-tab-one.png',
    options: ['Compra Total ($640.000)', 'Separar con Abono ($120.000)'],
    optionPrices: {
      'Compra Total ($640.000)': 640000,
      'Separar con Abono ($120.000)': 120000
    },
    price: 640000,
    suggestedDeposit: 120000,
    description:
      'Tablet Lenovo Tab One nueva en caja con estuche protector Folio Case original incluido. Ideal para estudio y trabajo.',
    pspBenefit: '10% OFF Afiliados'
  },
  {
    id: 'lm-case-correa-rosa',
    title: 'Case Pedrería & Correa Rosa',
    subtitle: 'Protección de Lujo para iPhone',
    category: 'Cases & Accesorios',
    tag: 'TENDENCIA',
    image: '/aliados/leidy-marulanda/case-correa-rosa.png',
    options: ['iPhone 13 / 14 ($55.000)', 'iPhone 15 / 16 Pro ($55.000)'],
    optionPrices: {
      'iPhone 13 / 14 ($55.000)': 55000,
      'iPhone 15 / 16 Pro ($55.000)': 55000
    },
    price: 55000,
    suggestedDeposit: 55000,
    description:
      'Estuche transparente con bordes rosados engastados en cristales brillantes y correa trenzada de seguridad.',
    pspBenefit: '10% OFF Afiliados'
  },
  {
    id: 'lm-cases-magsafe-diamond',
    title: 'Colección Cases MagSafe Diamond',
    subtitle: 'Aro Magnético & Brillo de Lujo',
    category: 'Cases & Accesorios',
    tag: 'MAGSAFE',
    image: '/aliados/leidy-marulanda/cases-magsafe-diamond.jpg',
    options: ['Dorado Diamond ($60.000)', 'Plata Glitter ($60.000)', 'Rosa MagSafe ($60.000)'],
    optionPrices: {
      'Dorado Diamond ($60.000)': 60000,
      'Plata Glitter ($60.000)': 60000,
      'Rosa MagSafe ($60.000)': 60000
    },
    price: 60000,
    suggestedDeposit: 60000,
    description:
      'Cases exclusivos con protección de cámara en pedrería, aro soporte MagSafe y acabados de alta resistencia.',
    pspBenefit: '10% OFF Afiliados'
  },
  {
    id: 'lm-iphone-15-pro-max-semi',
    title: 'iPhone 15 Pro Max 256GB',
    subtitle: 'Semi-Nuevo + Cargador 20W USB-C',
    category: 'iPhones & Mac',
    tag: 'SEMI-NUEVO',
    image: '/aliados/leidy-marulanda/iphone-15-pro-max-seminuevo.png',
    options: ['Pago de Contado ($4.150.000)', 'Cuota Inicial / Separación ($250.000)'],
    optionPrices: {
      'Pago de Contado ($4.150.000)': 4150000,
      'Cuota Inicial / Separación ($250.000)': 250000
    },
    price: 4150000,
    suggestedDeposit: 250000,
    description:
      'Equipo semi-nuevo impecable, garantizado y revisado al 100%, acompañado de adaptador de corriente Apple 20W USB-C.',
    pspBenefit: 'Combo Protección PSP'
  },
  {
    id: 'lm-iphone-14-pro-max-semi',
    title: 'iPhone 14 Pro Max 128GB',
    subtitle: 'Semi-Nuevo + Cargador 20W USB-C',
    category: 'iPhones & Mac',
    tag: 'SEMI-NUEVO',
    image: '/aliados/leidy-marulanda/iphone-14-pro-max-seminuevo.png',
    options: ['Pago de Contado ($3.350.000)', 'Cuota Inicial / Separación ($200.000)'],
    optionPrices: {
      'Pago de Contado ($3.350.000)': 3350000,
      'Cuota Inicial / Separación ($200.000)': 200000
    },
    price: 3350000,
    suggestedDeposit: 200000,
    description:
      'iPhone 14 Pro Max 128GB semi-nuevo en estado estético sobresaliente con garantía directa y cargador rápido 20W.',
    pspBenefit: 'Combo Protección PSP'
  },
  {
    id: 'lm-ipads-nuevos',
    title: 'iPad Apple 10ma / 11va Gen',
    subtitle: 'Nuevos Sellados + Stylus Pen',
    category: 'Android & Tablets',
    tag: 'APPLE IPAD',
    image: '/aliados/leidy-marulanda/ipads-nuevos.jpg',
    options: ['64 GB Wi-Fi ($1.890.000)', '256 GB Wi-Fi ($2.450.000)', 'Separar ($180.000)'],
    optionPrices: {
      '64 GB Wi-Fi ($1.890.000)': 1890000,
      '256 GB Wi-Fi ($2.450.000)': 2450000,
      'Separar ($180.000)': 180000
    },
    price: 1890000,
    suggestedDeposit: 180000,
    description:
      'iPads completamente nuevos en caja sellada para diseño, estudio y productividad, con opción de lápiz óptico.',
    pspBenefit: '10% OFF Accesorios'
  },
  {
    id: 'lm-forros-llaves',
    title: 'Estuches Llaves Inteligentes',
    subtitle: 'Key Fob Moto & Auto con Correa',
    category: 'Cases & Accesorios',
    tag: 'ACCESORIO',
    image: '/aliados/leidy-marulanda/forros-llaves.jpg',
    options: ['Negro Carbono ($45.000)', 'Rosa Gold ($45.000)', 'Lila Cristal ($45.000)'],
    optionPrices: {
      'Negro Carbono ($45.000)': 45000,
      'Rosa Gold ($45.000)': 45000,
      'Lila Cristal ($45.000)': 45000
    },
    price: 45000,
    suggestedDeposit: 45000,
    description:
      'Carcasas protectoras de lujo con llavero trenzado para llaves inteligentes de moto y vehículo.',
    pspBenefit: '10% OFF Afiliados'
  },
  {
    id: 'lm-ventosas-octobuddy',
    title: 'Ventosas Silicona Octobuddy',
    subtitle: 'Soporte Adherente para Fotos/Reels',
    category: 'Cases & Accesorios',
    tag: 'COLORES',
    image: '/aliados/leidy-marulanda/ventosas-octobuddy.png',
    options: ['Rosa / Fucsia ($25.000)', 'Turquesa / Azul ($25.000)', 'Negro / Gris ($25.000)'],
    optionPrices: {
      'Rosa / Fucsia ($25.000)': 25000,
      'Turquesa / Azul ($25.000)': 25000,
      'Negro / Gris ($25.000)': 25000
    },
    price: 25000,
    suggestedDeposit: 25000,
    description:
      'Adhiere tu smartphone a espejos y vidrios para grabar contenido manos libres con total seguridad.',
    pspBenefit: '10% OFF Afiliados'
  },
  {
    id: 'lm-protectores-cable',
    title: 'Kit Protector Cargador Perlado',
    subtitle: 'Funda Cubo 20W + Espiral Cable',
    category: 'Cases & Accesorios',
    tag: 'KIT 3D',
    image: '/aliados/leidy-marulanda/protectores-cable.png',
    options: ['Perlado Rosa ($35.000)', 'Plata Corazón ($35.000)', 'Azul ($35.000)'],
    optionPrices: {
      'Perlado Rosa ($35.000)': 35000,
      'Plata Corazón ($35.000)': 35000,
      'Azul ($35.000)': 35000
    },
    price: 35000,
    suggestedDeposit: 35000,
    description:
      'Protege tu cargador y evita que el cable original se doble o fracture. Incluye protector de cubo y espiral completo.',
    pspBenefit: '10% OFF Afiliados'
  },
  {
    id: 'lm-cases-iphone',
    title: 'Cases 3D & Glitter Degradado',
    subtitle: 'Colección Anti-Impacto iPhone',
    category: 'Cases & Accesorios',
    tag: 'COLECCIÓN',
    image: '/aliados/leidy-marulanda/cases-iphone.png',
    options: ['iPhone 11 / 12 ($48.000)', 'iPhone 13 / 14 ($48.000)', 'iPhone 15 / 16 ($48.000)'],
    optionPrices: {
      'iPhone 11 / 12 ($48.000)': 48000,
      'iPhone 13 / 14 ($48.000)': 48000,
      'iPhone 15 / 16 ($48.000)': 48000
    },
    price: 48000,
    suggestedDeposit: 48000,
    description:
      'Estuches brillantes y relieves 3D con bordes reforzados para proteger la cámara y pantalla de tu iPhone.',
    pspBenefit: '10% OFF Afiliados'
  }
];

const LeidyMarulanda = () => {
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [selectedLightbox, setSelectedLightbox] = useState(null);

  // Estado para Compra / Reserva Exclusiva por Wompi PSP (Retiene 2% en la plataforma)
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedOption, setSelectedOption] = useState('');
  const [paymentAmount, setPaymentAmount] = useState(250000);
  const [customAmount, setCustomAmount] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [isOrderSetupOpen, setIsOrderSetupOpen] = useState(false);
  const [isWompiOpen, setIsWompiOpen] = useState(false);
  const [orderReceipt, setOrderReceipt] = useState(null);

  const filteredProducts = CATALOG_PRODUCTS.filter((p) => {
    const matchesCategory = selectedCategory === 'Todos' || p.category === selectedCategory;
    const matchesSearch =
      !searchQuery.trim() ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.subtitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleOpenProductOrder = (product) => {
    const firstOpt = product.options?.[0] || 'Compra Directa PSP';
    const defaultPrice =
      product.optionPrices?.[firstOpt] || product.price || product.suggestedDeposit || 100000;
    setSelectedProduct(product);
    setSelectedOption(firstOpt);
    setPaymentAmount(defaultPrice);
    setCustomAmount(String(defaultPrice));
    setIsOrderSetupOpen(true);
  };

  const handleSelectOption = (opt) => {
    setSelectedOption(opt);
    if (selectedProduct?.optionPrices?.[opt]) {
      const priceVal = selectedProduct.optionPrices[opt];
      setPaymentAmount(priceVal);
      setCustomAmount(String(priceVal));
    }
  };

  const handleContinueToWompi = (e) => {
    e.preventDefault();
    const validAmount = Math.max(10000, Number(paymentAmount) || 50000);
    setPaymentAmount(validAmount);
    setIsOrderSetupOpen(false);
    setIsWompiOpen(true);
  };

  const handlePaymentSuccess = async (paymentResult) => {
    setIsWompiOpen(false);
    const totalPaid = Number(paymentResult.amount || paymentAmount);
    const platformCommission = Math.round(totalPaid * PLATFORM_FEE_RATE); // 2% para PSP
    const merchantNet = totalPaid - platformCommission; // 98% para el comercio aliado

    const receiptData = {
      ...paymentResult,
      amount: totalPaid,
      platformCommission,
      merchantNet,
      productTitle: selectedProduct?.title || 'Compra Leidy Marulanda Technology',
      productOption: selectedOption,
      customerName: customerName.trim() || 'Afiliado PSP',
      customerEmail: customerEmail.trim() || 'comprador@psp.com',
      date: new Date().toLocaleDateString('es-CO', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    setOrderReceipt(receiptData);

    // Si el comprador tiene sesión activa en PSP, persistimos también la orden y sub-orden en Psp.Orders.services
    if (getToken()) {
      try {
        await ordersApi.checkout({
          paymentMethod: paymentResult.paymentMethod || 'online_gateway',
          idempotencyKey: `lmt_${paymentResult.transactionId || Date.now()}`,
          paymentGateway: paymentResult.gateway || 'wompi',
          paymentTransactionId: paymentResult.transactionId,
          cardBrand: paymentResult.cardBrand,
          cardLastFour: paymentResult.lastFour,
          authorizationCode: paymentResult.authorizationCode || `AUTH-${Date.now().toString().slice(-6)}`,
          installments: paymentResult.installments || 1,
          shipping: {
            receiverName: receiptData.customerName,
            contactPhone: '3000000000',
            department: 'Antioquia',
            municipality: 'Apartadó',
            address: 'Entrega coordinada con Leidy Marulanda Technology',
            notes: `Opción seleccionada: ${selectedOption}`
          },
          directItems: [
            {
              productId: selectedProduct?.id || 'LMT-DIRECT',
              productName: `${receiptData.productTitle} (${selectedOption})`,
              productImageUrl: selectedProduct?.image || null,
              unitPrice: totalPaid,
              quantity: 1,
              companyId: 'leidy-marulanda-tech',
              companyName: 'Leidy Marulanda Technology'
            }
          ]
        });
      } catch {
        // Si el microservicio no está disponible en local, el comprobante visual ya quedó generado
      }
    }
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Cálculo en vivo del 2% para mostrar transparencia en el checkout
  const currentPlatformFee = Math.round((Number(paymentAmount) || 0) * PLATFORM_FEE_RATE);
  const currentMerchantNet = Math.max(0, (Number(paymentAmount) || 0) - currentPlatformFee);

  return (
    <div className="min-h-screen w-full bg-white text-[#111111] font-sans selection:bg-[#111111] selection:text-white">
      {/* 1. HEADER MINIMALISTA BLANCO (Inspirado en SOCETY de Pinterest — Sin contacto externo) */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-neutral-200/80 px-4 sm:px-10 py-5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Izquierda: Volver + Logo Editorial */}
          <div className="flex items-center gap-5">
            <Link
              to="/empresas-aliadas"
              title="Volver a Empresas Aliadas PSP"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-black transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Aliadas PSP</span>
            </Link>

            <div className="h-4 w-[1px] bg-neutral-200 hidden sm:block" />

            <div className="flex items-center gap-2.5">
              <img
                src="/aliados/ea-13.png"
                alt="Leidy Marulanda Technology"
                className="w-8 h-8 rounded-lg object-contain"
              />
              <span
                style={{ fontFamily: "'Figtree', -apple-system, BlinkMacSystemFont, 'Roboto', sans-serif" }}
                className="text-lg sm:text-xl font-bold tracking-wider uppercase text-[#111111]"
              >
                LEIDY MARULANDA
              </span>
            </div>
          </div>

          {/* Centro: Navegación Minimalista con Badge "PSP" */}
          <nav className="hidden lg:flex items-center gap-8 text-xs font-medium text-neutral-600">
            <button
              type="button"
              onClick={() => scrollToSection('hero-socety')}
              className="text-black font-semibold hover:text-black transition-colors cursor-pointer"
            >
              Inicio
            </button>

            <button
              type="button"
              onClick={() => scrollToSection('coleccion-socety')}
              className="relative hover:text-black transition-colors cursor-pointer py-1"
            >
              <span>Tienda</span>
              <span className="absolute -top-2.5 -right-5 px-1.5 py-[1px] bg-[#ff5722] text-white text-[8px] font-extrabold uppercase tracking-wider rounded-sm">
                PSP
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedCategory('iPhones & Mac');
                scrollToSection('coleccion-socety');
              }}
              className="hover:text-black transition-colors cursor-pointer"
            >
              iPhones & Mac
            </button>

            <button
              type="button"
              onClick={() => scrollToSection('credito-socety')}
              className="hover:text-black transition-colors cursor-pointer"
            >
              Crédito PSP
            </button>

            <button
              type="button"
              onClick={() => handleOpenProductOrder(CATALOG_PRODUCTS[0])}
              className="hover:text-black transition-colors cursor-pointer"
            >
              Pago Wompi
            </button>
          </nav>

          {/* Derecha: Iconos Minimalistas (Todos operan dentro de la plataforma PSP) */}
          <div className="flex items-center gap-4 text-neutral-700">
            {showSearchInput && (
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  scrollToSection('coleccion-socety');
                }}
                placeholder="Buscar iPhone, Bouquet, Case..."
                className="px-3 py-1.5 text-xs border border-neutral-300 rounded-none focus:outline-none focus:border-black w-40 sm:w-52"
                autoFocus
              />
            )}
            <button
              type="button"
              onClick={() => setShowSearchInput(!showSearchInput)}
              className="hover:text-black transition-colors cursor-pointer"
              title="Buscar en el catálogo"
            >
              <Search className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => handleOpenProductOrder(CATALOG_PRODUCTS[0])}
              className="hover:text-black transition-colors cursor-pointer"
              title="Compra protegida Afiliado PSP"
            >
              <User className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('credito-socety')}
              className="hover:text-black transition-colors cursor-pointer"
              title="10% Beneficio Miembros PSP"
            >
              <Heart className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => handleOpenProductOrder(CATALOG_PRODUCTS[0])}
              className="relative hover:text-black transition-colors cursor-pointer"
              title="Comprar o separar con Wompi PSP"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full bg-black text-white text-[9px] font-bold flex items-center justify-center">
                {CATALOG_PRODUCTS.length}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. HERO PRINCIPAL ESTILO "SOCETY" CON EL BOUQUET VIP DE IPHONE EN LA PRIMERA IMAGEN */}
      <section
        id="hero-socety"
        className="relative w-full bg-[#ededef] overflow-hidden min-h-[480px] sm:min-h-[540px] flex items-center"
      >
        {/* Polígono Diagonal Gris Medio a la derecha */}
        <div
          className="absolute inset-y-0 right-0 w-full lg:w-[55%] bg-[#dfe1e5] pointer-events-none"
          style={{
            clipPath: 'polygon(18% 0, 100% 0, 100% 100%, 0% 100%)'
          }}
        />

        <div className="max-w-7xl mx-auto w-full px-6 sm:px-10 py-14 lg:py-20 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Columna Izquierda: Tipografía Limpia + Botones de Compra en Plataforma */}
          <div className="lg:col-span-6 space-y-5">
            <p className="text-xs font-medium tracking-[0.22em] uppercase text-neutral-600">
              Tienda Oficial Aliada &bull; Compra Protegida Wompi PSP
            </p>

            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-bold text-[#111111] tracking-tight leading-[1.08]">
              Apple & Android Collection
            </h1>

            <p className="text-xs sm:text-sm text-neutral-600 max-w-md leading-relaxed font-normal">
              Elige tu equipo o el exclusivo <strong>Bouquet VIP de iPhone + Cases</strong>, compra o separa en línea y paga de forma segura por el <strong>Wompi de PSP</strong> con <strong>10% de beneficio para afiliados</strong>.
            </p>

            <div className="pt-3 flex flex-wrap items-center gap-3.5">
              <button
                type="button"
                onClick={() => handleOpenProductOrder(CATALOG_PRODUCTS[0])}
                className="px-8 py-3 bg-[#111111] hover:bg-neutral-800 text-white text-xs font-semibold tracking-wider uppercase transition-all cursor-pointer"
              >
                Comprar con Wompi PSP
              </button>

              <button
                type="button"
                onClick={() => scrollToSection('coleccion-socety')}
                className="px-8 py-3 bg-transparent hover:bg-[#111111] text-[#111111] hover:text-white border border-[#111111] text-xs font-semibold tracking-wider uppercase transition-all cursor-pointer"
              >
                Explorar Catálogo
              </button>
            </div>
          </div>

          {/* Columna Derecha: PRIMERA IMAGEN PRINCIPAL = BOUQUET VIP DE IPHONE + CASES */}
          <div className="lg:col-span-6 flex items-center justify-center lg:justify-end">
            <div className="relative w-full max-w-lg grid grid-cols-12 gap-4 items-center">
              {/* Primera Imagen Principal Destacada: El Ramo / Bouquet VIP de iPhone + Cases */}
              <div
                onClick={() => handleOpenProductOrder(CATALOG_PRODUCTS[0])}
                className="col-span-7 bg-white p-3 shadow-xl cursor-pointer group overflow-hidden relative"
              >
                <img
                  src="/aliados/leidy-marulanda/ramo-bouquet-iphone-cases.jpg"
                  alt="Bouquet VIP iPhone y Cases Leidy Marulanda Technology"
                  className="w-full h-72 sm:h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="mt-2.5 flex items-center justify-between text-[11px]">
                  <span className="font-bold text-[#111111]">Bouquet VIP iPhone + Cases</span>
                  <span className="font-extrabold text-[#00a650]">Pagar con Wompi →</span>
                </div>
              </div>

              {/* Columna Secundaria Derecha: Colección iPhones + Sello Liquidación Wompi PSP 2% */}
              <div className="col-span-5 space-y-4">
                <div
                  onClick={() => handleOpenProductOrder(CATALOG_PRODUCTS[1])}
                  className="bg-white p-2.5 shadow-lg cursor-pointer group overflow-hidden"
                >
                  <img
                    src="/aliados/leidy-marulanda/iphones-coleccion.png"
                    alt="Colección iPhones Leidy Marulanda"
                    className="w-full h-40 sm:h-44 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="bg-white/95 backdrop-blur-sm p-4 border border-neutral-200 shadow-sm space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                    Pasarela Oficial PSP
                  </p>
                  <p className="text-xs font-bold text-[#111111]">Pago 100% en Plataforma</p>
                  <p className="text-[11px] text-[#00a650] font-semibold">
                    ✓ Garantía &bull; 2% Retención PSP
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FILA DE 4 TARJETAS DE CATEGORÍA (Idéntica a "ONLINE STORE / NEW ITEMS - Shop Now" del Pinterest) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-10 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURED_CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.filter);
                scrollToSection('coleccion-socety');
              }}
              className="group bg-[#f8f8f9] hover:bg-[#f0f1f3] transition-colors p-6 flex items-center justify-between gap-4 cursor-pointer min-h-[170px] relative overflow-hidden"
            >
              <div className="z-10 space-y-1.5 self-end">
                <span className="text-[10px] font-medium tracking-[0.2em] uppercase text-neutral-500 block">
                  {cat.label}
                </span>
                <h3 className="text-sm font-bold text-[#111111]">{cat.title}</h3>
                <span className="inline-block text-[11px] font-semibold italic underline underline-offset-4 text-[#111111] group-hover:text-[#099c7d] transition-colors pt-1">
                  Ver Ahora
                </span>
              </div>

              <div className="w-28 h-28 shrink-0 overflow-hidden rounded-lg bg-white shadow-sm border border-neutral-100">
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. SECCIÓN "LAST COLLECTION" (ÚLTIMA COLECCIÓN — Compra directa por Wompi PSP sin fugas de contacto) */}
      <section id="coleccion-socety" className="max-w-7xl mx-auto px-4 sm:px-10 py-12 space-y-10">
        {/* Título Centrado Minimalista + Filtros Sutiles */}
        <div className="text-center space-y-5">
          <h2 className="text-2xl sm:text-3xl font-semibold text-[#222222] tracking-tight">
            Última Colección
          </h2>

          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-6 text-xs font-medium text-neutral-500 border-b border-neutral-200 pb-4 max-w-2xl mx-auto">
            {['Todos', 'iPhones & Mac', 'Android & Tablets', 'Audio & Carga', 'Cases & Accesorios'].map(
              (cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`pb-2 -mb-[17px] transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'text-[#111111] font-bold border-b-2 border-[#111111]'
                      : 'hover:text-[#111111]'
                  }`}
                >
                  {cat}
                </button>
              )
            )}
          </div>
        </div>

        {/* Grid Minimalista de 4 Columnas estilo SOCETY */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-7 gap-y-10">
          {filteredProducts.map((item) => (
            <div key={item.id} className="group flex flex-col">
              {/* Caja Cuadrada Gris Clara (#f4f4f6) con Imagen Centrada */}
              <div className="relative aspect-square w-full bg-[#f4f4f6] overflow-hidden mb-3.5">
                <img
                  onClick={() => handleOpenProductOrder(item)}
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                />

                {/* Etiqueta sutil arriba a la izquierda */}
                <span className="absolute top-3 left-3 px-2.5 py-1 bg-white/90 backdrop-blur-sm text-[#111111] text-[9px] font-bold tracking-widest uppercase">
                  {item.tag}
                </span>

                {/* Botón de ampliar arriba a la derecha */}
                <button
                  type="button"
                  onClick={() => setSelectedLightbox(item)}
                  className="absolute top-3 right-3 w-7 h-7 bg-white/90 text-[#111111] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  title="Ver detalle del producto"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>

                {/* Indicador de promoción estilo SOCETY */}
                {item.hasCountdown && (
                  <div className="absolute bottom-0 inset-x-0 bg-white/95 border-t border-neutral-100 py-2 px-3 grid grid-cols-4 text-center text-[10px] group-hover:opacity-0 transition-opacity">
                    <div>
                      <span className="font-bold text-[#111111] block">10%</span>
                      <span className="text-neutral-400 text-[9px]">PSP</span>
                    </div>
                    <div>
                      <span className="font-bold text-[#111111] block">100%</span>
                      <span className="text-neutral-400 text-[9px]">ANC</span>
                    </div>
                    <div>
                      <span className="font-bold text-[#111111] block">Wompi</span>
                      <span className="text-neutral-400 text-[9px]">Seguro</span>
                    </div>
                    <div>
                      <span className="font-bold text-[#111111] block">Garantía</span>
                      <span className="text-neutral-400 text-[9px]">Oficial</span>
                    </div>
                  </div>
                )}

                {/* Barra de Acción Rápida al pasar el mouse (100% conectada a Wompi PSP — Sin WhatsApp) */}
                <div className="absolute bottom-0 inset-x-0 bg-[#111111]/95 text-white p-2.5 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenProductOrder(item)}
                    className="flex-1 py-2 bg-white text-[#111111] hover:bg-[#14e0b5] text-[10px] font-extrabold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Comprar / Separar (Wompi)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedLightbox(item)}
                    className="py-2 px-3 border border-white/30 hover:border-white text-white text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Detalle
                  </button>
                </div>
              </div>

              {/* Pie de Tarjeta Minimalista */}
              <div className="flex items-baseline justify-between gap-2 pt-0.5">
                <h3
                  onClick={() => handleOpenProductOrder(item)}
                  className="text-[13px] font-semibold text-[#222222] hover:text-[#099c7d] transition-colors truncate cursor-pointer"
                >
                  {item.title}
                </h3>
                <span className="text-[11px] font-bold text-[#f59e0b] shrink-0">
                  ${item.price.toLocaleString('es-CO')}
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px] text-neutral-400 mt-0.5">
                <span className="truncate">{item.pspBenefit}</span>
                <button
                  type="button"
                  onClick={() => handleOpenProductOrder(item)}
                  className="text-[11px] font-semibold text-[#111111] hover:underline shrink-0 ml-2 cursor-pointer"
                >
                  Pagar con Wompi →
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. BANNER INFERIOR NEGRO DE LUJO (Inspirado en el bloque "SAMRAT" de Pinterest — 100% Wompi PSP sin teléfonos externos) */}
      <section
        id="credito-socety"
        className="w-full bg-[#0a0a0c] text-white py-16 sm:py-24 px-6 sm:px-10 mt-8 relative overflow-hidden"
      >
        <div className="absolute -left-20 top-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* Izquierda: Fotografías limpias de iPhones sin números de teléfono impresos */}
          <div className="lg:col-span-6 grid grid-cols-12 gap-4 items-center">
            <div
              onClick={() => handleOpenProductOrder(CATALOG_PRODUCTS[9])}
              className="col-span-7 rounded-xl overflow-hidden border border-white/10 shadow-2xl cursor-pointer group"
            >
              <img
                src="/aliados/leidy-marulanda/iphone-15-pro-max-seminuevo.png"
                alt="iPhone 15 Pro Max Titanio Negro"
                className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div
              onClick={() => handleOpenProductOrder(CATALOG_PRODUCTS[10])}
              className="col-span-5 rounded-xl overflow-hidden border border-white/10 shadow-2xl cursor-pointer group"
            >
              <img
                src="/aliados/leidy-marulanda/iphone-14-pro-max-seminuevo.png"
                alt="iPhone 14 Pro Max Blanco Plata"
                className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>

          {/* Derecha: Separación y Cuota Inicial por Wompi PSP */}
          <div className="lg:col-span-6 space-y-5">
            <span className="text-[11px] font-semibold tracking-[0.25em] uppercase text-[#14e0b5] block">
              Financiamiento Exclusivo en Plataforma &bull; Wompi PSP
            </span>

            <h2 className="text-3xl sm:text-4xl font-bold tracking-wide uppercase text-white">
              IPHONE & ANDROID A CRÉDITO
            </h2>

            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed max-w-lg">
              Sabemos que cada persona es única, por eso <strong>ajustamos los pagos según tu perfil</strong> en referencias seleccionadas.{' '}
              <span className="text-white font-semibold">
                ¡No importa si estás reportado!
              </span>{' '}
              Separa tu cupo o abona tu cuota inicial directamente por el <strong>Wompi de PSP</strong> para garantizar tu beneficio de afiliado.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-1 max-w-md text-xs text-neutral-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#14e0b5] shrink-0" />
                <span>Sin importar reportes</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#14e0b5] shrink-0" />
                <span>10% Beneficio PSP</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#14e0b5] shrink-0" />
                <span>Pago Protegido Wompi</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#14e0b5] shrink-0" />
                <span>2% Retención Plataforma PSP</span>
              </div>
            </div>

            <div className="pt-3 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => handleOpenProductOrder(CATALOG_PRODUCTS[9])}
                className="px-8 py-3 bg-white hover:bg-[#14e0b5] text-[#0a0a0c] text-xs font-bold tracking-wider uppercase transition-colors cursor-pointer"
              >
                Separar Cupo con Wompi PSP
              </button>

              <button
                type="button"
                onClick={() => scrollToSection('coleccion-socety')}
                className="px-6 py-3 border border-white/30 hover:border-white text-white text-xs font-semibold tracking-wider uppercase transition-colors cursor-pointer"
              >
                Ver Equipos Disponibles
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FOOTER MINIMALISTA DE TRANSACCIÓN PROTEGIDA PSP (Sin contacto directo para proteger la comisión del 2%) */}
      <footer className="bg-[#f8f8f9] border-t border-neutral-200 py-12 px-6 sm:px-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-neutral-600">
          <div className="flex items-center gap-3">
            <img
              src="/aliados/ea-13.png"
              alt="Leidy Marulanda Technology"
              className="w-9 h-9 rounded-lg object-contain bg-white p-1 border border-neutral-200"
            />
            <div>
              <p className="font-bold text-[#111111] uppercase tracking-wider">
                Leidy Marulanda Technology &bull; Comercio Aliado Oficial PSP
              </p>
              <p className="text-[11px] text-neutral-500">
                Todas las compras y separaciones se procesan exclusivamente a través de la pasarela Wompi PSP (Liquidación automática: 98% Comercio / 2% Plataforma PSP).
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <button
              type="button"
              onClick={() => handleOpenProductOrder(CATALOG_PRODUCTS[0])}
              className="font-bold text-[#111111] hover:text-[#099c7d] flex items-center gap-1.5 cursor-pointer"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Checkout Oficial Wompi PSP</span>
            </button>

            <Link
              to="/empresas-aliadas"
              className="font-bold text-[#111111] hover:underline"
            >
              ← Volver a Empresas Aliadas PSP
            </Link>
          </div>
        </div>
      </footer>

      {/* MODAL 1: CONFIGURAR COMPRA / SEPARACIÓN CON WOMPI PSP (Muestra liquidación del 2% para la plataforma) */}
      {isOrderSetupOpen && selectedProduct && (
        <div
          onClick={() => setIsOrderSetupOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white max-w-lg w-full overflow-hidden shadow-2xl border border-neutral-200"
          >
            <div className="bg-[#111111] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.title}
                  className="w-12 h-12 object-cover bg-white"
                />
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#14e0b5] block">
                    Checkout Oficial Wompi PSP
                  </span>
                  <h3 className="text-sm font-bold line-clamp-1">{selectedProduct.title}</h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOrderSetupOpen(false)}
                className="w-8 h-8 bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleContinueToWompi} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider block">
                  1. Selecciona Modalidad / Referencia:
                </label>
                <div className="flex flex-wrap gap-2">
                  {selectedProduct.options.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => handleSelectOption(opt)}
                      className={`px-3 py-2 text-xs font-semibold border transition-all cursor-pointer ${
                        selectedOption === opt
                          ? 'bg-[#111111] text-white border-[#111111]'
                          : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:border-black'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider block">
                  2. Valor a Pagar en Wompi PSP (COP):
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-400">
                    $
                  </span>
                  <input
                    type="text"
                    value={customAmount}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/\D/g, '');
                      setCustomAmount(raw);
                      if (raw) setPaymentAmount(Number(raw));
                    }}
                    className="w-full pl-7 pr-14 py-2.5 bg-neutral-50 border border-neutral-300 text-sm font-bold text-[#111111] focus:outline-none focus:border-black"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-neutral-400">
                    COP
                  </span>
                </div>

                {/* Desglose automático del 2% para la plataforma PSP */}
                <div className="bg-neutral-50 border border-neutral-200 p-3 text-[11px] space-y-1">
                  <div className="flex justify-between text-neutral-600">
                    <span>Liquidación Comercio Aliado (98%):</span>
                    <span className="font-semibold text-[#111111]">
                      ${currentMerchantNet.toLocaleString('es-CO')} COP
                    </span>
                  </div>
                  <div className="flex justify-between text-[#099c7d] font-bold">
                    <span>Comisión Plataforma PSP (2%):</span>
                    <span>${currentPlatformFee.toLocaleString('es-CO')} COP</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-neutral-700">Nombre del Comprador</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Ej: Camila Restrepo"
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 text-xs font-medium text-[#111111] focus:outline-none focus:border-black"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-neutral-700">Correo Afiliado PSP</label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="camila@psp.com"
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 text-xs font-medium text-[#111111] focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-6 bg-[#111111] hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5 text-[#14e0b5]" />
                <span>
                  Continuar al Wompi de PSP (${(Number(paymentAmount) || 0).toLocaleString('es-CO')} COP)
                </span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: PASARELA WOMPI PSP */}
      <MockPaymentModal
        isOpen={isWompiOpen}
        onClose={() => setIsWompiOpen(false)}
        totalAmount={paymentAmount}
        orderReference={`PSP-LMT-${Date.now().toString().slice(-5)}`}
        buyerInfo={{
          name: customerName || 'Comprador Afiliado PSP',
          email: customerEmail || 'pagos@psp.com',
          phone: '3000000000'
        }}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {/* MODAL 3: COMPROBANTE OFICIAL DE COMPRA CON RETENCIÓN DEL 2% EN LA PLATAFORMA PSP */}
      {orderReceipt && (
        <div
          onClick={() => setOrderReceipt(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white max-w-md w-full overflow-hidden shadow-2xl border border-neutral-200 p-6 sm:p-8 text-center space-y-5"
          >
            <div className="w-14 h-14 rounded-full bg-neutral-100 text-[#111111] mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-[#00a650]" />
            </div>

            <div className="space-y-1">
              <span className="px-3 py-1 bg-neutral-100 text-[#111111] text-[10px] font-bold uppercase tracking-widest">
                Comprobante Oficial Wompi PSP
              </span>
              <h3 className="text-xl font-bold text-[#111111] pt-1">
                ¡Pago Procesado en PSP!
              </h3>
              <p className="text-xs text-neutral-500">
                Tu orden quedó registrada directamente en la plataforma PSP con garantía y beneficio de afiliado activo.
              </p>
            </div>

            <div className="bg-neutral-50 p-4 border border-neutral-200 text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-neutral-500">Comercio Aliado:</span>
                <span className="font-bold text-[#111111]">Leidy Marulanda Technology</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Producto:</span>
                <span className="font-bold text-[#111111] text-right max-w-[190px] truncate">
                  {orderReceipt.productTitle}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Opción:</span>
                <span className="font-semibold text-neutral-800">{orderReceipt.productOption}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">ID Transacción Wompi:</span>
                <span className="font-mono font-bold text-[#00a650]">
                  {orderReceipt.transactionId}
                </span>
              </div>
              <div className="border-t border-neutral-200 pt-2 space-y-1">
                <div className="flex justify-between text-[11px] text-neutral-500">
                  <span>Abono a Comercio Aliado (98%):</span>
                  <span className="font-semibold text-neutral-800">
                    ${orderReceipt.merchantNet?.toLocaleString('es-CO')} COP
                  </span>
                </div>
                <div className="flex justify-between text-[11px] text-[#099c7d] font-bold">
                  <span>Retención Plataforma PSP (2%):</span>
                  <span>${orderReceipt.platformCommission?.toLocaleString('es-CO')} COP</span>
                </div>
              </div>
              <div className="flex justify-between border-t border-neutral-200 pt-2 text-sm">
                <span className="font-bold text-neutral-700">Total Pagado en Wompi:</span>
                <span className="font-bold text-[#111111]">
                  ${orderReceipt.amount?.toLocaleString('es-CO')} COP
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setOrderReceipt(null)}
              className="w-full py-3 bg-[#111111] hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider cursor-pointer"
            >
              Finalizar y Volver a la Tienda
            </button>
          </div>
        </div>
      )}

      {/* MODAL 4: DETALLE DEL PRODUCTO CON COMPRA DIRECTA WOMPI PSP */}
      {selectedLightbox && (
        <div
          onClick={() => setSelectedLightbox(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white max-w-2xl w-full overflow-hidden shadow-2xl space-y-4 p-4 sm:p-6 relative"
          >
            <button
              type="button"
              onClick={() => setSelectedLightbox(null)}
              className="absolute top-4 right-4 p-2 bg-neutral-100 text-neutral-700 hover:bg-black hover:text-white transition-colors z-10 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="max-h-[60vh] w-full flex items-center justify-center overflow-hidden bg-neutral-100">
              <img
                src={selectedLightbox.image}
                alt={selectedLightbox.title}
                className="max-h-[60vh] max-w-full object-contain"
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
              <div className="space-y-1">
                <h3 className="text-base font-bold text-[#111111]">{selectedLightbox.title}</h3>
                <p className="text-xs text-neutral-600">{selectedLightbox.description}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const prod = selectedLightbox;
                  setSelectedLightbox(null);
                  handleOpenProductOrder(prod);
                }}
                className="px-6 py-3 bg-[#111111] hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider shrink-0 cursor-pointer"
              >
                Comprar con Wompi PSP
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeidyMarulanda;
