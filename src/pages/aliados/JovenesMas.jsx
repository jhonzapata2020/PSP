import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Mail,
  MapPin,
  Sparkles,
  Award,
  Users,
  CheckCircle2,
  ArrowLeft,
  ArrowUpRight,
  GraduationCap,
  Trophy,
  Heart,
  ShieldCheck,
  Zap,
  X,
  Maximize2,
  HandHeart,
  Check,
  Lock
} from 'lucide-react';
import MockPaymentModal from '../../components/comercio/MockPaymentModal';

const INITIAL_CAMPAIGNS = [
  {
    id: 'becas-u',
    number: 'No - 01',
    category: 'Educación Superior',
    title: 'Fondo de Becas y Transporte "Jóvenes en la U"',
    description:
      'Apoya con kits académicos, inscripciones universitarias y auxilios de transporte a jóvenes recién graduados de colegios públicos y zonas rurales de Turbo.',
    impactDetail: 'Destinado a: Inscripciones PIN universitario, kits de estudio y transporte estudiantil.',
    image: '/aliados/jovenes-mas/banner-10anios.png',
    suggestedAmount: 50000
  },
  {
    id: 'deporte-paz',
    number: 'No - 02',
    category: 'Deporte & Convivencia',
    title: 'Torneos Nocturnos "Muévete con Jóvenes+"',
    description:
      'Dotación de balones, mallas de voleibol, arbitraje e hidratación para los torneos barriales nocturnos que promueven entornos seguros en Urabá.',
    impactDetail: 'Destinado a: Balones, mallas de voleibol, hidratación y logística comunitaria.',
    image: '/aliados/jovenes-mas/semana-juventud.jpg',
    suggestedAmount: 30000
  },
  {
    id: 'lideres-cambio',
    number: 'No - 03',
    category: 'Cultura de Paz',
    title: 'Semillero Líderes de Cambio (Alianza Mi Sangre)',
    description:
      'Financia talleres de liderazgo comunitario, salud mental, arte y resolución pacífica de conflictos para adolescentes multiplicadores en sus barrios.',
    impactDetail: 'Destinado a: Refrigerios, material pedagógico y talleres barriales de liderazgo.',
    image: '/aliados/jovenes-mas/mi-sangre.png',
    suggestedAmount: 50000
  }
];

const PRESET_AMOUNTS = [20000, 50000, 100000, 200000, 500000];

const JovenesMas = () => {
  const [aboutTab, setAboutTab] = useState('historia');
  const [selectedImageModal, setSelectedImageModal] = useState(null);

  // Estado de campañas y donaciones con Wompi PSP
  const [campaigns, setCampaigns] = useState(INITIAL_CAMPAIGNS);
  const [selectedCampaign, setSelectedCampaign] = useState(INITIAL_CAMPAIGNS[0]);
  const [donationAmount, setDonationAmount] = useState(50000);
  const [customAmountInput, setCustomAmountInput] = useState('');
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [donorMessage, setDonorMessage] = useState('');

  // Modal previo de configuración de donación y Modal Wompi
  const [isDonationSetupOpen, setIsDonationSetupOpen] = useState(false);
  const [isWompiOpen, setIsWompiOpen] = useState(false);
  const [donationReceipt, setDonationReceipt] = useState(null);

  const galleryImages = [
    {
      src: '/aliados/jovenes-mas/semana-juventud.jpg',
      title: 'Semana de la Juventud - Desafío Joven',
      subtitle: 'Encuentro masivo de integración, liderazgo y deporte en Turbo, Urabá.'
    },
    {
      src: '/aliados/jovenes-mas/banner-10anios.png',
      title: 'Celebración 10 Años - El Legado Continúa',
      subtitle: 'Una década construyendo oportunidades y tejido social con la juventud.'
    },
    {
      src: '/aliados/jovenes-mas/mi-sangre.png',
      title: 'Formación Líderes de Cambio - Fundación Mi Sangre',
      subtitle: 'Alianza estratégica para la paz, convivencia y liderazgo comunitario.'
    },
    {
      src: '/aliados/jovenes-mas/janier-lloreda.png',
      title: 'Janier Lloreda - Fundador & Director',
      subtitle: 'Compromiso directo con la transformación social de Urabá.'
    }
  ];

  const handleOpenDonateFlow = (campaign = campaigns[0], amount = 50000) => {
    setSelectedCampaign(campaign);
    setDonationAmount(amount);
    setCustomAmountInput('');
    setIsDonationSetupOpen(true);
  };

  const handleSelectPreset = (amount) => {
    setDonationAmount(amount);
    setCustomAmountInput('');
  };

  const handleCustomAmountChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '');
    setCustomAmountInput(raw);
    if (raw && Number(raw) >= 5000) {
      setDonationAmount(Number(raw));
    }
  };

  const handleProceedToWompi = (e) => {
    if (e) e.preventDefault();
    const finalAmount = Math.max(5000, Number(donationAmount) || 50000);
    setDonationAmount(finalAmount);
    setIsDonationSetupOpen(false);
    setIsWompiOpen(true);
  };

  const handleWompiSuccess = (paymentResult) => {
    setIsWompiOpen(false);
    setDonationReceipt({
      ...paymentResult,
      campaignTitle: selectedCampaign?.title || 'Fondo Social Jóvenes+ Urabá',
      donorName: donorName.trim() || 'Donante Solidario PSP',
      donorEmail: donorEmail.trim() || 'donaciones@psp.com.co',
      donorMessage: donorMessage.trim(),
      date: new Date().toLocaleDateString('es-CO', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    });
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#fcfdfa] text-slate-900 font-sans selection:bg-[#f5c518] selection:text-[#072b22]">
      {/* 1. CINTILLO INSTITUCIONAL SUPERIOR (Sin botones de cobro, solo información y retorno) */}
      <div className="bg-[#05241d] text-white/90 border-b border-white/10 px-4 sm:px-8 py-2.5 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              to="/empresas-aliadas"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold transition-all text-[11px]"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#f5c518]" />
              <span>Volver a Empresas Aliadas PSP</span>
            </Link>
            <span className="hidden md:inline-flex items-center gap-2 text-emerald-200/90 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Organización Social Verificada por la Corporación PSP
            </span>
          </div>

          <div className="flex items-center gap-5 text-[11px] text-emerald-200/90 font-medium">
            <span className="hidden sm:inline-flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#f5c518]" />
              <span>Turbo, Urabá Antioqueño</span>
            </span>
            <a
              href="mailto:jovenesmasorg@gmail.com"
              className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-[#f5c518]" />
              <span>jovenesmasorg@gmail.com</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. BARRA DE NAVEGACIÓN PRINCIPAL (Un único botón institucional de Donar) */}
      <header className="sticky top-0 z-30 bg-[#08382e]/95 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 py-3.5 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Logo & Nombre */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white p-1 border-2 border-[#f5c518] shadow-md flex items-center justify-center shrink-0 overflow-hidden">
              <img
                src="/aliados/jovenes-mas/logo.png"
                alt="Jóvenes+ Organización"
                className="w-full h-full object-contain rounded-full"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-black text-white tracking-tight leading-none">
                  Jóvenes<span className="text-[#f5c518]">+</span>
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-[#f5c518]/20 border border-[#f5c518]/40 text-[#f5c518] text-[10px] font-extrabold">
                  #10Años
                </span>
              </div>
              <p className="text-[11px] text-emerald-200/80 font-medium">
                Organización Social &bull; Urabá
              </p>
            </div>
          </div>

          {/* Enlaces de Navegación limpios */}
          <nav className="hidden lg:flex items-center gap-7 text-xs font-bold text-white/90">
            <button
              type="button"
              onClick={() => scrollToSection('hero-jovenes')}
              className="hover:text-[#f5c518] transition-colors cursor-pointer"
            >
              Inicio
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('nosotros-jovenes')}
              className="hover:text-[#f5c518] transition-colors cursor-pointer"
            >
              Sobre Nosotros
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('programas-jovenes')}
              className="hover:text-[#f5c518] transition-colors cursor-pointer"
            >
              Qué Hacemos
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('donar-jovenes')}
              className="hover:text-[#f5c518] transition-colors cursor-pointer"
            >
              Causas Sociales
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('galeria-jovenes')}
              className="hover:text-[#f5c518] transition-colors cursor-pointer"
            >
              Galería en Territorio
            </button>
          </nav>

          {/* Único Botón de Donar en el Header */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleOpenDonateFlow(campaigns[0], 50000)}
              className="group pl-5 pr-2 py-2 rounded-full bg-[#f5c518] hover:bg-[#ffd43b] text-[#05241d] font-black text-xs flex items-center gap-2.5 shadow-lg shadow-black/20 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <span>Donar con Wompi</span>
              <span className="w-7 h-7 rounded-full bg-[#08382e] text-[#f5c518] flex items-center justify-center group-hover:rotate-45 transition-transform">
                <ArrowUpRight className="w-4 h-4" />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* 3. HERO PRINCIPAL LIMPIO E INSPIRACIONAL (Como el referente Econest de Pinterest, sin caja de cobro invasiva) */}
      <section
        id="hero-jovenes"
        className="relative bg-[#072e25] text-white overflow-hidden pt-16 pb-28 sm:py-28 lg:py-32 px-4 sm:px-8"
      >
        {/* Imagen de fondo amplia y protagonista */}
        <div className="absolute inset-0 z-0">
          <img
            src="/aliados/jovenes-mas/semana-juventud.jpg"
            alt="Juventud de Urabá - Jóvenes+"
            className="w-full h-full object-cover object-center opacity-45"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#05241d]/95 via-[#072e25]/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#05241d] via-transparent to-transparent" />
        </div>

        {/* Contenido Hero */}
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="max-w-3xl space-y-6">
            {/* Insignia superior */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-[#f5c518]/40 text-[#f5c518] text-xs font-extrabold tracking-wide">
              <Sparkles className="w-3.5 h-3.5" />
              <span>#10Años El Legado Continúa &bull; Turbo, Urabá</span>
            </div>

            {/* Título Principal a dos tonos como el referente de Pinterest */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] text-white">
              Transformando a Urabá con{' '}
              <span className="text-[#f5c518] underline decoration-[#f5c518]/30 decoration-wavy underline-offset-8">
                Corazón Joven.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-emerald-100/90 max-w-2xl leading-relaxed font-normal">
              Durante más de una década, en <strong>Jóvenes+ Organización</strong> hemos construido oportunidades de educación superior, deporte para la sana convivencia y liderazgo comunitario para miles de jóvenes en toda la subregión de Urabá.
            </p>

            {/* Botones de exploración institucional (sin presionar al usuario a pagar en el segundo 1) */}
            <div className="pt-3 flex flex-wrap items-center gap-6">
              <button
                type="button"
                onClick={() => scrollToSection('programas-jovenes')}
                className="group pl-6 pr-2.5 py-3 rounded-full bg-[#f5c518] hover:bg-[#ffd43b] text-[#05241d] font-black text-sm flex items-center gap-3 shadow-xl shadow-black/30 transition-all transform hover:-translate-y-0.5 cursor-pointer"
              >
                <span>Conocer Nuestros Programas</span>
                <span className="w-9 h-9 rounded-full bg-[#05241d] text-[#f5c518] flex items-center justify-center group-hover:rotate-45 transition-transform">
                  <ArrowUpRight className="w-4 h-4" />
                </span>
              </button>

              <button
                type="button"
                onClick={() => scrollToSection('nosotros-jovenes')}
                className="px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/25 text-white font-bold text-xs sm:text-sm backdrop-blur-sm transition-all cursor-pointer"
              >
                Nuestra Historia
              </button>

              {/* Avatar Stack + Métrica (+2.5k Jóvenes Impactados) */}
              <div className="flex items-center gap-3 pl-1">
                <div className="flex -space-x-2.5">
                  <img
                    src="/aliados/jovenes-mas/janier-lloreda.png"
                    alt="Líder"
                    className="w-10 h-10 rounded-full object-cover border-2 border-[#08382e]"
                  />
                  <img
                    src="/aliados/jovenes-mas/mi-sangre.png"
                    alt="Comunidad"
                    className="w-10 h-10 rounded-full object-cover border-2 border-[#08382e]"
                  />
                  <div className="w-10 h-10 rounded-full bg-[#f5c518] text-[#05241d] font-black text-xs flex items-center justify-center border-2 border-[#08382e]">
                    +2.5k
                  </div>
                </div>
                <div className="text-xs">
                  <p className="font-extrabold text-white leading-tight">Jóvenes Impactados</p>
                  <p className="text-emerald-200/80 text-[11px]">Liderazgo activo desde 2016</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Divisor inferior curvo orgánico hacia la sección blanca */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none pointer-events-none">
          <svg
            viewBox="0 0 1440 70"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-10 sm:h-16"
            preserveAspectRatio="none"
          >
            <path
              d="M0 45C240 80 480 10 720 35C960 60 1200 15 1440 40V70H0V45Z"
              fill="#fcfdfa"
            />
          </svg>
        </div>
      </section>

      {/* 4. SECCIÓN SOBRE NOSOTROS (100% Institucional, sin botones de cobro) */}
      <section id="nosotros-jovenes" className="py-16 sm:py-24 px-4 sm:px-8 bg-[#fcfdfa]">
        <div className="max-w-7xl mx-auto space-y-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Columna Izquierda: Collage Fotográfico Asimétrico */}
            <div className="lg:col-span-6 relative">
              <div className="grid grid-cols-12 gap-4 items-center">
                <div className="col-span-6 space-y-4">
                  <div className="bg-[#f5c518] text-[#05241d] p-5 rounded-3xl shadow-lg">
                    <span className="text-3xl sm:text-4xl font-black block leading-none">
                      10+ Años
                    </span>
                    <p className="text-xs font-extrabold mt-1.5 leading-snug">
                      Transformando el liderazgo juvenil en Turbo y Urabá
                    </p>
                  </div>

                  <div
                    onClick={() => setSelectedImageModal(galleryImages[3])}
                    className="rounded-[2rem] overflow-hidden shadow-xl border-4 border-white cursor-pointer group relative h-64 sm:h-72"
                  >
                    <img
                      src="/aliados/jovenes-mas/janier-lloreda.png"
                      alt="Janier Lloreda - Fundador Jóvenes+"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#05241d]/80 via-transparent to-transparent flex items-end p-4">
                      <div>
                        <p className="text-xs font-black text-white">Janier Lloreda</p>
                        <p className="text-[10px] text-[#f5c518] font-bold">
                          Fundador & Director General
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-span-6 space-y-4">
                  <div
                    onClick={() => setSelectedImageModal(galleryImages[1])}
                    className="rounded-[2.2rem] overflow-hidden shadow-xl border-4 border-white cursor-pointer group h-60 sm:h-68"
                  >
                    <img
                      src="/aliados/jovenes-mas/banner-10anios.png"
                      alt="10 Años El Legado Continúa"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <div className="bg-[#08382e] text-white p-5 rounded-3xl shadow-xl space-y-2">
                    <div className="w-9 h-9 rounded-2xl bg-[#f5c518]/20 text-[#f5c518] flex items-center justify-center">
                      <Award className="w-5 h-5" />
                    </div>
                    <h4 className="text-xs sm:text-sm font-black leading-snug">
                      Organización Juvenil Referente en Urabá
                    </h4>
                    <p className="text-[11px] text-emerald-100/80 leading-relaxed">
                      Articulada con Fundación Mi Sangre y la Red Empresarial PSP.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Columna Derecha: Narrativa Institucional y Pestañas */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-extrabold text-[#08382e] uppercase tracking-wider">
                <span className="w-2.5 h-2.5 rounded-full bg-[#f5c518]" />
                <span>Sobre Nosotros &bull; Identidad</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight">
                Construyendo un Futuro de Oportunidades para la Juventud
              </h2>

              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setAboutTab('historia')}
                  className={`px-5 py-2.5 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
                    aboutTab === 'historia'
                      ? 'bg-[#08382e] text-white shadow-md'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  Nuestra Historia (#10Años)
                </button>
                <button
                  type="button"
                  onClick={() => setAboutTab('mision')}
                  className={`px-5 py-2.5 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
                    aboutTab === 'mision'
                      ? 'bg-[#08382e] text-white shadow-md'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  Nuestra Misión
                </button>
                <button
                  type="button"
                  onClick={() => setAboutTab('vision')}
                  className={`px-5 py-2.5 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
                    aboutTab === 'vision'
                      ? 'bg-[#08382e] text-white shadow-md'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  Alianza Social PSP
                </button>
              </div>

              <div className="bg-emerald-950/[0.03] border border-emerald-900/10 rounded-2xl p-5 space-y-3">
                {aboutTab === 'historia' && (
                  <>
                    <h4 className="text-sm font-black text-[#08382e]">
                      Hito Histórico 2016 – 2026: #10Años El Legado Continúa
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      Nacimos en el distrito de Turbo con la convicción de que los jóvenes de Urabá no son el problema, sino la solución transformadora del territorio. Durante una década ininterrumpida hemos liderado semanas de la juventud, torneos deportivos nocturnos y escuelas de liderazgo.
                    </p>
                  </>
                )}
                {aboutTab === 'mision' && (
                  <>
                    <h4 className="text-sm font-black text-[#08382e]">
                      Misión Institucional en el Territorio
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      Impulsar el empoderamiento juvenil, la formación en valores, el acceso a becas de educación superior y la sana convivencia barrial mediante programas deportivos, culturales y de participación ciudadana en Urabá.
                    </p>
                  </>
                )}
                {aboutTab === 'vision' && (
                  <>
                    <h4 className="text-sm font-black text-[#08382e]">
                      Receptor Oficial del Fondo Social PSP
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      Como organización aliada de la plataforma PSP, canalizamos el respaldo ciudadano y los programas de responsabilidad social empresarial para financiar becas universitarias, implementos deportivos y formación para el empleo.
                    </p>
                  </>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="flex items-center gap-2.5 text-xs font-bold text-slate-700">
                  <span className="w-5 h-5 rounded-full bg-[#08382e] text-[#f5c518] flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3" />
                  </span>
                  <span>Orientación vocacional &ldquo;Jóvenes en la U&rdquo;</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs font-bold text-slate-700">
                  <span className="w-5 h-5 rounded-full bg-[#08382e] text-[#f5c518] flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3" />
                  </span>
                  <span>Torneos nocturnos de voleibol y paz</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs font-bold text-slate-700">
                  <span className="w-5 h-5 rounded-full bg-[#08382e] text-[#f5c518] flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3" />
                  </span>
                  <span>Convenio formativo Fundación Mi Sangre</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs font-bold text-slate-700">
                  <span className="w-5 h-5 rounded-full bg-[#08382e] text-[#f5c518] flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3" />
                  </span>
                  <span>Empleabilidad con empresas de la red PSP</span>
                </div>
              </div>

              {/* Firma del Director + Botón de Ver Galería (Sin pedir dinero aquí) */}
              <div className="pt-4 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src="/aliados/jovenes-mas/janier-lloreda.png"
                    alt="Janier Lloreda"
                    className="w-12 h-12 rounded-full object-cover border-2 border-[#08382e]"
                  />
                  <div>
                    <p className="text-sm font-black text-slate-900">Janier Lloreda</p>
                    <p className="text-xs text-slate-500 font-semibold">
                      Fundador & Director &bull; Jóvenes+ Organización
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => scrollToSection('galeria-jovenes')}
                  className="px-5 py-2.5 rounded-full bg-slate-100 hover:bg-[#08382e] hover:text-white text-slate-800 font-bold text-xs transition-all cursor-pointer"
                >
                  Ver Evidencia en Territorio →
                </button>
              </div>
            </div>
          </div>

          {/* Fila de 4 Indicadores Circulares */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pt-6 border-t border-slate-200/80">
            {[
              {
                metric: '+5.3K',
                title: 'Comunidad Activa',
                desc: 'Jóvenes conectados en procesos barriales, deportivos y redes en Urabá.',
                icon: Users
              },
              {
                metric: '45+',
                title: 'Proyectos Ejecutados',
                desc: 'Jornadas de liderazgo, foros juveniles y torneos por la convivencia.',
                icon: Trophy
              },
              {
                metric: '100%',
                title: 'Transparencia Social',
                desc: 'Organización verificada dentro del ecosistema solidario de PSP.',
                icon: ShieldCheck
              },
              {
                metric: '10+ Años',
                title: 'Trayectoria Continua',
                desc: 'Una década respaldando los sueños de la juventud de Turbo.',
                icon: Sparkles
              }
            ].map((item, idx) => {
              const IconComponent = item.icon;
              return (
                <div
                  key={idx}
                  className="flex flex-col items-center text-center p-6 rounded-3xl bg-white border border-slate-200/70 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="w-16 h-16 rounded-full bg-[#08382e]/5 border border-[#08382e]/15 flex items-center justify-center text-[#08382e] mb-4 relative">
                    <IconComponent className="w-7 h-7" />
                    <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#f5c518] text-[#05241d] text-[10px] font-black flex items-center justify-center">
                      ✓
                    </span>
                  </div>
                  <div className="text-3xl font-black text-[#08382e]">{item.metric}</div>
                  <h4 className="text-sm font-black text-slate-900 mt-1">{item.title}</h4>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. SECCIÓN "QUÉ HACEMOS / PROGRAMAS BANDERA" (Tarjetas 100% informativas, sin botones de cobro repetidos) */}
      <section
        id="programas-jovenes"
        className="py-20 sm:py-24 px-4 sm:px-8 bg-[#08382e] text-white relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#f5c518]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 space-y-12">
          {/* Cabecera limpia */}
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-extrabold text-[#f5c518] uppercase tracking-wider">
              <Zap className="w-4 h-4" />
              <span>Qué Hacemos &bull; Programas Bandera</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">
              Impulsamos el Talento, la Educación y la Paz en el Territorio
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed">
              Conoce nuestras tres líneas de acción permanentes diseñadas junto a las comunidades y colegios de Turbo.
            </p>
          </div>

          {/* 3 Tarjetas Altas Informativas con Numeración No - 01, No - 02, No - 03 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[
              {
                num: 'No - 01',
                icon: GraduationCap,
                title: 'Jóvenes en la U & Educación',
                desc: 'Orientación vocacional, preparación para pruebas de estado y gestión de becas para que egresados de colegios públicos accedan a la universidad.',
                bullets: ['Becas y auxilios de transporte', 'Mentoría vocacional en colegios'],
                img: '/aliados/jovenes-mas/banner-10anios.png',
                tag: 'Línea de Educación Superior'
              },
              {
                num: 'No - 02',
                icon: Trophy,
                title: 'Muévete con Jóvenes+ (Deporte)',
                desc: 'Torneos nocturnos comunitarios de voleibol y microfútbol en los barrios de Turbo para fomentar la sana convivencia y entornos protectores.',
                bullets: ['Torneos nocturnos barriales', 'Dotación deportiva comunitaria'],
                img: '/aliados/jovenes-mas/semana-juventud.jpg',
                tag: 'Línea de Deporte & Convivencia'
              },
              {
                num: 'No - 03',
                icon: Users,
                title: 'Líderes de Cambio & Empleabilidad',
                desc: 'En alianza con Fundación Mi Sangre y la red de empresas PSP, formamos jóvenes en liderazgo, cultura de paz e inserción laboral.',
                bullets: ['Alianza Fundación Mi Sangre', 'Conexión laboral Red PSP'],
                img: '/aliados/jovenes-mas/mi-sangre.png',
                tag: 'Línea de Liderazgo & Empleo'
              }
            ].map((prog, index) => {
              const IconComp = prog.icon;
              return (
                <div
                  key={index}
                  className="group relative rounded-[2rem] overflow-hidden bg-[#05241d] border border-white/15 shadow-2xl flex flex-col justify-between min-h-[430px]"
                >
                  {/* Imagen de fondo con gradiente oscuro inferior */}
                  <div className="absolute inset-0">
                    <img
                      src={prog.img}
                      alt={prog.title}
                      className="w-full h-full object-cover opacity-55 group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#041d17] via-[#062921]/85 to-transparent" />
                  </div>

                  {/* Top Row: Icono circular + Badge No - 0X */}
                  <div className="relative z-10 p-6 flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-[#f5c518] text-[#05241d] flex items-center justify-center shadow-lg">
                      <IconComp className="w-6 h-6" />
                    </div>
                    <span className="px-3.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white/90 text-xs font-extrabold">
                      {prog.num}
                    </span>
                  </div>

                  {/* Bottom Panel: Texto + Checks + Sello de Programa (Sin botones de pago) */}
                  <div className="relative z-10 p-6 pt-12 space-y-4">
                    <h3 className="text-xl font-black text-white group-hover:text-[#f5c518] transition-colors">
                      {prog.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-emerald-100/85 leading-relaxed">
                      {prog.desc}
                    </p>

                    <div className="space-y-1.5 pt-1">
                      {prog.bullets.map((b, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 text-xs font-bold text-emerald-200"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#f5c518] shrink-0" />
                          <span>{b}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-emerald-200/70 font-semibold">
                      <span>{prog.tag}</span>
                      <span className="text-[#f5c518] font-bold">Activo 2026</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. SECCIÓN ÚNICA DE CAUSAS Y RECAUDACIÓN CON WOMPI PSP (Limpia, sobria y transparente) */}
      <section id="donar-jovenes" className="py-20 sm:py-24 px-4 sm:px-8 bg-[#f4f7f4]">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Encabezado de Donaciones */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#08382e]/10 text-[#08382e] text-xs font-extrabold">
                <Heart className="w-3.5 h-3.5 fill-[#08382e]" />
                <span>Fondo Social Verificado &bull; Pasarela Wompi PSP</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight">
                ¿Deseas Sumarte a una Causa Específica?
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Si deseas realizar un aporte voluntario, puedes elegir la meta social que prefieras respaldar. Las donaciones se procesan con total transparencia a través del <strong>Wompi de PSP</strong>.
              </p>
            </div>

            {/* Insignia de Garantía Wompi */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3.5 self-start">
              <div className="w-11 h-11 rounded-xl bg-emerald-100 text-[#08382e] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="text-xs">
                <p className="font-black text-slate-900">Recaudación Transparente PSP</p>
                <p className="text-slate-500 text-[11px]">
                  Comprobante digital inmediato tras tu aporte
                </p>
              </div>
            </div>
          </div>

          {/* Grid de 3 Causas (Sin barras de dinero quemadas, 100% honesto sobre el destino del aporte) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {campaigns.map((camp) => (
              <div
                key={camp.id}
                className="bg-white rounded-[2rem] border border-slate-200/90 shadow-lg hover:shadow-xl transition-all overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={camp.image}
                      alt={camp.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#08382e]/90 backdrop-blur-md text-[#f5c518] text-[11px] font-extrabold">
                      {camp.category}
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    <h3 className="text-lg font-black text-slate-900 leading-snug">
                      {camp.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{camp.description}</p>

                    {/* Bloque de Transparencia del Destino (Sin cifras falsas ni barras quemadas) */}
                    <div className="p-4 rounded-2xl bg-[#f4f7f4] border border-slate-200/70 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#08382e]">
                        <CheckCircle2 className="w-4 h-4 text-[#08382e] shrink-0" />
                        <span>Destino directo en territorio</span>
                      </div>
                      <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                        {camp.impactDetail}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Único botón limpio por causa */}
                <div className="px-6 pb-6 pt-1">
                  <button
                    type="button"
                    onClick={() => handleOpenDonateFlow(camp, camp.suggestedAmount)}
                    className="w-full py-3.5 px-4 rounded-full bg-[#08382e] hover:bg-[#0b4a3d] text-white font-black text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                  >
                    <span>Aportar a esta Causa</span>
                    <ArrowUpRight className="w-4 h-4 text-[#f5c518]" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. GALERÍA EN TERRITORIO & LÍDERES DE CAMBIO (Sin botones de cobro) */}
      <section id="galeria-jovenes" className="py-20 px-4 sm:px-8 bg-white">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-xs font-extrabold text-[#08382e] uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-[#f5c518]" />
                <span>Evidencia Social en Urabá</span>
              </div>
              <h2 className="text-3xl font-black text-slate-900">
                Galería en Territorio & Líderes de Cambio
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md">
              Haz clic sobre cualquier fotografía para ampliar los registros oficiales de nuestras jornadas en Turbo.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {galleryImages.map((item, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedImageModal(item)}
                className="group rounded-3xl overflow-hidden bg-slate-50 border border-slate-200 shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={item.src}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 p-2 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <Maximize2 className="w-4 h-4" />
                  </div>
                </div>
                <div className="p-4 space-y-1">
                  <h4 className="text-sm font-black text-slate-900 group-hover:text-[#08382e] transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{item.subtitle}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Banner Institucional de Líderes Destacados (Con botón de contacto institucional, no de cobro) */}
          <div className="rounded-3xl bg-gradient-to-r from-[#08382e] to-[#05241d] text-white p-6 sm:p-10 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-3 max-w-2xl">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f5c518]/20 text-[#f5c518] text-xs font-extrabold">
                <Award className="w-3.5 h-3.5" /> Convenio Formativo Fundación Mi Sangre
              </span>
              <h3 className="text-2xl sm:text-3xl font-black">
                Jóvenes Multiplicadores del Cambio en Turbo
              </h3>
              <p className="text-xs sm:text-sm text-emerald-100/85 leading-relaxed">
                Destacamos el compromiso de nuestros jóvenes líderes formados en articulación con la{' '}
                <strong>Fundación Mi Sangre</strong>: Aldin David Perea, Karen Mena, Jana Romaña y Jhon Eric Mena.
              </p>
            </div>

            <a
              href="mailto:jovenesmasorg@gmail.com"
              className="shrink-0 px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/25 text-white font-black text-xs sm:text-sm flex items-center gap-2 transition-all"
            >
              <Mail className="w-4 h-4 text-[#f5c518]" />
              <span>Contactar a la Organización</span>
            </a>
          </div>
        </div>
      </section>

      {/* 8. FOOTER DE JÓVENES+ ORGANIZACIÓN */}
      <footer className="bg-[#05241d] text-white/80 py-12 px-4 sm:px-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img
              src="/aliados/jovenes-mas/logo.png"
              alt="Jóvenes+"
              className="w-10 h-10 rounded-full bg-white p-0.5 object-contain"
            />
            <div>
              <p className="text-sm font-black text-white">Jóvenes+ Organización</p>
              <p className="text-xs text-emerald-200/70">
                Turbo, Urabá Antioqueño &bull; Entidad Afiliada a la Red Social PSP
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs">
            <a
              href="mailto:jovenesmasorg@gmail.com"
              className="text-emerald-200/80 hover:text-white transition-colors"
            >
              jovenesmasorg@gmail.com
            </a>
            <Link
              to="/empresas-aliadas"
              className="text-[#f5c518] hover:underline font-bold transition-colors"
            >
              ← Volver al Directorio de Empresas Aliadas
            </Link>
          </div>
        </div>
      </footer>

      {/* MODAL 1: CONFIGURADOR DE DONACIÓN (PRE-CHECKOUT WOMPI) */}
      {isDonationSetupOpen && (
        <div
          onClick={() => setIsDonationSetupOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200"
          >
            <div className="bg-[#08382e] text-white p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-[#f5c518] text-[#05241d] flex items-center justify-center font-black">
                  <HandHeart className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#f5c518] block">
                    Fondo Social PSP &bull; Wompi
                  </span>
                  <h3 className="text-base sm:text-lg font-black">
                    Donar a Jóvenes+ Organización
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsDonationSetupOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleProceedToWompi} className="p-6 space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-slate-700 block">
                  Destino de tu donación:
                </label>
                <select
                  value={selectedCampaign?.id}
                  onChange={(e) => {
                    const found = campaigns.find((c) => c.id === e.target.value);
                    if (found) setSelectedCampaign(found);
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#08382e]"
                >
                  {campaigns.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-extrabold text-slate-700 block">
                  Elige el monto a donar (COP):
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {PRESET_AMOUNTS.map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => handleSelectPreset(amt)}
                      className={`py-2 px-2 rounded-xl text-xs font-black border transition-all cursor-pointer ${
                        donationAmount === amt && !customAmountInput
                          ? 'bg-[#08382e] text-[#f5c518] border-[#08382e]'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      ${(amt / 1000).toFixed(0)}k
                    </button>
                  ))}
                </div>
                <div className="relative pt-1">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-black text-slate-400">
                    $
                  </span>
                  <input
                    type="text"
                    value={customAmountInput}
                    onChange={handleCustomAmountChange}
                    placeholder="O escribe otro valor en pesos (mín. $5.000)"
                    className="w-full pl-7 pr-14 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#08382e]"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400">
                    COP
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">
                    Tu Nombre o Empresa (Opcional)
                  </label>
                  <input
                    type="text"
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    placeholder="Ej: Carlos Restrepo"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#08382e]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">
                    Correo para Certificado
                  </label>
                  <input
                    type="email"
                    value={donorEmail}
                    onChange={(e) => setDonorEmail(e.target.value)}
                    placeholder="correo@ejemplo.com"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#08382e]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  Mensaje de apoyo para los jóvenes (Opcional)
                </label>
                <input
                  type="text"
                  value={donorMessage}
                  onChange={(e) => setDonorMessage(e.target.value)}
                  placeholder="¡Sigan adelante transformando a Urabá!"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#08382e]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-full bg-[#f5c518] hover:bg-[#ffd43b] text-[#05241d] font-black text-xs sm:text-sm shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Lock className="w-4 h-4" />
                <span>
                  Continuar a Pasarela Wompi (${donationAmount.toLocaleString('es-CO')} COP)
                </span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: PASARELA DE PAGOS WOMPI DE PSP */}
      <MockPaymentModal
        isOpen={isWompiOpen}
        onClose={() => setIsWompiOpen(false)}
        totalAmount={donationAmount}
        orderReference={`DON-JOV-${Date.now().toString().slice(-5)}`}
        buyerInfo={{
          name: donorName || 'Donante Solidario PSP',
          email: donorEmail || 'donaciones@psp.com.co',
          phone: '3120000000'
        }}
        onPaymentSuccess={handleWompiSuccess}
      />

      {/* MODAL 3: CERTIFICADO / COMPROBANTE DE DONACIÓN EXITOSA */}
      {donationReceipt && (
        <div
          onClick={() => setDonationReceipt(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-emerald-500/30 p-6 sm:p-8 text-center space-y-5"
          >
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#08382e] mx-auto flex items-center justify-center shadow-inner">
              <CheckCircle2 className="w-9 h-9 text-emerald-600" />
            </div>

            <div className="space-y-1">
              <span className="px-3 py-1 rounded-full bg-[#f5c518]/30 text-[#05241d] text-[10px] font-black uppercase tracking-wider">
                Comprobante Oficial Wompi PSP
              </span>
              <h3 className="text-2xl font-black text-slate-900 pt-1">
                ¡Gracias por tu Donación!
              </h3>
              <p className="text-xs text-slate-500">
                Tu aporte ya está sumando a la transformación juvenil de Turbo y Urabá.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-left space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">Organización Beneficiaria:</span>
                <span className="font-black text-[#08382e]">Jóvenes+ Organización</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">Causa Apoyada:</span>
                <span className="font-bold text-slate-900 text-right max-w-[200px] truncate">
                  {donationReceipt.campaignTitle}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">Donante:</span>
                <span className="font-bold text-slate-900">{donationReceipt.donorName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">ID Transacción Wompi:</span>
                <span className="font-mono font-bold text-emerald-700">
                  {donationReceipt.transactionId}
                </span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2 text-sm">
                <span className="font-extrabold text-slate-700">Total Donado:</span>
                <span className="font-black text-[#08382e]">
                  ${donationReceipt.amount?.toLocaleString('es-CO')} COP
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setDonationReceipt(null)}
              className="w-full py-3 rounded-full bg-[#08382e] hover:bg-[#0a473b] text-white font-black text-xs cursor-pointer"
            >
              Finalizar y Volver a Jóvenes+
            </button>
          </div>
        </div>
      )}

      {/* LIGHTBOX MODAL PARA IMÁGENES DE LA GALERÍA */}
      {selectedImageModal && (
        <div
          onClick={() => setSelectedImageModal(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-900 border border-slate-800 max-w-3xl w-full rounded-3xl overflow-hidden shadow-2xl space-y-4 p-4 sm:p-6 relative"
          >
            <button
              type="button"
              onClick={() => setSelectedImageModal(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors z-10 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="max-h-[65vh] w-full flex items-center justify-center overflow-hidden rounded-2xl bg-black">
              <img
                src={selectedImageModal.src}
                alt={selectedImageModal.title}
                className="max-h-[65vh] max-w-full object-contain"
              />
            </div>

            <div className="space-y-1 pt-2">
              <h3 className="text-base font-black text-white">{selectedImageModal.title}</h3>
              <p className="text-xs text-slate-300">{selectedImageModal.subtitle}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JovenesMas;
