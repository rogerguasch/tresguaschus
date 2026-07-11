import { useMemo } from 'react';
import { PROPERTY_TYPE_ICONS } from '../data';
import { Icon } from '../icon';
import { useRentalContext } from '../rental-context';
import { Card, TextInput } from '../ui';
import { formatEuros, getInitials, shortAddress } from '../utils';

export function RentalsView() {
    const { state, actions } = useRentalContext();
    const { rentals, transactions, rentalSearch } = state;

    const cards = useMemo(() => {
        const query = rentalSearch.trim().toLowerCase();
        const tx2026 = transactions.filter(
            (t) => t.date.slice(0, 4) === '2026',
        );

        return rentals
            .filter((r) => {
                if (!query) {
                    return true;
                }
                const haystack =
                    `${r.address} ${r.city} ${r.tenant?.name ?? ''}`.toLowerCase();
                return haystack.includes(query);
            })
            .map((r) => {
                const own = tx2026.filter((t) => t.rentalId === r.id);
                const net =
                    own
                        .filter((t) => t.type === 'ingreso')
                        .reduce((sum, t) => sum + t.amount, 0) -
                    own
                        .filter((t) => t.type === 'gasto')
                        .reduce((sum, t) => sum + t.amount, 0);
                const rented = r.status === 'Alquilado';
                return {
                    id: r.id,
                    address: shortAddress(r.address),
                    city: r.city,
                    type: r.type,
                    status: r.status,
                    statusFg: rented ? '#16a34a' : '#ea580c',
                    statusBg: rented ? '#f0fdf4' : '#fff7ed',
                    statusBorder: rented ? '#bbf7d0' : '#fed7aa',
                    typeIcon: PROPERTY_TYPE_ICONS[r.type] ?? 'home',
                    tenantName: r.tenant ? r.tenant.name : 'Sin inquilino',
                    initials: r.tenant ? getInitials(r.tenant.name) : '—',
                    rentFmt: `${formatEuros(r.rent)} /mes`,
                    netFmt: formatEuros(net),
                    netColor: net >= 0 ? '#16a34a' : '#dc2626',
                };
            });
    }, [rentals, transactions, rentalSearch]);

    return (
        <div className="mx-auto max-w-[1200px]">
            <div className="relative mb-5 max-w-[340px]">
                <Icon
                    name="search"
                    width={16}
                    height={16}
                    className="absolute top-1/2 left-3 -translate-y-1/2 text-zinc-400"
                />
                <TextInput
                    value={rentalSearch}
                    onChange={(e) => actions.setRentalSearch(e.target.value)}
                    placeholder="Buscar por dirección, ciudad o inquilino…"
                    className="h-10 pr-3 pl-9 text-sm"
                />
            </div>

            {cards.length === 0 ? (
                <div className="px-5 py-16 text-center text-zinc-500">
                    <Icon
                        name="building-2"
                        width={34}
                        height={34}
                        className="mx-auto text-zinc-300"
                    />
                    <p className="mt-3 text-sm">
                        No se encontraron alquileres. Prueba con otra búsqueda.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {cards.map((c) => (
                        <Card
                            key={c.id}
                            onClick={() => actions.openRental(c.id)}
                            className="cursor-pointer p-[18px] transition hover:border-zinc-300 hover:shadow-[0_6px_20px_rgba(16,24,40,0.10)]"
                        >
                            <div className="mb-3.5 flex items-start justify-between gap-2">
                                <span
                                    className="inline-flex h-[22px] items-center gap-1.5 rounded-full border px-[9px] text-[11px] font-semibold"
                                    style={{
                                        color: c.statusFg,
                                        background: c.statusBg,
                                        borderColor: c.statusBorder,
                                    }}
                                >
                                    <span
                                        className="size-1.5 rounded-full"
                                        style={{ background: c.statusFg }}
                                    />
                                    {c.status}
                                </span>
                                <Icon
                                    name={c.typeIcon}
                                    width={18}
                                    height={18}
                                    className="text-zinc-400"
                                />
                            </div>
                            <h3 className="mb-[3px] text-[15px] font-semibold tracking-tight">
                                {c.address}
                            </h3>
                            <p className="mb-4 text-[13px] text-zinc-500">
                                {c.city} · {c.type}
                            </p>
                            <div className="mb-3.5 flex items-center gap-[9px] border-y border-zinc-100 py-3">
                                <div className="flex size-[30px] shrink-0 items-center justify-center rounded-full bg-zinc-100 text-[11px] font-semibold text-zinc-600">
                                    {c.initials}
                                </div>
                                <span className="truncate text-[13px] text-zinc-700">
                                    {c.tenantName}
                                </span>
                            </div>
                            <div className="flex items-end justify-between">
                                <div>
                                    <div className="text-[11px] font-semibold tracking-[0.05em] text-zinc-400 uppercase">
                                        Renta
                                    </div>
                                    <div className="text-[17px] font-bold tracking-tight">
                                        {c.rentFmt}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-[11px] font-semibold tracking-[0.05em] text-zinc-400 uppercase">
                                        Neto 2026
                                    </div>
                                    <div
                                        className="text-[15px] font-semibold"
                                        style={{ color: c.netColor }}
                                    >
                                        {c.netFmt}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
