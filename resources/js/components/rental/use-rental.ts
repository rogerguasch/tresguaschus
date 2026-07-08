import DeleteCategoryController from '@/actions/App/Category/Infrastructure/Http/Controllers/DeleteCategoryController';
import { router } from '@inertiajs/react';
import { useEffect, useMemo, useReducer } from 'react';
import { CHAT_REPLIES } from './data';
import type {
    Category,
    ChatMessage,
    DashboardFilters,
    DetailFilters,
    Rental,
    RentalView,
    Toast,
    Transaction,
    TransactionsFilters,
} from './types';

interface RentalState {
    view: RentalView;
    selectedId: string | null;
    rentals: Rental[];
    transactions: Transaction[];
    categories: Category[];
    rentalSearch: string;
    dashFilters: DashboardFilters;
    detailFilters: DetailFilters;
    filters: TransactionsFilters;
    rentalsExpanded: boolean;
    settingsExpanded: boolean;
    chatMessages: ChatMessage[];
    chatInput: string;
    chatReplyIndex: number;
    catModal: { open: boolean; editingId: string | null };
    txModal: { open: boolean; rentalId: string | null };
    txDetailId: string | null;
    toast: Toast | null;
    toastSeq: number;
}

type Action =
    | { type: 'NAVIGATE'; view: RentalView }
    | { type: 'TOGGLE_RENTALS_NAV' }
    | { type: 'TOGGLE_SETTINGS_NAV' }
    | { type: 'OPEN_RENTAL'; id: string }
    | { type: 'SET_RENTAL_SEARCH'; value: string }
    | { type: 'SET_DASH_FILTER'; key: keyof DashboardFilters; value: string }
    | { type: 'CLEAR_DASH_FILTERS' }
    | { type: 'SET_DETAIL_FILTER'; key: keyof DetailFilters; value: string }
    | { type: 'CLEAR_DETAIL_FILTERS' }
    | { type: 'SET_TX_FILTER'; key: keyof TransactionsFilters; value: string }
    | { type: 'CLEAR_TX_FILTERS' }
    | { type: 'OPEN_TX_MODAL'; rentalId: string | null }
    | { type: 'CLOSE_TX_MODAL' }
    | { type: 'OPEN_TX_DETAIL'; id: string }
    | { type: 'CLOSE_TX_DETAIL' }
    | { type: 'OPEN_CAT_NEW' }
    | { type: 'OPEN_CAT_EDIT'; id: string }
    | { type: 'CLOSE_CAT_MODAL' }
    | { type: 'SET_RENTALS'; rentals: Rental[] }
    | { type: 'SET_CATEGORIES'; categories: Category[] }
    | { type: 'SET_TRANSACTIONS'; transactions: Transaction[] }
    | { type: 'SHOW_TOAST'; message: string; ok: boolean }
    | { type: 'SET_CHAT_INPUT'; value: string }
    | { type: 'SEND_CHAT'; text: string }
    | { type: 'DISMISS_TOAST' };

interface RentalInit {
    rentals: Rental[];
    categories: Category[];
    transactions: Transaction[];
}

function createInitialState({
    rentals,
    categories,
    transactions,
}: RentalInit): RentalState {
    return {
        view: 'dashboard',
        selectedId: null,
        rentals,
        transactions,
        categories,
        rentalSearch: '',
        dashFilters: { rentalId: 'all', from: '2026-01-01', to: '2026-06-30' },
        detailFilters: { from: '', to: '', category: 'all' },
        filters: { rentalId: 'all', month: 'all', year: 'all' },
        rentalsExpanded: true,
        settingsExpanded: false,
        chatMessages: [
            {
                role: 'assistant',
                text: '¡Hola! Soy Guaschnet, tu asistente de alquileres. Puedo ayudarte a resumir ingresos y gastos, localizar transacciones o preparar informes. ¿En qué te ayudo hoy?',
            },
        ],
        chatInput: '',
        chatReplyIndex: 0,
        catModal: { open: false, editingId: null },
        txModal: { open: false, rentalId: null },
        txDetailId: null,
        toast: null,
        toastSeq: 0,
    };
}

function withToast(state: RentalState, msg: string, ok: boolean): RentalState {
    const toastSeq = state.toastSeq + 1;
    return { ...state, toast: { id: toastSeq, msg, ok }, toastSeq };
}

function reducer(state: RentalState, action: Action): RentalState {
    switch (action.type) {
        case 'NAVIGATE':
            return { ...state, view: action.view };

        case 'TOGGLE_RENTALS_NAV': {
            const onRentalsSection =
                state.view === 'rentals' ||
                state.view === 'detail' ||
                state.view === 'newRental';
            return {
                ...state,
                view: 'rentals',
                rentalsExpanded: onRentalsSection
                    ? !state.rentalsExpanded
                    : true,
            };
        }

        case 'TOGGLE_SETTINGS_NAV':
            return {
                ...state,
                view: 'settings',
                settingsExpanded:
                    state.view === 'settings' ? !state.settingsExpanded : true,
            };

        case 'OPEN_RENTAL':
            return {
                ...state,
                view: 'detail',
                selectedId: action.id,
                detailFilters: { from: '', to: '', category: 'all' },
            };

        case 'SET_RENTAL_SEARCH':
            return { ...state, rentalSearch: action.value };

        case 'SET_DASH_FILTER':
            return {
                ...state,
                dashFilters: {
                    ...state.dashFilters,
                    [action.key]: action.value,
                },
            };

        case 'CLEAR_DASH_FILTERS':
            return {
                ...state,
                dashFilters: {
                    rentalId: 'all',
                    from: '2026-01-01',
                    to: '2026-06-30',
                },
            };

        case 'SET_DETAIL_FILTER':
            return {
                ...state,
                detailFilters: {
                    ...state.detailFilters,
                    [action.key]: action.value,
                },
            };

        case 'CLEAR_DETAIL_FILTERS':
            return {
                ...state,
                detailFilters: { from: '', to: '', category: 'all' },
            };

        case 'SET_TX_FILTER':
            return {
                ...state,
                filters: { ...state.filters, [action.key]: action.value },
            };

        case 'CLEAR_TX_FILTERS':
            return {
                ...state,
                filters: { rentalId: 'all', month: 'all', year: 'all' },
            };

        case 'OPEN_TX_MODAL':
            return {
                ...state,
                txModal: { open: true, rentalId: action.rentalId },
            };

        case 'CLOSE_TX_MODAL':
            return { ...state, txModal: { open: false, rentalId: null } };

        case 'OPEN_TX_DETAIL':
            return { ...state, txDetailId: action.id };

        case 'CLOSE_TX_DETAIL':
            return { ...state, txDetailId: null };

        case 'OPEN_CAT_NEW':
            return { ...state, catModal: { open: true, editingId: null } };

        case 'OPEN_CAT_EDIT':
            return {
                ...state,
                catModal: { open: true, editingId: action.id },
            };

        case 'CLOSE_CAT_MODAL':
            return { ...state, catModal: { open: false, editingId: null } };

        case 'SET_RENTALS':
            return { ...state, rentals: action.rentals };

        case 'SET_CATEGORIES':
            return { ...state, categories: action.categories };

        case 'SET_TRANSACTIONS':
            return { ...state, transactions: action.transactions };

        case 'SHOW_TOAST':
            return withToast(state, action.message, action.ok);

        case 'SET_CHAT_INPUT':
            return { ...state, chatInput: action.value };

        case 'SEND_CHAT': {
            const text = action.text.trim();
            if (!text) {
                return state;
            }
            const reply =
                CHAT_REPLIES[state.chatReplyIndex % CHAT_REPLIES.length];
            return {
                ...state,
                chatMessages: [
                    ...state.chatMessages,
                    { role: 'user', text },
                    { role: 'assistant', text: reply },
                ],
                chatInput: '',
                chatReplyIndex: state.chatReplyIndex + 1,
            };
        }

        case 'DISMISS_TOAST':
            return { ...state, toast: null };

        default:
            return state;
    }
}

export interface RentalActions {
    navigate: (view: RentalView) => void;
    toggleRentalsNav: () => void;
    toggleSettingsNav: () => void;
    openRental: (id: string) => void;
    setRentalSearch: (value: string) => void;
    setDashFilter: (key: keyof DashboardFilters, value: string) => void;
    clearDashFilters: () => void;
    setDetailFilter: (key: keyof DetailFilters, value: string) => void;
    clearDetailFilters: () => void;
    setTxFilter: (key: keyof TransactionsFilters, value: string) => void;
    clearTxFilters: () => void;
    openTxModal: (rentalId?: string | null) => void;
    closeTxModal: () => void;
    openTxDetail: (id: string) => void;
    closeTxDetail: () => void;
    openCatNew: () => void;
    openCatEdit: (id: string) => void;
    closeCatModal: () => void;
    deleteCat: (id: string) => void;
    showToast: (message: string, ok: boolean) => void;
    setChatInput: (value: string) => void;
    sendChat: (text: string) => void;
}

export interface RentalStore {
    state: RentalState;
    actions: RentalActions;
}

export function useRental(
    rentals: Rental[],
    categories: Category[],
    transactions: Transaction[],
): RentalStore {
    const [state, dispatch] = useReducer(
        reducer,
        { rentals, categories, transactions },
        createInitialState,
    );

    useEffect(() => {
        if (!state.toast) {
            return;
        }
        const timer = window.setTimeout(
            () => dispatch({ type: 'DISMISS_TOAST' }),
            2800,
        );
        return () => window.clearTimeout(timer);
    }, [state.toast]);

    useEffect(() => {
        dispatch({ type: 'SET_RENTALS', rentals });
    }, [rentals]);

    useEffect(() => {
        dispatch({ type: 'SET_CATEGORIES', categories });
    }, [categories]);

    useEffect(() => {
        dispatch({ type: 'SET_TRANSACTIONS', transactions });
    }, [transactions]);

    const actions = useMemo<RentalActions>(
        () => ({
            navigate: (view) => dispatch({ type: 'NAVIGATE', view }),
            toggleRentalsNav: () => dispatch({ type: 'TOGGLE_RENTALS_NAV' }),
            toggleSettingsNav: () => dispatch({ type: 'TOGGLE_SETTINGS_NAV' }),
            openRental: (id) => dispatch({ type: 'OPEN_RENTAL', id }),
            setRentalSearch: (value) =>
                dispatch({ type: 'SET_RENTAL_SEARCH', value }),
            setDashFilter: (key, value) =>
                dispatch({ type: 'SET_DASH_FILTER', key, value }),
            clearDashFilters: () => dispatch({ type: 'CLEAR_DASH_FILTERS' }),
            setDetailFilter: (key, value) =>
                dispatch({ type: 'SET_DETAIL_FILTER', key, value }),
            clearDetailFilters: () =>
                dispatch({ type: 'CLEAR_DETAIL_FILTERS' }),
            setTxFilter: (key, value) =>
                dispatch({ type: 'SET_TX_FILTER', key, value }),
            clearTxFilters: () => dispatch({ type: 'CLEAR_TX_FILTERS' }),
            openTxModal: (rentalId = null) =>
                dispatch({ type: 'OPEN_TX_MODAL', rentalId }),
            closeTxModal: () => dispatch({ type: 'CLOSE_TX_MODAL' }),
            openTxDetail: (id) => dispatch({ type: 'OPEN_TX_DETAIL', id }),
            closeTxDetail: () => dispatch({ type: 'CLOSE_TX_DETAIL' }),
            openCatNew: () => dispatch({ type: 'OPEN_CAT_NEW' }),
            openCatEdit: (id) => dispatch({ type: 'OPEN_CAT_EDIT', id }),
            closeCatModal: () => dispatch({ type: 'CLOSE_CAT_MODAL' }),
            deleteCat: (id) => {
                router.delete(DeleteCategoryController.url(Number(id)), {
                    preserveScroll: true,
                    preserveState: true,
                    onSuccess: () =>
                        dispatch({
                            type: 'SHOW_TOAST',
                            message: 'Categoría eliminada',
                            ok: true,
                        }),
                    onError: () =>
                        dispatch({
                            type: 'SHOW_TOAST',
                            message: 'No se pudo eliminar la categoría',
                            ok: false,
                        }),
                });
            },
            showToast: (message, ok) =>
                dispatch({ type: 'SHOW_TOAST', message, ok }),
            setChatInput: (value) =>
                dispatch({ type: 'SET_CHAT_INPUT', value }),
            sendChat: (text) => dispatch({ type: 'SEND_CHAT', text }),
        }),
        [],
    );

    return useMemo(() => ({ state, actions }), [state, actions]);
}

export type { RentalState };
