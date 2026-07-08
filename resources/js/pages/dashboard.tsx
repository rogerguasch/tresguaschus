import { RentalApp } from '@/components/rental/rental-app';
import type { Category, Rental, Transaction } from '@/components/rental/types';
import { Head } from '@inertiajs/react';

interface DashboardPageProps {
    rentals: Rental[];
    categories: Category[];
    transactions: Transaction[];
}

export default function Dashboard({
    rentals,
    categories,
    transactions,
}: DashboardPageProps) {
    return (
        <>
            <Head title="Tresguaschus">
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link
                    rel="preconnect"
                    href="https://fonts.gstatic.com"
                    crossOrigin=""
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
                    rel="stylesheet"
                />
            </Head>
            <RentalApp
                rentals={rentals}
                categories={categories}
                transactions={transactions}
            />
        </>
    );
}
