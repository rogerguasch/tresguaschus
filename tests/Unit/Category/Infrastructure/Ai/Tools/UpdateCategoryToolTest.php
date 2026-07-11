<?php

declare(strict_types=1);

use App\Category\Domain\Models\Category;
use App\Category\Infrastructure\Ai\Tools\UpdateCategoryTool;
use Laravel\Ai\Tools\Request;

it('updates only the provided fields', function (): void {
    $category = Category::factory()->gasto()->create([
        'name' => 'Suministros',
        'color' => '#eab308',
    ]);

    $result = app(UpdateCategoryTool::class)->handle(new Request([
        'id' => $category->id,
        'color' => '#2563eb',
    ]));

    $data = json_decode((string) $result, true);

    expect($data['ok'])->toBeTrue()
        ->and($data['category']['color'])->toBe('#2563eb')
        ->and($data['category']['name'])->toBe('Suministros');

    $this->assertDatabaseHas('categories', [
        'id' => $category->id,
        'name' => 'Suministros',
        'type' => 'gasto',
        'color' => '#2563eb',
    ]);
});

it('reports an error when the category does not exist', function (): void {
    $result = app(UpdateCategoryTool::class)->handle(new Request([
        'id' => 999,
        'name' => 'Nueva',
    ]));

    $data = json_decode((string) $result, true);

    expect($data['ok'])->toBeFalse()
        ->and($data['errors'])->not->toBeEmpty();
});
