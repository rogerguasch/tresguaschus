import { cn } from '@/lib/utils';
import { useMemo } from 'react';
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
import { shortAddress } from '../utils';
import { Modal } from './modal';

const segmentBase =
    'inline-flex h-[42px] cursor-pointer items-center justify-center gap-2 rounded-lg text-sm font-semibold transition';

export function NewTransactionModal() {
    const { state, actions } = useRentalContext();
    const { txModalOpen, draft, rentals, categories } = state;

    const categoryOptions = useMemo(
        () =>
            categories.filter((c) => c.type === draft.type).map((c) => c.name),
        [categories, draft.type],
    );

    const rentalOptions = useMemo(
        () =>
            rentals.map((r) => ({
                value: r.id,
                label: `${shortAddress(r.address)} · ${r.city}`,
            })),
        [rentals],
    );

    if (!txModalOpen) {
        return null;
    }

    const typeButton = (type: TransactionType, label: string, icon: string) => {
        const active = draft.type === type;
        const activeClass =
            type === 'ingreso'
                ? 'border border-green-600 bg-green-50 text-green-600'
                : 'border border-red-600 bg-red-50 text-red-600';
        return (
            <button
                onClick={() => actions.setTxType(type)}
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
                    <Field label="Alquiler">
                        <SelectInput
                            value={draft.rentalId}
                            onChange={(e) =>
                                actions.setDraftField(
                                    'rentalId',
                                    e.target.value,
                                )
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
                        <Field label="Importe (€)">
                            <TextInput
                                type="number"
                                value={draft.amount}
                                onChange={(e) =>
                                    actions.setDraftField(
                                        'amount',
                                        e.target.value,
                                    )
                                }
                                placeholder="0"
                            />
                        </Field>
                        <Field label="Fecha">
                            <TextInput
                                type="date"
                                value={draft.date}
                                onChange={(e) =>
                                    actions.setDraftField(
                                        'date',
                                        e.target.value,
                                    )
                                }
                            />
                        </Field>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Field label="Categoría">
                            <SelectInput
                                value={draft.category}
                                onChange={(e) =>
                                    actions.setDraftField(
                                        'category',
                                        e.target.value,
                                    )
                                }
                            >
                                {categoryOptions.map((c) => (
                                    <option key={c} value={c}>
                                        {c}
                                    </option>
                                ))}
                            </SelectInput>
                        </Field>
                        <Field label="Método de pago">
                            <SelectInput
                                value={draft.method}
                                onChange={(e) =>
                                    actions.setDraftField(
                                        'method',
                                        e.target.value,
                                    )
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
                    <Field label="Concepto">
                        <TextInput
                            value={draft.concept}
                            onChange={(e) =>
                                actions.setDraftField('concept', e.target.value)
                            }
                            placeholder="Ej: Renta mensual, Reparación caldera…"
                        />
                    </Field>
                </div>
            </div>
            <div className="flex justify-end gap-2.5 border-t border-zinc-100 bg-zinc-50 px-6 py-[18px]">
                <SecondaryButton onClick={actions.closeTxModal}>
                    Cancelar
                </SecondaryButton>
                <PrimaryButton onClick={actions.submitTx}>
                    <Icon name="check" width={16} height={16} />
                    Guardar
                </PrimaryButton>
            </div>
        </Modal>
    );
}
