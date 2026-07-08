<?php

declare(strict_types=1);

use App\Category\Application\Actions\FindCategoryByNameAction;
use App\Category\Domain\Models\Category;
use Illuminate\Database\Eloquent\ModelNotFoundException;

it('finds a category by name', function (): void {
    $category = Category::factory()->create(['name' => 'Renta']);

    $found = app(FindCategoryByNameAction::class)->handle('Renta');

    expect($found->id)->toBe($category->id);
});

it('fails when no category matches the name', function (): void {
    app(FindCategoryByNameAction::class)->handle('Inexistente');
})->throws(ModelNotFoundException::class);

it('ignores soft-deleted categories', function (): void {
    Category::factory()->create(['name' => 'Renta'])->delete();

    app(FindCategoryByNameAction::class)->handle('Renta');
})->throws(ModelNotFoundException::class);
