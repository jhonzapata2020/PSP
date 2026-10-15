/**
 * Constantes y políticas de comercio electrónico para la plataforma PSP.
 */

// Valor mínimo de compra global para procesar un pedido (en pesos colombianos COP)
export const MIN_PURCHASE_AMOUNT = 20000;

export const formatCOP = (amount) => {
  return `$${Number(amount || 0).toLocaleString('es-CO')} COP`;
};
