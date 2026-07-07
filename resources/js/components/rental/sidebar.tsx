import { cn } from '@/lib/utils';
import type { ComponentProps } from 'react';
import { Icon } from './icon';
import { useRentalContext } from './rental-context';
import { shortAddress } from './utils';

interface NavButtonProps extends ComponentProps<'button'> {
    active: boolean;
}

function NavButton({ active, className, children, ...props }: NavButtonProps) {
    return (
        <button
            className={cn(
                'flex h-[38px] w-full cursor-pointer items-center gap-[11px] rounded-lg border border-transparent px-3 text-[13.5px] transition hover:bg-zinc-100',
                active
                    ? 'border-zinc-200 bg-white font-semibold text-zinc-900 shadow-[0_1px_2px_rgba(16,24,40,0.06)]'
                    : 'font-medium text-zinc-600',
                className,
            )}
            {...props}
        >
            {children}
        </button>
    );
}

export function Sidebar() {
    const { state, actions } = useRentalContext();
    const { view, selectedId, rentals } = state;

    const isDashboard = view === 'dashboard';
    const isTransactions = view === 'transactions';
    const isChat = view === 'chat';
    const isSettings = view === 'settings';
    const rentalsActive =
        view === 'rentals' || view === 'detail' || view === 'newRental';

    return (
        <aside className="flex w-[252px] shrink-0 flex-col border-r border-zinc-200 bg-zinc-50">
            <div className="flex h-[60px] shrink-0 items-center gap-2.5 border-b border-zinc-200 px-5">
                <div className="flex size-[30px] shrink-0 items-center justify-center rounded-lg bg-zinc-900">
                    <Icon
                        name="key-round"
                        width={17}
                        height={17}
                        className="text-zinc-50"
                    />
                </div>
                <span className="text-base font-bold tracking-tight">
                    Tresguaschus
                </span>
            </div>

            <nav className="flex-1 overflow-y-auto p-3">
                <p className="mx-2 mt-1 mb-2 text-[11px] font-semibold tracking-[0.06em] text-zinc-400 uppercase">
                    Gestión
                </p>

                <NavButton
                    active={isDashboard}
                    onClick={() => actions.navigate('dashboard')}
                >
                    <Icon name="layout-dashboard" width={17} height={17} />
                    <span className="flex-1 text-left">Dashboard</span>
                </NavButton>

                <NavButton
                    active={rentalsActive}
                    onClick={actions.toggleRentalsNav}
                >
                    <Icon name="building-2" width={17} height={17} />
                    <span className="flex-1 text-left">Alquileres</span>
                    <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-zinc-100 px-1.5 text-[11px] font-semibold text-zinc-500">
                        {rentals.length}
                    </span>
                    <Icon
                        name={
                            state.rentalsExpanded
                                ? 'chevron-up'
                                : 'chevron-down'
                        }
                        width={14}
                        height={14}
                        className="text-zinc-400"
                    />
                </NavButton>

                {state.rentalsExpanded && (
                    <div className="my-1 flex flex-col gap-px">
                        {rentals.map((rental) => {
                            const active =
                                view === 'detail' && selectedId === rental.id;
                            return (
                                <button
                                    key={rental.id}
                                    onClick={() =>
                                        actions.openRental(rental.id)
                                    }
                                    className={cn(
                                        'flex h-8 w-full cursor-pointer items-center gap-[9px] rounded-lg py-0 pr-3 pl-8 text-[13px] transition hover:bg-zinc-100',
                                        active
                                            ? 'bg-zinc-100 font-semibold text-zinc-900'
                                            : 'font-normal text-zinc-500',
                                    )}
                                >
                                    <span
                                        className="size-1.5 shrink-0 rounded-full"
                                        style={{
                                            background:
                                                rental.status === 'Alquilado'
                                                    ? '#16a34a'
                                                    : '#ea580c',
                                        }}
                                    />
                                    <span className="flex-1 truncate text-left">
                                        {shortAddress(rental.address)}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                )}

                <NavButton
                    active={isTransactions}
                    onClick={() => actions.navigate('transactions')}
                >
                    <Icon name="arrow-left-right" width={17} height={17} />
                    <span className="flex-1 text-left">Transacciones</span>
                </NavButton>

                <div className="mx-2 mt-3.5 mb-2.5 h-px bg-zinc-200" />

                <NavButton
                    active={isChat}
                    onClick={() => actions.navigate('chat')}
                >
                    <Icon name="sparkles" width={17} height={17} />
                    <span className="flex-1 text-left">Guaschnet</span>
                    <span className="inline-flex h-[18px] items-center rounded-full bg-indigo-50 px-[7px] text-[10px] font-bold tracking-[0.04em] text-indigo-600">
                        IA
                    </span>
                </NavButton>

                <div className="mx-2 mt-3.5 mb-2.5 h-px bg-zinc-200" />

                <NavButton
                    active={isSettings}
                    onClick={actions.toggleSettingsNav}
                >
                    <Icon name="settings" width={17} height={17} />
                    <span className="flex-1 text-left">Configuración</span>
                    <Icon
                        name={
                            state.settingsExpanded
                                ? 'chevron-up'
                                : 'chevron-down'
                        }
                        width={14}
                        height={14}
                        className="text-zinc-400"
                    />
                </NavButton>

                {state.settingsExpanded && (
                    <div className="my-1 flex flex-col gap-px">
                        <button
                            onClick={() => actions.navigate('settings')}
                            className={cn(
                                'flex h-8 w-full cursor-pointer items-center gap-[9px] rounded-lg py-0 pr-3 pl-8 text-[13px] transition hover:bg-zinc-100',
                                isSettings
                                    ? 'bg-zinc-100 font-semibold text-zinc-900'
                                    : 'font-normal text-zinc-500',
                            )}
                        >
                            <Icon
                                name="tags"
                                width={14}
                                height={14}
                                className="text-zinc-400"
                            />
                            <span className="flex-1 text-left">Categorías</span>
                        </button>
                    </div>
                )}
            </nav>

            <div className="border-t border-zinc-200 p-3">
                <div className="flex items-center gap-2.5 px-1.5 py-1">
                    <div className="flex size-[34px] shrink-0 items-center justify-center rounded-full bg-zinc-200 text-xs font-semibold text-zinc-600">
                        MG
                    </div>
                    <div className="min-w-0 flex-1">
                        <div className="truncate text-[13px] font-semibold">
                            María G. Ortiz
                        </div>
                        <div className="text-xs text-zinc-500">Propietaria</div>
                    </div>
                    <button
                        title="Cerrar sesión"
                        onClick={() => actions.navigate('dashboard')}
                        className="flex size-[34px] shrink-0 cursor-pointer items-center justify-center rounded-lg border border-zinc-200 bg-white transition hover:border-red-200 hover:bg-red-50"
                    >
                        <Icon
                            name="log-out"
                            width={16}
                            height={16}
                            className="text-zinc-500"
                        />
                    </button>
                </div>
            </div>
        </aside>
    );
}
