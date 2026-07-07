import { Icon } from './icon';
import { useRentalContext } from './rental-context';

export function Toast() {
    const { state } = useRentalContext();
    const toast = state.toast;

    if (!toast) {
        return null;
    }

    const accent = toast.ok ? '#16a34a' : '#dc2626';

    return (
        <div
            className="fixed right-6 bottom-6 z-[60] flex items-center gap-2.5 rounded-[10px] border border-zinc-200 bg-white px-4 py-3 text-sm font-medium shadow-[0_12px_32px_rgba(0,0,0,0.14)] animate-in fade-in slide-in-from-bottom-2"
            style={{ borderLeft: `3px solid ${accent}` }}
        >
            <Icon
                name={toast.ok ? 'check-circle-2' : 'alert-circle'}
                width={18}
                height={18}
                style={{ color: accent }}
            />
            {toast.msg}
        </div>
    );
}
