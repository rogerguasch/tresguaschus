<?php

declare(strict_types=1);

use App\Category\Application\Actions\DeleteCategoryAction;
use App\Category\Domain\Models\Category;
use App\Transaction\Domain\Models\Transaction;

it('soft deletes a category', function (): void {
    $category = Category::factory()->create();

    app(DeleteCategoryAction::class)->handle($category);

    $this->assertSoftDeleted($category);
    expect(Category::query()->find($category->id))->toBeNull();
});

it('keeps the transactions of a soft-deleted category', function (): void {
    $category = Category::factory()->create();
    $transaction = Transaction::factory()->for($category)->create();

    app(DeleteCategoryAction::class)->handle($category);

    $this->assertNotSoftDeleted($transaction);
    expect(Transaction::query()->whereKey($transaction->id)->exists())->toBeTrue();
});
