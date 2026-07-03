import type {
    Category,
    PropertyType,
    Rental,
    RentalFile,
    Transaction,
} from './types';

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

export const INITIAL_CATEGORIES: Category[] = [
    { id: 'c1', name: 'Renta', type: 'ingreso', color: '#16a34a' },
    { id: 'c2', name: 'Fianza', type: 'ingreso', color: '#0d9488' },
    { id: 'c3', name: 'Otros ingresos', type: 'ingreso', color: '#22c55e' },
    { id: 'c4', name: 'Reparaciones', type: 'gasto', color: '#ef4444' },
    { id: 'c5', name: 'Comunidad', type: 'gasto', color: '#4f46e5' },
    { id: 'c6', name: 'IBI', type: 'gasto', color: '#ea580c' },
    { id: 'c7', name: 'Seguro', type: 'gasto', color: '#0891b2' },
    { id: 'c8', name: 'Suministros', type: 'gasto', color: '#eab308' },
    { id: 'c9', name: 'Gestión', type: 'gasto', color: '#9333ea' },
    { id: 'c10', name: 'Otros gastos', type: 'gasto', color: '#71717a' },
];

export const INITIAL_RENTALS: Rental[] = [
    {
        id: 'r1',
        address: 'Gran Vía 42, 3ºB',
        city: 'Madrid',
        type: 'Piso',
        rent: 1200,
        deposit: 2400,
        contractStart: '2024-09-01',
        contractEnd: '2026-08-31',
        status: 'Alquilado',
        tenant: {
            name: 'Laura Giménez',
            email: 'laura.gimenez@email.com',
            phone: '+34 612 345 678',
            since: '2024-09-01',
        },
    },
    {
        id: 'r2',
        address: 'Avinguda Diagonal 210, 2º1ª',
        city: 'Barcelona',
        type: 'Piso',
        rent: 1450,
        deposit: 2900,
        contractStart: '2025-01-15',
        contractEnd: '2027-01-14',
        status: 'Alquilado',
        tenant: {
            name: 'Marc Torres',
            email: 'marc.torres@email.com',
            phone: '+34 623 111 222',
            since: '2025-01-15',
        },
    },
    {
        id: 'r3',
        address: 'Calle Sierpes 8',
        city: 'Sevilla',
        type: 'Local comercial',
        rent: 950,
        deposit: 2850,
        contractStart: '2023-06-01',
        contractEnd: '2028-05-31',
        status: 'Alquilado',
        tenant: {
            name: 'Café Aurora S.L.',
            email: 'admin@cafeaurora.es',
            phone: '+34 954 000 111',
            since: '2023-06-01',
        },
    },
    {
        id: 'r4',
        address: 'Paseo de la Castellana 100, 5ºA',
        city: 'Madrid',
        type: 'Ático',
        rent: 1800,
        deposit: 3600,
        contractStart: '2025-03-01',
        contractEnd: '2027-02-28',
        status: 'Alquilado',
        tenant: {
            name: 'David Romero',
            email: 'david.romero@email.com',
            phone: '+34 655 987 654',
            since: '2025-03-01',
        },
    },
    {
        id: 'r5',
        address: 'Calle de la Paz 15',
        city: 'Valencia',
        type: 'Estudio',
        rent: 750,
        deposit: 1500,
        contractStart: '2025-10-01',
        contractEnd: '2026-09-30',
        status: 'Alquilado',
        tenant: {
            name: 'Nadia Cheddadi',
            email: 'nadia.ch@email.com',
            phone: '+34 666 222 333',
            since: '2025-10-01',
        },
    },
    {
        id: 'r6',
        address: 'Calle Uría 30, 1ºC',
        city: 'Oviedo',
        type: 'Piso',
        rent: 820,
        deposit: 0,
        contractStart: null,
        contractEnd: null,
        status: 'Vacío',
        tenant: null,
    },
];

function buildTransactions(rentals: Rental[]): Transaction[] {
    const transactions: Transaction[] = [];
    let sequence = 1;
    const push = (tx: Omit<Transaction, 'id'>): void => {
        transactions.push({ id: `t${sequence++}`, ...tx });
    };

    const active = rentals.filter((r) => r.status === 'Alquilado');

    // Monthly rent for 2026 (Jan–Jun).
    for (let month = 0; month < 6; month++) {
        active.forEach((rental) => {
            push({
                rentalId: rental.id,
                date: `2026-${String(month + 1).padStart(2, '0')}-05`,
                type: 'ingreso',
                category: 'Renta',
                concept: 'Renta mensual',
                amount: rental.rent,
                method: 'Transferencia',
            });
        });
    }

    // Rent for Nov–Dec 2025 (so the year filter has data).
    for (let month = 10; month < 12; month++) {
        ['r1', 'r2', 'r3', 'r4'].forEach((id) => {
            const rental = rentals.find((r) => r.id === id);
            if (!rental) {
                return;
            }
            push({
                rentalId: id,
                date: `2025-${month + 1}-05`,
                type: 'ingreso',
                category: 'Renta',
                concept: 'Renta mensual',
                amount: rental.rent,
                method: 'Transferencia',
            });
        });
    }

    const expenses: Array<[string, string, string, string, number, string]> = [
        ['r1', '2026-01-12', 'Comunidad', 'Cuota comunidad', 85, 'Domiciliado'],
        [
            'r1',
            '2026-02-20',
            'Reparaciones',
            'Reparación caldera',
            240,
            'Transferencia',
        ],
        [
            'r1',
            '2026-05-03',
            'IBI',
            'IBI anual (1er plazo)',
            310,
            'Domiciliado',
        ],
        [
            'r2',
            '2026-01-18',
            'Comunidad',
            'Cuota comunidad',
            110,
            'Domiciliado',
        ],
        [
            'r2',
            '2026-03-09',
            'Suministros',
            'Derrama ascensor',
            180,
            'Transferencia',
        ],
        [
            'r2',
            '2026-04-27',
            'Reparaciones',
            'Fontanería baño',
            150,
            'Transferencia',
        ],
        ['r3', '2026-02-14', 'Seguro', 'Seguro del local', 420, 'Domiciliado'],
        [
            'r3',
            '2026-06-01',
            'Reparaciones',
            'Pintura fachada',
            600,
            'Transferencia',
        ],
        [
            'r4',
            '2026-01-30',
            'Comunidad',
            'Cuota comunidad',
            160,
            'Domiciliado',
        ],
        [
            'r4',
            '2026-03-22',
            'Gestión',
            'Honorarios gestoría',
            95,
            'Transferencia',
        ],
        [
            'r4',
            '2026-05-16',
            'Reparaciones',
            'Aire acondicionado',
            380,
            'Tarjeta',
        ],
        [
            'r5',
            '2026-02-08',
            'Suministros',
            'Alta luz y agua',
            120,
            'Transferencia',
        ],
        ['r5', '2026-04-11', 'Comunidad', 'Cuota comunidad', 60, 'Domiciliado'],
        [
            'r6',
            '2026-03-05',
            'Reparaciones',
            'Acondicionamiento piso',
            540,
            'Transferencia',
        ],
        ['r6', '2026-05-19', 'Gestión', 'Publicación anuncio', 75, 'Tarjeta'],
        [
            'r2',
            '2025-12-10',
            'Reparaciones',
            'Cambio cerradura',
            200,
            'Transferencia',
        ],
        ['r1', '2025-11-15', 'Comunidad', 'Cuota comunidad', 85, 'Domiciliado'],
    ];

    expenses.forEach(([rentalId, date, category, concept, amount, method]) => {
        push({
            rentalId,
            date,
            type: 'gasto',
            category,
            concept,
            amount,
            method,
        });
    });

    return transactions;
}

export const INITIAL_TRANSACTIONS = buildTransactions(INITIAL_RENTALS);

export const INITIAL_FILES: Record<string, RentalFile[]> = {
    r1: [
        {
            name: 'Contrato_arrendamiento_GranVia.pdf',
            kind: 'Contrato',
            size: '248 KB',
            date: '2024-09-01',
        },
        {
            name: 'DNI_Laura_Gimenez.pdf',
            kind: 'Identificación',
            size: '96 KB',
            date: '2024-09-01',
        },
        {
            name: 'Inventario_mobiliario.pdf',
            kind: 'Inventario',
            size: '132 KB',
            date: '2024-09-02',
        },
    ],
    r2: [
        {
            name: 'Contrato_Diagonal210.pdf',
            kind: 'Contrato',
            size: '256 KB',
            date: '2025-01-15',
        },
        {
            name: 'Certificado_energetico.pdf',
            kind: 'Certificado',
            size: '188 KB',
            date: '2025-01-10',
        },
    ],
    r3: [
        {
            name: 'Contrato_local_Sierpes.pdf',
            kind: 'Contrato',
            size: '312 KB',
            date: '2023-06-01',
        },
        {
            name: 'Seguro_local_2026.pdf',
            kind: 'Seguro',
            size: '144 KB',
            date: '2026-02-14',
        },
        {
            name: 'Licencia_actividad.jpg',
            kind: 'Licencia',
            size: '420 KB',
            date: '2023-05-20',
        },
    ],
    r4: [
        {
            name: 'Contrato_Castellana100.pdf',
            kind: 'Contrato',
            size: '268 KB',
            date: '2025-03-01',
        },
    ],
    r5: [
        {
            name: 'Contrato_Paz15.pdf',
            kind: 'Contrato',
            size: '240 KB',
            date: '2025-10-01',
        },
        {
            name: 'Fotos_estado_entrada.jpg',
            kind: 'Inventario',
            size: '1,2 MB',
            date: '2025-10-01',
        },
    ],
    r6: [],
};

export const CHAT_SUGGESTIONS = [
    'Resumen de ingresos del mes',
    '¿Qué alquiler es más rentable?',
    'Gastos por categoría',
];

export const CHAT_REPLIES = [
    'Buena pregunta. En esta demo todavía no analizo datos reales, pero en la versión final revisaré tus alquileres y transacciones para darte una respuesta precisa.',
    'Entendido. Cuando esté conectado a tus datos podré generarte ese resumen al instante.',
    'Anotado. Esta es una vista de demostración del asistente Guaschnet — pronto podré ayudarte de verdad.',
];
