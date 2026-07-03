<?php

declare(strict_types=1);

namespace App\Category\Application\Actions;

use App\Category\Application\DTOs\CategoryData;
use App\Category\Domain\Models\Category;

final readonly class CreateCategoryAction
{
    public function handle(CategoryData $data): Category
    {
        return Category::query()->create([
            'name' => $data->name,
            'type' => $data->type,
            'color' => $data->color,
        ]);
    }
}
