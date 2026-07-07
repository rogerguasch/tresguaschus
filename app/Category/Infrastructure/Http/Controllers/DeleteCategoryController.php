<?php

declare(strict_types=1);

namespace App\Category\Infrastructure\Http\Controllers;

use App\Category\Application\Actions\DeleteCategoryAction;
use App\Category\Domain\Models\Category;
use Illuminate\Http\RedirectResponse;

final readonly class DeleteCategoryController
{
    public function __invoke(Category $category, DeleteCategoryAction $action): RedirectResponse
    {
        $action->handle($category);

        return back();
    }
}
