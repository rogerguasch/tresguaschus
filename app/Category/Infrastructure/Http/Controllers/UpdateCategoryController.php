<?php

declare(strict_types=1);

namespace App\Category\Infrastructure\Http\Controllers;

use App\Category\Application\Actions\UpdateCategoryAction;
use App\Category\Application\DTOs\CategoryData;
use App\Category\Domain\Enums\TransactionType;
use App\Category\Domain\Models\Category;
use App\Category\Infrastructure\Http\Requests\UpdateCategoryRequest;
use Illuminate\Http\RedirectResponse;

final readonly class UpdateCategoryController
{
    public function __invoke(UpdateCategoryRequest $request, Category $category, UpdateCategoryAction $action): RedirectResponse
    {
        $type = $request->enum('type', TransactionType::class);
        assert($type instanceof TransactionType);

        $action->handle($category, new CategoryData(
            $request->string('name')->value(),
            $type,
            $request->string('color')->value(),
        ));

        return back();
    }
}
