<?php

declare(strict_types=1);

namespace App\Category\Infrastructure\Http\Controllers;

use App\Category\Application\Actions\UpdateCategoryAction;
use App\Category\Domain\Models\Category;
use App\Category\Infrastructure\Http\Requests\UpdateCategoryRequest;
use Illuminate\Http\RedirectResponse;

final readonly class UpdateCategoryController
{
    public function __invoke(UpdateCategoryRequest $request, Category $category, UpdateCategoryAction $action): RedirectResponse
    {
        $action->handle($category, $request->toData());

        return back();
    }
}
