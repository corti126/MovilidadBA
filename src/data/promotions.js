/**
 * PLACEHOLDER — Promociones de transporte público.
 *
 * Estos datos son EJEMPLOS DE ESTRUCTURA, no promociones reales vigentes.
 * Reemplazá el arreglo por las promociones reales manteniendo la misma forma.
 * Cada objeto: { id, title, transport, paymentMethod, discount, description,
 *                conditions, validity, featured, placeholder }
 */
export const PROMOTIONS = [
  {
    id: "placeholder-1",
    title: "Ejemplo de beneficio en subte",
    transport: "subte",
    paymentMethod: "Medio de pago a definir",
    discount: "—",
    description: "Cargá acá la descripción real del beneficio de subte.",
    conditions: "Condiciones a completar con la información oficial.",
    validity: "Vigencia a completar",
    featured: true,
    placeholder: true,
  },
  {
    id: "placeholder-2",
    title: "Ejemplo de beneficio en colectivo",
    transport: "colectivo",
    paymentMethod: "Medio de pago a definir",
    discount: "—",
    description: "Cargá acá la descripción real del beneficio de colectivos.",
    conditions: "Condiciones a completar con la información oficial.",
    validity: "Vigencia a completar",
    featured: false,
    placeholder: true,
  },
  {
    id: "placeholder-3",
    title: "Ejemplo de beneficio en tren",
    transport: "tren",
    paymentMethod: "Medio de pago a definir",
    discount: "—",
    description: "Cargá acá la descripción real del beneficio ferroviario.",
    conditions: "Condiciones a completar con la información oficial.",
    validity: "Vigencia a completar",
    featured: false,
    placeholder: true,
  },
];

export const PROMOTIONS_ARE_PLACEHOLDER = PROMOTIONS.every((p) => p.placeholder);
