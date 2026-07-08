<?php

declare(strict_types=1);

namespace App\Rental\Domain\Models;

use Carbon\CarbonInterface;
use Database\Factories\RentalFileFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property-read int $id
 * @property-read int $rental_id
 * @property-read string $name
 * @property-read string $kind
 * @property-read string $path
 * @property-read string $mime_type
 * @property-read int $size
 * @property-read Rental $rental
 * @property-read CarbonInterface $created_at
 * @property-read CarbonInterface $updated_at
 */
final class RentalFile extends Model
{
    /**
     * @use HasFactory<RentalFileFactory>
     */
    use HasFactory;

    /**
     * @return BelongsTo<Rental, $this>
     */
    public function rental(): BelongsTo
    {
        return $this->belongsTo(Rental::class);
    }

    /**
     * @return array<string, string>
     */
    public function casts(): array
    {
        return [
            'id' => 'integer',
            'rental_id' => 'integer',
            'name' => 'string',
            'kind' => 'string',
            'path' => 'string',
            'mime_type' => 'string',
            'size' => 'integer',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    protected static function newFactory(): RentalFileFactory
    {
        return RentalFileFactory::new();
    }
}
