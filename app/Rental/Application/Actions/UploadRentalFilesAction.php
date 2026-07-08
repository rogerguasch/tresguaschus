<?php

declare(strict_types=1);

namespace App\Rental\Application\Actions;

use App\Rental\Domain\Models\Rental;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;

final readonly class UploadRentalFilesAction
{
    /**
     * @param  list<UploadedFile>  $files
     */
    public function handle(Rental $rental, array $files): void
    {
        DB::transaction(function () use ($rental, $files): void {
            foreach ($files as $file) {
                $path = $file->store('rental-files/'.$rental->id);
                assert(is_string($path));

                $rental->files()->create([
                    'name' => $file->getClientOriginalName(),
                    'kind' => 'Documento',
                    'path' => $path,
                    'mime_type' => $file->getClientMimeType(),
                    'size' => $file->getSize(),
                ]);
            }
        });
    }
}
