<?php

declare(strict_types=1);

use App\Category\Application\Actions\ListCategoriesAction;
use App\Category\Domain\Enums\TransactionType;
use App\Category\Domain\Models\Category;

it('lists every category ordered by type and name', function (): void {
    Category::factory()->gasto()->create(['name' => 'Reparaciones']);
    Category::factory()->ingreso()->create(['name' => 'Renta']);
    Category::factory()->gasto()->create(['name' => 'Comunidad']);

    $categories = app(ListCategoriesAction::class)->handle();

    // Ordered by type (gasto before ingreso), then by name.
    expect($categories->pluck('name')->all())
        ->toBe(['Comunidad', 'Reparaciones', 'Renta']);
});

it('filters categories by type', function (): void {
    Category::factory()->ingreso()->create(['name' => 'Renta']);
    Category::factory()->gasto()->create(['name' => 'IBI']);

    $gastos = app(ListCategoriesAction::class)->handle(TransactionType::Gasto);

    expect($gastos)->toHaveCount(1)
        ->and($gastos->first()->name)->toBe('IBI');
});
