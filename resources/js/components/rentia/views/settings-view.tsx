import { useMemo } from 'react';
import { Icon } from '../icon';
import { useRentiaContext } from '../rentia-context';
import type { Category, TransactionType } from '../types';
import { Card } from '../ui';

interface CategoryRow extends Category {
    count: string;
}

function CategorySection({
    title,
    icon,
    iconClass,
    categories,
}: {
    title: string;
    icon: string;
    iconClass: string;
    categories: CategoryRow[];
}) {
    const { actions } = useRentiaContext();

    return (
        <Card className="overflow-hidden p-0">
            <div className="flex items-center gap-[9px] px-5 py-4">
                <Icon
                    name={icon}
                    width={17}
                    height={17}
                    className={iconClass}
                />
                <h3 className="text-[15px] font-semibold">{title}</h3>
            </div>
            {categories.map((c) => (
                <div
                    key={c.id}
                    className="flex items-center gap-3 border-t border-zinc-100 px-5 py-[13px]"
                >
                    <span
                        className="size-3 shrink-0 rounded-[3px]"
                        style={{ background: c.color }}
                    />
                    <span className="flex-1 text-sm font-medium">{c.name}</span>
                    <span className="text-xs text-zinc-400">{c.count}</span>
                    <button
                        onClick={() => actions.openCatEdit(c.id)}
                        title="Editar"
                        className="flex size-[30px] cursor-pointer items-center justify-center rounded-md text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-900"
                    >
                        <Icon name="pencil" width={15} height={15} />
                    </button>
                    <button
                        onClick={() => actions.deleteCat(c.id)}
                        title="Eliminar"
                        className="flex size-[30px] cursor-pointer items-center justify-center rounded-md text-zinc-400 transition hover:bg-red-50 hover:text-red-600"
                    >
                        <Icon name="trash-2" width={15} height={15} />
                    </button>
                </div>
            ))}
        </Card>
    );
}

export function SettingsView() {
    const { state } = useRentiaContext();
    const { categories, transactions } = state;

    const { ingresos, gastos } = useMemo(() => {
        const counts = new Map<string, number>();
        transactions.forEach((t) =>
            counts.set(t.category, (counts.get(t.category) ?? 0) + 1),
        );
        const toRow = (c: Category): CategoryRow => {
            const n = counts.get(c.name) ?? 0;
            return {
                ...c,
                count: `${n} ${n === 1 ? 'transacción' : 'transacciones'}`,
            };
        };
        const byType = (type: TransactionType) =>
            categories.filter((c) => c.type === type).map(toRow);
        return { ingresos: byType('ingreso'), gastos: byType('gasto') };
    }, [categories, transactions]);

    return (
        <div className="mx-auto flex max-w-[820px] flex-col gap-4">
            <CategorySection
                title="Categorías de ingresos"
                icon="trending-up"
                iconClass="text-green-600"
                categories={ingresos}
            />
            <CategorySection
                title="Categorías de gastos"
                icon="trending-down"
                iconClass="text-red-600"
                categories={gastos}
            />
        </div>
    );
}
