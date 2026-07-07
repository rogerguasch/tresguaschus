<?php

declare(strict_types=1);

namespace App\Transaction\Infrastructure\Http\Controllers;

use App\Transaction\Application\Actions\CreateTransactionAction;
use App\Transaction\Infrastructure\Http\Requests\StoreTransactionRequest;
use Illuminate\Http\RedirectResponse;

final readonly class CreateTransactionController
{
    public function __invoke(StoreTransactionRequest $request, CreateTransactionAction $action): RedirectResponse
    {
        $action->handle($request->toData());

        return back();
    }
}
