import { useEffect, useMemo, useReducer } from 'react';
import {
    CHAT_REPLIES,
    INITIAL_CATEGORIES,
    INITIAL_FILES,
    INITIAL_RENTALS,
    INITIAL_TRANSACTIONS,
} from './data';
import type {
    Category,
    CategoryDraft,
    ChatMessage,
    DashboardFilters,
    DetailFilters,
    Rental,
    RentalFile,
    RentalForm,
    RentiaView,
    Toast,
    Transaction,
    TransactionDraft,
    TransactionsFilters,
    TransactionType,
} from './types';
import { todayIso } from './utils';

interface RentiaState {
    view: RentiaView;
    selectedId: string | null;
    rentals: Rental[];
    transactions: Transaction[];
    files: Record<string, RentalFile[]>;
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
    catModalOpen: boolean;
    catEditing: boolean;
    catDraft: CategoryDraft;
    txModalOpen: boolean;
    draft: TransactionDraft;
    txDetailId: string | null;
    form: RentalForm;
    toast: Toast | null;
    toastSeq: number;
}

type Action =
    | { type: 'NAVIGATE'; view: RentiaView }
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
    | { type: 'SET_TX_TYPE'; txType: TransactionType }
    | { type: 'SET_DRAFT_FIELD'; field: keyof TransactionDraft; value: string }
    | { type: 'SUBMIT_TX' }
    | { type: 'OPEN_TX_DETAIL'; id: string }
    | { type: 'CLOSE_TX_DETAIL' }
    | { type: 'OPEN_CAT_NEW' }
    | { type: 'OPEN_CAT_EDIT'; id: string }
    | { type: 'CLOSE_CAT_MODAL' }
    | { type: 'SET_CAT_NAME'; value: string }
    | { type: 'SET_CAT_TYPE'; catType: TransactionType }
    | { type: 'SET_CAT_COLOR'; color: string }
    | { type: 'SAVE_CAT' }
    | { type: 'DELETE_CAT'; id: string }
    | { type: 'SET_FORM_FIELD'; field: keyof RentalForm; value: string }
    | { type: 'SUBMIT_RENTAL' }
    | { type: 'UPLOAD_FILES'; files: Array<{ name: string; size: number }> }
    | { type: 'SET_CHAT_INPUT'; value: string }
    | { type: 'SEND_CHAT'; text: string }
    | { type: 'DISMISS_TOAST' };

function emptyForm(): RentalForm {
    return {
        address: '',
        city: '',
        type: 'Piso',
        rent: '',
        deposit: '',
        tenantName: '',
        tenantEmail: '',
        tenantPhone: '',
        contractStart: '',
        contractEnd: '',
    };
}

function createInitialState(): RentiaState {
    return {
        view: 'dashboard',
        selectedId: null,
        rentals: INITIAL_RENTALS,
        transactions: INITIAL_TRANSACTIONS,
        files: INITIAL_FILES,
        categories: INITIAL_CATEGORIES,
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
        catModalOpen: false,
        catEditing: false,
        catDraft: { id: null, name: '', type: 'gasto', color: '#ef4444' },
        txModalOpen: false,
        draft: {
            type: 'ingreso',
            rentalId: '',
            date: todayIso(),
            category: 'Renta',
            concept: '',
            amount: '',
            method: 'Transferencia',
        },
        txDetailId: null,
        form: emptyForm(),
        toast: null,
        toastSeq: 0,
    };
}

function withToast(state: RentiaState, msg: string, ok: boolean): RentiaState {
    const toastSeq = state.toastSeq + 1;
    return { ...state, toast: { id: toastSeq, msg, ok }, toastSeq };
}

function reducer(state: RentiaState, action: Action): RentiaState {
    switch (action.type) {
        case 'NAVIGATE':
            return {
                ...state,
                view: action.view,
                form: action.view === 'newRental' ? emptyForm() : state.form,
            };

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

        case 'OPEN_TX_MODAL': {
            const fallback =
                state.rentals.find((r) => r.status === 'Alquilado') ??
                state.rentals[0];
            const type: TransactionType = 'ingreso';
            return {
                ...state,
                txModalOpen: true,
                draft: {
                    type,
                    rentalId: action.rentalId ?? fallback?.id ?? '',
                    date: todayIso(),
                    category: 'Renta',
                    concept: '',
                    amount: '',
                    method: 'Transferencia',
                },
            };
        }

        case 'CLOSE_TX_MODAL':
            return { ...state, txModalOpen: false };

        case 'SET_TX_TYPE':
            return {
                ...state,
                draft: {
                    ...state.draft,
                    type: action.txType,
                    category:
                        action.txType === 'ingreso' ? 'Renta' : 'Reparaciones',
                },
            };

        case 'SET_DRAFT_FIELD':
            return {
                ...state,
                draft: { ...state.draft, [action.field]: action.value },
            };

        case 'SUBMIT_TX': {
            const { draft } = state;
            if (!draft.amount || !Number(draft.amount) || !draft.rentalId) {
                return withToast(
                    state,
                    'Indica un importe y un alquiler',
                    false,
                );
            }
            const tx: Transaction = {
                id: `t${Date.now()}`,
                rentalId: draft.rentalId,
                date: draft.date || todayIso(),
                type: draft.type,
                category: draft.category,
                concept:
                    draft.concept ||
                    (draft.type === 'ingreso' ? 'Ingreso' : 'Gasto'),
                amount: Math.abs(Number(draft.amount)),
                method: draft.method || 'Transferencia',
            };
            return withToast(
                {
                    ...state,
                    transactions: [tx, ...state.transactions],
                    txModalOpen: false,
                },
                'Transacción añadida',
                true,
            );
        }

        case 'OPEN_TX_DETAIL':
            return { ...state, txDetailId: action.id };

        case 'CLOSE_TX_DETAIL':
            return { ...state, txDetailId: null };

        case 'OPEN_CAT_NEW':
            return {
                ...state,
                catModalOpen: true,
                catEditing: false,
                catDraft: {
                    id: null,
                    name: '',
                    type: 'gasto',
                    color: '#ef4444',
                },
            };

        case 'OPEN_CAT_EDIT': {
            const category = state.categories.find((c) => c.id === action.id);
            if (!category) {
                return state;
            }
            return {
                ...state,
                catModalOpen: true,
                catEditing: true,
                catDraft: { ...category },
            };
        }

        case 'CLOSE_CAT_MODAL':
            return { ...state, catModalOpen: false };

        case 'SET_CAT_NAME':
            return {
                ...state,
                catDraft: { ...state.catDraft, name: action.value },
            };

        case 'SET_CAT_TYPE':
            return {
                ...state,
                catDraft: { ...state.catDraft, type: action.catType },
            };

        case 'SET_CAT_COLOR':
            return {
                ...state,
                catDraft: { ...state.catDraft, color: action.color },
            };

        case 'SAVE_CAT': {
            const draft = state.catDraft;
            if (!draft.name.trim()) {
                return withToast(
                    state,
                    'Escribe un nombre de categoría',
                    false,
                );
            }
            const categories = draft.id
                ? state.categories.map((c) =>
                      c.id === draft.id
                          ? {
                                ...c,
                                name: draft.name.trim(),
                                type: draft.type,
                                color: draft.color,
                            }
                          : c,
                  )
                : [
                      ...state.categories,
                      {
                          id: `c${Date.now()}`,
                          name: draft.name.trim(),
                          type: draft.type,
                          color: draft.color,
                      },
                  ];
            return withToast(
                { ...state, categories, catModalOpen: false },
                draft.id ? 'Categoría actualizada' : 'Categoría creada',
                true,
            );
        }

        case 'DELETE_CAT':
            return withToast(
                {
                    ...state,
                    categories: state.categories.filter(
                        (c) => c.id !== action.id,
                    ),
                },
                'Categoría eliminada',
                true,
            );

        case 'SET_FORM_FIELD':
            return {
                ...state,
                form: { ...state.form, [action.field]: action.value },
            };

        case 'SUBMIT_RENTAL': {
            const form = state.form;
            if (!form.address || !form.city || !form.rent) {
                return withToast(
                    state,
                    'Completa dirección, ciudad y renta',
                    false,
                );
            }
            const id = `r${Date.now()}`;
            const hasTenant = Boolean(form.tenantName);
            const rental: Rental = {
                id,
                address: form.address,
                city: form.city,
                type: form.type,
                rent: Number(form.rent) || 0,
                deposit: Number(form.deposit) || 0,
                contractStart: form.contractStart || null,
                contractEnd: form.contractEnd || null,
                status: hasTenant ? 'Alquilado' : 'Vacío',
                tenant: hasTenant
                    ? {
                          name: form.tenantName,
                          email: form.tenantEmail || '—',
                          phone: form.tenantPhone || '—',
                          since: form.contractStart || todayIso(),
                      }
                    : null,
            };
            return withToast(
                {
                    ...state,
                    rentals: [...state.rentals, rental],
                    files: { ...state.files, [id]: [] },
                    view: 'detail',
                    selectedId: id,
                    detailFilters: { from: '', to: '', category: 'all' },
                    form: emptyForm(),
                },
                'Alquiler dado de alta',
                true,
            );
        }

        case 'UPLOAD_FILES': {
            const id = state.selectedId;
            if (!id || !action.files.length) {
                return state;
            }
            const added: RentalFile[] = action.files.map((file) => ({
                name: file.name,
                kind: 'Documento',
                size: `${Math.max(1, Math.round(file.size / 1024))} KB`,
                date: todayIso(),
            }));
            return withToast(
                {
                    ...state,
                    files: {
                        ...state.files,
                        [id]: [...(state.files[id] ?? []), ...added],
                    },
                },
                `${action.files.length} archivo(s) subido(s)`,
                true,
            );
        }

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

export interface RentiaActions {
    navigate: (view: RentiaView) => void;
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
    setTxType: (txType: TransactionType) => void;
    setDraftField: (field: keyof TransactionDraft, value: string) => void;
    submitTx: () => void;
    openTxDetail: (id: string) => void;
    closeTxDetail: () => void;
    openCatNew: () => void;
    openCatEdit: (id: string) => void;
    closeCatModal: () => void;
    setCatName: (value: string) => void;
    setCatType: (catType: TransactionType) => void;
    setCatColor: (color: string) => void;
    saveCat: () => void;
    deleteCat: (id: string) => void;
    setFormField: (field: keyof RentalForm, value: string) => void;
    submitRental: () => void;
    uploadFiles: (files: Array<{ name: string; size: number }>) => void;
    setChatInput: (value: string) => void;
    sendChat: (text: string) => void;
}

export interface RentiaStore {
    state: RentiaState;
    actions: RentiaActions;
}

export function useRentia(): RentiaStore {
    const [state, dispatch] = useReducer(
        reducer,
        undefined,
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

    const actions = useMemo<RentiaActions>(
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
            setTxType: (txType) => dispatch({ type: 'SET_TX_TYPE', txType }),
            setDraftField: (field, value) =>
                dispatch({ type: 'SET_DRAFT_FIELD', field, value }),
            submitTx: () => dispatch({ type: 'SUBMIT_TX' }),
            openTxDetail: (id) => dispatch({ type: 'OPEN_TX_DETAIL', id }),
            closeTxDetail: () => dispatch({ type: 'CLOSE_TX_DETAIL' }),
            openCatNew: () => dispatch({ type: 'OPEN_CAT_NEW' }),
            openCatEdit: (id) => dispatch({ type: 'OPEN_CAT_EDIT', id }),
            closeCatModal: () => dispatch({ type: 'CLOSE_CAT_MODAL' }),
            setCatName: (value) => dispatch({ type: 'SET_CAT_NAME', value }),
            setCatType: (catType) =>
                dispatch({ type: 'SET_CAT_TYPE', catType }),
            setCatColor: (color) => dispatch({ type: 'SET_CAT_COLOR', color }),
            saveCat: () => dispatch({ type: 'SAVE_CAT' }),
            deleteCat: (id) => dispatch({ type: 'DELETE_CAT', id }),
            setFormField: (field, value) =>
                dispatch({ type: 'SET_FORM_FIELD', field, value }),
            submitRental: () => dispatch({ type: 'SUBMIT_RENTAL' }),
            uploadFiles: (files) => dispatch({ type: 'UPLOAD_FILES', files }),
            setChatInput: (value) =>
                dispatch({ type: 'SET_CHAT_INPUT', value }),
            sendChat: (text) => dispatch({ type: 'SEND_CHAT', text }),
        }),
        [],
    );

    return useMemo(() => ({ state, actions }), [state, actions]);
}

export type { RentiaState };
