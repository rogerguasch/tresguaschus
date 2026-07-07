<?php

declare(strict_types=1);

use App\Category\Domain\Models\Category;
use App\Transaction\Domain\Models\Transaction;

it('renders the Rentia single-page app', function (): void {
    $this->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('dashboard'));
});

it('passes categories from the backend to the Rentia page', function (): void {
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

it('passes transactions from the backend to the Rentia page', function (): void {
    $category = Category::factory()->ingreso()->create(['name' => 'Renta']);

    $transaction = Transaction::factory()->for($category)->create([
        'rental_id' => 'r1',
        'date' => '2026-01-05',
        'concept' => 'Renta mensual',
        'amount' => 1200,
        'method' => 'Transferencia',
    ]);

    $this->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('dashboard')
            ->has('transactions', 1)
            ->where('transactions.0.id', (string) $transaction->id)
            ->where('transactions.0.rentalId', 'r1')
            ->where('transactions.0.date', '2026-01-05')
            ->where('transactions.0.type', 'ingreso')
            ->where('transactions.0.category', 'Renta')
            ->where('transactions.0.concept', 'Renta mensual')
            ->where('transactions.0.amount', 1200)
            ->where('transactions.0.method', 'Transferencia'));
});
