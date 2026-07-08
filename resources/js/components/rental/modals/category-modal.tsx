import CreateCategoryController from '@/actions/App/Category/Infrastructure/Http/Controllers/CreateCategoryController';
import UpdateCategoryController from '@/actions/App/Category/Infrastructure/Http/Controllers/UpdateCategoryController';
import { cn } from '@/lib/utils';
import { useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import { CATEGORY_COLOR_CHOICES } from '../data';
import { Icon } from '../icon';
import { useRentalContext } from '../rental-context';
import type { Category, TransactionType } from '../types';
import { Field, PrimaryButton, SecondaryButton, TextInput } from '../ui';
import { Modal } from './modal';

const segmentBase =
    'inline-flex h-[42px] cursor-pointer items-center justify-center gap-2 rounded-lg text-sm font-semibold transition';

export function CategoryModal() {
    const { state } = useRentalContext();

    if (!state.catModal.open) {
        return null;
    }

    const editing = state.catModal.editingId
        ? (state.categories.find((c) => c.id === state.catModal.editingId) ??
          null)
        : null;

    return <CategoryForm key={editing?.id ?? 'new'} editing={editing} />;
}

function CategoryForm({ editing }: { editing: Category | null }) {
    const { actions } = useRentalContext();

    const form = useForm({
        name: editing?.name ?? '',
        type: editing?.type ?? ('gasto' as TransactionType),
        color: editing?.color ?? '#ef4444',
    });

    const submit = (event: FormEvent): void => {
        event.preventDefault();

        const options = {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                actions.closeCatModal();
                actions.showToast(
                    editing ? 'Categoría actualizada' : 'Categoría creada',
                    true,
                );
            },
        };

        if (editing) {
            form.patch(
                UpdateCategoryController.url(Number(editing.id)),
                options,
            );
        } else {
            form.post(CreateCategoryController.url(), options);
        }
    };

    const typeButton = (type: TransactionType, label: string, icon: string) => {
        const active = form.data.type === type;
        const activeClass =
            type === 'ingreso'
                ? 'border border-green-600 bg-green-50 text-green-600'
                : 'border border-red-600 bg-red-50 text-red-600';
        return (
            <button
                type="button"
                onClick={() => form.setData('type', type)}
                className={cn(
                    segmentBase,
                    active
                        ? activeClass
                        : 'border border-zinc-200 bg-white text-zinc-500',
                )}
            >
                <Icon name={icon} width={16} height={16} />
                {label}
            </button>
        );
    };

    return (
        <Modal onClose={actions.closeCatModal} className="max-w-[440px]">
            <form onSubmit={submit}>
                <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-5">
                    <h3 className="text-base font-bold tracking-tight">
                        {editing ? 'Editar categoría' : 'Nueva categoría'}
                    </h3>
                    <button
                        type="button"
                        onClick={actions.closeCatModal}
                        className="flex size-8 cursor-pointer items-center justify-center rounded-lg border border-zinc-200 bg-white transition hover:bg-zinc-100"
                    >
                        <Icon name="x" width={16} height={16} />
                    </button>
                </div>
                <div className="grid grid-cols-1 gap-[18px] p-6">
                    <Field label="Nombre" error={form.errors.name}>
                        <TextInput
                            value={form.data.name}
                            onChange={(e) =>
                                form.setData('name', e.target.value)
                            }
                            placeholder="Ej: Mantenimiento"
                            autoFocus
                        />
                    </Field>
                    <div>
                        <label className="mb-1.5 block text-[13px] font-medium">
                            Tipo
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {typeButton(
                                'ingreso',
                                'Ingreso',
                                'arrow-down-left',
                            )}
                            {typeButton('gasto', 'Gasto', 'arrow-up-right')}
                        </div>
                        {form.errors.type ? (
                            <p className="mt-1 text-[13px] text-red-600">
                                {form.errors.type}
                            </p>
                        ) : null}
                    </div>
                    <div>
                        <label className="mb-2 block text-[13px] font-medium">
                            Color
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {CATEGORY_COLOR_CHOICES.map((color) => (
                                <button
                                    key={color}
                                    type="button"
                                    onClick={() => form.setData('color', color)}
                                    className="size-[30px] cursor-pointer rounded-lg shadow-[0_0_0_1px_#e4e4e7]"
                                    style={{
                                        background: color,
                                        border: `2px solid ${
                                            form.data.color === color
                                                ? '#18181b'
                                                : 'transparent'
                                        }`,
                                    }}
                                />
                            ))}
                        </div>
                        {form.errors.color ? (
                            <p className="mt-1 text-[13px] text-red-600">
                                {form.errors.color}
                            </p>
                        ) : null}
                    </div>
                </div>
                <div className="flex justify-end gap-2.5 border-t border-zinc-100 bg-zinc-50 px-6 py-[18px]">
                    <SecondaryButton
                        type="button"
                        onClick={actions.closeCatModal}
                    >
                        Cancelar
                    </SecondaryButton>
                    <PrimaryButton type="submit" disabled={form.processing}>
                        <Icon name="check" width={16} height={16} />
                        {form.processing ? 'Guardando…' : 'Guardar'}
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
}
