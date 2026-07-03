export type TransactionType = 'ingreso' | 'gasto';

export type RentalStatus = 'Alquilado' | 'Vacío';

export type PropertyType =
    | 'Piso'
    | 'Ático'
    | 'Estudio'
    | 'Casa'
    | 'Local comercial'
    | 'Plaza garaje'
    | 'Trastero';

export type RentiaView =
    | 'dashboard'
    | 'rentals'
    | 'detail'
    | 'newRental'
    | 'transactions'
    | 'chat'
    | 'settings';

export interface Tenant {
    name: string;
    email: string;
    phone: string;
    since: string;
}

export interface Rental {
    id: string;
    address: string;
    city: string;
    type: PropertyType;
    rent: number;
    deposit: number;
    contractStart: string | null;
    contractEnd: string | null;
    status: RentalStatus;
    tenant: Tenant | null;
}

export interface Transaction {
    id: string;
    rentalId: string;
    date: string;
    type: TransactionType;
    category: string;
    concept: string;
    amount: number;
    method: string;
}

export interface RentalFile {
    name: string;
    kind: string;
    size: string;
    date: string;
}

export interface Category {
    id: string;
    name: string;
    type: TransactionType;
    color: string;
}

export interface ChatMessage {
    role: 'assistant' | 'user';
    text: string;
}

export interface DashboardFilters {
    rentalId: string;
    from: string;
    to: string;
}

export interface DetailFilters {
    from: string;
    to: string;
    category: string;
}

export interface TransactionsFilters {
    rentalId: string;
    month: string;
    year: string;
}

export interface TransactionDraft {
    type: TransactionType;
    rentalId: string;
    date: string;
    category: string;
    concept: string;
    amount: string;
    method: string;
}

export interface RentalForm {
    address: string;
    city: string;
    type: PropertyType;
    rent: string;
    deposit: string;
    tenantName: string;
    tenantEmail: string;
    tenantPhone: string;
    contractStart: string;
    contractEnd: string;
}

export interface CategoryDraft {
    id: string | null;
    name: string;
    type: TransactionType;
    color: string;
}

export interface Toast {
    id: number;
    msg: string;
    ok: boolean;
}

export interface SelectOption {
    value: string;
    label: string;
}
