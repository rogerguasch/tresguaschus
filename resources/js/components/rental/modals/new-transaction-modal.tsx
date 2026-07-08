import CreateTransactionController from '@/actions/App/Transaction/Infrastructure/Http/Controllers/CreateTransactionController';
import { cn } from '@/lib/utils';
import { useForm } from '@inertiajs/react';
import { type FormEvent, useMemo } from 'react';
import { PAYMENT_METHODS } from '../data';
import { Icon } from '../icon';
import { useRentalContext } from '../rental-context';
import type { TransactionType } from '../types';
import {
    Field,
    PrimaryButton,
    SecondaryButton,
    SelectInput,
    TextInput,
} from '../ui';
import { shortAddress, todayIso } from '../utils';
import { Modal } from './modal';

const segmentBase =
    'inline-flex h-[42px] cursor-pointer items-center justify-center gap-2 rounded-lg text-sm font-semibold transition';

export function NewTransactionModal() {
    const { state } = useRentalContext();

    if (!state.txModal.open) {
        return null;
    }

    return <TransactionForm />;
}

function TransactionForm() {
    const { state, actions } = useRentalContext();
    const { rentals, categories, txModal } = state;

    const fallbackRental =
        rentals.find((r) => r.status === 'Alquilado') ?? rentals[0];

    const form = useForm({
        type: 'ingreso' as TransactionType,
        rental_id: txModal.rentalId ?? fallbackRental?.id ?? '',
        date: todayIso(),
        category: categories.find((c) => c.type === 'ingreso')?.name ?? '',
        concept: '',
        amount: '',
        method: 'Transferencia',
    });

    const categoryOptions = useMemo(
        () =>
            categories
                .filter((c) => c.type === form.data.type)
                .map((c) => c.name),
        [categories, form.data.type],
    );

    const rentalOptions = useMemo(
        () =>
            rentals.map((r) => ({
                value: r.id,
                label: `${shortAddress(r.address)} · ${r.city}`,
            })),
        [rentals],
    );

    const changeType = (type: TransactionType): void => {
        form.setData((data) => ({
            ...data,
            type,
            category: categories.find((c) => c.type === type)?.name ?? '',
        }));
    };

    const submit = (event: FormEvent): void => {
        event.preventDefault();

        form.transform((data) => ({
            rental_id: data.rental_id,
            category: data.category,
            date: data.date || todayIso(),
            concept:
                data.concept || (data.type === 'ingreso' ? 'Ingreso' : 'Gasto'),
            amount: Math.abs(Number(data.amount)) || 0,
            method: data.method || 'Transferencia',
        }));

        form.post(CreateTransactionController.url(), {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                actions.closeTxModal();
                actions.showToast('Transacción añadida', true);
            },
        });
    };

    const typeButton = (type: TransactionType, label: string, icon: string) => {
        const active = form.data.type === type;
        const activeClass =
            type === 'ingreso'
                ? 'border border-green-600 bg-green-50 text-green-600'
                : 'border border-red-600 bg-red-50 text-red-600';
        return (
            <button
                type="button"
                onClick={() => changeType(type)}
                className={cn(
                    segmentBase,
                    active
                        ? activeClass
                        : 'border border-zinc-200 bg-white text-zinc-500',
                )}
            >
                <Icon name={icon} width={16} height={16} />
                {label}
            </button>
        );
    };

    return (
        <Modal onClose={actions.closeTxModal} className="max-w-[520px]">
            <form onSubmit={submit}>
                <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-5">
                    <div>
                        <h3 className="text-base font-bold tracking-tight">
                            Nueva transacción
                        </h3>
                        <p className="mt-0.5 text-[13px] text-zinc-500">
                            Registra un ingreso o un gasto
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={actions.closeTxModal}
                        className="flex size-8 cursor-pointer items-center justify-center rounded-lg border border-zinc-200 bg-white transition hover:bg-zinc-100"
                    >
                        <Icon name="x" width={16} height={16} />
                    </button>
                </div>
                <div className="p-6">
                    <div className="mb-[18px] grid grid-cols-2 gap-2">
                        {typeButton('ingreso', 'Ingreso', 'arrow-down-left')}
                        {typeButton('gasto', 'Gasto', 'arrow-up-right')}
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                        <Field label="Alquiler" error={form.errors.rental_id}>
                            <SelectInput
                                value={form.data.rental_id}
                                onChange={(e) =>
                                    form.setData('rental_id', e.target.value)
                                }
                            >
                                {rentalOptions.map((o) => (
                                    <option key={o.value} value={o.value}>
                                        {o.label}
                                    </option>
                                ))}
                            </SelectInput>
                        </Field>
                        <div className="grid grid-cols-2 gap-4">
                            <Field
                                label="Importe (€)"
                                error={form.errors.amount}
                            >
                                <TextInput
                                    type="number"
                                    value={form.data.amount}
                                    onChange={(e) =>
                                        form.setData('amount', e.target.value)
                                    }
                                    placeholder="0"
                                />
                            </Field>
                            <Field label="Fecha" error={form.errors.date}>
                                <TextInput
                                    type="date"
                                    value={form.data.date}
                                    onChange={(e) =>
                                        form.setData('date', e.target.value)
                                    }
                                />
                            </Field>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <Field
                                label="Categoría"
                                error={form.errors.category}
                            >
                                <SelectInput
                                    value={form.data.category}
                                    onChange={(e) =>
                                        form.setData('category', e.target.value)
                                    }
                                >
                                    {categoryOptions.map((c) => (
                                        <option key={c} value={c}>
                                            {c}
                                        </option>
                                    ))}
                                </SelectInput>
                            </Field>
                            <Field
                                label="Método de pago"
                                error={form.errors.method}
                            >
                                <SelectInput
                                    value={form.data.method}
                                    onChange={(e) =>
                                        form.setData('method', e.target.value)
                                    }
                                >
                                    {PAYMENT_METHODS.map((m) => (
                                        <option key={m} value={m}>
                                            {m}
                                        </option>
                                    ))}
                                </SelectInput>
                            </Field>
                        </div>
                        <Field label="Concepto" error={form.errors.concept}>
                            <TextInput
                                value={form.data.concept}
                                onChange={(e) =>
                                    form.setData('concept', e.target.value)
                                }
                                placeholder="Ej: Renta mensual, Reparación caldera…"
                            />
                        </Field>
                    </div>
                </div>
                <div className="flex justify-end gap-2.5 border-t border-zinc-100 bg-zinc-50 px-6 py-[18px]">
                    <SecondaryButton
                        type="button"
                        onClick={actions.closeTxModal}
                    >
                        Cancelar
                    </SecondaryButton>
                    <PrimaryButton type="submit" disabled={form.processing}>
                        <Icon name="check" width={16} height={16} />
                        {form.processing ? 'Guardando…' : 'Guardar'}
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
}
