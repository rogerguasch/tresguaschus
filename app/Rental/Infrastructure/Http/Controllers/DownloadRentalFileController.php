<?php

declare(strict_types=1);

namespace App\Rental\Infrastructure\Http\Controllers;

use App\Rental\Domain\Models\RentalFile;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

final readonly class DownloadRentalFileController
{
    public function __invoke(RentalFile $rentalFile): StreamedResponse
    {
        return Storage::download($rentalFile->path, $rentalFile->name);
    }
}
