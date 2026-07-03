<?php

declare(strict_types=1);

use App\Category\Application\Actions\DeleteCategoryAction;
use App\Category\Domain\Models\Category;

it('may delete a category', function (): void {
    $category = Category::factory()->create();

    app(DeleteCategoryAction::class)->handle($category);

    expect($category->fresh())->toBeNull();
});
