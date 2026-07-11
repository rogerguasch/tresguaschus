import type { PropertyType } from './types';

export const MONTHS_SHORT = [
    'Ene',
    'Feb',
    'Mar',
    'Abr',
    'May',
    'Jun',
    'Jul',
    'Ago',
    'Sep',
    'Oct',
    'Nov',
    'Dic',
];

export const MONTHS_LONG = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
];

/** Fallback colors for categories not present in the editable list. */
export const CATEGORY_COLORS: Record<string, string> = {
    Reparaciones: '#ef4444',
    Comunidad: '#4f46e5',
    IBI: '#ea580c',
    Seguro: '#0891b2',
    Suministros: '#eab308',
    Gestión: '#9333ea',
    'Otros gastos': '#71717a',
    Renta: '#16a34a',
    Fianza: '#0d9488',
    'Otros ingresos': '#22c55e',
};

/** Palette used to color the per-rental income breakdown bars. */
export const RENTAL_PALETTE = [
    '#18181b',
    '#4f46e5',
    '#0891b2',
    '#16a34a',
    '#ea580c',
    '#9333ea',
    '#db2777',
    '#ca8a04',
];

/** lucide-react icon names keyed by property type. */
export const PROPERTY_TYPE_ICONS: Record<PropertyType, string> = {
    Piso: 'building',
    Ático: 'building-2',
    Estudio: 'door-open',
    Casa: 'home',
    'Local comercial': 'store',
    'Plaza garaje': 'car',
    Trastero: 'package',
};

export const PROPERTY_TYPES: PropertyType[] = [
    'Piso',
    'Ático',
    'Estudio',
    'Casa',
    'Local comercial',
    'Plaza garaje',
    'Trastero',
];

export const PAYMENT_METHODS = [
    'Transferencia',
    'Domiciliado',
    'Tarjeta',
    'Efectivo',
    'Bizum',
];

export const CATEGORY_COLOR_CHOICES = [
    '#16a34a',
    '#22c55e',
    '#0d9488',
    '#0891b2',
    '#2563eb',
    '#4f46e5',
    '#9333ea',
    '#db2777',
    '#ef4444',
    '#dc2626',
    '#ea580c',
    '#eab308',
    '#71717a',
];

export const CHAT_SUGGESTIONS = [
    'Lista todas las categorías',
    'Crea una categoría de gasto llamada Basuras',
    'Cambia el color de Suministros a azul',
];
