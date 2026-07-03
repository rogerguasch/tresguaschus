<?php

declare(strict_types=1);

namespace App\Category\Application\Actions;

use App\Category\Application\DTOs\CategoryData;
use App\Category\Domain\Models\Category;

final readonly class UpdateCategoryAction
{
    public function handle(Category $category, CategoryData $data): void
    {
        $category->update([
            'name' => $data->name,
            'type' => $data->type,
            'color' => $data->color,
        ]);
    }
}
