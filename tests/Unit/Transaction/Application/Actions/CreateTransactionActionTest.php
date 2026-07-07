<?php

declare(strict_types=1);

use App\Category\Domain\Models\Category;
use App\Transaction\Application\Actions\CreateTransactionAction;
use App\Transaction\Application\DTOs\TransactionData;
use App\Transaction\Domain\Models\Transaction;

it('may create a transaction for a category', function (): void {
    $category = Category::factory()->ingreso()->create(['name' => 'Renta']);

    $action = app(CreateTransactionAction::class);

    $transaction = $action->handle(
        new TransactionData('r1', 'Renta', '2026-01-05', 'Renta mensual', 1200, 'Transferencia'),
    );

    expect($transaction)->toBeInstanceOf(Transaction::class)
        ->and($transaction->rental_id)->toBe('r1')
        ->and($transaction->category_id)->toBe($category->id)
        ->and($transaction->date->format('Y-m-d'))->toBe('2026-01-05')
        ->and($transaction->concept)->toBe('Renta mensual')
        ->and($transaction->amount)->toBe(1200)
        ->and($transaction->method)->toBe('Transferencia');

    $this->assertDatabaseHas('transactions', [
        'rental_id' => 'r1',
        'category_id' => $category->id,
        'concept' => 'Renta mensual',
        'amount' => 1200,
        'method' => 'Transferencia',
    ]);
});
