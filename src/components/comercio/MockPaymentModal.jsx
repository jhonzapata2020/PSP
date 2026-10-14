import React, { useState } from 'react';
import { 
  CreditCard, 
  ShieldCheck, 
  X, 
  Lock, 
  Building2, 
  Smartphone, 
  CheckCircle2, 
  AlertTriangle, 
  Loader2, 
  Sparkles,
  ArrowRight,
  Info
} from 'lucide-react';

export default function MockPaymentModal({
  isOpen,
  onClose,
  totalAmount,
  orderReference,
  buyerInfo,
  onPaymentSuccess
}) {
  const [activeTab, setActiveTab] = useState('card'); // 'card' | 'pse' | 'nequi'
  
  // Datos de Tarjeta
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [rawCardNumber, setRawCardNumber] = useState('4242424242424242');
  const [cardHolder, setCardHolder] = useState(buyerInfo?.name || 'Comprador PSP Urabá');
  const [expiry, setExpiry] = useState('12/28');
  const [cvc, setCvc] = useState('123');
  const [installments, setInstallments] = useState(1);
  const [cardBrand, setCardBrand] = useState('Visa');

  // Datos de PSE
  const [bank, setBank] = useState('Bancolombia');
  const [personType, setPersonType] = useState('natural');
  const [pseEmail, setPseEmail] = useState(buyerInfo?.email || 'cliente@psp.com');

  // Datos Nequi
  const [nequiPhone, setNequiPhone] = useState(buyerInfo?.phone || '3120000000');

  // Estados de simulación
  const [isProcessing, setIsProcessing] = useState(false);
  const [processStep, setProcessStep] = useState('');
  const [simulationError, setSimulationError] = useState(null);

  if (!isOpen) return null;

  const handleFillTestCard = (type = 'success') => {
    setSimulationError(null);
    if (type === 'success') {
      setCardNumber('4242 •••• •••• 4242');
      setRawCardNumber('4242424242424242');
      setCardBrand('Visa');
      setExpiry('12/28');
      setCvc('789');
    } else {
      setCardNumber('4000 •••• •••• 0002');
      setRawCardNumber('4000000000000002');
      setCardBrand('Visa');
      setExpiry('08/27');
      setCvc('002');
    }
  };

  const handleProcessPayment = (simulateFailure = false) => {
    setSimulationError(null);
    setIsProcessing(true);
    setProcessStep('Conectando con la red bancaria (Redeban / Wompi)...');

    setTimeout(() => {
      setProcessStep('Verificando token de seguridad 3D Secure...');
    }, 700);

    setTimeout(() => {
      if (simulateFailure || rawCardNumber.endsWith('0002')) {
        setIsProcessing(false);
        setSimulationError('Transacción rechazada por el banco emisor: Fondos insuficientes o límite excedido (Código: WMP_DECLINED_51). Intenta con otra tarjeta.');
      } else {
        setProcessStep('¡Pago autorizado exitosamente!');
        setTimeout(() => {
          setIsProcessing(false);
          const paymentResult = {
            paymentMethod: activeTab === 'card' ? 'online_gateway' : activeTab === 'pse' ? 'pse' : 'direct_transfer',
            transactionId: `WMP-TX-${Date.now().toString().slice(-7)}`,
            status: 'paid',
            gateway: 'Wompi Sandbox',
            cardBrand: activeTab === 'card' ? cardBrand : 'Débito Bancario',
            lastFour: rawCardNumber.slice(-4),
            amount: totalAmount,
            installments: activeTab === 'card' ? installments : 1
          };
          onPaymentSuccess(paymentResult);
        }, 600);
      }
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div 
        className="w-full max-w-lg bg-white dark:bg-[#131c1a] border border-slate-200 dark:border-emerald-500/20 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera Sandbox */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-900 to-[#0c4236] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-400/20 border border-teal-400/30 flex items-center justify-center text-teal-300">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-black tracking-tight">Pasarela Segura PSP Urabá</h3>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  Sandbox Wompi
                </span>
              </div>
              <p className="text-[11px] text-teal-200/80">Simulador oficial de pagos para comercios aliados</p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors disabled:opacity-50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Resumen del Monto */}
        <div className="px-6 py-3.5 bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total a Pagar</span>
            <p className="text-xl font-black text-[#0c4236] dark:text-teal-400">
              ${totalAmount?.toLocaleString()} <span className="text-xs font-bold text-slate-500">COP</span>
            </p>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Referencia</span>
            <p className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
              {orderReference || 'PSP-CHK-2026'}
            </p>
          </div>
        </div>

        {/* Selector de Pestañas de Pago */}
        <div className="grid grid-cols-3 border-b border-slate-200 dark:border-slate-800 p-2 gap-1.5 bg-slate-100/50 dark:bg-slate-900/30">
          <button
            type="button"
            onClick={() => { setActiveTab('card'); setSimulationError(null); }}
            className={`py-2 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'card'
                ? 'bg-white dark:bg-[#1a2825] text-emerald-800 dark:text-teal-300 shadow-sm border border-emerald-500/30'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Tarjeta</span>
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab('pse'); setSimulationError(null); }}
            className={`py-2 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'pse'
                ? 'bg-white dark:bg-[#1a2825] text-emerald-800 dark:text-teal-300 shadow-sm border border-emerald-500/30'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>PSE Débito</span>
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab('nequi'); setSimulationError(null); }}
            className={`py-2 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'nequi'
                ? 'bg-white dark:bg-[#1a2825] text-emerald-800 dark:text-teal-300 shadow-sm border border-emerald-500/30'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Nequi / Bancolombia</span>
          </button>
        </div>

        {/* Cuerpo del Formulario */}
        <div className="p-6 overflow-y-auto space-y-4">
          
          {simulationError && (
            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-start gap-2.5 animate-fadeIn">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold">Error de autorización</span>
                <p className="text-[11px] leading-relaxed">{simulationError}</p>
              </div>
            </div>
          )}

          {/* TAB 1: TARJETA DE CRÉDITO / DÉBITO */}
          {activeTab === 'card' && (
            <div className="space-y-4">
              
              {/* Tarjetas de prueba prefabricadas para testing */}
              <div className="p-3 rounded-2xl bg-teal-50 dark:bg-teal-950/20 border border-teal-500/20 text-[11px] space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-emerald-800 dark:text-teal-300">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Tarjetas Sandbox de Prueba:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleFillTestCard('success')}
                    className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] transition-colors"
                  >
                    4242... (Aprobada)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFillTestCard('decline')}
                    className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-[10px] transition-colors"
                  >
                    4000... (Fondos Insuficientes)
                  </button>
                </div>
              </div>

              {/* Número de Tarjeta */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex justify-between">
                  <span>Número de la Tarjeta</span>
                  <span className="text-[10px] font-mono text-emerald-700 dark:text-teal-400 font-bold">{cardBrand}</span>
                </label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => {
                      setCardNumber(e.target.value);
                      setRawCardNumber(e.target.value.replace(/\D/g, ''));
                    }}
                    placeholder="4242 4242 4242 4242"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-mono font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Titular */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Nombre del Titular
                </label>
                <input
                  type="text"
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value)}
                  placeholder="Como aparece en la tarjeta"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              {/* Vencimiento y CVC */}
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Vence
                  </label>
                  <input
                    type="text"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    placeholder="MM/AA"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-mono font-bold text-center text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    CVC / CVV
                  </label>
                  <input
                    type="password"
                    maxLength={4}
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value)}
                    placeholder="123"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-mono font-bold text-center text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Cuotas
                  </label>
                  <select
                    value={installments}
                    onChange={(e) => setInstallments(Number(e.target.value))}
                    className="w-full px-2 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value={1}>1 cuota</option>
                    <option value={3}>3 cuotas</option>
                    <option value={6}>6 cuotas</option>
                    <option value={12}>12 cuotas</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PSE (DÉBITO BANCARIO) */}
          {activeTab === 'pse' && (
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Selecciona tu Banco
                </label>
                <select
                  value={bank}
                  onChange={(e) => setBank(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="Bancolombia">Bancolombia</option>
                  <option value="Nequi">Nequi</option>
                  <option value="Banco de Bogotá">Banco de Bogotá</option>
                  <option value="Davivienda">Davivienda</option>
                  <option value="Banco Agrario">Banco Agrario de Colombia</option>
                  <option value="Scotiabank Colpatria">Scotiabank Colpatria</option>
                  <option value="BBVA Colombia">BBVA Colombia</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Tipo de Persona
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPersonType('natural')}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      personType === 'natural'
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-teal-950/30 text-emerald-800 dark:text-teal-300'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600'
                    }`}
                  >
                    Persona Natural
                  </button>
                  <button
                    type="button"
                    onClick={() => setPersonType('juridica')}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      personType === 'juridica'
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-teal-950/30 text-emerald-800 dark:text-teal-300'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600'
                    }`}
                  >
                    Persona Jurídica
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Correo Electrónico Registrado en PSE
                </label>
                <input
                  type="email"
                  value={pseEmail}
                  onChange={(e) => setPseEmail(e.target.value)}
                  placeholder="correo@ejemplo.com"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* TAB 3: NEQUI / BANCOLOMBIA */}
          {activeTab === 'nequi' && (
            <div className="space-y-4 text-center">
              <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/20 border border-purple-500/20 space-y-2">
                <div className="w-10 h-10 rounded-full bg-purple-500/20 text-purple-600 dark:text-purple-400 mx-auto flex items-center justify-center">
                  <Smartphone className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-extrabold text-slate-900 dark:text-white">Pago Móvil Nequi / Bancolombia</h4>
                <p className="text-[11px] text-slate-500">
                  Te llegará una notificación push a tu app de Nequi o Bancolombia a la Mano para autorizar el cobro.
                </p>
              </div>

              <div className="space-y-1 text-left">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Número de Celular Nequi
                </label>
                <input
                  type="tel"
                  value={nequiPhone}
                  onChange={(e) => setNequiPhone(e.target.value)}
                  placeholder="300 000 0000"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-mono font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Mensaje de Seguridad */}
          <div className="flex items-center gap-2 pt-2 text-[10px] text-slate-400 justify-center">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Encriptación TLS de 256 bits &bull; Certificado PCI-DSS Nivel 1</span>
          </div>

        </div>

        {/* Footer y Botones de Acción */}
        <div className="p-6 bg-slate-50 dark:bg-[#111917] border-t border-slate-200 dark:border-slate-800 space-y-3">
          
          {isProcessing ? (
            <div className="py-4 text-center space-y-3 animate-fadeIn">
              <Loader2 className="w-8 h-8 text-emerald-600 dark:text-teal-400 animate-spin mx-auto" />
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300 animate-pulse">
                {processStep}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleProcessPayment(false)}
                className="w-full py-3.5 rounded-2xl bg-[#0c4236] hover:bg-[#0f5144] dark:bg-gradient-to-r dark:from-teal-400 dark:to-emerald-400 dark:hover:from-teal-300 dark:hover:to-emerald-300 text-white dark:text-slate-950 font-black text-xs shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Pagar ${(totalAmount || 0).toLocaleString()} COP (Simular Aprobado)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleProcessPayment(true)}
                  className="flex-1 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-rose-100 dark:hover:bg-rose-950/40 text-slate-700 dark:text-slate-300 hover:text-rose-600 text-[10px] font-bold transition-all"
                >
                  Simular Rechazo Bancario
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 text-[10px] font-bold transition-all"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
