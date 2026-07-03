<?php

declare(strict_types=1);

namespace App\Category\Infrastructure\Http\Controllers;

use App\Category\Application\Actions\CreateCategoryAction;
use App\Category\Application\Actions\DeleteCategoryAction;
use App\Category\Application\Actions\UpdateCategoryAction;
use App\Category\Application\DTOs\CategoryData;
use App\Category\Domain\Enums\TransactionType;
use App\Category\Domain\Models\Category;
use App\Category\Infrastructure\Http\Requests\StoreCategoryRequest;
use App\Category\Infrastructure\Http\Requests\UpdateCategoryRequest;
use Illuminate\Http\RedirectResponse;

final readonly class CategoryController
{
    public function store(StoreCategoryRequest $request, CreateCategoryAction $action): RedirectResponse
    {
        $action->handle($this->dataFrom($request));

        return back();
    }

    public function update(UpdateCategoryRequest $request, Category $category, UpdateCategoryAction $action): RedirectResponse
    {
        $action->handle($category, $this->dataFrom($request));

        return back();
    }

    public function destroy(Category $category, DeleteCategoryAction $action): RedirectResponse
    {
        $action->handle($category);

        return back();
    }

    private function dataFrom(StoreCategoryRequest|UpdateCategoryRequest $request): CategoryData
    {
        $type = $request->enum('type', TransactionType::class);
        assert($type instanceof TransactionType);

        return new CategoryData(
            $request->string('name')->value(),
            $type,
            $request->string('color')->value(),
        );
    }
}
