import CreateRentalController from '@/actions/App/Rental/Infrastructure/Http/Controllers/CreateRentalController';
import { useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import { PROPERTY_TYPES } from '../data';
import { Icon } from '../icon';
import { useRentalContext } from '../rental-context';
import type { PropertyType } from '../types';
import {
    Card,
    Field,
    PrimaryButton,
    SecondaryButton,
    SelectInput,
    TextInput,
} from '../ui';

export function NewRentalView() {
    const { actions } = useRentalContext();

    const form = useForm({
        address: '',
        city: '',
        type: 'Piso' as PropertyType,
        rent: '',
        deposit: '',
        tenant_name: '',
        tenant_email: '',
        tenant_phone: '',
        contract_start: '',
        contract_end: '',
    });

    const submit = (event: FormEvent): void => {
        event.preventDefault();

        form.post(CreateRentalController.url(), {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                actions.navigate('rentals');
                actions.showToast('Alquiler dado de alta', true);
            },
        });
    };

    return (
        <form onSubmit={submit} className="mx-auto max-w-[720px]">
            <Card className="p-7">
                <h3 className="mb-1 flex items-center gap-2 text-[15px] font-semibold">
                    <Icon name="home" width={17} height={17} />
                    Datos del inmueble
                </h3>
                <p className="mb-[18px] text-[13px] text-zinc-500">
                    Información básica de la propiedad
                </p>
                <div className="grid grid-cols-1 gap-4">
                    <Field label="Dirección" error={form.errors.address}>
                        <TextInput
                            value={form.data.address}
                            onChange={(e) =>
                                form.setData('address', e.target.value)
                            }
                            placeholder="Calle, número, piso"
                        />
                    </Field>
                    <div className="grid grid-cols-2 gap-4">
                        <Field label="Ciudad" error={form.errors.city}>
                            <TextInput
                                value={form.data.city}
                                onChange={(e) =>
                                    form.setData('city', e.target.value)
                                }
                                placeholder="Madrid"
                            />
                        </Field>
                        <Field
                            label="Tipo de inmueble"
                            error={form.errors.type}
                        >
                            <SelectInput
                                value={form.data.type}
                                onChange={(e) =>
                                    form.setData(
                                        'type',
                                        e.target.value as PropertyType,
                                    )
                                }
                            >
                                {PROPERTY_TYPES.map((type) => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </SelectInput>
                        </Field>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Field
                            label="Renta mensual (€)"
                            error={form.errors.rent}
                        >
                            <TextInput
                                type="number"
                                value={form.data.rent}
                                onChange={(e) =>
                                    form.setData('rent', e.target.value)
                                }
                                placeholder="1200"
                            />
                        </Field>
                        <Field label="Fianza (€)" error={form.errors.deposit}>
                            <TextInput
                                type="number"
                                value={form.data.deposit}
                                onChange={(e) =>
                                    form.setData('deposit', e.target.value)
                                }
                                placeholder="2400"
                            />
                        </Field>
                    </div>
                </div>

                <div className="my-6 h-px bg-zinc-100" />

                <h3 className="mb-1 flex items-center gap-2 text-[15px] font-semibold">
                    <Icon name="user" width={17} height={17} />
                    Inquilino y contrato
                </h3>
                <p className="mb-[18px] text-[13px] text-zinc-500">
                    Déjalo en blanco si el inmueble está vacío
                </p>
                <div className="grid grid-cols-1 gap-4">
                    <div className="grid grid-cols-2 gap-4">
                        <Field
                            label="Nombre del inquilino"
                            error={form.errors.tenant_name}
                        >
                            <TextInput
                                value={form.data.tenant_name}
                                onChange={(e) =>
                                    form.setData('tenant_name', e.target.value)
                                }
                                placeholder="Nombre y apellidos"
                            />
                        </Field>
                        <Field label="Email" error={form.errors.tenant_email}>
                            <TextInput
                                value={form.data.tenant_email}
                                onChange={(e) =>
                                    form.setData('tenant_email', e.target.value)
                                }
                                placeholder="correo@email.com"
                            />
                        </Field>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <Field
                            label="Teléfono"
                            error={form.errors.tenant_phone}
                        >
                            <TextInput
                                value={form.data.tenant_phone}
                                onChange={(e) =>
                                    form.setData('tenant_phone', e.target.value)
                                }
                                placeholder="+34 600 000 000"
                            />
                        </Field>
                        <Field
                            label="Inicio contrato"
                            error={form.errors.contract_start}
                        >
                            <TextInput
                                type="date"
                                value={form.data.contract_start}
                                onChange={(e) =>
                                    form.setData(
                                        'contract_start',
                                        e.target.value,
                                    )
                                }
                            />
                        </Field>
                        <Field
                            label="Fin contrato"
                            error={form.errors.contract_end}
                        >
                            <TextInput
                                type="date"
                                value={form.data.contract_end}
                                onChange={(e) =>
                                    form.setData('contract_end', e.target.value)
                                }
                            />
                        </Field>
                    </div>
                </div>

                <div className="mt-7 flex justify-end gap-2.5">
                    <SecondaryButton
                        type="button"
                        onClick={() => actions.navigate('rentals')}
                    >
                        Cancelar
                    </SecondaryButton>
                    <PrimaryButton type="submit" disabled={form.processing}>
                        <Icon name="check" width={16} height={16} />
                        {form.processing ? 'Guardando…' : 'Dar de alta'}
                    </PrimaryButton>
                </div>
            </Card>
        </form>
    );
}
