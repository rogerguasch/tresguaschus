import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface ModalProps {
    onClose: () => void;
    className?: string;
    children: ReactNode;
}

/** Centered dialog with a click-away backdrop. */
export function Modal({ onClose, className, children }: ModalProps) {
    return (
        <div
            onClick={onClose}
            className="fixed inset-0 z-[55] flex items-center justify-center p-4 duration-150 animate-in fade-in sm:p-6"
            style={{ background: 'rgba(0,0,0,0.5)' }}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className={cn(
                    'max-h-[90vh] w-full overflow-y-auto rounded-xl bg-white shadow-[0_24px_60px_rgba(0,0,0,0.25)] duration-200 animate-in fade-in slide-in-from-bottom-2',
                    className,
                )}
            >
                {children}
            </div>
        </div>
    );
}
