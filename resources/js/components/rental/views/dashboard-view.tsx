import { useMemo } from 'react';
import { BarChart, type MonthlyPoint } from '../charts/bar-chart';
import { DonutChart, type DonutSlice } from '../charts/donut-chart';
import { NetChart } from '../charts/net-chart';
import { Sparkline } from '../charts/sparkline';
import { MONTHS_SHORT, RENTAL_PALETTE } from '../data';
import { Icon } from '../icon';
import { useRentalContext } from '../rental-context';
import { Card, SecondaryButton, SelectInput } from '../ui';
import {
    categoryColor,
    formatDate,
    formatEuros,
    shortAddress,
    sumByType,
} from '../utils';

interface Kpi {
    label: string;
    value: string;
    icon: string;
    bg: string;
    fg: string;
    spark?: number[];
    sparkColor?: string;
}

interface RepartRow {
    label: string;
    amountFmt: string;
    pct: string;
    color: string;
}

export function DashboardView() {
    const { state, actions } = useRentalContext();
    const { rentals, transactions, categories, dashFilters } = state;

    const data = useMemo(() => {
        const df = dashFilters;

        let filtered = transactions.filter(
            (t) => t.date >= df.from && t.date <= df.to,
        );
        if (df.rentalId !== 'all') {
            filtered = filtered.filter((t) => t.rentalId === df.rentalId);
        }

        const ingD = sumByType(filtered, 'ingreso');
        const gasD = sumByType(filtered, 'gasto');
        const netD = ingD - gasD;

        // Months within the selected range.
        const months: Array<{ y: number; m: number }> = [];
        let y = +df.from.slice(0, 4);
        let m = +df.from.slice(5, 7);
        const ey = +df.to.slice(0, 4);
        const em = +df.to.slice(5, 7);
        let guard = 0;
        while ((y < ey || (y === ey && m <= em)) && guard < 48) {
            months.push({ y, m });
            m++;
            if (m > 12) {
                m = 1;
                y++;
            }
            guard++;
        }
        const multiYear = months.length
            ? months[0].y !== months[months.length - 1].y
            : false;
        const chartLabels = months.map(
            (o) =>
                MONTHS_SHORT[o.m - 1] +
                (multiYear ? `'${String(o.y).slice(2)}` : ''),
        );
        const monthly: MonthlyPoint[] = months.map((o) => {
            const key = `${o.y}-${String(o.m).padStart(2, '0')}`;
            const monthTx = filtered.filter((t) => t.date.slice(0, 7) === key);
            return {
                inc: sumByType(monthTx, 'ingreso'),
                exp: sumByType(monthTx, 'gasto'),
            };
        });

        const catMap = new Map<string, number>();
        filtered
            .filter((t) => t.type === 'gasto')
            .forEach((t) =>
                catMap.set(
                    t.category,
                    (catMap.get(t.category) ?? 0) + t.amount,
                ),
            );
        const slices: DonutSlice[] = [...catMap.entries()]
            .map(([label, value]) => ({
                label,
                value,
                color: categoryColor(categories, label),
            }))
            .sort((a, b) => b.value - a.value);

        const perRental = rentals
            .map((rental, i) => ({
                rental,
                i,
                total: filtered
                    .filter(
                        (t) => t.rentalId === rental.id && t.type === 'ingreso',
                    )
                    .reduce((sum, t) => sum + t.amount, 0),
            }))
            .filter((x) => x.total > 0)
            .sort((a, b) => b.total - a.total);
        const perMax = Math.max(1, ...perRental.map((x) => x.total));
        const repartData: RepartRow[] = perRental.map((x) => ({
            label: shortAddress(x.rental.address),
            amountFmt: formatEuros(x.total),
            pct: `${Math.round((x.total / perMax) * 100)}%`,
            color: RENTAL_PALETTE[x.i % RENTAL_PALETTE.length],
        }));

        const kpis: Kpi[] = [
            {
                label: 'Ingresos',
                value: formatEuros(ingD),
                icon: 'wallet',
                bg: '#f0fdf4',
                fg: '#16a34a',
                spark: monthly.map((p) => p.inc),
                sparkColor: '#16a34a',
            },
            {
                label: 'Gastos',
                value: formatEuros(gasD),
                icon: 'receipt',
                bg: '#fef2f2',
                fg: '#dc2626',
                spark: monthly.map((p) => p.exp),
                sparkColor: '#dc2626',
            },
            {
                label: 'Beneficio neto',
                value: formatEuros(netD),
                icon: 'piggy-bank',
                bg: '#eff6ff',
                fg: '#2563eb',
            },
        ];

        return {
            kpis,
            slices,
            catData: slices.map((s) => ({
                label: s.label,
                amountFmt: formatEuros(s.value),
                color: s.color,
            })),
            repartData,
            monthly,
            chartLabels,
            periodLabel: `${formatDate(df.from)} – ${formatDate(df.to)}`,
        };
    }, [rentals, transactions, categories, dashFilters]);

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

    const hasFilters =
        dashFilters.rentalId !== 'all' ||
        dashFilters.from !== '2026-01-01' ||
        dashFilters.to !== '2026-06-30';

    return (
        <div className="mx-auto max-w-[1200px]">
            <div className="mb-5 flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-zinc-500">
                    <Icon name="sliders-horizontal" width={15} height={15} />
                    Filtros:
                </span>
                <SelectInput
                    value={dashFilters.rentalId}
                    onChange={(e) =>
                        actions.setDashFilter('rentalId', e.target.value)
                    }
                    className="h-[38px] min-w-[200px] text-[13px]"
                >
                    {rentalOptions.map((o) => (
                        <option key={o.value} value={o.value}>
                            {o.label}
                        </option>
                    ))}
                </SelectInput>
                <div className="flex h-[38px] items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3">
                    <span className="text-[13px] text-zinc-500">Desde</span>
                    <input
                        type="date"
                        value={dashFilters.from}
                        onChange={(e) =>
                            actions.setDashFilter('from', e.target.value)
                        }
                        className="cursor-pointer border-none bg-transparent text-[13px] text-zinc-950 outline-none"
                    />
                    <span className="h-[18px] w-px bg-zinc-200" />
                    <span className="text-[13px] text-zinc-500">Hasta</span>
                    <input
                        type="date"
                        value={dashFilters.to}
                        onChange={(e) =>
                            actions.setDashFilter('to', e.target.value)
                        }
                        className="cursor-pointer border-none bg-transparent text-[13px] text-zinc-950 outline-none"
                    />
                </div>
                {hasFilters && (
                    <SecondaryButton
                        onClick={actions.clearDashFilters}
                        className="h-[38px] px-3 font-normal text-zinc-600"
                    >
                        <Icon name="x" width={14} height={14} />
                        Limpiar
                    </SecondaryButton>
                )}
                <span className="ml-auto text-xs text-zinc-400">
                    {data.periodLabel}
                </span>
            </div>

            <div className="mb-4 grid grid-cols-3 gap-4">
                {data.kpis.map((kpi) => (
                    <Card
                        key={kpi.label}
                        className="relative min-h-[118px] overflow-hidden p-[18px]"
                    >
                        {kpi.spark && (
                            <Sparkline
                                values={kpi.spark}
                                color={kpi.sparkColor ?? '#16a34a'}
                            />
                        )}
                        <div className="relative z-[1] flex items-start justify-between gap-3">
                            <div>
                                <div className="mb-1.5 text-[13px] font-medium text-zinc-500">
                                    {kpi.label}
                                </div>
                                <div className="text-[26px] font-bold tracking-tight">
                                    {kpi.value}
                                </div>
                            </div>
                            <span
                                className="flex size-8 shrink-0 items-center justify-center rounded-lg"
                                style={{ background: kpi.bg }}
                            >
                                <Icon
                                    name={kpi.icon}
                                    width={17}
                                    height={17}
                                    style={{ color: kpi.fg }}
                                />
                            </span>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="mb-4 grid grid-cols-[1.5fr_1fr] gap-4">
                <Card className="p-5">
                    <div className="mb-2 flex items-start justify-between">
                        <div>
                            <h3 className="text-[15px] font-semibold">
                                Ingresos vs Gastos
                            </h3>
                            <p className="mt-0.5 text-xs text-zinc-500">
                                Por mes
                            </p>
                        </div>
                        <div className="flex gap-3.5 text-xs text-zinc-600">
                            <span className="inline-flex items-center gap-1.5">
                                <span className="size-[9px] rounded-[2px] bg-green-600" />
                                Ingresos
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                                <span className="size-[9px] rounded-[2px] bg-red-600" />
                                Gastos
                            </span>
                        </div>
                    </div>
                    <BarChart
                        monthly={data.monthly}
                        labels={data.chartLabels}
                    />
                </Card>

                <Card className="p-5">
                    <h3 className="text-[15px] font-semibold">
                        Gastos por categoría
                    </h3>
                    <p className="mt-0.5 mb-3 text-xs text-zinc-500">
                        Del periodo seleccionado
                    </p>
                    <div className="flex items-center gap-4">
                        <DonutChart slices={data.slices} />
                        <div className="flex min-w-0 flex-1 flex-col gap-[9px]">
                            {data.catData.map((c) => (
                                <div
                                    key={c.label}
                                    className="flex items-center gap-2 text-[13px]"
                                >
                                    <span
                                        className="size-[9px] shrink-0 rounded-[2px]"
                                        style={{ background: c.color }}
                                    />
                                    <span className="flex-1 truncate text-zinc-600">
                                        {c.label}
                                    </span>
                                    <span className="font-semibold">
                                        {c.amountFmt}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-[1.5fr_1fr] gap-4">
                <Card className="p-5">
                    <h3 className="text-[15px] font-semibold">
                        Beneficio neto
                    </h3>
                    <p className="mt-0.5 mb-1 text-xs text-zinc-500">
                        Evolución mensual
                    </p>
                    <NetChart
                        monthly={data.monthly}
                        labels={data.chartLabels}
                    />
                </Card>

                <Card className="p-5">
                    <h3 className="text-[15px] font-semibold">
                        Ingresos por alquiler
                    </h3>
                    <p className="mt-0.5 mb-4 text-xs text-zinc-500">
                        Del periodo seleccionado
                    </p>
                    <div className="flex flex-col gap-3.5">
                        {data.repartData.map((r) => (
                            <div key={r.label}>
                                <div className="mb-1.5 flex items-center justify-between text-[13px]">
                                    <span className="max-w-[60%] truncate text-zinc-600">
                                        {r.label}
                                    </span>
                                    <span className="font-semibold">
                                        {r.amountFmt}
                                    </span>
                                </div>
                                <div className="h-[7px] overflow-hidden rounded-full bg-zinc-100">
                                    <div
                                        className="h-full rounded-full"
                                        style={{
                                            background: r.color,
                                            width: r.pct,
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
}
