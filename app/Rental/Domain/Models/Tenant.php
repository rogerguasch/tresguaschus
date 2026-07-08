<?php

declare(strict_types=1);

namespace App\Rental\Domain\Models;

use Carbon\CarbonImmutable;
use Carbon\CarbonInterface;
use Database\Factories\TenantFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property-read int $id
 * @property-read int $rental_id
 * @property-read string $name
 * @property-read string $email
 * @property-read string $phone
 * @property-read CarbonImmutable $since
 * @property-read Rental $rental
 * @property-read CarbonInterface $created_at
 * @property-read CarbonInterface $updated_at
 */
final class Tenant extends Model
{
    /**
     * @use HasFactory<TenantFactory>
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
            'email' => 'string',
            'phone' => 'string',
            'since' => 'date',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    protected static function newFactory(): TenantFactory
    {
        return TenantFactory::new();
    }
}
