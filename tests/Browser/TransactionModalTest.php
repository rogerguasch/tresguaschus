<?php

declare(strict_types=1);

use App\Category\Domain\Models\Category;
use App\Transaction\Domain\Models\Transaction;

it('surfaces a server validation error on the field', function (): void {
    Category::factory()->ingreso()->create(['name' => 'Renta']);

    $page = visit(route('dashboard'));

    $page->assertNoJavaScriptErrors()
        ->click('Nueva transacción')
        ->assertSee('Registra un ingreso o un gasto')
        ->click('Guardar')
        ->assertSee('at least 1')
        ->assertSee('Registra un ingreso o un gasto')
        ->assertNoJavaScriptErrors();

    expect(Transaction::query()->count())->toBe(0);
});

it('creates a transaction from the modal', function (): void {
    Category::factory()->ingreso()->create(['name' => 'Renta']);

    $page = visit(route('dashboard'));

    $page->click('Nueva transacción')
        ->fill('input[type="number"]', '1200')
        ->click('Guardar')
        ->assertSee('Transacción añadida')
        ->assertNoJavaScriptErrors();

    expect(Transaction::query()->where('amount', 1200)->exists())->toBeTrue();
});
