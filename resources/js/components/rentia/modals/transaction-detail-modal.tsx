import { useMemo } from 'react';
import { Icon } from '../icon';
import { useRentiaContext } from '../rentia-context';
import { categoryColor, formatDate, formatEuros, shortAddress } from '../utils';
import { Modal } from './modal';

function DetailRow({
    icon,
    label,
    children,
}: {
    icon: string;
    label: string;
    children: React.ReactNode;
}) {
    return (
        <div className="flex items-center justify-between gap-3 border-t border-zinc-100 py-3">
            <span className="flex items-center gap-2 text-[13px] text-zinc-500">
                <Icon
                    name={icon}
                    width={15}
                    height={15}
                    className="text-zinc-400"
                />
                {label}
            </span>
            <span className="inline-flex items-center gap-[7px] text-right text-[13px] font-medium">
                {children}
            </span>
        </div>
    );
}

export function TransactionDetailModal() {
    const { state, actions } = useRentiaContext();
    const { txDetailId, transactions, rentals, categories } = state;

    const detail = useMemo(() => {
        if (!txDetailId) {
            return null;
        }
        const tx = transactions.find((t) => t.id === txDetailId);
        if (!tx) {
            return null;
        }
        const rental = rentals.find((r) => r.id === tx.rentalId);
        const isIncome = tx.type === 'ingreso';
        return {
            isIncome,
            typeLabel: isIncome ? 'Ingreso' : 'Gasto',
            typeFg: isIncome ? '#16a34a' : '#dc2626',
            typeBg: isIncome ? '#f0fdf4' : '#fef2f2',
            typeBorder: isIncome ? '#bbf7d0' : '#fecaca',
            typeIcon: isIncome ? 'arrow-down-left' : 'arrow-up-right',
            amountFmt: `${isIncome ? '+' : '−'}${formatEuros(tx.amount)}`,
            amountColor: isIncome ? '#16a34a' : '#dc2626',
            concept: tx.concept,
            rentalName:
                shortAddress(rental?.address ?? '—') +
                (rental?.city ? ` · ${rental.city}` : ''),
            category: tx.category,
            catColor: categoryColor(categories, tx.category),
            dateFmt: formatDate(tx.date),
            method: tx.method,
        };
    }, [txDetailId, transactions, rentals, categories]);

    if (!detail) {
        return null;
    }

    return (
        <Modal onClose={actions.closeTxDetail} className="max-w-[420px]">
            <div className="flex items-center justify-between border-b border-zinc-100 px-[22px] py-[18px]">
                <span
                    className="inline-flex h-[26px] items-center gap-[7px] rounded-full border px-[11px] text-xs font-semibold"
                    style={{
                        color: detail.typeFg,
                        background: detail.typeBg,
                        borderColor: detail.typeBorder,
                    }}
                >
                    <Icon name={detail.typeIcon} width={14} height={14} />
                    {detail.typeLabel}
                </span>
                <button
                    onClick={actions.closeTxDetail}
                    className="flex size-8 cursor-pointer items-center justify-center rounded-lg border border-zinc-200 bg-white transition hover:bg-zinc-100"
                >
                    <Icon name="x" width={16} height={16} />
                </button>
            </div>
            <div className="p-[22px]">
                <div
                    className="mb-[3px] text-3xl font-bold tracking-tight"
                    style={{ color: detail.amountColor }}
                >
                    {detail.amountFmt}
                </div>
                <div className="mb-4 text-[15px] font-semibold">
                    {detail.concept}
                </div>
                <div className="flex flex-col">
                    <DetailRow icon="building-2" label="Alquiler">
                        {detail.rentalName}
                    </DetailRow>
                    <DetailRow icon="tag" label="Categoría">
                        <span
                            className="size-2 rounded-[2px]"
                            style={{ background: detail.catColor }}
                        />
                        {detail.category}
                    </DetailRow>
                    <DetailRow icon="calendar" label="Fecha">
                        {detail.dateFmt}
                    </DetailRow>
                    <DetailRow icon="credit-card" label="Método">
                        {detail.method}
                    </DetailRow>
                </div>
            </div>
        </Modal>
    );
}
