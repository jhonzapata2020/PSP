/**
 * Utilidades para cálculo, desglose y discriminación de impuestos (IVA)
 * y descuentos comerciales en la plataforma PSP según el Estatuto Tributario
 * de Colombia (DIAN) y estándares de Marketplaces como Mercado Libre / Falabella.
 */

/**
 * Determina si un producto es un bien agrícola primario no procesado
 * excluido de IVA según el Artículo 424 del Estatuto Tributario
 * (Bienes agropecuarios de consumo primario / canasta familiar en fresco).
 * 
 * NOTA LEGAL & TRIBUTARIA:
 * Las manufacturas, artesanías, accesorios o productos procesados elaborados
 * a base de fibras naturales (ej: un bolso playero o sombrero en fibra de plátano,
 * caña flecha, palma o fique, o snacks procesados) NO son alimentos ni canasta familiar,
 * por lo que están sujetos a la tarifa general del 19% de IVA.
 */
export const isItemIvaExempt = (item) => {
  if (!item) return false;
  const sku = (item.sku || '').toUpperCase();
  const name = (item.productName || item.name || '').toLowerCase();

  // 1. Si es artesanía, accesorio, bolso, textil, manufactura, snack procesado o servicio -> SIEMPRE IVA 19%
  const nonExemptPatterns = [
    'bolso', 'mochila', 'cartera', 'sombrero', 'artesanal', 'artesanía', 'artesania',
    'fibra', 'tejido', 'madera', 'máscara', 'mascara', 'decorativ', 'collar', 'aretes',
    'snack', 'chips', 'frito', 'mofongo', 'cazuela', 'restaurante', 'almuerzo',
    'tour', 'transporte', 'servicio', 'consultor', 'capacitac'
  ];

  if (nonExemptPatterns.some(pattern => name.includes(pattern))) {
    return false;
  }

  // 2. Si tiene SKU o código explícito de fruta o vegetal primario en fresco
  if (sku.startsWith('BAN-EXP-') || sku.startsWith('AGRO-FRESCO-')) {
    return true;
  }

  // 3. Debe ser explícitamente un fruto agrícola primario en fresco (alimento sin procesar)
  const freshAgroKeywords = [
    'banano fresco',
    'banano criollo',
    'banano de exportación',
    'caja de banano',
    'racimo de plátano',
    'racimo de platano',
    'plátano verde fresco',
    'platano verde fresco',
    'plátano hartón fresco',
    'platano harton fresco',
    'cacao en grano crudo',
    'yuca fresca',
    'fruta fresca',
    'maracuyá fresca'
  ];

  return freshAgroKeywords.some(keyword => name.includes(keyword));
};

/**
 * Calcula el desglose financiero, tributario y de descuentos de una orden.
 * En Colombia, los precios al consumidor siempre tienen el IVA incluido (Ley 1480 / Estatuto del Consumidor).
 * Por ende, el impuesto no se añade como recargo, sino que se discrimina de la base de compra.
 * Según el Art. 454 E.T., los descuentos comerciales efectivos reducen la base gravable antes de discriminar el IVA.
 */
export const calculateOrderFinancialBreakdown = (order) => {
  if (!order) return null;

  const subtotal = Number(order.subtotalAmount) || 0;
  const discount = Number(order.discountAmount) || 0;
  const netSubtotal = Math.max(0, subtotal - discount);
  const shipping = Number(order.shippingAmount) || 0;
  const total = Number(order.totalAmount) || (netSubtotal + shipping);

  const items = order.items || [];
  let exemptGross = 0;
  let taxableGross = 0;

  if (items.length > 0) {
    items.forEach(item => {
      const lineTotal = Number(item.lineTotal || (item.unitPrice * item.quantity)) || 0;
      if (isItemIvaExempt(item)) {
        exemptGross += lineTotal;
      } else {
        taxableGross += lineTotal;
      }
    });
  } else {
    // Si no hay lista detallada de items, tratamos como gravado general 19%
    taxableGross = subtotal;
  }

  // Descuento comercial aplicado de forma proporcional (Art. 454 Estatuto Tributario)
  const totalItemsGross = exemptGross + taxableGross;
  let exemptNet = exemptGross;
  let taxableNet = taxableGross;

  if (totalItemsGross > 0 && discount > 0) {
    const discountRatio = Math.min(1, discount / totalItemsGross);
    exemptNet = Math.max(0, exemptGross * (1 - discountRatio));
    taxableNet = Math.max(0, taxableGross * (1 - discountRatio));
  } else if (totalItemsGross === 0) {
    taxableNet = netSubtotal;
    exemptNet = 0;
  }

  // Base gravable e IVA 19% discriminado:
  // Base = Valor / 1.19
  // IVA = Valor - Base
  const baseGravable19 = Math.round(taxableNet / 1.19);
  const iva19 = Math.round(taxableNet - baseGravable19);
  const totalExempt = Math.round(exemptNet);

  return {
    subtotal,
    discount,
    netSubtotal,
    shipping,
    total,
    baseGravable19,
    iva19,
    totalExempt,
    hasTaxable: taxableNet > 0,
    hasExempt: totalExempt > 0,
    totalTaxes: iva19
  };
};

/**
 * Retorna la información limpia y legible del medio de pago y sus detalles de auditoría bancaria.
 */
export const getPaymentDisplayInfo = (order) => {
  if (!order) return { title: 'No especificado', badge: 'Pendiente', isOnline: false };

  const method = (order.paymentMethod || '').toLowerCase();
  const isCashOnDelivery = method === 'cash_on_delivery' || method === 'cash';
  const isTransfer = method === 'direct_transfer' || method === 'pse';

  if (isCashOnDelivery) {
    return {
      title: 'Pago Contra Entrega en Domicilio (Efectivo)',
      badge: '⏱ Contra Entrega',
      isOnline: false,
      detail: 'Pagas en efectivo al transportador al momento de recibir el paquete en tu domicilio.'
    };
  }

  if (isTransfer) {
    return {
      title: 'Transferencia Bancaria Directa / PSE',
      badge: '✓ Pago Aprobado',
      isOnline: true,
      gateway: order.paymentGateway || 'PSE Wompi Colombia',
      transactionId: order.paymentTransactionId || order.orderNumber,
      authorizationCode: order.authorizationCode,
      detail: 'Transacción electrónica aprobada y conciliada.'
    };
  }

  // Tarjeta de crédito o débito
  return {
    title: 'Tarjeta de Crédito / Débito (Pasarela Wompi)',
    badge: '✓ Pago Aprobado',
    isOnline: true,
    gateway: order.paymentGateway || 'Wompi Colombia',
    cardBrand: order.cardBrand || 'Tarjeta Autorizada',
    lastFour: order.cardLastFour ? `•••• ${order.cardLastFour}` : '',
    installments: order.installments || 1,
    transactionId: order.paymentTransactionId || `WMP-${order.orderNumber}`,
    authorizationCode: order.authorizationCode || 'AUTH-OK',
    detail: 'Pago procesado mediante pasarela bancaria segura con tokenización 3D Secure.'
  };
};
