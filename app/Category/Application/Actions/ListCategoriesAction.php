<?php

declare(strict_types=1);

namespace App\Category\Application\Actions;

use App\Category\Domain\Enums\TransactionType;
use App\Category\Domain\Models\Category;
use Illuminate\Database\Eloquent\Collection;

final readonly class ListCategoriesAction
{
    /**
     * @return Collection<int, Category>
     */
    public function handle(?TransactionType $type = null): Collection
    {
        return Category::query()
            ->when($type, fn ($query) => $query->where('type', $type))
            ->orderBy('type')
            ->orderBy('name')
            ->get();
    }
}
