<?php

declare(strict_types=1);

namespace App\Rental\Application\DTOs;

final readonly class TenantData
{
    public function __construct(
        public string $name,
        public string $email,
        public string $phone,
        public string $since,
    ) {}
}
