<?php

declare(strict_types=1);

namespace App\Rental\Infrastructure\Http\Controllers;

use App\Rental\Application\Actions\UploadRentalFilesAction;
use App\Rental\Domain\Models\Rental;
use App\Rental\Infrastructure\Http\Requests\StoreRentalFilesRequest;
use Illuminate\Http\RedirectResponse;

final readonly class UploadRentalFilesController
{
    public function __invoke(StoreRentalFilesRequest $request, Rental $rental, UploadRentalFilesAction $action): RedirectResponse
    {
        $action->handle($rental, $request->uploadedFiles());

        return back();
    }
}
