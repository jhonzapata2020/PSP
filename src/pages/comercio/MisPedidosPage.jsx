import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, 
  Store, 
  Clock, 
  CheckCircle, 
  Truck, 
  MapPin, 
  ArrowLeft, 
  RefreshCw,
  ShoppingBag,
  AlertCircle,
  CreditCard,
  Banknote,
  Building2,
  Copy,
  Check,
  Printer,
  X,
  ShieldCheck,
  PackageCheck,
  Calendar,
  Phone,
  User,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import ordersApi from '../../services/ordersApi';
import { 
  calculateOrderFinancialBreakdown, 
  getPaymentDisplayInfo, 
  isItemIvaExempt 
} from '../../utils/orderTaxUtils';

const STATUS_CONFIG = {
  confirmed: { label: 'Confirmado', bg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20' },
  preparing: { label: 'En Preparación', bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' },
  ready_to_ship: { label: 'Listo para Despacho', bg: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20' },
  shipped: { label: 'En Camino / Despachado', bg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20' },
  delivered: { label: 'Entregado', bg: 'bg-emerald-500/10 text-emerald-600 dark:text-teal-400 border-emerald-500/20' },
  cancelled: { label: 'Cancelado', bg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20' },
  pending: { label: 'Pendiente', bg: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20' },
};

const STEPS = [
  { key: 'confirmed', label: 'Confirmado', icon: CheckCircle },
  { key: 'preparing', label: 'En Preparación', icon: Clock },
  { key: 'ready_to_ship', label: 'Empacado', icon: PackageCheck },
  { key: 'shipped', label: 'En Camino', icon: Truck },
  { key: 'delivered', label: 'Entregado', icon: MapPin },
];

const STEP_ORDER = {
  confirmed: 1,
  preparing: 2,
  ready_to_ship: 3,
  shipped: 4,
  delivered: 5,
};

export default function MisPedidosPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);
  
  // Recibo digital modal
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState(null);
  const [copiedTxId, setCopiedTxId] = useState(false);

  const loadOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await ordersApi.getMyOrders({ page: 1, pageSize: 20 });
      setOrders(res?.items || []);
    } catch (err) {
      setError(err.message || 'No se pudieron cargar los pedidos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('¿Seguro que deseas cancelar este pedido? Se liberará el inventario reservado en bodega.'))
      return;

    setCancellingId(orderId);
    try {
      await ordersApi.cancelMyOrder(orderId);
      await loadOrders();
    } catch (err) {
      alert(err.message || 'Error al cancelar pedido.');
    } finally {
      setCancellingId(null);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedTxId(true);
    setTimeout(() => setCopiedTxId(false), 2000);
  };

  const handlePrintReceipt = (order) => {
    if (!order) return;

    const existingFrame = document.getElementById('psp-receipt-print-frame');
    if (existingFrame) existingFrame.remove();

    const iframe = document.createElement('iframe');
    iframe.id = 'psp-receipt-print-frame';
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const dateFormatted = new Date(order.createdAt).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const fin = calculateOrderFinancialBreakdown(order);
    const payInfo = getPaymentDisplayInfo(order);

    const itemsRows = (order.items || []).map(item => {
      const isExempt = isItemIvaExempt(item);
      const taxTag = isExempt ? 'IVA 0% (Excluido Canasta Familiar Art. 424 E.T.)' : 'IVA 19% Incluido';
      return `
        <tr>
          <td style="padding: 7px 6px; border-bottom: 1px solid #e2e8f0; font-size: 11px;">
            <strong>${item.productName}</strong><br/>
            <span style="font-size: 9.5px; color: #64748b;">SKU: ${item.sku || 'N/A'} • ${item.companyName || 'Comercio Local'} • <em style="color: ${isExempt ? '#047857' : '#475569'};">${taxTag}</em></span>
          </td>
          <td style="padding: 7px 6px; border-bottom: 1px solid #e2e8f0; text-align: center; font-size: 11px;">
            ${item.quantity}
          </td>
          <td style="padding: 7px 6px; border-bottom: 1px solid #e2e8f0; text-align: right; font-size: 11px;">
            $${(item.unitPrice || 0).toLocaleString('es-CO')}
          </td>
          <td style="padding: 7px 6px; border-bottom: 1px solid #e2e8f0; text-align: right; font-size: 11px; font-weight: bold;">
            $${(item.lineTotal || 0).toLocaleString('es-CO')}
          </td>
        </tr>
      `;
    }).join('');

    let paymentAuditHtml = '';
    if (payInfo.isOnline) {
      paymentAuditHtml = `
        <div style="margin-top: 10px; padding: 9px 12px; background: #f0fdfa; border: 1px solid #99f6e4; border-radius: 8px; font-size: 10px; color: #115e59;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 3px;">
            <strong style="font-size: 10.5px; color: #0f766e;">${payInfo.title}</strong>
            <span style="background: #ccfbf1; color: #0f766e; padding: 2px 6px; border-radius: 4px; font-weight: bold; font-size: 9px;">${payInfo.badge}</span>
          </div>
          <p style="margin: 2px 0;"><strong>Pasarela Procesadora:</strong> ${payInfo.gateway}</p>
          ${payInfo.cardBrand ? `<p style="margin: 2px 0;"><strong>Medio de Pago:</strong> ${payInfo.cardBrand} ${payInfo.lastFour} &bull; ${payInfo.installments} cuota(s)</p>` : ''}
          <p style="margin: 2px 0; font-family: monospace;"><strong>ID Transacción:</strong> ${payInfo.transactionId}</p>
          ${payInfo.authorizationCode ? `<p style="margin: 2px 0; font-family: monospace;"><strong>Cód. Autorización Bancaria:</strong> ${payInfo.authorizationCode}</p>` : ''}
        </div>
      `;
    } else {
      paymentAuditHtml = `
        <div style="margin-top: 10px; padding: 9px 12px; background: #fefce8; border: 1px solid #fef08a; border-radius: 8px; font-size: 10px; color: #854d0e;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 3px;">
            <strong style="font-size: 10.5px; color: #a16207;">${payInfo.title}</strong>
            <span style="background: #fef9c3; color: #854d0e; padding: 2px 6px; border-radius: 4px; font-weight: bold; font-size: 9px;">${payInfo.badge}</span>
          </div>
          <p style="margin: 2px 0;">${payInfo.detail}</p>
        </div>
      `;
    }

    const receiptHtml = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <title>Recibo - ${order.orderNumber}</title>
        <style>
          @page {
            size: letter portrait;
            margin: 12mm;
          }
          * {
            box-sizing: border-box;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
            color: #0f172a;
            margin: 0;
            padding: 0;
            background: #fff;
            font-size: 11px;
            line-height: 1.4;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            border-bottom: 2px solid #0c4236;
            padding-bottom: 10px;
            margin-bottom: 12px;
          }
          .logo-badge {
            background: #0c4236;
            color: #fff;
            font-weight: 900;
            font-size: 12px;
            padding: 5px 8px;
            border-radius: 6px;
            display: inline-block;
          }
          .title {
            font-size: 15px;
            font-weight: 800;
            margin: 0;
            color: #0c4236;
          }
          .subtitle {
            font-size: 10px;
            color: #64748b;
            margin: 1px 0 0 0;
          }
          .info-box {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            padding: 10px;
            border-radius: 8px;
            margin-bottom: 12px;
          }
          .info-box p {
            margin: 2px 0;
            font-size: 11px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 12px;
          }
          th {
            background: #f1f5f9;
            padding: 6px;
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            border-bottom: 2px solid #cbd5e1;
          }
          .totals-section {
            width: 240px;
            margin-left: auto;
            border-top: 1px solid #e2e8f0;
            padding-top: 6px;
          }
          .totals-row {
            display: flex;
            justify-content: space-between;
            margin: 2px 0;
            font-size: 11px;
          }
          .total-highlight {
            display: flex;
            justify-content: space-between;
            margin-top: 5px;
            padding-top: 5px;
            border-top: 2px solid #0c4236;
            font-size: 13px;
            font-weight: 900;
            color: #0c4236;
          }
          .footer {
            margin-top: 20px;
            padding-top: 8px;
            border-top: 1px dashed #cbd5e1;
            text-align: center;
            font-size: 9px;
            color: #94a3b8;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div style="display: flex; align-items: center; gap: 8px;">
            <div class="logo-badge">PSP</div>
            <div>
              <h1 class="title">Recibo de Compra Digital</h1>
              <p class="subtitle">Plataforma Social con Propósito • Urabá, Colombia</p>
            </div>
          </div>
          <div style="text-align: right;">
            <strong style="font-family: monospace; font-size: 12px;">${order.orderNumber}</strong><br/>
            <span style="font-size: 9px; color: #64748b;">${dateFormatted}</span>
          </div>
        </div>

        <div class="info-box">
          <div>
            <p><strong>Comprador:</strong> ${order.buyerName}</p>
            <p><strong>Email:</strong> ${order.buyerEmail}</p>
            <p><strong>Teléfono:</strong> ${order.buyerPhone || 'N/A'}</p>
          </div>
          <div>
            <p><strong>Destino de Entrega:</strong> ${order.shippingAddress}</p>
            ${order.shippingNeighborhood ? `<p><strong>Barrio:</strong> ${order.shippingNeighborhood}</p>` : ''}
            <p><strong>Municipio:</strong> ${order.shippingMunicipality}, Antioquia</p>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th style="text-align: left;">Artículo</th>
              <th style="text-align: center; width: 45px;">Cant.</th>
              <th style="text-align: right; width: 85px;">Precio</th>
              <th style="text-align: right; width: 95px;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsRows}
          </tbody>
        </table>

        <div class="totals-section" style="width: 275px; margin-left: auto;">
          <div class="totals-row">
            <span>Subtotal Artículos:</span>
            <span>$${fin.subtotal.toLocaleString('es-CO')} COP</span>
          </div>
          ${fin.discount > 0 ? `
          <div class="totals-row" style="color: #059669; font-weight: bold;">
            <span>Descuento Promocional:</span>
            <span>-$${fin.discount.toLocaleString('es-CO')} COP</span>
          </div>
          <div class="totals-row" style="border-top: 1px dashed #cbd5e1; padding-top: 2px; font-weight: bold;">
            <span>Subtotal Neto:</span>
            <span>$${fin.netSubtotal.toLocaleString('es-CO')} COP</span>
          </div>
          ` : ''}

          <!-- Discriminación Tributaria según DIAN (IVA Incluido) -->
          <div style="margin: 6px 0; padding: 6px 8px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 9.5px; color: #475569;">
            <div style="font-weight: bold; color: #334155; margin-bottom: 3px; text-transform: uppercase; letter-spacing: 0.3px; font-size: 8.5px;">
              Discriminación Tributaria (IVA Incluido):
            </div>
            ${fin.baseGravable19 > 0 ? `
            <div style="display: flex; justify-content: space-between; margin: 1px 0;">
              <span>&bull; Base Gravable (19%):</span>
              <span>$${fin.baseGravable19.toLocaleString('es-CO')} COP</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin: 1px 0;">
              <span>&bull; IVA 19% Generado:</span>
              <span>$${fin.iva19.toLocaleString('es-CO')} COP</span>
            </div>
            ` : ''}
            ${fin.totalExempt > 0 ? `
            <div style="display: flex; justify-content: space-between; margin: 1px 0; color: #047857;">
              <span>&bull; Excluidos (IVA 0% Art. 424 E.T.):</span>
              <span>$${fin.totalExempt.toLocaleString('es-CO')} COP</span>
            </div>
            ` : ''}
          </div>

          <div class="totals-row">
            <span>Costo de Envío (Urabá):</span>
            <span style="color: #059669; font-weight: bold;">${fin.shipping > 0 ? `$${fin.shipping.toLocaleString('es-CO')} COP` : 'Gratis / Incluido'}</span>
          </div>
          <div class="total-highlight">
            <span>TOTAL FACTURADO:</span>
            <span>$${fin.total.toLocaleString('es-CO')} COP</span>
          </div>
        </div>

        ${paymentAuditHtml}

        <div class="footer">
          <p>Comprobante oficial generado por Plataforma Social con Propósito (PSP) • Apoyando el comercio local de Urabá.</p>
        </div>
      </body>
      </html>
    `;

    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(receiptHtml);
    doc.close();

    iframe.contentWindow.focus();
    setTimeout(() => {
      iframe.contentWindow.print();
    }, 200);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 animate-fadeIn">
      
      {/* Top Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <Link
          to="/comercio"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al Directorio Comercial</span>
        </Link>
        <button
          onClick={loadOrders}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Actualizar Pedidos</span>
        </button>
      </div>

      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
          Mis Compras y Pedidos
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Seguimiento en tiempo real de entregas, comprobantes bancarios y paquetes por Empresa Aliada de Urabá.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2 font-semibold shadow-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="p-16 text-center text-slate-400 font-bold text-sm flex flex-col items-center justify-center gap-3">
          <RefreshCw className="w-8 h-8 animate-spin text-teal-500" />
          <span>Cargando el historial de tus pedidos...</span>
        </div>
      ) : orders.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-[#131c1a] border border-slate-200 dark:border-[#203330] rounded-3xl space-y-4 shadow-sm">
          <ShoppingBag className="w-14 h-14 text-slate-300 dark:text-slate-700 mx-auto" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">Aún no has realizado compras</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Explora los productos locales de Urabá, agrégalos a tu carrito y disfruta de entregas seguras.
          </p>
          <Link
            to="/comercio"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0c4236] hover:bg-[#0f5144] dark:bg-teal-400 dark:hover:bg-teal-300 text-white dark:text-slate-950 font-black text-xs shadow-md transition-all cursor-pointer"
          >
            <span>Ir al Catálogo de Productos</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const masterStatusCfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
            const canCancel = order.status === 'confirmed' || order.status === 'pending';
            const fin = calculateOrderFinancialBreakdown(order);
            const payInfo = getPaymentDisplayInfo(order);
            const isOnlinePayment = payInfo.isOnline;

            return (
              <div 
                key={order.id}
                className="bg-white dark:bg-[#131c1a] border border-slate-200 dark:border-[#203330] rounded-3xl p-5 sm:p-7 shadow-sm space-y-6"
              >
                {/* Cabecera de la Orden Maestra */}
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800/80">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono font-black text-sm sm:text-base text-slate-900 dark:text-white">
                        {order.orderNumber}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold border ${masterStatusCfg.bg}`}>
                        {masterStatusCfg.label}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(order.createdAt).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Total de la Orden</p>
                      <p className="text-base sm:text-xl font-black text-[#0c4236] dark:text-teal-400">
                        ${order.totalAmount?.toLocaleString()} COP
                      </p>
                      {fin.discount > 0 && (
                        <span className="text-[10px] font-bold text-emerald-600 dark:text-teal-400 block">
                          Ahorraste ${fin.discount.toLocaleString('es-CO')} COP
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => setSelectedReceiptOrder(order)}
                      className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                      title="Ver e imprimir comprobante digital"
                    >
                      <Printer className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                      <span>Recibo</span>
                    </button>

                    {canCancel && (
                      <button
                        onClick={() => handleCancelOrder(order.id)}
                        disabled={cancellingId === order.id}
                        className="px-3 py-2 rounded-xl border border-rose-500/30 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 text-xs font-bold transition-colors disabled:opacity-50 cursor-pointer"
                      >
                        {cancellingId === order.id ? 'Cancelando...' : 'Cancelar'}
                      </button>
                    )}
                  </div>
                </div>

                {/* Grid: Información de Entrega & Auditoría de Pago */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Tarjeta de Envío y Destino */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800/80 space-y-2 text-xs">
                    <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
                      <MapPin className="w-4 h-4 text-emerald-600 dark:text-teal-400" />
                      <span>Datos de Destino (Urabá)</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300">
                      <strong className="text-slate-900 dark:text-white">{order.shippingAddress}</strong>
                      {order.shippingNeighborhood && `, Barrio ${order.shippingNeighborhood}`}
                      <br />
                      <span className="text-slate-500">{order.shippingMunicipality}, {order.shippingDepartment || 'Antioquia'}</span>
                    </p>
                    <div className="pt-1 border-t border-slate-200/50 dark:border-slate-800/50 text-[11px] text-slate-500 flex items-center justify-between">
                      <span>Recibe: <strong>{order.buyerName}</strong></span>
                      <span>Tel: <strong>{order.buyerPhone}</strong></span>
                    </div>
                  </div>

                  {/* Tarjeta de Información Bancaria / Pasarela Wompi */}
                  <div className={`p-4 rounded-2xl border space-y-2 text-xs ${
                    isOnlinePayment 
                      ? 'bg-teal-50/50 dark:bg-teal-950/20 border-teal-200/60 dark:border-teal-900/40' 
                      : 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-200/60 dark:border-amber-900/40'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                        {order.paymentMethod === 'cash_on_delivery' ? (
                          <Banknote className="w-4 h-4 text-amber-600" />
                        ) : order.paymentMethod === 'direct_transfer' || order.paymentMethod === 'pse' ? (
                          <Building2 className="w-4 h-4 text-teal-600" />
                        ) : (
                          <CreditCard className="w-4 h-4 text-emerald-600 dark:text-teal-400" />
                        )}
                        <span>{payInfo.title}</span>
                      </div>

                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                        isOnlinePayment 
                          ? 'bg-emerald-500/15 text-emerald-700 dark:text-teal-300' 
                          : 'bg-amber-500/15 text-amber-700 dark:text-amber-300'
                      }`}>
                        {payInfo.badge}
                      </span>
                    </div>

                    {isOnlinePayment ? (
                      <div className="space-y-1 text-[11px] text-slate-600 dark:text-slate-300">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Medio / Franquicia:</span>
                          <span className="font-bold text-slate-800 dark:text-slate-200 uppercase">
                            {payInfo.cardBrand || 'Tarjeta'} {payInfo.lastFour}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-slate-400">ID Transacción:</span>
                          <div className="flex items-center gap-1 font-mono text-[10px] text-teal-800 dark:text-teal-300 truncate max-w-[170px]">
                            <span>{payInfo.transactionId}</span>
                            <button
                              onClick={() => copyToClipboard(payInfo.transactionId)}
                              className="p-0.5 hover:text-teal-500 cursor-pointer"
                              title="Copiar ID de transacción"
                            >
                              {copiedTxId ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                            </button>
                          </div>
                        </div>
                        {payInfo.authorizationCode && (
                          <div className="flex items-center justify-between">
                            <span className="text-slate-400">Cod. Autorización:</span>
                            <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{payInfo.authorizationCode}</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        Pagas en efectivo al transportador al momento de recibir el paquete en tu domicilio en Urabá.
                      </p>
                    )}
                  </div>

                </div>

                {/* Sub-Órdenes por Empresa Aliada con Línea de Tiempo de Despacho */}
                <div className="space-y-4 pt-2">
                  <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                    Paquetes de Envío ({order.subOrders?.length || 1})
                  </h4>

                  <div className="grid grid-cols-1 gap-4">
                    {order.subOrders?.map((sub, sIdx) => {
                      const subStatusCfg = STATUS_CONFIG[sub.status] || STATUS_CONFIG.pending;
                      const currentStepNum = STEP_ORDER[sub.status] || 1;
                      const isCancelled = sub.status === 'cancelled';

                      return (
                        <div 
                          key={sub.id}
                          className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-[#182422]/40 space-y-4 shadow-xs"
                        >
                          {/* Header del paquete */}
                          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200/80 dark:border-slate-800">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-teal-400 flex items-center justify-center shrink-0">
                                <Store className="w-4 h-4" />
                              </div>
                              <span className="text-xs font-bold text-slate-900 dark:text-white">
                                {sub.companyName || 'Comercio Local PSP'}
                              </span>
                              <span className="font-mono text-[10px] text-slate-400 px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                                {sub.subOrderNumber}
                              </span>
                            </div>

                            <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold border ${subStatusCfg.bg}`}>
                              {subStatusCfg.label}
                            </span>
                          </div>

                          {/* Línea de Tiempo Visual del Paquete (Timeline Stepper) */}
                          {!isCancelled ? (
                            <div className="py-2 px-1">
                              <div className="grid grid-cols-5 gap-1 items-center relative">
                                {STEPS.map((step, idx) => {
                                  const stepNum = idx + 1;
                                  const isCompleted = currentStepNum >= stepNum;
                                  const isCurrent = currentStepNum === stepNum;
                                  const Icon = step.icon;

                                  return (
                                    <div key={step.key} className="flex flex-col items-center text-center relative z-10">
                                      <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                                        isCompleted
                                          ? 'bg-teal-500 text-white shadow-md shadow-teal-500/20'
                                          : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                                      } ${isCurrent ? 'ring-4 ring-teal-500/20 scale-110' : ''}`}>
                                        <Icon className="w-4 h-4" />
                                      </div>
                                      <span className={`text-[10px] font-bold mt-1.5 truncate max-w-full ${
                                        isCurrent 
                                          ? 'text-teal-600 dark:text-teal-400' 
                                          : isCompleted 
                                          ? 'text-slate-800 dark:text-slate-200' 
                                          : 'text-slate-400'
                                      }`}>
                                        {step.label}
                                      </span>
                                    </div>
                                  );
                                })}

                                {/* Línea conectora de fondo */}
                                <div className="absolute top-4 left-6 right-6 h-0.5 bg-slate-200 dark:bg-slate-800 -z-0">
                                  <div 
                                    className="h-full bg-teal-500 transition-all duration-500"
                                    style={{ width: `${Math.max(0, ((currentStepNum - 1) / 4) * 100)}%` }}
                                  />
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
                              <XCircle className="w-4 h-4 shrink-0" />
                              <span>Este paquete ha sido cancelado. Inventario devuelto a bodega.</span>
                            </div>
                          )}

                          {/* Info de Despacho si ya está en camino */}
                          {sub.carrierName && (
                            <div className="text-xs text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Truck className="w-4 h-4 text-purple-500 shrink-0" />
                                <span>Operador: <strong>{sub.carrierName}</strong></span>
                              </div>
                              {sub.trackingCode && (
                                <span className="font-mono text-[11px] font-bold text-slate-900 dark:text-white">
                                  Guía: {sub.trackingCode}
                                </span>
                              )}
                            </div>
                          )}

                          {/* Ítems del paquete */}
                          <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
                            {sub.items?.map((item) => (
                              <div key={item.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                                <div className="flex items-center gap-3 min-w-0">
                                  <img 
                                    src={item.productImage || '/icon.png'} 
                                    alt={item.productName} 
                                    className="w-11 h-11 rounded-xl object-cover border border-slate-200 dark:border-slate-800 shrink-0"
                                  />
                                  <div className="min-w-0">
                                    <p className="font-bold text-slate-900 dark:text-white truncate">{item.productName}</p>
                                    <p className="text-[10px] text-slate-400">SKU: {item.sku} &bull; Cantidad: <strong>{item.quantity}</strong></p>
                                  </div>
                                </div>
                                <span className="font-extrabold text-slate-900 dark:text-white shrink-0">
                                  ${item.lineTotal?.toLocaleString()} COP
                                </span>
                              </div>
                            ))}
                          </div>

                          <div className="pt-2 text-right text-xs font-semibold text-slate-500">
                            Subtotal paquete: <strong className="font-black text-slate-900 dark:text-white">${sub.subtotalAmount?.toLocaleString()} COP</strong>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* MODAL DE RECIBO DIGITAL IMPRIMIBLE */}
      {selectedReceiptOrder && (() => {
        const modalFin = calculateOrderFinancialBreakdown(selectedReceiptOrder);
        const modalPay = getPaymentDisplayInfo(selectedReceiptOrder);

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white dark:bg-[#131c1a] border border-slate-200 dark:border-[#203330] rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl relative max-h-[92vh] overflow-y-auto">
              
              {/* Header del Recibo */}
              <div className="flex items-start justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-teal-500 text-white flex items-center justify-center font-black text-xs">
                      PSP
                    </div>
                    <h3 className="font-black text-base text-slate-900 dark:text-white">Recibo de Compra Digital</h3>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">Plataforma Social con Propósito &bull; Urabá, Colombia</p>
                </div>

                <button
                  onClick={() => setSelectedReceiptOrder(null)}
                  className="p-1 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Metadatos de la Factura / Recibo */}
              <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 dark:bg-slate-900/60 p-3.5 rounded-2xl">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">No. de Orden:</span>
                  <span className="font-mono font-extrabold text-slate-900 dark:text-white">{selectedReceiptOrder.orderNumber}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Fecha:</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    {new Date(selectedReceiptOrder.createdAt).toLocaleDateString('es-CO')}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Comprador:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedReceiptOrder.buyerName}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Destino:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedReceiptOrder.shippingMunicipality}</span>
                </div>
              </div>

              {/* Desglose de Productos con Indicación Tributaria */}
              <div className="space-y-2">
                <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Resumen de Artículos</h4>
                <div className="divide-y divide-slate-100 dark:divide-slate-800/80 max-h-48 overflow-y-auto">
                  {selectedReceiptOrder.items?.map((item) => {
                    const isExempt = isItemIvaExempt(item);
                    return (
                      <div key={item.id} className="py-2 flex justify-between items-center text-xs">
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">{item.productName}</p>
                          <p className="text-[10px] text-slate-400">
                            Cant: {item.quantity} &bull; {item.companyName || 'Comercio Local'} &bull;{' '}
                            <span className={isExempt ? 'text-emerald-600 dark:text-teal-400 font-semibold' : 'text-slate-500'}>
                              {isExempt ? 'IVA 0% (Excluido Art. 424 E.T.)' : 'IVA 19% Incluido'}
                            </span>
                          </p>
                        </div>
                        <span className="font-extrabold text-slate-900 dark:text-white">
                          ${item.lineTotal?.toLocaleString()} COP
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Totales y Discriminación de Impuestos */}
              <div className="border-t border-slate-200 dark:border-slate-800 pt-3 space-y-2 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal Artículos:</span>
                  <span className="font-bold text-slate-900 dark:text-white">${modalFin.subtotal.toLocaleString()} COP</span>
                </div>

                {modalFin.discount > 0 && (
                  <>
                    <div className="flex justify-between text-emerald-600 dark:text-teal-400 font-bold">
                      <span>Descuento Promocional:</span>
                      <span>-${modalFin.discount.toLocaleString()} COP</span>
                    </div>
                    <div className="flex justify-between text-slate-600 dark:text-slate-300 font-semibold border-t border-dashed border-slate-200 dark:border-slate-800 pt-1">
                      <span>Subtotal Neto:</span>
                      <span>${modalFin.netSubtotal.toLocaleString()} COP</span>
                    </div>
                  </>
                )}

                {/* Discriminación de Impuestos según DIAN */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-1 text-[11px] text-slate-500">
                  <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                    Discriminación Tributaria (IVA Incluido):
                  </p>
                  {modalFin.baseGravable19 > 0 && (
                    <>
                      <div className="flex justify-between">
                        <span>• Base Gravable (Tarifa 19%):</span>
                        <span className="font-mono text-slate-700 dark:text-slate-300">${modalFin.baseGravable19.toLocaleString()} COP</span>
                      </div>
                      <div className="flex justify-between">
                        <span>• IVA 19% Discriminado:</span>
                        <span className="font-mono font-bold text-slate-800 dark:text-slate-200">${modalFin.iva19.toLocaleString()} COP</span>
                      </div>
                    </>
                  )}
                  {modalFin.totalExempt > 0 && (
                    <div className="flex justify-between text-emerald-700 dark:text-teal-300">
                      <span>• Bienes Excluidos (IVA 0% Canasta Agro Art. 424):</span>
                      <span className="font-mono font-bold">${modalFin.totalExempt.toLocaleString()} COP</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between text-slate-500">
                  <span>Costo de Envío (Urabá):</span>
                  <span className="font-bold text-emerald-600 dark:text-teal-400">
                    {modalFin.shipping > 0 ? `$${modalFin.shipping.toLocaleString()} COP` : 'Gratis / Incluido'}
                  </span>
                </div>

                <div className="flex justify-between text-base font-black text-slate-900 dark:text-white pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span>Total Facturado:</span>
                  <span className="text-[#0c4236] dark:text-teal-400">${modalFin.total.toLocaleString()} COP</span>
                </div>
              </div>

              {/* Medio de Pago y Auditoría Bancaria */}
              <div className={`p-3.5 rounded-2xl border text-xs space-y-1.5 ${
                modalPay.isOnline 
                  ? 'bg-teal-50/60 dark:bg-teal-950/30 border-teal-200 dark:border-teal-900/50' 
                  : 'bg-amber-50/60 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/50'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                    {modalPay.isOnline ? (
                      <CreditCard className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                    ) : (
                      <Banknote className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    )}
                    <span>{modalPay.title}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                    modalPay.isOnline 
                      ? 'bg-emerald-500/15 text-emerald-700 dark:text-teal-300' 
                      : 'bg-amber-500/15 text-amber-700 dark:text-amber-300'
                  }`}>
                    {modalPay.badge}
                  </span>
                </div>

                {modalPay.isOnline ? (
                  <div className="text-[11px] text-slate-600 dark:text-slate-300 space-y-0.5 pt-1">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Pasarela:</span>
                      <strong className="font-mono">{modalPay.gateway}</strong>
                    </div>
                    {modalPay.cardBrand && (
                      <div className="flex justify-between">
                        <span className="text-slate-400">Franquicia:</span>
                        <strong>{modalPay.cardBrand} {modalPay.lastFour} &bull; {modalPay.installments} cuota(s)</strong>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-slate-400">Ref Transacción:</span>
                      <span className="font-mono font-bold text-teal-700 dark:text-teal-300">{modalPay.transactionId}</span>
                    </div>
                    {modalPay.authorizationCode && (
                      <div className="flex justify-between">
                        <span className="text-slate-400">Cod. Autorización:</span>
                        <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{modalPay.authorizationCode}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-500 leading-relaxed pt-1">
                    {modalPay.detail}
                  </p>
                )}
              </div>

              {/* Botones de Acción */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => handlePrintReceipt(selectedReceiptOrder)}
                  className="flex-1 py-3 rounded-xl bg-[#0c4236] hover:bg-[#0f5144] dark:bg-teal-400 dark:hover:bg-teal-300 text-white dark:text-slate-950 font-bold text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Imprimir / Guardar PDF</span>
                </button>
                <button
                  onClick={() => setSelectedReceiptOrder(null)}
                  className="py-3 px-5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Cerrar
                </button>
              </div>

            </div>
          </div>
        );
      })()}

    </div>
  );
}
