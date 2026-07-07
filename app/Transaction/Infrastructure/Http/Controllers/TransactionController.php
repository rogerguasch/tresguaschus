<?php

declare(strict_types=1);

namespace App\Transaction\Infrastructure\Http\Controllers;

use App\Category\Domain\Models\Category;
use App\Transaction\Application\Actions\CreateTransactionAction;
use App\Transaction\Application\DTOs\TransactionData;
use App\Transaction\Infrastructure\Http\Requests\StoreTransactionRequest;
use Illuminate\Http\RedirectResponse;

final readonly class TransactionController
{
    public function store(StoreTransactionRequest $request, CreateTransactionAction $action): RedirectResponse
    {
        $category = Category::query()
            ->where('name', $request->string('category')->value())
            ->firstOrFail();

        $action->handle($category, $this->dataFrom($request));

        return back();
    }

    private function dataFrom(StoreTransactionRequest $request): TransactionData
    {
        return new TransactionData(
            $request->string('rental_id')->value(),
            $request->string('date')->value(),
            $request->string('concept')->value(),
            $request->integer('amount'),
            $request->string('method')->value(),
        );
    }
}
