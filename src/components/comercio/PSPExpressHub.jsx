import React, { useState } from 'react';
import { 
  Bike, 
  Car, 
  Package, 
  MapPin, 
  Navigation, 
  Clock, 
  ShieldCheck, 
  UserCheck, 
  Sparkles, 
  CheckCircle2, 
  Phone, 
  MessageCircle, 
  DollarSign, 
  ArrowRight,
  Search,
  Check,
  Zap,
  Briefcase,
  Bus
} from 'lucide-react';

const PSPExpressHub = ({ transportRoutes = [], onSelectRoute }) => {
  const [activeSubTab, setActiveSubTab] = useState('pedir'); // 'pedir' | 'registro' | 'rutas'

  // Ride / Delivery Request Form State (Uber/Rappi style)
  const [serviceType, setServiceType] = useState('mototaxi'); // 'mototaxi' | 'bici' | 'carro' | 'mandado'
  const [pickupLocation, setPickupLocation] = useState('Parque Principal, Apartadó');
  const [dropoffLocation, setDropoffLocation] = useState('Barrio Ortíz, Apartadó');
  const [isSearchingDriver, setIsSearchingDriver] = useState(false);
  const [matchedDriver, setMatchedDriver] = useState(null);

  // Driver Registration Form State
  const [driverName, setDriverName] = useState('');
  const [driverDoc, setDriverDoc] = useState('');
  const [driverMunicipio, setDriverMunicipio] = useState('Apartadó');
  const [driverVehicle, setDriverVehicle] = useState('mototaxi');
  const [driverPlaca, setDriverPlaca] = useState('');
  const [driverPhone, setDriverPhone] = useState('');
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  // Estimated fare calculation based on vehicle type
  const getEstimatedFare = () => {
    switch (serviceType) {
      case 'mototaxi': return { price: 5000, time: '8-12 min', label: 'Mototaxi Express (Rápido Urbano)' };
      case 'bici': return { price: 4000, time: '12-18 min', label: 'Bici Eléctrica Eco (0 Emisiones)' };
      case 'carro': return { price: 12000, time: '10-15 min', label: 'Carro Climatizado (4 Pasajeros)' };
      case 'mandado': return { price: 6000, time: '15-25 min', label: 'Domicilio / Mandado Paquete' };
      default: return { price: 5000, time: '10 min', label: 'Servicio Express' };
    }
  };

  const currentFare = getEstimatedFare();

  const handleRequestRide = (e) => {
    e.preventDefault();
    setIsSearchingDriver(true);
    setMatchedDriver(null);

    // Simulate Uber/Rappi driver matching algorithm
    setTimeout(() => {
      setIsSearchingDriver(false);
      setMatchedDriver({
        nombre: 'Pedro Manuel Morales',
        vehiculo: serviceType === 'bici' ? 'Bici Eléctrica Specialized' : serviceType === 'carro' ? 'Chevrolet Sail (Placa URA-456)' : 'Yamaha FZ-150 (Placa ABC-12D)',
        municipio: driverMunicipio || 'Apartadó',
        calificacion: 4.9,
        viajes: 342,
        telefono: '+573129876543',
        foto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
      });
    }, 2500);
  };

  const handleRegisterDriver = (e) => {
    e.preventDefault();
    setRegistrationSuccess(true);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Top Banner Header: PSP Express Mobility & Delivery */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#0c4236] via-[#0d5c4b] to-teal-500 p-6 sm:p-8 text-white shadow-2xl overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-teal-300 text-xs font-extrabold backdrop-blur-md">
            <Zap className="w-3.5 h-3.5 text-teal-300" />
            PSP Express • Movilidad & Domicilios Urabá
          </div>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            La Red Comunitaria Tipo Uber & Rappi de nuestra Región
          </h2>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-2xl">
            Pide un viaje en mototaxi, bici eléctrica o carro express, envía paquetes locales o <strong>únete como repartidor/mototaxista</strong> para generar ingresos en Apartadó, Turbo, Necoclí, Carepa, Chigorodó y Mutatá.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-bold text-teal-200">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-teal-300" /> 148 Conductores y Repartidores Activos
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-teal-300" /> Tarifa Justa Comunal 0% Comisión
            </span>
          </div>
        </div>

        {/* Subtle Background Glow Graphic */}
        <div className="absolute right-4 bottom-0 opacity-20 pointer-events-none hidden md:block">
          <Bike className="w-64 h-64 text-white" />
        </div>
      </div>

      {/* Sub-Tab Navigation Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => { setActiveSubTab('pedir'); setMatchedDriver(null); }}
          className={`px-4 py-3 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'pedir'
              ? 'bg-gradient-to-r from-[#0c4236] to-teal-400 text-white shadow-md'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <Bike className="w-4 h-4" />
          <span>Pedir Viaje o Domicilio (Uber/Rappi)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('registro')}
          className={`px-4 py-3 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'registro'
              ? 'bg-gradient-to-r from-[#0c4236] to-teal-400 text-white shadow-md'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <Briefcase className="w-4 h-4 text-emerald-400" />
          <span>Únete como Mototaxista / Domiciliario</span>
        </button>

        <button
          onClick={() => setActiveSubTab('rutas')}
          className={`px-4 py-3 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'rutas'
              ? 'bg-gradient-to-r from-[#0c4236] to-teal-400 text-white shadow-md'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <Bus className="w-4 h-4" />
          <span>Rutas Intermunicipales Urabá</span>
        </button>
      </div>

      {/* SUB-TAB 1: PEDIR VIAJE O DOMICILIO (PASAJERO / CLIENTE) */}
      {activeSubTab === 'pedir' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column (Cols 1-7): Service Type & Pickup/Dropoff Form */}
          <div className="lg:col-span-7 bg-white dark:bg-[#131c1a] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
            
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                ¿Qué servicio necesitas hoy?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Selecciona la modalidad de transporte o envío dentro de Urabá.
              </p>
            </div>

            {/* Vehicle Mode Selector (4 Options Grid) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { id: 'mototaxi', name: 'Mototaxi', icon: Bike, desc: 'Carrera urbana rápida' },
                { id: 'bici', name: 'Bici Eco', icon: Zap, desc: 'Cero emisiones ODS' },
                { id: 'carro', name: 'Carro Express', icon: Car, desc: 'Cómodo 4 pasajeros' },
                { id: 'mandado', name: 'Mandados', icon: Package, desc: 'Envíos y compras' },
              ].map((opt) => {
                const IconComp = opt.icon;
                const isSelected = serviceType === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => { setServiceType(opt.id); setMatchedDriver(null); }}
                    className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between gap-2 cursor-pointer ${
                      isSelected
                        ? 'border-teal-500 bg-teal-500/10 text-slate-900 dark:text-white ring-2 ring-teal-500/30 font-bold'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                    }`}
                  >
                    <IconComp className={`w-6 h-6 ${isSelected ? 'text-teal-500' : 'text-slate-400'}`} />
                    <div>
                      <span className="text-xs font-bold block">{opt.name}</span>
                      <span className="text-[10px] text-slate-500 block leading-tight">{opt.desc}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Interactive Location Form */}
            <form onSubmit={handleRequestRide} className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  📍 Punto de Recogida / Origen *
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-teal-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    placeholder="Ej. Parque Principal, Apartadó"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  🏁 Destino / Lugar de Entrega *
                </label>
                <div className="relative">
                  <Navigation className="w-4 h-4 text-emerald-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={dropoffLocation}
                    onChange={(e) => setDropoffLocation(e.target.value)}
                    placeholder="Ej. Barrio Ortíz / Puerto Antioquia / Terminal"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                  />
                </div>
              </div>

              {/* Fare Calculation Summary Box */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-500 block font-medium">Tarifa Transparente Estándar</span>
                  <span className="font-extrabold text-slate-900 dark:text-white text-sm">{currentFare.label}</span>
                </div>
                <div className="text-right">
                  <span className="text-xl font-black text-teal-600 dark:text-teal-400">${currentFare.price.toLocaleString()} COP</span>
                  <span className="text-[10px] text-slate-400 block">Llegada est: {currentFare.time}</span>
                </div>
              </div>

              {/* Request Action Button */}
              <button
                type="submit"
                disabled={isSearchingDriver}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#0c4236] via-[#0d5c4b] to-teal-400 hover:opacity-95 text-white font-extrabold text-sm shadow-lg shadow-teal-500/25 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSearchingDriver ? (
                  <>
                    <Bike className="w-5 h-5 animate-bounce" />
                    <span>Conectando con mototaxistas y repartidores en Urabá...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    <span>Solicitar Viaje / Domicilio (${currentFare.price.toLocaleString()} COP)</span>
                  </>
                )}
              </button>
            </form>

          </div>

          {/* Right Column (Cols 8-12): Driver Matching Result & Live Status */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Matching Result Card */}
            {matchedDriver ? (
              <div className="p-6 rounded-3xl bg-slate-900 text-white border-2 border-teal-400 shadow-2xl space-y-5 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-xs font-black text-teal-300 uppercase tracking-wider">
                      ¡Conductor Asignado en Camino!
                    </span>
                  </div>
                  <span className="text-[10px] bg-teal-500/20 text-teal-300 px-2.5 py-1 rounded-full font-bold">
                    ETA: 4 min
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <img src={matchedDriver.foto} alt={matchedDriver.nombre} className="w-16 h-16 rounded-2xl object-cover border-2 border-teal-400" />
                  <div>
                    <h4 className="text-base font-extrabold text-white">{matchedDriver.nombre}</h4>
                    <span className="text-xs text-teal-300 font-semibold block">{matchedDriver.vehiculo}</span>
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      ★ {matchedDriver.calificacion} ({matchedDriver.viajes} viajes realizados en Urabá)
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 text-xs space-y-1">
                  <div className="flex justify-between text-slate-300">
                    <span>Recogida:</span>
                    <span className="font-bold text-white">{pickupLocation}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Destino:</span>
                    <span className="font-bold text-white">{dropoffLocation}</span>
                  </div>
                  <div className="flex justify-between text-teal-300 font-black pt-1 border-t border-slate-700">
                    <span>Tarifa Acordada:</span>
                    <span>${currentFare.price.toLocaleString()} COP</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      const msg = encodeURIComponent(`Hola ${matchedDriver.nombre}, solicité un servicio PSP Express de ${pickupLocation} hacia ${dropoffLocation}.`);
                      window.open(`https://wa.me/${matchedDriver.telefono.replace(/[^0-9]/g, '')}?text=${msg}`, '_blank');
                    }}
                    className="flex-1 py-3 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Contactar Conductor</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-teal-500/10 text-teal-500 flex items-center justify-center mx-auto">
                  <Bike className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">
                    Red Social PSP Express Urabá
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs mx-auto">
                    Conectamos la demanda de movilidad de vecinos y comercios con conductores y mototaxistas locales verificados.
                  </p>
                </div>

                <div className="pt-2 text-left space-y-2 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Sin cobros excesivos ni tarifas dinámicas ocultas.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Conexión directa por WhatsApp y confirmación GPS.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Pago seguro en efectivo, Nequi o Daviplata.</span>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>
      )}

      {/* SUB-TAB 2: PORTALSITO DE REGISTRO PARA MOTOTAXIS & REPARTIDORES */}
      {activeSubTab === 'registro' && (
        <div className="max-w-3xl mx-auto bg-white dark:bg-[#131c1a] border border-slate-200 dark:border-teal-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 text-xs font-bold">
              <Briefcase className="w-3.5 h-3.5" />
              Trabaja con la Plataforma Social PSP Express
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Únete como Mototaxista o Domiciliario en Urabá
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto leading-relaxed">
              Trabaja con tu propia moto, bici eléctrica o vehículo. Recibe solicitudes de domicilios de restaurantes locales y carreras urbanas en tu municipio.
            </p>
          </div>

          {registrationSuccess ? (
            <div className="p-6 rounded-3xl bg-emerald-500/15 border border-emerald-500/40 text-center space-y-4 animate-fadeIn">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
              <h4 className="text-lg font-extrabold text-slate-900 dark:text-white">
                ¡Registro Recibido Exitosamente!
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-md mx-auto">
                Bienvenido <strong>{driverName}</strong> a la Red PSP Express de {driverMunicipio}. Nuestro equipo de coordinación verificará tus datos y te activará en la aplicación en menos de 2 horas.
              </p>
              <button
                onClick={() => setRegistrationSuccess(false)}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs shadow-md"
              >
                Registrar otro vehículo / conductor
              </button>
            </div>
          ) : (
            <form onSubmit={handleRegisterDriver} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Juan Carlos Ramos"
                    value={driverName}
                    onChange={(e) => setDriverName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Nro. Cédula de Ciudadanía *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. 1017123456"
                    value={driverDoc}
                    onChange={(e) => setDriverDoc(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Municipio Sede de Operación *
                  </label>
                  <select
                    value={driverMunicipio}
                    onChange={(e) => setDriverMunicipio(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-teal-500 cursor-pointer"
                  >
                    <option value="Apartadó">Apartadó</option>
                    <option value="Turbo">Turbo</option>
                    <option value="Necoclí">Necoclí</option>
                    <option value="Carepa">Carepa</option>
                    <option value="Chigorodó">Chigorodó</option>
                    <option value="Mutatá">Mutatá</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Tipo de Vehículo *
                  </label>
                  <select
                    value={driverVehicle}
                    onChange={(e) => setDriverVehicle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-teal-500 cursor-pointer"
                  >
                    <option value="mototaxi">Mototaxi / Motocicleta</option>
                    <option value="bici">Bicicleta / Bici Eléctrica</option>
                    <option value="carro">Carro Particular / Colectivo</option>
                    <option value="furgon">Furgón / Camioneta de Carga</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Placa del Vehículo (Si aplica)
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. ABC-12D"
                    value={driverPlaca}
                    onChange={(e) => setDriverPlaca(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Teléfono celular con WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="Ej. 312 456 7890"
                    value={driverPhone}
                    onChange={(e) => setDriverPhone(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              {/* Benefits Banner */}
              <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/20 grid grid-cols-1 sm:grid-cols-3 gap-3 text-center text-xs">
                <div>
                  <span className="font-extrabold text-teal-600 dark:text-teal-300 block">0% Comisión Inicial</span>
                  <span className="text-[10px] text-slate-500">Primeros 3 meses gratis</span>
                </div>
                <div>
                  <span className="font-extrabold text-teal-600 dark:text-teal-300 block">Pago Diario</span>
                  <span className="text-[10px] text-slate-500">Nequi o Efectivo inmediato</span>
                </div>
                <div>
                  <span className="font-extrabold text-teal-600 dark:text-teal-300 block">Apoyo Comunal</span>
                  <span className="text-[10px] text-slate-500">Seguro y capacitaciones</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-teal-400 text-slate-950 font-black text-xs shadow-lg hover:opacity-95 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Completar Registro de Conductor / Repartidor PSP</span>
              </button>
            </form>
          )}

        </div>
      )}

      {/* SUB-TAB 3: RUTAS INTERMUNICIPALES (COMPREHENSIVE BUS/ROUTER LISTING) */}
      {activeSubTab === 'rutas' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {transportRoutes.map((ruta) => (
              <div 
                key={ruta.id} 
                onClick={() => onSelectRoute(ruta)}
                className="p-6 rounded-2xl bg-white dark:bg-psp-dark-card border border-slate-200 dark:border-slate-800 shadow-psp-soft space-y-4 hover:shadow-xl transition-all cursor-pointer group"
              >
                <div className="flex justify-between items-center text-xs font-bold text-teal-500">
                  <span>Ruta Intermunicipal</span>
                  <span className="px-2 py-0.5 rounded bg-teal-500/15">{ruta.empresa}</span>
                </div>
                <h4 className="text-lg font-extrabold text-slate-900 dark:text-white group-hover:text-teal-500 transition-colors">
                  {ruta.origen} ➔ {ruta.destino}
                </h4>
                <div className="text-xs text-slate-500 space-y-1">
                  <p>⏱ Tiempo estimado: <strong>{ruta.tiempoEstimado}</strong></p>
                  <p>🔄 Frecuencia: <strong>{ruta.frecuencia}</strong></p>
                </div>
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                  <span className="text-base font-extrabold text-slate-900 dark:text-white">${ruta.precio.toLocaleString()} COP</span>
                  <button className="px-3 py-1.5 rounded-lg bg-slate-900 dark:bg-slate-800 text-white text-xs font-bold group-hover:bg-teal-500 group-hover:text-slate-950 transition-colors flex items-center gap-1">
                    <span>Ver Detalles</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default PSPExpressHub;
