<?php

declare(strict_types=1);

namespace App\Rental\Application\Actions;

use App\Rental\Application\DTOs\RentalData;
use App\Rental\Domain\Enums\RentalStatus;
use App\Rental\Domain\Models\Rental;
use Illuminate\Support\Facades\DB;

final readonly class CreateRentalAction
{
    public function handle(RentalData $data): Rental
    {
        return DB::transaction(function () use ($data): Rental {
            $rental = Rental::query()->create([
                'address' => $data->address,
                'city' => $data->city,
                'type' => $data->type,
                'rent' => $data->rent,
                'deposit' => $data->deposit,
                'contract_start' => $data->contractStart,
                'contract_end' => $data->contractEnd,
                'status' => $data->tenant !== null
                    ? RentalStatus::Alquilado
                    : RentalStatus::Vacio,
            ]);

            if ($data->tenant !== null) {
                $rental->tenant()->create([
                    'name' => $data->tenant->name,
                    'email' => $data->tenant->email,
                    'phone' => $data->tenant->phone,
                    'since' => $data->tenant->since,
                ]);
            }

            return $rental;
        });
    }
}
