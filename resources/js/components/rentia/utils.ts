import { CATEGORY_COLORS, MONTHS_SHORT } from './data';
import type { Category, Transaction, TransactionType } from './types';

const currencyFormatter = new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
});

/** Formats a number as euros with no decimals, e.g. `1.200 €`. */
export function formatEuros(value: number): string {
    return currencyFormatter.format(value || 0);
}

/** Formats an ISO date (`2026-01-05`) as `5 Ene 2026`. */
export function formatDate(iso: string | null): string {
    if (!iso) {
        return '—';
    }
    const [year, month, day] = iso.split('-');
    return `${+day} ${MONTHS_SHORT[+month - 1]} ${year}`;
}

/** Builds up-to-two-letter initials from a full name. */
export function getInitials(name: string): string {
    const parts = (name || '').trim().split(/\s+/);
    const first = (parts[0]?.[0] ?? '').toUpperCase();
    const second = (parts[1]?.[0] ?? '').toUpperCase();
    return first + second;
}

/** Returns the first comma-separated segment of an address. */
export function shortAddress(address: string): string {
    return (address || '').split(',')[0];
}

/** Today as an ISO `YYYY-MM-DD` string. */
export function todayIso(): string {
    return new Date().toISOString().slice(0, 10);
}

/** Resolves a category's color, preferring the editable list then fallbacks. */
export function categoryColor(categories: Category[], name: string): string {
    const match = categories.find((category) => category.name === name);
    return match?.color ?? CATEGORY_COLORS[name] ?? '#71717a';
}

/** Sums the amount of transactions matching the given type. */
export function sumByType(
    transactions: Transaction[],
    type: TransactionType,
): number {
    return transactions
        .filter((tx) => tx.type === type)
        .reduce((total, tx) => total + tx.amount, 0);
}
