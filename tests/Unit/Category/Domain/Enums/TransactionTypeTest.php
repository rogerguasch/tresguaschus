<?php

declare(strict_types=1);

use App\Category\Domain\Enums\TransactionType;

it('has the expected backed values', function (): void {
    expect(TransactionType::Ingreso->value)->toBe('ingreso')
        ->and(TransactionType::Gasto->value)->toBe('gasto')
        ->and(TransactionType::cases())->toHaveCount(2);
});
