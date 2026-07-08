<?php

declare(strict_types=1);

namespace App\Transaction\Domain\Models;

use App\Category\Domain\Models\Category;
use App\Transaction\Domain\Casts\MoneyCast;
use Carbon\CarbonImmutable;
use Carbon\CarbonInterface;
use Database\Factories\TransactionFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Money\Money;

/**
 * @property-read int $id
 * @property-read string $rental_id
 * @property-read int $category_id
 * @property-read CarbonImmutable $date
 * @property-read string $concept
 * @property-read Money $amount
 * @property-read string $method
 * @property-read Category $category
 * @property-read CarbonInterface $created_at
 * @property-read CarbonInterface $updated_at
 * @property-read ?CarbonInterface $deleted_at
 */
final class Transaction extends Model
{
    /**
     * @use HasFactory<TransactionFactory>
     */
    use HasFactory;

    use SoftDeletes;

    /**
     * A transaction keeps its category even after the category is archived
     * (soft-deleted), so the relation resolves trashed categories too.
     *
     * @return BelongsTo<Category, $this>
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class)->withTrashed();
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
            'amount' => MoneyCast::class,
            'method' => 'string',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
            'deleted_at' => 'datetime',
        ];
    }

    protected static function newFactory(): TransactionFactory
    {
        return TransactionFactory::new();
    }
}
