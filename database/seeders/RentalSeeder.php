<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Rental\Domain\Enums\PropertyType;
use App\Rental\Domain\Enums\RentalStatus;
use App\Rental\Domain\Models\Rental;
use Illuminate\Database\Seeder;
use Money\Money;

final class RentalSeeder extends Seeder
{
    public function run(): void
    {
        foreach ($this->rentals() as $data) {
            $rental = Rental::query()->updateOrCreate(
                ['address' => $data['address']],
                [
                    'city' => $data['city'],
                    'type' => $data['type'],
                    'rent' => Money::EUR($data['rent'] * 100),
                    'deposit' => Money::EUR($data['deposit'] * 100),
                    'contract_start' => $data['contract_start'],
                    'contract_end' => $data['contract_end'],
                    'status' => $data['status'],
                ],
            );

            if ($data['tenant'] !== null) {
                $rental->tenant()->updateOrCreate([], $data['tenant']);
            }
        }
    }

    /**
     * @return list<array{
     *     address: string, city: string, type: PropertyType, rent: int, deposit: int,
     *     contract_start: ?string, contract_end: ?string, status: RentalStatus,
     *     tenant: ?array{name: string, email: string, phone: string, since: string}
     * }>
     */
    private function rentals(): array
    {
        return [
            [
                'address' => 'Gran Vía 42, 3ºB', 'city' => 'Madrid', 'type' => PropertyType::Piso,
                'rent' => 1200, 'deposit' => 2400,
                'contract_start' => '2024-09-01', 'contract_end' => '2026-08-31', 'status' => RentalStatus::Alquilado,
                'tenant' => ['name' => 'Laura Giménez', 'email' => 'laura.gimenez@email.com', 'phone' => '+34 612 345 678', 'since' => '2024-09-01'],
            ],
            [
                'address' => 'Avinguda Diagonal 210, 2º1ª', 'city' => 'Barcelona', 'type' => PropertyType::Piso,
                'rent' => 1450, 'deposit' => 2900,
                'contract_start' => '2025-01-15', 'contract_end' => '2027-01-14', 'status' => RentalStatus::Alquilado,
                'tenant' => ['name' => 'Marc Torres', 'email' => 'marc.torres@email.com', 'phone' => '+34 623 111 222', 'since' => '2025-01-15'],
            ],
            [
                'address' => 'Calle Sierpes 8', 'city' => 'Sevilla', 'type' => PropertyType::LocalComercial,
                'rent' => 950, 'deposit' => 2850,
                'contract_start' => '2023-06-01', 'contract_end' => '2028-05-31', 'status' => RentalStatus::Alquilado,
                'tenant' => ['name' => 'Café Aurora S.L.', 'email' => 'admin@cafeaurora.es', 'phone' => '+34 954 000 111', 'since' => '2023-06-01'],
            ],
            [
                'address' => 'Paseo de la Castellana 100, 5ºA', 'city' => 'Madrid', 'type' => PropertyType::Atico,
                'rent' => 1800, 'deposit' => 3600,
                'contract_start' => '2025-03-01', 'contract_end' => '2027-02-28', 'status' => RentalStatus::Alquilado,
                'tenant' => ['name' => 'David Romero', 'email' => 'david.romero@email.com', 'phone' => '+34 655 987 654', 'since' => '2025-03-01'],
            ],
            [
                'address' => 'Calle de la Paz 15', 'city' => 'Valencia', 'type' => PropertyType::Estudio,
                'rent' => 750, 'deposit' => 1500,
                'contract_start' => '2025-10-01', 'contract_end' => '2026-09-30', 'status' => RentalStatus::Alquilado,
                'tenant' => ['name' => 'Nadia Cheddadi', 'email' => 'nadia.ch@email.com', 'phone' => '+34 666 222 333', 'since' => '2025-10-01'],
            ],
            [
                'address' => 'Calle Uría 30, 1ºC', 'city' => 'Oviedo', 'type' => PropertyType::Piso,
                'rent' => 820, 'deposit' => 0,
                'contract_start' => null, 'contract_end' => null, 'status' => RentalStatus::Vacio,
                'tenant' => null,
            ],
        ];
    }
}
