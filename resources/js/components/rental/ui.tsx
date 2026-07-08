import { cn } from '@/lib/utils';
import type { ComponentProps, ReactNode } from 'react';
import { Icon } from './icon';

/** White surface card used across every view. */
export function Card({ className, ...props }: ComponentProps<'div'>) {
    return (
        <div
            className={cn(
                'rounded-xl border border-zinc-200 bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04)]',
                className,
            )}
            {...props}
        />
    );
}

const fieldClasses =
    'h-10 w-full rounded-lg border border-zinc-200 px-3 text-sm text-zinc-950 outline-none transition focus:border-zinc-900 focus:shadow-[0_0_0_3px_rgba(0,0,0,0.05)]';

export function TextInput({ className, ...props }: ComponentProps<'input'>) {
    return <input className={cn(fieldClasses, className)} {...props} />;
}

export function SelectInput({
    className,
    children,
    ...props
}: ComponentProps<'select'>) {
    return (
        <select
            className={cn(fieldClasses, 'cursor-pointer bg-white', className)}
            {...props}
        >
            {children}
        </select>
    );
}

interface FieldProps {
    label: string;
    children: ReactNode;
    error?: string;
}

/** Labelled form control wrapper. */
export function Field({ label, children, error }: FieldProps) {
    return (
        <div>
            <label className="mb-1.5 block text-[13px] font-medium">
                {label}
            </label>
            {children}
            {error ? (
                <p className="mt-1 text-[13px] text-red-600">{error}</p>
            ) : null}
        </div>
    );
}

/** Solid dark primary action button. */
export function PrimaryButton({
    className,
    children,
    ...props
}: ComponentProps<'button'>) {
    return (
        <button
            className={cn(
                'inline-flex h-10 cursor-pointer items-center gap-2 rounded-lg bg-zinc-900 px-[18px] text-[13px] font-semibold text-zinc-50 transition hover:bg-black',
                className,
            )}
            {...props}
        >
            {children}
        </button>
    );
}

/** Bordered light secondary button. */
export function SecondaryButton({
    className,
    children,
    ...props
}: ComponentProps<'button'>) {
    return (
        <button
            className={cn(
                'inline-flex h-10 cursor-pointer items-center gap-2 rounded-lg border border-zinc-200 bg-white px-[18px] text-[13px] font-semibold text-zinc-900 transition hover:bg-zinc-100',
                className,
            )}
            {...props}
        >
            {children}
        </button>
    );
}

interface EmptyStateProps {
    icon: string;
    message: string;
}

/** Centered empty-state placeholder. */
export function EmptyState({ icon, message }: EmptyStateProps) {
    return (
        <div className="px-5 py-14 text-center text-zinc-500">
            <Icon
                name={icon}
                width={34}
                height={34}
                className="mx-auto text-zinc-300"
            />
            <p className="mt-3 text-sm">{message}</p>
        </div>
    );
}
