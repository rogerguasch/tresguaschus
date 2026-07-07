<?php

declare(strict_types=1);

namespace App\Transaction\Application\Actions;

use App\Category\Domain\Models\Category;
use App\Transaction\Application\DTOs\TransactionData;
use App\Transaction\Domain\Models\Transaction;

final readonly class CreateTransactionAction
{
    public function handle(Category $category, TransactionData $data): Transaction
    {
        return Transaction::query()->create([
            'rental_id' => $data->rentalId,
            'category_id' => $category->id,
            'date' => $data->date,
            'concept' => $data->concept,
            'amount' => $data->amount,
            'method' => $data->method,
        ]);
    }
}
