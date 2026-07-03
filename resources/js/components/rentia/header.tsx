import { Icon } from './icon';
import { useRentiaContext } from './rentia-context';
import { PrimaryButton } from './ui';
import { shortAddress } from './utils';

interface HeaderConfig {
    title: string;
    subtitle: string;
    showBack: boolean;
    primary: { label: string; icon: string; onClick: () => void } | null;
}

export function Header() {
    const { state, actions } = useRentiaContext();
    const { view, rentals, selectedId } = state;

    const config = ((): HeaderConfig => {
        switch (view) {
            case 'rentals':
                return {
                    title: 'Alquileres',
                    subtitle: `${rentals.length} propiedades en tu cartera`,
                    showBack: false,
                    primary: {
                        label: 'Nuevo alquiler',
                        icon: 'plus',
                        onClick: () => actions.navigate('newRental'),
                    },
                };
            case 'transactions':
                return {
                    title: 'Transacciones',
                    subtitle: 'Todos los movimientos de ingresos y gastos',
                    showBack: false,
                    primary: {
                        label: 'Nueva transacción',
                        icon: 'plus',
                        onClick: () => actions.openTxModal(),
                    },
                };
            case 'newRental':
                return {
                    title: 'Nuevo alquiler',
                    subtitle: 'Da de alta una propiedad y su inquilino',
                    showBack: true,
                    primary: null,
                };
            case 'detail': {
                const rental = rentals.find((r) => r.id === selectedId);
                return {
                    title: rental ? shortAddress(rental.address) : 'Alquiler',
                    subtitle: rental ? `${rental.city} · ${rental.type}` : '',
                    showBack: true,
                    primary: {
                        label: 'Nueva transacción',
                        icon: 'plus',
                        onClick: () => actions.openTxModal(selectedId),
                    },
                };
            }
            case 'settings':
                return {
                    title: 'Configuración',
                    subtitle: 'Gestiona las categorías de tus transacciones',
                    showBack: false,
                    primary: {
                        label: 'Nueva categoría',
                        icon: 'plus',
                        onClick: actions.openCatNew,
                    },
                };
            case 'chat':
                return {
                    title: 'Guaschnet',
                    subtitle: 'Tu asistente para la gestión de alquileres',
                    showBack: false,
                    primary: null,
                };
            default:
                return {
                    title: 'Dashboard',
                    subtitle: 'Resumen de tu cartera de alquileres',
                    showBack: false,
                    primary: {
                        label: 'Nueva transacción',
                        icon: 'plus',
                        onClick: () => actions.openTxModal(),
                    },
                };
        }
    })();

    return (
        <header className="sticky top-0 z-20 flex h-[60px] shrink-0 items-center justify-between gap-4 border-b border-zinc-200 bg-white/85 px-7 backdrop-blur-sm">
            <div className="flex min-w-0 items-center gap-3">
                {config.showBack && (
                    <button
                        onClick={() => actions.navigate('rentals')}
                        className="flex size-[34px] shrink-0 cursor-pointer items-center justify-center rounded-lg border border-zinc-200 bg-white transition hover:bg-zinc-100"
                    >
                        <Icon name="arrow-left" width={17} height={17} />
                    </button>
                )}
                <div className="min-w-0">
                    <h1 className="truncate text-[19px] font-bold tracking-tight">
                        {config.title}
                    </h1>
                    <p className="mt-px truncate text-[13px] text-zinc-500">
                        {config.subtitle}
                    </p>
                </div>
            </div>
            {config.primary && (
                <PrimaryButton
                    onClick={config.primary.onClick}
                    className="h-[38px] shrink-0 px-4 whitespace-nowrap"
                >
                    <Icon name={config.primary.icon} width={16} height={16} />
                    {config.primary.label}
                </PrimaryButton>
            )}
        </header>
    );
}
