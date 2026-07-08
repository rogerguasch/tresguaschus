<?php

declare(strict_types=1);

namespace App\Rental\Application\DTOs;

use App\Rental\Domain\Enums\PropertyType;
use Money\Money;

final readonly class RentalData
{
    public function __construct(
        public string $address,
        public string $city,
        public PropertyType $type,
        public Money $rent,
        public Money $deposit,
        public ?string $contractStart,
        public ?string $contractEnd,
        public ?TenantData $tenant,
    ) {}
}
