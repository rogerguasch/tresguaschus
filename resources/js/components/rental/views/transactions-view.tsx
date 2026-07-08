import { useEffect, useMemo, useState } from 'react';
import { Sparkline } from '../charts/sparkline';
import { MONTHS_LONG } from '../data';
import { Icon } from '../icon';
import { useRentalContext } from '../rental-context';
import { rentalsById, toTransactionRow } from '../selectors';
import { Card, SecondaryButton, SelectInput } from '../ui';
import { formatEuros, shortAddress, sumByType } from '../utils';

const PAGE_SIZE = 20;

export function TransactionsView() {
    const { state, actions } = useRentalContext();
    const { rentals, transactions, categories, filters } = state;

    const rentalsMap = useMemo(() => rentalsById(rentals), [rentals]);

    const [page, setPage] = useState(1);

    // Reset to the first page whenever the active filters change.
    useEffect(() => {
        setPage(1);
    }, [filters.rentalId, filters.month, filters.year]);

    const data = useMemo(() => {
        let list = transactions.slice();
        if (filters.rentalId !== 'all') {
            list = list.filter((t) => t.rentalId === filters.rentalId);
        }
        if (filters.year !== 'all') {
            list = list.filter((t) => t.date.slice(0, 4) === filters.year);
        }
        if (filters.month !== 'all') {
            list = list.filter(
                (t) => String(+t.date.slice(5, 7) - 1) === filters.month,
            );
        }
        list.sort((a, b) => b.date.localeCompare(a.date));

        const totIng = sumByType(list, 'ingreso');
        const totGas = sumByType(list, 'gasto');
        const months = [...new Set(list.map((t) => t.date.slice(0, 7)))].sort();
        const incSeries = months.map((k) =>
            sumByType(
                list.filter((t) => t.date.slice(0, 7) === k),
                'ingreso',
            ),
        );
        const expSeries = months.map((k) =>
            sumByType(
                list.filter((t) => t.date.slice(0, 7) === k),
                'gasto',
            ),
        );

        return {
            rows: list.map((t) => toTransactionRow(t, rentalsMap, categories)),
            totIng: formatEuros(totIng),
            totGas: formatEuros(totGas),
            totNet: formatEuros(totIng - totGas),
            netColor: totIng - totGas >= 0 ? '#16a34a' : '#dc2626',
            incSeries,
            expSeries,
        };
    }, [transactions, categories, filters, rentalsMap]);

    const rentalOptions = useMemo(
        () => [
            { value: 'all', label: 'Todos los alquileres' },
            ...rentals.map((r) => ({
                value: r.id,
                label: `${shortAddress(r.address)} · ${r.city}`,
            })),
        ],
        [rentals],
    );

    const yearOptions = useMemo(() => {
        const years = [...new Set(transactions.map((t) => t.date.slice(0, 4)))]
            .sort()
            .reverse();
        return [
            { value: 'all', label: 'Todos los años' },
            ...years.map((y) => ({ value: y, label: y })),
        ];
    }, [transactions]);

    const hasFilters =
        filters.rentalId !== 'all' ||
        filters.month !== 'all' ||
        filters.year !== 'all';

    const totalPages = Math.max(1, Math.ceil(data.rows.length / PAGE_SIZE));
    const currentPage = Math.min(page, totalPages);
    const pageRows = data.rows.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE,
    );

    return (
        <div className="mx-auto max-w-[1200px]">
            <div className="mb-5 grid grid-cols-3 gap-4">
                <Card className="relative min-h-[70px] overflow-hidden px-[18px] py-4">
                    <Sparkline values={data.incSeries} color="#16a34a" />
                    <div className="relative z-[1] flex items-center gap-3.5">
                        <span className="flex size-[38px] shrink-0 items-center justify-center rounded-lg bg-green-50">
                            <Icon
                                name="trending-up"
                                width={19}
                                height={19}
                                className="text-green-600"
                            />
                        </span>
                        <div>
                            <div className="text-xs text-zinc-500">
                                Ingresos filtrados
                            </div>
                            <div className="text-xl font-bold tracking-tight text-green-600">
                                {data.totIng}
                            </div>
                        </div>
                    </div>
                </Card>
                <Card className="relative min-h-[70px] overflow-hidden px-[18px] py-4">
                    <Sparkline values={data.expSeries} color="#dc2626" />
                    <div className="relative z-[1] flex items-center gap-3.5">
                        <span className="flex size-[38px] shrink-0 items-center justify-center rounded-lg bg-red-50">
                            <Icon
                                name="trending-down"
                                width={19}
                                height={19}
                                className="text-red-600"
                            />
                        </span>
                        <div>
                            <div className="text-xs text-zinc-500">
                                Gastos filtrados
                            </div>
                            <div className="text-xl font-bold tracking-tight text-red-600">
                                {data.totGas}
                            </div>
                        </div>
                    </div>
                </Card>
                <Card className="flex min-h-[70px] items-center gap-3.5 px-[18px] py-4">
                    <span className="flex size-[38px] shrink-0 items-center justify-center rounded-lg bg-zinc-100">
                        <Icon
                            name="wallet"
                            width={19}
                            height={19}
                            className="text-zinc-900"
                        />
                    </span>
                    <div>
                        <div className="text-xs text-zinc-500">
                            Balance neto
                        </div>
                        <div
                            className="text-xl font-bold tracking-tight"
                            style={{ color: data.netColor }}
                        >
                            {data.totNet}
                        </div>
                    </div>
                </Card>
            </div>

            <div className="mb-4 flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-zinc-500">
                    <Icon name="filter" width={15} height={15} />
                    Filtrar:
                </span>
                <SelectInput
                    value={filters.rentalId}
                    onChange={(e) =>
                        actions.setTxFilter('rentalId', e.target.value)
                    }
                    className="h-9 w-auto px-2.5 text-[13px]"
                >
                    {rentalOptions.map((o) => (
                        <option key={o.value} value={o.value}>
                            {o.label}
                        </option>
                    ))}
                </SelectInput>
                <SelectInput
                    value={filters.month}
                    onChange={(e) =>
                        actions.setTxFilter('month', e.target.value)
                    }
                    className="h-9 w-auto px-2.5 text-[13px]"
                >
                    <option value="all">Todos los meses</option>
                    {MONTHS_LONG.map((month, i) => (
                        <option key={month} value={String(i)}>
                            {month}
                        </option>
                    ))}
                </SelectInput>
                <SelectInput
                    value={filters.year}
                    onChange={(e) =>
                        actions.setTxFilter('year', e.target.value)
                    }
                    className="h-9 w-auto px-2.5 text-[13px]"
                >
                    {yearOptions.map((o) => (
                        <option key={o.value} value={o.value}>
                            {o.label}
                        </option>
                    ))}
                </SelectInput>
                {hasFilters && (
                    <SecondaryButton
                        onClick={actions.clearTxFilters}
                        className="h-9 px-3 font-normal text-zinc-600"
                    >
                        <Icon name="x" width={14} height={14} />
                        Limpiar
                    </SecondaryButton>
                )}
                <span className="ml-auto text-[13px] text-zinc-500">
                    {data.rows.length} transacciones
                </span>
            </div>

            <Card className="overflow-hidden p-0">
                <div className="grid grid-cols-[120px_1fr_200px_150px_110px_44px] gap-3 border-b border-zinc-200 bg-zinc-50 px-[18px] py-3 text-[11px] font-semibold tracking-[0.05em] text-zinc-500 uppercase">
                    <span>Fecha</span>
                    <span>Concepto</span>
                    <span>Alquiler</span>
                    <span>Categoría</span>
                    <span className="text-right">Importe</span>
                    <span />
                </div>
                {data.rows.length === 0 ? (
                    <div className="px-5 py-12 text-center text-sm text-zinc-500">
                        No hay transacciones con estos filtros.
                    </div>
                ) : (
                    pageRows.map((t) => (
                        <div
                            key={t.id}
                            className="grid grid-cols-[120px_1fr_200px_150px_110px_44px] items-center gap-3 border-b border-zinc-100 px-[18px] py-3.5 text-[13px] last:border-b-0"
                        >
                            <span className="text-zinc-500">{t.dateFmt}</span>
                            <span className="truncate font-medium">
                                {t.concept}
                            </span>
                            <span className="truncate text-zinc-600">
                                {t.rentalShort}
                            </span>
                            <span className="inline-flex items-center gap-[7px] text-zinc-600">
                                <span
                                    className="size-2 shrink-0 rounded-[2px]"
                                    style={{ background: t.catColor }}
                                />
                                {t.category}
                            </span>
                            <span
                                className="text-right font-semibold tabular-nums"
                                style={{ color: t.amountColor }}
                            >
                                {t.amountFmt}
                            </span>
                            <button
                                onClick={() => actions.openTxDetail(t.id)}
                                title="Ver detalle"
                                className="flex size-7 cursor-pointer items-center justify-center justify-self-center rounded-md text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-900"
                            >
                                <Icon name="eye" width={16} height={16} />
                            </button>
                        </div>
                    ))
                )}
            </Card>

            {data.rows.length > PAGE_SIZE && (
                <div className="mt-4 flex items-center justify-between">
                    <span className="text-[13px] text-zinc-500">
                        Página {currentPage} de {totalPages}
                    </span>
                    <div className="flex gap-2">
                        <SecondaryButton
                            onClick={() => setPage(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="h-9 px-3 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            <Icon name="chevron-left" width={15} height={15} />
                            Anterior
                        </SecondaryButton>
                        <SecondaryButton
                            onClick={() => setPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="h-9 px-3 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            Siguiente
                            <Icon name="chevron-right" width={15} height={15} />
                        </SecondaryButton>
                    </div>
                </div>
            )}
        </div>
    );
}
