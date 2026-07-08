<?php

declare(strict_types=1);

namespace App\Rental\Infrastructure\Http\Resources;

use App\Rental\Domain\Models\Rental;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Money\Currencies\ISOCurrencies;
use Money\Formatter\DecimalMoneyFormatter;
use Money\Money;

/**
 * @mixin Rental
 */
final class RentalResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => (string) $this->id,
            'address' => $this->address,
            'city' => $this->city,
            'type' => $this->type->value,
            'rent' => $this->euros($this->rent),
            'deposit' => $this->euros($this->deposit),
            'contractStart' => $this->contract_start?->format('Y-m-d'),
            'contractEnd' => $this->contract_end?->format('Y-m-d'),
            'status' => $this->status->value,
            'tenant' => $this->tenant === null ? null : [
                'name' => $this->tenant->name,
                'email' => $this->tenant->email,
                'phone' => $this->tenant->phone,
                'since' => $this->tenant->since->format('Y-m-d'),
            ],
            'files' => RentalFileResource::collection($this->files),
        ];
    }

    private function euros(Money $money): float
    {
        return (float) (new DecimalMoneyFormatter(new ISOCurrencies()))->format($money);
    }
}
