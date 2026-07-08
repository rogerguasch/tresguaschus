<?php

declare(strict_types=1);

use App\Category\Domain\Models\Category;
use App\Rental\Domain\Models\Rental;
use App\Transaction\Application\Actions\CreateTransactionAction;
use App\Transaction\Application\DTOs\TransactionData;
use App\Transaction\Domain\Models\Transaction;
use Money\Money;

it('may create a transaction for a category', function (): void {
    $rental = Rental::factory()->create();
    $category = Category::factory()->ingreso()->create(['name' => 'Renta']);

    $action = app(CreateTransactionAction::class);

    $transaction = $action->handle(
        new TransactionData($rental->id, 'Renta', '2026-01-05', 'Renta mensual', Money::EUR(120_000), 'Transferencia'),
    );

    expect($transaction)->toBeInstanceOf(Transaction::class)
        ->and($transaction->rental_id)->toBe($rental->id)
        ->and($transaction->category_id)->toBe($category->id)
        ->and($transaction->date->format('Y-m-d'))->toBe('2026-01-05')
        ->and($transaction->concept)->toBe('Renta mensual')
        ->and($transaction->amount->equals(Money::EUR(120_000)))->toBeTrue()
        ->and($transaction->method)->toBe('Transferencia');

    $this->assertDatabaseHas('transactions', [
        'rental_id' => $rental->id,
        'category_id' => $category->id,
        'concept' => 'Renta mensual',
        'amount' => 120_000,
        'method' => 'Transferencia',
    ]);
});
