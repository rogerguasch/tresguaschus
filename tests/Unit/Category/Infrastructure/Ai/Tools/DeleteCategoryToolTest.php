<?php

declare(strict_types=1);

use App\Category\Domain\Models\Category;
use App\Category\Infrastructure\Ai\Tools\DeleteCategoryTool;
use Laravel\Ai\Tools\Request;

it('soft deletes a category', function (): void {
    $category = Category::factory()->create(['name' => 'Otros gastos']);

    $result = app(DeleteCategoryTool::class)->handle(new Request([
        'id' => $category->id,
    ]));

    $data = json_decode((string) $result, true);

    expect($data['ok'])->toBeTrue()
        ->and($data['deleted']['name'])->toBe('Otros gastos');

    $this->assertSoftDeleted($category);
});

it('reports an error when the category does not exist', function (): void {
    $result = app(DeleteCategoryTool::class)->handle(new Request(['id' => 999]));

    $data = json_decode((string) $result, true);

    expect($data['ok'])->toBeFalse()
        ->and($data['errors'])->not->toBeEmpty();
});
