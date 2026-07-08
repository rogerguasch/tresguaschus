<?php

declare(strict_types=1);

namespace App\Rental\Domain\Models;

use App\Rental\Domain\Casts\MoneyCast;
use App\Rental\Domain\Enums\PropertyType;
use App\Rental\Domain\Enums\RentalStatus;
use Carbon\CarbonImmutable;
use Carbon\CarbonInterface;
use Database\Factories\RentalFactory;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Money\Money;

/**
 * @property-read int $id
 * @property-read string $address
 * @property-read string $city
 * @property-read PropertyType $type
 * @property-read Money $rent
 * @property-read Money $deposit
 * @property-read ?CarbonImmutable $contract_start
 * @property-read ?CarbonImmutable $contract_end
 * @property-read RentalStatus $status
 * @property-read ?Tenant $tenant
 * @property-read Collection<int, RentalFile> $files
 * @property-read CarbonInterface $created_at
 * @property-read CarbonInterface $updated_at
 */
final class Rental extends Model
{
    /**
     * @use HasFactory<RentalFactory>
     */
    use HasFactory;

    /**
     * @return HasOne<Tenant, $this>
     */
    public function tenant(): HasOne
    {
        return $this->hasOne(Tenant::class);
    }

    /**
     * @return HasMany<RentalFile, $this>
     */
    public function files(): HasMany
    {
        return $this->hasMany(RentalFile::class);
    }

    /**
     * @return array<string, string>
     */
    public function casts(): array
    {
        return [
            'id' => 'integer',
            'address' => 'string',
            'city' => 'string',
            'type' => PropertyType::class,
            'rent' => MoneyCast::class,
            'deposit' => MoneyCast::class,
            'contract_start' => 'date',
            'contract_end' => 'date',
            'status' => RentalStatus::class,
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    protected static function newFactory(): RentalFactory
    {
        return RentalFactory::new();
    }
}
