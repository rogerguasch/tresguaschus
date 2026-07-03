import { type ChangeEvent, useMemo } from 'react';
import { Sparkline } from '../charts/sparkline';
import { Icon } from '../icon';
import { useRentiaContext } from '../rentia-context';
import { toTransactionRow } from '../selectors';
import { Card, SecondaryButton, SelectInput } from '../ui';
import { formatDate, formatEuros, getInitials, sumByType } from '../utils';

const IMAGE_RE = /\.(jpg|jpeg|png|gif|webp)$/i;

function InfoRow({
    icon,
    label,
    children,
}: {
    icon: string;
    label: string;
    children: React.ReactNode;
}) {
    return (
        <div className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2 text-[13px] text-zinc-500">
                <Icon
                    name={icon}
                    width={15}
                    height={15}
                    className="text-zinc-400"
                />
                {label}
            </span>
            <span className="truncate text-right text-[13px] font-medium">
                {children}
            </span>
        </div>
    );
}

export function RentalDetailView() {
    const { state, actions } = useRentiaContext();
    const {
        rentals,
        transactions,
        files,
        categories,
        selectedId,
        detailFilters,
    } = state;

    const rental = useMemo(
        () => rentals.find((r) => r.id === selectedId) ?? null,
        [rentals, selectedId],
    );

    const rentalsMap = useMemo(
        () => new Map(rentals.map((r) => [r.id, r])),
        [rentals],
    );

    const data = useMemo(() => {
        if (!rental) {
            return null;
        }
        const own = transactions.filter((t) => t.rentalId === rental.id);
        const ding = sumByType(own, 'ingreso');
        const dgas = sumByType(own, 'gasto');

        let list = own.slice();
        if (detailFilters.category !== 'all') {
            list = list.filter((t) => t.category === detailFilters.category);
        }
        if (detailFilters.from) {
            list = list.filter((t) => t.date >= detailFilters.from);
        }
        if (detailFilters.to) {
            list = list.filter((t) => t.date <= detailFilters.to);
        }
        list.sort((a, b) => b.date.localeCompare(a.date));

        const rentalCats = [...new Set(own.map((t) => t.category))];
        const months = [...new Set(own.map((t) => t.date.slice(0, 7)))].sort();
        const incSeries = months.map((k) =>
            sumByType(
                own.filter((t) => t.date.slice(0, 7) === k),
                'ingreso',
            ),
        );
        const expSeries = months.map((k) =>
            sumByType(
                own.filter((t) => t.date.slice(0, 7) === k),
                'gasto',
            ),
        );

        const fileList = (files[rental.id] ?? []).map((f) => {
            const isImage = IMAGE_RE.test(f.name);
            return {
                ...f,
                dateFmt: formatDate(f.date),
                icon: isImage ? 'image' : 'file-text',
                iconBg: isImage ? '#eff6ff' : '#f4f4f5',
                iconFg: isImage ? '#2563eb' : '#52525b',
            };
        });

        return {
            rentFmt: formatEuros(rental.rent),
            depositFmt: formatEuros(rental.deposit),
            ingFmt: formatEuros(ding),
            gasFmt: formatEuros(dgas),
            netFmt: formatEuros(ding - dgas),
            rows: list.map((t) => toTransactionRow(t, rentalsMap, categories)),
            catOptions: [
                { value: 'all', label: 'Todas las categorías' },
                ...rentalCats.map((c) => ({ value: c, label: c })),
            ],
            incSeries,
            expSeries,
            files: fileList,
        };
    }, [rental, transactions, files, categories, detailFilters, rentalsMap]);

    if (!rental || !data) {
        return null;
    }

    const hasFilters =
        Boolean(detailFilters.from) ||
        Boolean(detailFilters.to) ||
        detailFilters.category !== 'all';

    const onUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const uploaded = Array.from(e.target.files ?? []).map((f) => ({
            name: f.name,
            size: f.size,
        }));
        actions.uploadFiles(uploaded);
        e.target.value = '';
    };

    return (
        <div className="mx-auto max-w-[1100px]">
            <div className="mb-6 grid grid-cols-4 gap-3">
                <Card className="p-4">
                    <div className="mb-1.5 text-xs text-zinc-500">
                        Renta mensual
                    </div>
                    <div className="text-[19px] font-bold tracking-tight">
                        {data.rentFmt}
                    </div>
                </Card>
                <Card className="relative min-h-[76px] overflow-hidden p-4">
                    <Sparkline values={data.incSeries} color="#16a34a" />
                    <div className="relative z-[1]">
                        <div className="mb-1.5 text-xs text-zinc-500">
                            Ingresos
                        </div>
                        <div className="text-[19px] font-bold tracking-tight text-green-600">
                            {data.ingFmt}
                        </div>
                    </div>
                </Card>
                <Card className="relative min-h-[76px] overflow-hidden p-4">
                    <Sparkline values={data.expSeries} color="#dc2626" />
                    <div className="relative z-[1]">
                        <div className="mb-1.5 text-xs text-zinc-500">
                            Gastos
                        </div>
                        <div className="text-[19px] font-bold tracking-tight text-red-600">
                            {data.gasFmt}
                        </div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="mb-1.5 text-xs text-zinc-500">
                        Beneficio neto
                    </div>
                    <div className="text-[19px] font-bold tracking-tight">
                        {data.netFmt}
                    </div>
                </Card>
            </div>

            <div className="mb-4 grid grid-cols-2 items-stretch gap-4">
                <Card className="overflow-hidden p-0">
                    <div className="flex items-center gap-[9px] border-b border-zinc-100 px-5 py-4">
                        <Icon
                            name="user"
                            width={17}
                            height={17}
                            className="text-zinc-600"
                        />
                        <h3 className="text-[15px] font-semibold">Inquilino</h3>
                    </div>
                    {rental.tenant ? (
                        <div className="p-5">
                            <div className="mb-[18px] flex items-center gap-3.5 border-b border-zinc-100 pb-[18px]">
                                <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-base font-bold text-zinc-600">
                                    {getInitials(rental.tenant.name)}
                                </div>
                                <div className="min-w-0">
                                    <div className="truncate text-base font-bold tracking-tight">
                                        {rental.tenant.name}
                                    </div>
                                    <div className="text-[13px] text-zinc-500">
                                        Inquilino desde{' '}
                                        {formatDate(rental.tenant.since)}
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-3.5">
                                <InfoRow icon="mail" label="Email">
                                    {rental.tenant.email}
                                </InfoRow>
                                <InfoRow icon="phone" label="Teléfono">
                                    {rental.tenant.phone}
                                </InfoRow>
                                <InfoRow
                                    icon="calendar"
                                    label="Inicio contrato"
                                >
                                    {formatDate(rental.contractStart)}
                                </InfoRow>
                                <InfoRow
                                    icon="calendar-check"
                                    label="Fin contrato"
                                >
                                    {formatDate(rental.contractEnd)}
                                </InfoRow>
                                <InfoRow
                                    icon="shield-check"
                                    label="Fianza depositada"
                                >
                                    <span className="font-semibold">
                                        {data.depositFmt}
                                    </span>
                                </InfoRow>
                            </div>
                        </div>
                    ) : (
                        <div className="px-5 py-11 text-center text-zinc-500">
                            <Icon
                                name="user-x"
                                width={30}
                                height={30}
                                className="mx-auto text-zinc-300"
                            />
                            <p className="mt-2.5 text-[13px]">
                                Este alquiler está vacío. No hay inquilino
                                asignado.
                            </p>
                        </div>
                    )}
                </Card>

                <Card className="overflow-hidden p-0">
                    <div className="flex items-center gap-[9px] border-b border-zinc-100 px-5 py-4">
                        <Icon
                            name="folder"
                            width={17}
                            height={17}
                            className="text-zinc-600"
                        />
                        <h3 className="text-[15px] font-semibold">Archivos</h3>
                        <span className="ml-auto text-xs text-zinc-400">
                            {data.files.length}
                        </span>
                    </div>
                    <div className="p-5">
                        <label className="mb-3.5 flex cursor-pointer items-center gap-3 rounded-[10px] border-2 border-dashed border-zinc-200 bg-zinc-50 px-4 py-3.5 transition hover:border-zinc-400 hover:bg-zinc-100">
                            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-zinc-200 bg-white">
                                <Icon
                                    name="upload-cloud"
                                    width={18}
                                    height={18}
                                    className="text-zinc-600"
                                />
                            </span>
                            <span className="min-w-0">
                                <span className="block text-[13px] font-semibold">
                                    Subir archivos
                                </span>
                                <span className="block text-xs text-zinc-500">
                                    Contratos, DNI, facturas… PDF, JPG, PNG
                                </span>
                            </span>
                            <input
                                type="file"
                                multiple
                                onChange={onUpload}
                                className="hidden"
                            />
                        </label>
                        <div className="flex flex-col">
                            {data.files.length === 0 ? (
                                <div className="px-5 py-7 text-center text-[13px] text-zinc-500">
                                    Todavía no hay archivos. Sube el contrato
                                    para empezar.
                                </div>
                            ) : (
                                data.files.map((f, i) => (
                                    <div
                                        key={`${f.name}-${i}`}
                                        className="flex items-center gap-3 border-b border-zinc-100 py-[11px] last:border-b-0"
                                    >
                                        <span
                                            className="flex size-[34px] shrink-0 items-center justify-center rounded-lg"
                                            style={{ background: f.iconBg }}
                                        >
                                            <Icon
                                                name={f.icon}
                                                width={16}
                                                height={16}
                                                style={{ color: f.iconFg }}
                                            />
                                        </span>
                                        <div className="min-w-0 flex-1">
                                            <div className="truncate text-[13px] font-semibold">
                                                {f.name}
                                            </div>
                                            <div className="text-xs text-zinc-500">
                                                {f.kind} · {f.size} ·{' '}
                                                {f.dateFmt}
                                            </div>
                                        </div>
                                        <button className="flex size-[30px] shrink-0 cursor-pointer items-center justify-center rounded-lg border border-zinc-200 bg-white transition hover:bg-zinc-100">
                                            <Icon
                                                name="download"
                                                width={14}
                                                height={14}
                                                className="text-zinc-600"
                                            />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </Card>
            </div>

            <div className="mb-3 flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-zinc-500">
                    <Icon name="filter" width={15} height={15} />
                    Filtrar:
                </span>
                <SelectInput
                    value={detailFilters.category}
                    onChange={(e) =>
                        actions.setDetailFilter('category', e.target.value)
                    }
                    className="h-9 w-auto px-2.5 text-[13px]"
                >
                    {data.catOptions.map((o) => (
                        <option key={o.value} value={o.value}>
                            {o.label}
                        </option>
                    ))}
                </SelectInput>
                <div className="flex h-9 items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3">
                    <span className="text-[13px] text-zinc-500">Desde</span>
                    <input
                        type="date"
                        value={detailFilters.from}
                        onChange={(e) =>
                            actions.setDetailFilter('from', e.target.value)
                        }
                        className="cursor-pointer border-none bg-transparent text-[13px] text-zinc-950 outline-none"
                    />
                    <span className="h-[18px] w-px bg-zinc-200" />
                    <span className="text-[13px] text-zinc-500">Hasta</span>
                    <input
                        type="date"
                        value={detailFilters.to}
                        onChange={(e) =>
                            actions.setDetailFilter('to', e.target.value)
                        }
                        className="cursor-pointer border-none bg-transparent text-[13px] text-zinc-950 outline-none"
                    />
                </div>
                {hasFilters && (
                    <SecondaryButton
                        onClick={actions.clearDetailFilters}
                        className="h-9 px-3 font-normal text-zinc-600"
                    >
                        <Icon name="x" width={14} height={14} />
                        Limpiar
                    </SecondaryButton>
                )}
            </div>

            <Card className="overflow-hidden p-0">
                <div className="flex items-center gap-[9px] border-b border-zinc-100 px-5 py-4">
                    <Icon
                        name="arrow-left-right"
                        width={17}
                        height={17}
                        className="text-zinc-600"
                    />
                    <h3 className="text-[15px] font-semibold">Transacciones</h3>
                    <span className="ml-auto text-xs text-zinc-400">
                        {data.rows.length}
                    </span>
                </div>
                <div className="grid grid-cols-[120px_1fr_150px_130px_110px_44px] gap-3 border-b border-zinc-200 bg-zinc-50 px-[18px] py-3 text-[11px] font-semibold tracking-[0.05em] text-zinc-500 uppercase">
                    <span>Fecha</span>
                    <span>Concepto</span>
                    <span>Categoría</span>
                    <span>Método</span>
                    <span className="text-right">Importe</span>
                    <span />
                </div>
                {data.rows.length === 0 ? (
                    <div className="px-5 py-12 text-center text-sm text-zinc-500">
                        Aún no hay transacciones para este alquiler.
                    </div>
                ) : (
                    data.rows.map((t) => (
                        <div
                            key={t.id}
                            className="grid grid-cols-[120px_1fr_150px_130px_110px_44px] items-center gap-3 border-b border-zinc-100 px-[18px] py-3.5 text-[13px] last:border-b-0"
                        >
                            <span className="text-zinc-500">{t.dateFmt}</span>
                            <span className="truncate font-medium">
                                {t.concept}
                            </span>
                            <span className="inline-flex items-center gap-[7px] text-zinc-600">
                                <span
                                    className="size-2 shrink-0 rounded-[2px]"
                                    style={{ background: t.catColor }}
                                />
                                {t.category}
                            </span>
                            <span className="text-zinc-500">{t.method}</span>
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
        </div>
    );
}
