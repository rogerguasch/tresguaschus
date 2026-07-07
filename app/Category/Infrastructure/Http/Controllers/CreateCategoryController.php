<?php

declare(strict_types=1);

namespace App\Category\Infrastructure\Http\Controllers;

use App\Category\Application\Actions\CreateCategoryAction;
use App\Category\Infrastructure\Http\Requests\StoreCategoryRequest;
use Illuminate\Http\RedirectResponse;

final readonly class CreateCategoryController
{
    public function __invoke(StoreCategoryRequest $request, CreateCategoryAction $action): RedirectResponse
    {
        $action->handle($request->toData());

        return back();
    }
}
