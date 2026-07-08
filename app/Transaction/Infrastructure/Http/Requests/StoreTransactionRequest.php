<?php

declare(strict_types=1);

namespace App\Transaction\Infrastructure\Http\Requests;

use App\Category\Domain\Models\Category;
use App\Rental\Domain\Models\Rental;
use App\Transaction\Application\DTOs\TransactionData;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Money\Currencies\ISOCurrencies;
use Money\Currency;
use Money\Money;
use Money\Parser\DecimalMoneyParser;

final class StoreTransactionRequest extends FormRequest
{
    /**
     * @return array<string, array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'rental_id' => ['required', 'integer', Rule::exists(Rental::class, 'id')],
            'category' => ['required', 'string', Rule::exists(Category::class, 'name')->withoutTrashed()],
            'date' => ['required', 'date'],
            'concept' => ['required', 'string', 'max:255'],
            'amount' => ['required', 'numeric', 'decimal:0,2', 'min:0.01'],
            'method' => ['required', 'string', 'max:255'],
        ];
    }

    public function toData(): TransactionData
    {
        return new TransactionData(
            $this->integer('rental_id'),
            $this->string('category')->value(),
            $this->string('date')->value(),
            $this->string('concept')->value(),
            $this->amount(),
            $this->string('method')->value(),
        );
    }

    private function amount(): Money
    {
        return (new DecimalMoneyParser(new ISOCurrencies()))
            ->parse($this->string('amount')->value(), new Currency('EUR'));
    }
}
