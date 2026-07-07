import { PROPERTY_TYPES } from '../data';
import { Icon } from '../icon';
import { useRentalContext } from '../rental-context';
import {
    Card,
    Field,
    PrimaryButton,
    SecondaryButton,
    SelectInput,
    TextInput,
} from '../ui';

export function NewRentalView() {
    const { state, actions } = useRentalContext();
    const { form } = state;

    return (
        <div className="mx-auto max-w-[720px]">
            <Card className="p-7">
                <h3 className="mb-1 flex items-center gap-2 text-[15px] font-semibold">
                    <Icon name="home" width={17} height={17} />
                    Datos del inmueble
                </h3>
                <p className="mb-[18px] text-[13px] text-zinc-500">
                    Información básica de la propiedad
                </p>
                <div className="grid grid-cols-1 gap-4">
                    <Field label="Dirección">
                        <TextInput
                            value={form.address}
                            onChange={(e) =>
                                actions.setFormField('address', e.target.value)
                            }
                            placeholder="Calle, número, piso"
                        />
                    </Field>
                    <div className="grid grid-cols-2 gap-4">
                        <Field label="Ciudad">
                            <TextInput
                                value={form.city}
                                onChange={(e) =>
                                    actions.setFormField('city', e.target.value)
                                }
                                placeholder="Madrid"
                            />
                        </Field>
                        <Field label="Tipo de inmueble">
                            <SelectInput
                                value={form.type}
                                onChange={(e) =>
                                    actions.setFormField('type', e.target.value)
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
                        <Field label="Renta mensual (€)">
                            <TextInput
                                type="number"
                                value={form.rent}
                                onChange={(e) =>
                                    actions.setFormField('rent', e.target.value)
                                }
                                placeholder="1200"
                            />
                        </Field>
                        <Field label="Fianza (€)">
                            <TextInput
                                type="number"
                                value={form.deposit}
                                onChange={(e) =>
                                    actions.setFormField(
                                        'deposit',
                                        e.target.value,
                                    )
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
                        <Field label="Nombre del inquilino">
                            <TextInput
                                value={form.tenantName}
                                onChange={(e) =>
                                    actions.setFormField(
                                        'tenantName',
                                        e.target.value,
                                    )
                                }
                                placeholder="Nombre y apellidos"
                            />
                        </Field>
                        <Field label="Email">
                            <TextInput
                                value={form.tenantEmail}
                                onChange={(e) =>
                                    actions.setFormField(
                                        'tenantEmail',
                                        e.target.value,
                                    )
                                }
                                placeholder="correo@email.com"
                            />
                        </Field>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <Field label="Teléfono">
                            <TextInput
                                value={form.tenantPhone}
                                onChange={(e) =>
                                    actions.setFormField(
                                        'tenantPhone',
                                        e.target.value,
                                    )
                                }
                                placeholder="+34 600 000 000"
                            />
                        </Field>
                        <Field label="Inicio contrato">
                            <TextInput
                                type="date"
                                value={form.contractStart}
                                onChange={(e) =>
                                    actions.setFormField(
                                        'contractStart',
                                        e.target.value,
                                    )
                                }
                            />
                        </Field>
                        <Field label="Fin contrato">
                            <TextInput
                                type="date"
                                value={form.contractEnd}
                                onChange={(e) =>
                                    actions.setFormField(
                                        'contractEnd',
                                        e.target.value,
                                    )
                                }
                            />
                        </Field>
                    </div>
                </div>

                <div className="mt-7 flex justify-end gap-2.5">
                    <SecondaryButton
                        onClick={() => actions.navigate('rentals')}
                    >
                        Cancelar
                    </SecondaryButton>
                    <PrimaryButton onClick={actions.submitRental}>
                        <Icon name="check" width={16} height={16} />
                        Dar de alta
                    </PrimaryButton>
                </div>
            </Card>
        </div>
    );
}
