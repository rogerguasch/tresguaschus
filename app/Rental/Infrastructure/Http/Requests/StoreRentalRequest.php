<?php

declare(strict_types=1);

namespace App\Rental\Infrastructure\Http\Requests;

use App\Rental\Application\DTOs\RentalData;
use App\Rental\Application\DTOs\TenantData;
use App\Rental\Domain\Enums\PropertyType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Money\Currencies\ISOCurrencies;
use Money\Currency;
use Money\Money;
use Money\Parser\DecimalMoneyParser;

final class StoreRentalRequest extends FormRequest
{
    /**
     * @return array<string, array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'address' => ['required', 'string', 'max:255'],
            'city' => ['required', 'string', 'max:255'],
            'type' => ['required', Rule::enum(PropertyType::class)],
            'rent' => ['required', 'numeric', 'decimal:0,2', 'min:0.01'],
            'deposit' => ['required', 'numeric', 'decimal:0,2', 'min:0'],
            'contract_start' => ['nullable', 'date'],
            'contract_end' => ['nullable', 'date'],
            'tenant_name' => ['nullable', 'string', 'max:255'],
            'tenant_email' => ['nullable', 'email', 'max:255'],
            'tenant_phone' => ['nullable', 'string', 'max:255'],
        ];
    }

    public function toData(): RentalData
    {
        $type = $this->enum('type', PropertyType::class);
        assert($type instanceof PropertyType);

        return new RentalData(
            $this->string('address')->value(),
            $this->string('city')->value(),
            $type,
            $this->money('rent'),
            $this->money('deposit'),
            $this->dateOrNull('contract_start'),
            $this->dateOrNull('contract_end'),
            $this->tenant(),
        );
    }

    private function tenant(): ?TenantData
    {
        if ($this->string('tenant_name')->isEmpty()) {
            return null;
        }

        return new TenantData(
            $this->string('tenant_name')->value(),
            $this->string('tenant_email')->value() ?: '—',
            $this->string('tenant_phone')->value() ?: '—',
            $this->dateOrNull('contract_start') ?? today()->toDateString(),
        );
    }

    private function money(string $key): Money
    {
        return (new DecimalMoneyParser(new ISOCurrencies()))
            ->parse($this->string($key)->value(), new Currency('EUR'));
    }

    private function dateOrNull(string $key): ?string
    {
        $value = $this->string($key)->value();

        return $value === '' ? null : $value;
    }
}
