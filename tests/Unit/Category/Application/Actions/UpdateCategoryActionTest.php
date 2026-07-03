<?php

declare(strict_types=1);

use App\Category\Application\Actions\UpdateCategoryAction;
use App\Category\Application\DTOs\CategoryData;
use App\Category\Domain\Enums\TransactionType;
use App\Category\Domain\Models\Category;

it('may update a category', function (): void {
    $category = Category::factory()->ingreso()->create();

    app(UpdateCategoryAction::class)->handle(
        $category,
        new CategoryData('Comunidad', TransactionType::Gasto, '#4f46e5'),
    );

    expect($category->fresh())
        ->name->toBe('Comunidad')
        ->type->toBe(TransactionType::Gasto)
        ->color->toBe('#4f46e5');
});
