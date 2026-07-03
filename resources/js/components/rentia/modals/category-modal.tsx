import { cn } from '@/lib/utils';
import { CATEGORY_COLOR_CHOICES } from '../data';
import { Icon } from '../icon';
import { useRentiaContext } from '../rentia-context';
import type { TransactionType } from '../types';
import { Field, PrimaryButton, SecondaryButton, TextInput } from '../ui';
import { Modal } from './modal';

const segmentBase =
    'inline-flex h-[42px] cursor-pointer items-center justify-center gap-2 rounded-lg text-sm font-semibold transition';

export function CategoryModal() {
    const { state, actions } = useRentiaContext();
    if (!state.catModalOpen) {
        return null;
    }
    const { catDraft, catEditing } = state;

    const typeButton = (type: TransactionType, label: string, icon: string) => {
        const active = catDraft.type === type;
        const activeClass =
            type === 'ingreso'
                ? 'border border-green-600 bg-green-50 text-green-600'
                : 'border border-red-600 bg-red-50 text-red-600';
        return (
            <button
                onClick={() => actions.setCatType(type)}
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
            <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-5">
                <h3 className="text-base font-bold tracking-tight">
                    {catEditing ? 'Editar categoría' : 'Nueva categoría'}
                </h3>
                <button
                    onClick={actions.closeCatModal}
                    className="flex size-8 cursor-pointer items-center justify-center rounded-lg border border-zinc-200 bg-white transition hover:bg-zinc-100"
                >
                    <Icon name="x" width={16} height={16} />
                </button>
            </div>
            <div className="grid grid-cols-1 gap-[18px] p-6">
                <Field label="Nombre">
                    <TextInput
                        value={catDraft.name}
                        onChange={(e) => actions.setCatName(e.target.value)}
                        placeholder="Ej: Mantenimiento"
                    />
                </Field>
                <div>
                    <label className="mb-1.5 block text-[13px] font-medium">
                        Tipo
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                        {typeButton('ingreso', 'Ingreso', 'arrow-down-left')}
                        {typeButton('gasto', 'Gasto', 'arrow-up-right')}
                    </div>
                </div>
                <div>
                    <label className="mb-2 block text-[13px] font-medium">
                        Color
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {CATEGORY_COLOR_CHOICES.map((color) => (
                            <button
                                key={color}
                                onClick={() => actions.setCatColor(color)}
                                className="size-[30px] cursor-pointer rounded-lg shadow-[0_0_0_1px_#e4e4e7]"
                                style={{
                                    background: color,
                                    border: `2px solid ${
                                        catDraft.color === color
                                            ? '#18181b'
                                            : 'transparent'
                                    }`,
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>
            <div className="flex justify-end gap-2.5 border-t border-zinc-100 bg-zinc-50 px-6 py-[18px]">
                <SecondaryButton onClick={actions.closeCatModal}>
                    Cancelar
                </SecondaryButton>
                <PrimaryButton onClick={actions.saveCat}>
                    <Icon name="check" width={16} height={16} />
                    Guardar
                </PrimaryButton>
            </div>
        </Modal>
    );
}
