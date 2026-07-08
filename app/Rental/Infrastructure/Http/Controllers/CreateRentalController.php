<?php

declare(strict_types=1);

namespace App\Rental\Infrastructure\Http\Controllers;

use App\Rental\Application\Actions\CreateRentalAction;
use App\Rental\Infrastructure\Http\Requests\StoreRentalRequest;
use Illuminate\Http\RedirectResponse;

final readonly class CreateRentalController
{
    public function __invoke(StoreRentalRequest $request, CreateRentalAction $action): RedirectResponse
    {
        $action->handle($request->toData());

        return back();
    }
}
