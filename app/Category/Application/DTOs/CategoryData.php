<?php

declare(strict_types=1);

namespace App\Category\Application\DTOs;

use App\Category\Domain\Enums\TransactionType;

final readonly class CategoryData
{
    public function __construct(
        public string $name,
        public TransactionType $type,
        public string $color,
    ) {}
}
