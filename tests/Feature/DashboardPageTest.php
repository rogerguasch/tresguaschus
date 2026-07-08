<?php

declare(strict_types=1);

use App\Category\Domain\Models\Category;
use App\Rental\Domain\Models\Rental;
use App\Transaction\Domain\Models\Transaction;
use Money\Money;

it('renders the dashboard single-page app', function (): void {
    $this->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('dashboard'));
});

it('passes categories from the backend to the dashboard', function (): void {
    $category = Category::factory()->ingreso()->create([
        'name' => 'Renta',
        'color' => '#16a34a',
    ]);

    $this->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('dashboard')
            ->has('categories', 1)
            ->where('categories.0.id', (string) $category->id)
            ->where('categories.0.name', 'Renta')
            ->where('categories.0.type', 'ingreso')
            ->where('categories.0.color', '#16a34a'));
});

it('passes transactions from the backend to the dashboard', function (): void {
    $rental = Rental::factory()->create();
    $category = Category::factory()->ingreso()->create(['name' => 'Renta']);

    $transaction = Transaction::factory()->for($rental)->for($category)->create([
        'date' => '2026-01-05',
        'concept' => 'Renta mensual',
        'amount' => Money::EUR(120_000),
        'method' => 'Transferencia',
    ]);

    $this->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('dashboard')
            ->has('transactions', 1)
            ->where('transactions.0.id', (string) $transaction->id)
            ->where('transactions.0.rentalId', (string) $rental->id)
            ->where('transactions.0.date', '2026-01-05')
            ->where('transactions.0.type', 'ingreso')
            ->where('transactions.0.category', 'Renta')
            ->where('transactions.0.concept', 'Renta mensual')
            ->where('transactions.0.amount', 1200)
            ->where('transactions.0.method', 'Transferencia'));
});

it('passes rentals with their tenant from the backend to the dashboard', function (): void {
    $rental = Rental::factory()->create([
        'address' => 'Gran Vía 42, 3ºB',
        'city' => 'Madrid',
    ]);
    $rental->tenant()->create([
        'name' => 'Laura Giménez',
        'email' => 'laura@email.com',
        'phone' => '+34 612 345 678',
        'since' => '2024-09-01',
    ]);
    $rental->files()->create([
        'name' => 'contrato.pdf',
        'kind' => 'Documento',
        'path' => 'rental-files/1/contrato.pdf',
        'mime_type' => 'application/pdf',
        'size' => 253_952,
    ]);

    Rental::factory()->vacant()->create();

    $this->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('dashboard')
            ->has('rentals', 2)
            ->where('rentals.0.id', (string) $rental->id)
            ->where('rentals.0.address', 'Gran Vía 42, 3ºB')
            ->where('rentals.0.city', 'Madrid')
            ->where('rentals.0.tenant.name', 'Laura Giménez')
            ->where('rentals.0.tenant.since', '2024-09-01')
            ->has('rentals.0.files', 1)
            ->where('rentals.0.files.0.name', 'contrato.pdf')
            ->where('rentals.0.files.0.size', '248 KB')
            ->where('rentals.1.tenant', null)
            ->where('rentals.1.status', 'Vacío'));
});
