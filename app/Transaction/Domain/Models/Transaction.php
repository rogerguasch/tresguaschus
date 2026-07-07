<?php

declare(strict_types=1);

namespace App\Transaction\Domain\Models;

use App\Category\Domain\Models\Category;
use Carbon\CarbonImmutable;
use Carbon\CarbonInterface;
use Database\Factories\TransactionFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property-read int $id
 * @property-read string $rental_id
 * @property-read int $category_id
 * @property-read CarbonImmutable $date
 * @property-read string $concept
 * @property-read int $amount
 * @property-read string $method
 * @property-read Category $category
 * @property-read CarbonInterface $created_at
 * @property-read CarbonInterface $updated_at
 */
final class Transaction extends Model
{
    /**
     * @use HasFactory<TransactionFactory>
     */
    use HasFactory;

    /**
     * @return BelongsTo<Category, $this>
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * @return array<string, string>
     */
    public function casts(): array
    {
        return [
            'id' => 'integer',
            'rental_id' => 'string',
            'category_id' => 'integer',
            'date' => 'date',
            'concept' => 'string',
            'amount' => 'integer',
            'method' => 'string',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    protected static function newFactory(): TransactionFactory
    {
        return TransactionFactory::new();
    }
}
