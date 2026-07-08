<?php

declare(strict_types=1);

namespace App\Rental\Infrastructure\Http\Resources;

use App\Rental\Domain\Models\RentalFile;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Number;

/**
 * @mixin RentalFile
 */
final class RentalFileResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => (string) $this->id,
            'name' => $this->name,
            'kind' => $this->kind,
            'size' => Number::fileSize($this->size),
            'date' => $this->created_at->format('Y-m-d'),
            'url' => route('rental-files.download', $this->id),
        ];
    }
}
