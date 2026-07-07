<?php

declare(strict_types=1);

namespace App\Transaction\Application\DTOs;

final readonly class TransactionData
{
    public function __construct(
        public string $rentalId,
        public string $categoryName,
        public string $date,
        public string $concept,
        public int $amount,
        public string $method,
    ) {}
}
