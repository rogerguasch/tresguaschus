<?php

declare(strict_types=1);

use App\Category\Application\Actions\CreateCategoryAction;
use App\Category\Application\DTOs\CategoryData;
use App\Category\Domain\Enums\TransactionType;
use App\Category\Domain\Models\Category;

it('may create a category', function (): void {
    $action = app(CreateCategoryAction::class);

    $category = $action->handle(new CategoryData('Renta', TransactionType::Ingreso, '#16a34a'));

    expect($category)->toBeInstanceOf(Category::class)
        ->and($category->name)->toBe('Renta')
        ->and($category->type)->toBe(TransactionType::Ingreso)
        ->and($category->color)->toBe('#16a34a');

    $this->assertDatabaseHas('categories', [
        'name' => 'Renta',
        'type' => 'ingreso',
        'color' => '#16a34a',
    ]);
});
