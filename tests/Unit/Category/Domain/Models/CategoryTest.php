<?php

declare(strict_types=1);

use App\Category\Domain\Enums\TransactionType;
use App\Category\Domain\Models\Category;

it('casts type to the TransactionType enum', function (): void {
    $category = Category::factory()->create(['type' => TransactionType::Gasto]);

    expect($category->fresh()->type)->toBe(TransactionType::Gasto);
});

it('builds via factory type states', function (): void {
    expect(Category::factory()->ingreso()->create()->type)->toBe(TransactionType::Ingreso)
        ->and(Category::factory()->gasto()->create()->type)->toBe(TransactionType::Gasto);
});
