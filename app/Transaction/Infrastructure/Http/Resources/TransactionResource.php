<?php

declare(strict_types=1);

namespace App\Transaction\Infrastructure\Http\Resources;

use App\Transaction\Domain\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Money\Currencies\ISOCurrencies;
use Money\Formatter\DecimalMoneyFormatter;

/**
 * @mixin Transaction
 */
final class TransactionResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => (string) $this->id,
            'rentalId' => (string) $this->rental_id,
            'date' => $this->date->format('Y-m-d'),
            'type' => $this->category->type->value,
            'category' => $this->category->name,
            'concept' => $this->concept,
            'amount' => (float) (new DecimalMoneyFormatter(new ISOCurrencies()))->format($this->amount),
            'method' => $this->method,
        ];
    }
}
