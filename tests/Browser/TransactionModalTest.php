<?php

declare(strict_types=1);

use App\Category\Domain\Models\Category;
use App\Rental\Domain\Models\Rental;
use App\Transaction\Domain\Models\Transaction;
use App\User\Domain\Models\User;
use Money\Money;

beforeEach(fn () => $this->actingAs(User::factory()->create()));

it('surfaces a server validation error on the field', function (): void {
    Rental::factory()->create();
    Category::factory()->ingreso()->create(['name' => 'Renta']);

    $page = visit(route('dashboard'));

    $page->assertNoJavaScriptErrors()
        ->click('Nueva transacción')
        ->assertSee('Registra un ingreso o un gasto')
        ->click('Guardar')
        ->assertSee('at least 0.01')
        ->assertSee('Registra un ingreso o un gasto')
        ->assertNoJavaScriptErrors();

    expect(Transaction::query()->count())->toBe(0);
});

it('creates a transaction from the modal', function (): void {
    Rental::factory()->create();
    Category::factory()->ingreso()->create(['name' => 'Renta']);

    $page = visit(route('dashboard'));

    $page->click('Nueva transacción')
        ->fill('input[type="number"]', '1200')
        ->click('Guardar')
        ->assertSee('Transacción añadida')
        ->assertNoJavaScriptErrors();

    expect(Transaction::query()->firstOrFail()->amount->equals(Money::EUR(120_000)))->toBeTrue();
});
