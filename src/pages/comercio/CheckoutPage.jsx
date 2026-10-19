import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ShoppingBag, 
  MapPin, 
  CreditCard, 
  Truck, 
  Store, 
  CheckCircle2, 
  ArrowLeft, 
  ArrowRight, 
  AlertCircle,
  ShieldCheck,
  Phone,
  User,
  Banknote,
  Building2,
  PackageCheck
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import ordersApi from '../../services/ordersApi';
import MockPaymentModal from '../../components/comercio/MockPaymentModal';
import { MIN_PURCHASE_AMOUNT } from '../../constants/commerce';

const MUNICIPIOS_URABA = [
  'Apartadó',
  'Turbo',
  'Carepa',
  'Chigorodó',
  'Necoclí',
  'San Pedro de Urabá',
  'San Juan de Urabá',
  'Arboletes',
  'Mutatá',
  'Murindó',
  'Vigía del Fuerte',
  'Medellín / Nacional'
];

export default function CheckoutPage() {
  const {
    cartGroups,
    cartItems,
    totalAmount,
    subtotalAmount = totalAmount,
    discountPercentage = 0,
    discountAmount = 0,
    payableAmount,
    clearCart
  } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const finalPayableAmount = payableAmount !== undefined ? payableAmount : totalAmount;

  // Formulario de Entrega
  const [receiverName, setReceiverName] = useState(user?.name || '');
  const [contactPhone, setContactPhone] = useState(user?.phone || '');
  const [municipality, setMunicipality] = useState(user?.municipio || 'Apartadó');
  const [address, setAddress] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [notes, setNotes] = useState('');

  // Errores específicos por campo y campos tocados
  const [fieldErrors, setFieldErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});

  // Método de Pago ('cash_on_delivery' | 'wompi')
  const [paymentMethod, setPaymentMethod] = useState('cash_on_delivery');

  // Estados de proceso
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [completedOrder, setCompletedOrder] = useState(null);

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // Clave de idempotencia única para este intento de compra
  const [idempotencyKey] = useState(() => `idemp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`);

  // Helpers de validación profesional y formateo
  const formatPhoneNumber = (val) => {
    // Extraer solo dígitos
    let digits = val.replace(/\D/g, '');
    // Si viene con el código de país 57 al inicio y tiene más de 10 dígitos, quitarlo
    if (digits.startsWith('57') && digits.length > 10) {
      digits = digits.slice(2);
    }
    // Limitar a máximo 10 dígitos (estándar nacional Colombia)
    digits = digits.slice(0, 10);

    // Formatear visualmente: 3XX XXX XXXX
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
    return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
  };

  const getCleanPhoneDigits = (val) => {
    let digits = (val || '').replace(/\D/g, '');
    if (digits.startsWith('57') && digits.length > 10) {
      digits = digits.slice(2);
    }
    return digits;
  };

  const validateField = (name, value) => {
    let err = '';
    const val = (value || '').trim();

    if (name === 'receiverName') {
      if (!val) {
        err = 'El nombre de quien recibe es obligatorio.';
      } else if (val.length < 5) {
        err = 'Ingresa un nombre y apellido con al menos 5 caracteres.';
      } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]+$/.test(val)) {
        err = 'El nombre no debe contener números ni símbolos especiales.';
      } else if (!/\s+/.test(val)) {
        err = 'Por favor ingresa nombre y apellido para entrega segura.';
      }
    }

    if (name === 'contactPhone') {
      const cleanDigits = getCleanPhoneDigits(val);
      if (!cleanDigits) {
        err = 'El teléfono de contacto es obligatorio.';
      } else if (cleanDigits.length !== 10) {
        err = `Debe tener 10 dígitos (actualmente tiene ${cleanDigits.length}).`;
      } else if (!cleanDigits.startsWith('3') && !cleanDigits.startsWith('60')) {
        err = 'Ingresa un celular válido (inicia por 3) o línea fija (inicia por 60).';
      }
    }

    if (name === 'address') {
      if (!val) {
        err = 'La dirección exacta de entrega es obligatoria.';
      } else if (val.length < 7) {
        err = 'Ingresa una dirección completa (ej. Calle, Carrera, Vereda o referencia clara).';
      }
    }

    if (name === 'neighborhood') {
      if (val && val.length < 3) {
        err = 'Si indicas un barrio o sector, debe tener al menos 3 caracteres.';
      }
    }

    return err;
  };

  const handleFieldBlur = (fieldName, value) => {
    setTouchedFields(prev => ({ ...prev, [fieldName]: true }));
    const error = validateField(fieldName, value);
    setFieldErrors(prev => ({ ...prev, [fieldName]: error }));
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    setContactPhone(formatted);
    if (touchedFields.contactPhone) {
      const error = validateField('contactPhone', formatted);
      setFieldErrors(prev => ({ ...prev, contactPhone: error }));
    }
  };

  const handleInitiateOrder = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    // Marcar todos los campos como tocados y evaluar errores
    const nameErr = validateField('receiverName', receiverName);
    const phoneErr = validateField('contactPhone', contactPhone);
    const addrErr = validateField('address', address);
    const neighErr = validateField('neighborhood', neighborhood);

    const errors = {
      receiverName: nameErr,
      contactPhone: phoneErr,
      address: addrErr,
      neighborhood: neighErr
    };

    setTouchedFields({
      receiverName: true,
      contactPhone: true,
      address: true,
      neighborhood: true
    });
    setFieldErrors(errors);

    const hasValidationErrors = Object.values(errors).some(err => !!err);
    if (hasValidationErrors) {
      setErrorMessage('Por favor corrige los campos señalados en rojo antes de continuar con tu compra.');
      return;
    }

    if (subtotalAmount < MIN_PURCHASE_AMOUNT) {
      setErrorMessage(`El monto mínimo de compra en la plataforma es de $${MIN_PURCHASE_AMOUNT.toLocaleString()} COP. Tu carrito suma $${subtotalAmount.toLocaleString()} COP. Agrega más productos para continuar.`);
      return;
    }

    // Si el usuario eligió Wompi, abrimos la pasarela de pago Wompi
    if (paymentMethod === 'wompi') {
      setIsPaymentModalOpen(true);
      return;
    }

    // Si es contraentrega, se procesa de inmediato
    await executeCheckout('cash_on_delivery', null);
  };

  const executeCheckout = async (chosenPaymentMethod, paymentResult) => {
    setSubmitting(true);
    try {
      const cleanPhone = getCleanPhoneDigits(contactPhone);
      const payload = {
        paymentMethod: chosenPaymentMethod,
        idempotencyKey,
        shipping: {
          receiverName: receiverName.trim(),
          contactPhone: cleanPhone,
          department: 'Antioquia',
          municipality,
          address: address.trim(),
          neighborhood: neighborhood.trim() || null,
          notes: notes.trim() || null
        }
      };

      if (chosenPaymentMethod === 'wompi') {
        payload.paymentGateway = 'wompi';
        if (paymentResult) {
          payload.paymentTransactionId = paymentResult.transactionId;
          payload.cardBrand = paymentResult.cardBrand;
          payload.cardLastFour = paymentResult.lastFour;
          payload.authorizationCode = paymentResult.authorizationCode || `AUTH-${Date.now().toString().slice(-6)}`;
          payload.installments = paymentResult.installments || 1;
        }
      }

      const result = await ordersApi.checkout(payload);

      // Si fue pagado a través de la pasarela Wompi, emitir la confirmación mediante el webhook
      if (chosenPaymentMethod === 'wompi' && paymentResult) {
        try {
          await ordersApi.postPaymentWebhook({
            orderId: result.id,
            orderNumber: result.orderNumber,
            transactionId: paymentResult.transactionId,
            status: 'APPROVED',
            authorizationCode: payload.authorizationCode,
            gateway: 'wompi',
            rawPayload: JSON.stringify(paymentResult)
          });
          result.paymentStatus = 'paid';
          result.status = 'confirmed';
        } catch (webhookErr) {
          console.warn('Confirmación vía webhook diferida', webhookErr);
        }
        result.mockPayment = paymentResult;
      }

      setCompletedOrder(result);
      await clearCart();
    } catch (err) {
      const msg = err.message || 'Ocurrió un error al procesar el pedido. Por favor intenta de nuevo.';
      if (msg.toLowerCase().includes('stock insuficiente') || msg.toLowerCase().includes('agotado')) {
        setErrorMessage(`⚠️ Disponibilidad de inventario: ${msg} Por favor revisa tu carrito para ajustar las cantidades.`);
      } else {
        setErrorMessage(msg);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handlePaymentApproved = async (paymentResult) => {
    setIsPaymentModalOpen(false);
    await executeCheckout(paymentResult.paymentMethod, paymentResult);
  };

  if (completedOrder) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 animate-fadeIn">
        <div className="bg-white dark:bg-[#131c1a] border border-emerald-500/30 rounded-3xl p-6 sm:p-10 shadow-2xl text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-12 h-12 animate-bounce" />
          </div>

          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-teal-300 text-xs font-bold">
              ¡Pedido Confirmado con Éxito!
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Orden #{completedOrder.orderNumber}
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-lg mx-auto">
              Tu compra se ha procesado correctamente y ha sido distribuida a los comercios correspondientes.
            </p>
          </div>

          {/* Tarjeta de Comprobante de Pago Mock Wompi */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-teal-950/30 border border-emerald-500/30 flex items-center justify-between text-left">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-700 dark:text-teal-300 flex items-center justify-center">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  {completedOrder.mockPayment 
                    ? `Pago Aprobado con ${completedOrder.mockPayment.cardBrand || 'Tarjeta'} (Wompi Sandbox)`
                    : completedOrder.paymentMethod === 'cash_on_delivery' 
                      ? 'Pago Contraentrega (Efectivo)' 
                      : 'Pago Registrado'}
                </p>
                <p className="text-[11px] text-slate-500">
                  {completedOrder.mockPayment 
                    ? `Ref Transacción: ${completedOrder.mockPayment.transactionId} • Terminada en ${completedOrder.mockPayment.lastFour}`
                    : completedOrder.paymentMethod === 'cash_on_delivery'
                      ? 'Cancela en efectivo al recibir tu paquete en Urabá'
                      : 'Procesado en el sistema'}
                </p>
              </div>
            </div>
            <span className="text-xs font-black px-2.5 py-1 rounded-full bg-emerald-200 dark:bg-emerald-900/60 text-emerald-800 dark:text-teal-200 uppercase">
              {completedOrder.paymentStatus === 'paid' || completedOrder.mockPayment ? 'Pagado' : 'Pendiente'}
            </span>
          </div>

          {/* Desglose de Paquetes por Empresa Aliada (Split-Order) */}
          <div className="text-left space-y-3 pt-4 border-t border-slate-100 dark:border-[#203330]">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
              Desglose de Paquetes por Empresa Aliada ({completedOrder.subOrders?.length || 1})
            </h3>

            <div className="space-y-3">
              {completedOrder.subOrders?.map((sub) => (
                <div 
                  key={sub.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row justify-between sm:items-center gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Store className="w-4 h-4 text-emerald-600 dark:text-teal-400" />
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        {sub.companyName || 'Comercio Local'}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {sub.subOrderNumber}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      {sub.items?.length || 0} producto(s) &bull; Estado: <strong className="text-emerald-700 dark:text-teal-400 uppercase text-[11px]">{sub.status}</strong>
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-black text-slate-900 dark:text-white">
                      ${sub.totalAmount?.toLocaleString()} COP
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 dark:border-[#203330] flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/mis-pedidos"
              className="px-6 py-3.5 rounded-xl bg-[#0c4236] hover:bg-[#0f5144] dark:bg-teal-400 dark:hover:bg-teal-300 text-white dark:text-slate-950 font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              <PackageCheck className="w-4 h-4" />
              <span>Ver el Estado de Mis Pedidos</span>
            </Link>
            <Link
              to="/comercio"
              className="px-6 py-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-extrabold text-xs transition-all flex items-center justify-center gap-2"
            >
              <span>Seguir Comprando</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">Tu carrito está vacío</h2>
        <p className="text-sm text-slate-500">
          No tienes productos en el carrito para procesar una compra.
        </p>
        <Link
          to="/comercio"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-psp-cyan text-slate-950 font-bold text-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al Catálogo</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <Link
          to="/comercio"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a la Tienda</span>
        </Link>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-teal-300 text-xs font-bold">
          <ShieldCheck className="w-4 h-4" />
          <span>Checkout Seguro PSP Urabá</span>
        </div>
      </div>

      <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
        Finalizar Pedido Multi-Comercio
      </h1>

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span className="font-semibold">{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleInitiateOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Columna Izquierda: Formulario de Entrega y Pago (Cols 1-7) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* 1. Datos de Entrega */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#131c1a] border border-slate-200 dark:border-[#203330] shadow-sm space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-teal-300 flex items-center justify-center font-bold text-xs">
                1
              </div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                Dirección y Contacto de Entrega
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span>Nombre de quien recibe *</span>
                  {touchedFields.receiverName && !fieldErrors.receiverName && (
                    <span className="text-[10px] text-emerald-600 dark:text-teal-400 font-semibold flex items-center gap-0.5">
                      ✓ Válido
                    </span>
                  )}
                </label>
                <div className="relative">
                  <User className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${
                    touchedFields.receiverName && fieldErrors.receiverName 
                      ? 'text-rose-500' 
                      : 'text-slate-400'
                  }`} />
                  <input
                    type="text"
                    required
                    value={receiverName}
                    onChange={(e) => {
                      setReceiverName(e.target.value);
                      if (touchedFields.receiverName) {
                        setFieldErrors(prev => ({ ...prev, receiverName: validateField('receiverName', e.target.value) }));
                      }
                    }}
                    onBlur={(e) => handleFieldBlur('receiverName', e.target.value)}
                    placeholder="Ej. Juan Pérez"
                    className={`w-full pl-9 pr-3 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-900 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none transition-all ${
                      touchedFields.receiverName && fieldErrors.receiverName
                        ? 'border-rose-500 focus:ring-2 focus:ring-rose-500/30'
                        : 'border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-psp-cyan'
                    }`}
                  />
                </div>
                {touchedFields.receiverName && fieldErrors.receiverName && (
                  <p className="text-[11px] font-semibold text-rose-500 flex items-center gap-1 mt-1 animate-fadeIn">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{fieldErrors.receiverName}</span>
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span>Teléfono de Contacto (WhatsApp) *</span>
                  {touchedFields.contactPhone && !fieldErrors.contactPhone && (
                    <span className="text-[10px] text-emerald-600 dark:text-teal-400 font-semibold flex items-center gap-0.5">
                      ✓ 10 dígitos OK
                    </span>
                  )}
                </label>
                <div className="relative">
                  <Phone className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${
                    touchedFields.contactPhone && fieldErrors.contactPhone 
                      ? 'text-rose-500' 
                      : 'text-slate-400'
                  }`} />
                  <input
                    type="tel"
                    required
                    value={contactPhone}
                    onChange={handlePhoneChange}
                    onBlur={(e) => handleFieldBlur('contactPhone', e.target.value)}
                    placeholder="Ej. 312 000 0000"
                    maxLength={13}
                    className={`w-full pl-9 pr-3 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-900 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none transition-all ${
                      touchedFields.contactPhone && fieldErrors.contactPhone
                        ? 'border-rose-500 focus:ring-2 focus:ring-rose-500/30'
                        : 'border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-psp-cyan'
                    }`}
                  />
                </div>
                {touchedFields.contactPhone && fieldErrors.contactPhone ? (
                  <p className="text-[11px] font-semibold text-rose-500 flex items-center gap-1 mt-1 animate-fadeIn">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{fieldErrors.contactPhone}</span>
                  </p>
                ) : (
                  <p className="text-[10px] text-slate-400 mt-1">
                    Número colombiano a 10 dígitos para notificaciones de entrega.
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Municipio de Urabá *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <select
                    value={municipality}
                    onChange={(e) => setMunicipality(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-psp-cyan"
                  >
                    {MUNICIPIOS_URABA.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Barrio o Sector (opcional)
                </label>
                <input
                  type="text"
                  value={neighborhood}
                  onChange={(e) => {
                    setNeighborhood(e.target.value);
                    if (touchedFields.neighborhood) {
                      setFieldErrors(prev => ({ ...prev, neighborhood: validateField('neighborhood', e.target.value) }));
                    }
                  }}
                  onBlur={(e) => handleFieldBlur('neighborhood', e.target.value)}
                  placeholder="Ej. Barrio Obrero, Centro, Vereda..."
                  className={`w-full px-3 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-900 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none transition-all ${
                    touchedFields.neighborhood && fieldErrors.neighborhood
                      ? 'border-rose-500 focus:ring-2 focus:ring-rose-500/30'
                      : 'border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-psp-cyan'
                  }`}
                />
                {touchedFields.neighborhood && fieldErrors.neighborhood && (
                  <p className="text-[11px] font-semibold text-rose-500 flex items-center gap-1 mt-1 animate-fadeIn">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{fieldErrors.neighborhood}</span>
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>Dirección exacta de entrega *</span>
                {touchedFields.address && !fieldErrors.address && (
                  <span className="text-[10px] text-emerald-600 dark:text-teal-400 font-semibold flex items-center gap-0.5">
                    ✓ Completa
                  </span>
                )}
              </label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value);
                  if (touchedFields.address) {
                    setFieldErrors(prev => ({ ...prev, address: validateField('address', e.target.value) }));
                  }
                }}
                onBlur={(e) => handleFieldBlur('address', e.target.value)}
                placeholder="Ej. Calle 100 # 98-45, Casa 3 / Vereda El Silencio Finca La Palma"
                className={`w-full px-3 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-900 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none transition-all ${
                  touchedFields.address && fieldErrors.address
                    ? 'border-rose-500 focus:ring-2 focus:ring-rose-500/30'
                    : 'border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-psp-cyan'
                }`}
              />
              {touchedFields.address && fieldErrors.address && (
                <p className="text-[11px] font-semibold text-rose-500 flex items-center gap-1 mt-1 animate-fadeIn">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{fieldErrors.address}</span>
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Instrucciones para el domiciliario (opcional)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ej. Portón negro frente a la tienda de abarrotes, timbre 2"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-psp-cyan"
              />
            </div>
          </div>

          {/* 2. Método de Pago */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#131c1a] border border-slate-200 dark:border-[#203330] shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-teal-300 flex items-center justify-center font-bold text-xs">
                2
              </div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                Método de Pago
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between gap-3 ${
                paymentMethod === 'cash_on_delivery'
                  ? 'border-emerald-500 bg-emerald-50/50 dark:bg-teal-950/30'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
              }`}>
                <div className="flex items-center justify-between">
                  <Banknote className="w-5 h-5 text-emerald-600 dark:text-teal-400" />
                  <input
                    type="radio"
                    name="payment"
                    value="cash_on_delivery"
                    checked={paymentMethod === 'cash_on_delivery'}
                    onChange={() => setPaymentMethod('cash_on_delivery')}
                    className="text-emerald-600"
                  />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Pago Contraentrega</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">Paga en efectivo al recibir tu pedido en Urabá</p>
                </div>
              </label>

              <label className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between gap-3 ${
                paymentMethod === 'wompi'
                  ? 'border-emerald-500 bg-emerald-50/50 dark:bg-teal-950/30'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <CreditCard className="w-5 h-5 text-emerald-600 dark:text-teal-400" />
                    <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-teal-300">
                      Oficial
                    </span>
                  </div>
                  <input
                    type="radio"
                    name="payment"
                    value="wompi"
                    checked={paymentMethod === 'wompi'}
                    onChange={() => setPaymentMethod('wompi')}
                    className="text-emerald-600"
                  />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Wompi (Bancolombia)</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">Tarjetas de crédito/débito, PSE, Nequi y Botón Bancolombia</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Resumen de Paquetes por Empresa Aliada (Cols 8-12) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="p-6 rounded-3xl bg-white dark:bg-[#131c1a] border border-slate-200 dark:border-[#203330] shadow-sm space-y-5">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center justify-between">
              <span>Resumen de la Compra</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {cartGroups.length} {cartGroups.length === 1 ? 'Paquete' : 'Paquetes'}
              </span>
            </h3>

            {/* Lista de Paquetes por Comercio */}
            <div className="space-y-4">
              {cartGroups.map((group, idx) => (
                <div key={group.companyId || idx} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800 space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-extrabold pb-2 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-1.5 text-emerald-700 dark:text-teal-400 truncate">
                      <Store className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{group.companyName}</span>
                    </div>
                    <span className="text-slate-500 font-semibold text-[11px]">Paquete {idx + 1} de {cartGroups.length}</span>
                  </div>

                  <div className="space-y-2">
                    {group.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-2.5 text-xs">
                        <img 
                          src={item.imagen || '/icon.png'} 
                          alt={item.nombre} 
                          className="w-9 h-9 rounded-lg object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-slate-800 dark:text-slate-200 truncate">{item.nombre}</p>
                          <p className="text-[10px] text-slate-400">{item.quantity} x ${(item.precio || item.unitPrice || 0).toLocaleString()} COP</p>
                        </div>
                        <span className="font-extrabold text-slate-900 dark:text-white shrink-0">
                          ${((item.precio || item.unitPrice || 0) * item.quantity).toLocaleString()} COP
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 flex justify-between items-center text-[11px] font-bold text-slate-600 dark:text-slate-400">
                    <span>Subtotal paquete:</span>
                    <span className="font-black text-slate-900 dark:text-white">${group.subtotal.toLocaleString()} COP</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Totales */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Subtotal Productos:</span>
                <span className="font-bold text-slate-900 dark:text-white">${subtotalAmount.toLocaleString()} COP</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-teal-400 font-bold">
                  <span>Beneficio Membresía ({discountPercentage}% OFF):</span>
                  <span>-${discountAmount.toLocaleString()} COP</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5" /> Envío subregional:
                </span>
                <span className="font-bold text-emerald-600 dark:text-teal-400">Coordinado con el comercio</span>
              </div>
              <div className="flex justify-between text-base font-black text-slate-900 dark:text-white pt-2 border-t border-slate-100 dark:border-slate-800">
                <span>Total a Pagar:</span>
                <span className="text-[#0c4236] dark:text-teal-400 font-black">${finalPayableAmount.toLocaleString()} COP</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 rounded-2xl bg-[#0c4236] hover:bg-[#0f5144] dark:bg-gradient-to-r dark:from-teal-400 dark:to-emerald-400 dark:hover:from-teal-300 dark:hover:to-emerald-300 text-white dark:text-slate-950 font-black text-sm shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {submitting ? (
                <span>Procesando Pedido...</span>
              ) : (
                <>
                  <span>
                    {paymentMethod === 'wompi'
                      ? 'Pagar con Tarjeta / PSE / Nequi (Wompi)'
                      : 'Confirmar Pedido Contraentrega'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 text-center leading-relaxed pt-2">
              🔒 <strong>Compra protegida:</strong> El inventario se reserva de forma segura al confirmar tu pedido. Conforme a la Ley 1480 de 2011, la disponibilidad se valida en tiempo real.
            </p>
          </div>
        </div>

      </form>

      {/* Modal Pasarela de Pagos Segura (Sandbox Wompi / Redeban) */}
      <MockPaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        totalAmount={finalPayableAmount}
        orderReference={idempotencyKey}
        buyerInfo={{
          name: receiverName.trim(),
          phone: getCleanPhoneDigits(contactPhone),
          email: user?.email
        }}
        onPaymentSuccess={handlePaymentApproved}
      />
    </div>
  );
}
