<?php

declare(strict_types=1);

namespace App\Category\Application\Actions;

use App\Category\Domain\Models\Category;

final readonly class FindCategoryByNameAction
{
    public function handle(string $name): Category
    {
        return Category::query()->where('name', $name)->firstOrFail();
    }
}
