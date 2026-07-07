<?php

declare(strict_types=1);

namespace App\Category\Infrastructure\Http\Controllers;

use App\Category\Application\Actions\CreateCategoryAction;
use App\Category\Application\DTOs\CategoryData;
use App\Category\Domain\Enums\TransactionType;
use App\Category\Infrastructure\Http\Requests\StoreCategoryRequest;
use Illuminate\Http\RedirectResponse;

final readonly class CreateCategoryController
{
    public function __invoke(StoreCategoryRequest $request, CreateCategoryAction $action): RedirectResponse
    {
        $type = $request->enum('type', TransactionType::class);
        assert($type instanceof TransactionType);

        $action->handle(new CategoryData(
            $request->string('name')->value(),
            $type,
            $request->string('color')->value(),
        ));

        return back();
    }
}
