<?php

declare(strict_types=1);

use App\Category\Domain\Models\Category;
use App\Transaction\Domain\Models\Transaction;

function validTransaction(array $overrides = []): array
{
    return array_merge([
        'rental_id' => 'r1',
        'category' => 'Renta',
        'date' => '2026-01-05',
        'concept' => 'Renta mensual',
        'amount' => 1200,
        'method' => 'Transferencia',
    ], $overrides);
}

it('allows guests to store a transaction for a category', function (): void {
    $category = Category::factory()->ingreso()->create(['name' => 'Renta']);

    $response = $this->fromRoute('dashboard')
        ->post(route('transactions.store'), validTransaction());

    $response->assertRedirect(route('dashboard'));

    $transaction = Transaction::query()->firstOrFail();

    expect($transaction->category_id)->toBe($category->id)
        ->and($transaction->rental_id)->toBe('r1')
        ->and($transaction->concept)->toBe('Renta mensual')
        ->and($transaction->amount)->toBe(1200)
        ->and($transaction->method)->toBe('Transferencia');
});

it('requires an existing category', function (): void {
    Category::factory()->ingreso()->create(['name' => 'Renta']);

    $response = $this->fromRoute('dashboard')
        ->post(route('transactions.store'), validTransaction(['category' => 'Inexistente']));

    $response->assertSessionHasErrors('category');
});

it('requires a positive integer amount', function (string|int $amount): void {
    Category::factory()->ingreso()->create(['name' => 'Renta']);

    $response = $this->fromRoute('dashboard')
        ->post(route('transactions.store'), validTransaction(['amount' => $amount]));

    $response->assertSessionHasErrors('amount');
})->with([
    'zero' => 0,
    'negative' => -50,
    'non-numeric' => 'lots',
]);

it('validates the remaining required fields', function (string $field): void {
    Category::factory()->ingreso()->create(['name' => 'Renta']);

    $response = $this->fromRoute('dashboard')
        ->post(route('transactions.store'), validTransaction([$field => '']));

    $response->assertSessionHasErrors($field);
})->with([
    'rental_id',
    'date',
    'concept',
    'method',
]);
