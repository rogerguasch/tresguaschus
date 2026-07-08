import { Header } from './header';
import { CategoryModal } from './modals/category-modal';
import { NewTransactionModal } from './modals/new-transaction-modal';
import { TransactionDetailModal } from './modals/transaction-detail-modal';
import { RentalProvider } from './rental-context';
import { Sidebar } from './sidebar';
import { Toast } from './toast';
import type { Category, Rental, RentalView, Transaction } from './types';
import { useRental } from './use-rental';
import { ChatView } from './views/chat-view';
import { DashboardView } from './views/dashboard-view';
import { NewRentalView } from './views/new-rental-view';
import { RentalDetailView } from './views/rental-detail-view';
import { RentalsView } from './views/rentals-view';
import { SettingsView } from './views/settings-view';
import { TransactionsView } from './views/transactions-view';

const VIEWS: Record<RentalView, React.ComponentType> = {
    dashboard: DashboardView,
    rentals: RentalsView,
    detail: RentalDetailView,
    newRental: NewRentalView,
    transactions: TransactionsView,
    chat: ChatView,
    settings: SettingsView,
};

function CurrentView({ view }: { view: RentalView }) {
    const View = VIEWS[view];
    return <View />;
}

export function RentalApp({
    rentals,
    categories,
    transactions,
}: {
    rentals: Rental[];
    categories: Category[];
    transactions: Transaction[];
}) {
    const store = useRental(rentals, categories, transactions);

    return (
        <RentalProvider value={store}>
            <div
                className="flex h-screen w-full overflow-hidden bg-white text-sm text-zinc-950 antialiased"
                style={{
                    fontFamily: "'Inter', -apple-system, system-ui, sans-serif",
                }}
            >
                <Sidebar />
                <main className="flex min-w-0 flex-1 flex-col bg-zinc-50">
                    <Header />
                    <div className="flex-1 overflow-y-auto p-7">
                        <CurrentView view={store.state.view} />
                    </div>
                </main>

                <CategoryModal />
                <TransactionDetailModal />
                <NewTransactionModal />
                <Toast />
            </div>
        </RentalProvider>
    );
}
