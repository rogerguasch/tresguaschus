<?php

declare(strict_types=1);

use App\Category\Domain\Models\Category;
use App\Transaction\Domain\Models\Transaction;
use Carbon\CarbonImmutable;
use Money\Money;

it('casts its attributes', function (): void {
    $transaction = Transaction::factory()->create([
        'date' => '2026-01-05',
        'amount' => Money::EUR(120_000),
    ]);

    $fresh = $transaction->fresh();

    expect($fresh->date)->toBeInstanceOf(CarbonImmutable::class)
        ->and($fresh->date->format('Y-m-d'))->toBe('2026-01-05')
        ->and($fresh->amount)->toBeInstanceOf(Money::class)
        ->and($fresh->amount->equals(Money::EUR(120_000)))->toBeTrue();

    $this->assertDatabaseHas('transactions', [
        'id' => $transaction->id,
        'amount' => 120_000,
    ]);
});

it('belongs to a category', function (): void {
    $category = Category::factory()->create();

    $transaction = Transaction::factory()->for($category)->create();

    expect($transaction->category)->toBeInstanceOf(Category::class)
        ->and($transaction->category->id)->toBe($category->id);
});
