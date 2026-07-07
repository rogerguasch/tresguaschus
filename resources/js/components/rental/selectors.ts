import type { Category, Rental, Transaction } from './types';
import { categoryColor, formatDate, formatEuros, shortAddress } from './utils';

export interface TransactionRow {
    id: string;
    dateFmt: string;
    concept: string;
    category: string;
    catColor: string;
    method: string;
    amountFmt: string;
    amountColor: string;
    rentalShort: string;
}

/** Builds display-ready fields for a transaction table row. */
export function toTransactionRow(
    tx: Transaction,
    rentalsById: Map<string, Rental>,
    categories: Category[],
): TransactionRow {
    const rental = rentalsById.get(tx.rentalId);
    const isIncome = tx.type === 'ingreso';
    return {
        id: tx.id,
        dateFmt: formatDate(tx.date),
        concept: tx.concept,
        category: tx.category,
        catColor: categoryColor(categories, tx.category),
        method: tx.method,
        amountFmt: `${isIncome ? '+' : '−'}${formatEuros(tx.amount)}`,
        amountColor: isIncome ? '#16a34a' : '#dc2626',
        rentalShort: shortAddress(rental?.address ?? '—'),
    };
}

/** Indexes rentals by id for quick lookups. */
export function rentalsById(rentals: Rental[]): Map<string, Rental> {
    return new Map(rentals.map((rental) => [rental.id, rental]));
}
