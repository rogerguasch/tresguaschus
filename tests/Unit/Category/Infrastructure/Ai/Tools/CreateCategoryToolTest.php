<?php

declare(strict_types=1);

use App\Category\Domain\Models\Category;
use App\Category\Infrastructure\Ai\Tools\CreateCategoryTool;
use Laravel\Ai\Tools\Request;

it('creates a category', function (): void {
    $result = app(CreateCategoryTool::class)->handle(new Request([
        'name' => 'Basuras',
        'type' => 'gasto',
        'color' => '#123abc',
    ]));

    $data = json_decode((string) $result, true);

    expect($data['ok'])->toBeTrue()
        ->and($data['category']['name'])->toBe('Basuras');

    $this->assertDatabaseHas('categories', [
        'name' => 'Basuras',
        'type' => 'gasto',
        'color' => '#123abc',
    ]);
});

it('defaults the color when none is given', function (): void {
    $result = app(CreateCategoryTool::class)->handle(new Request([
        'name' => 'Fianza',
        'type' => 'ingreso',
    ]));

    $data = json_decode((string) $result, true);

    expect($data['ok'])->toBeTrue()
        ->and($data['category']['color'])->toBe('#71717a');
});

it('reports a validation error for a duplicate name', function (): void {
    Category::factory()->create(['name' => 'Renta']);

    $result = app(CreateCategoryTool::class)->handle(new Request([
        'name' => 'Renta',
        'type' => 'ingreso',
    ]));

    $data = json_decode((string) $result, true);

    expect($data['ok'])->toBeFalse()
        ->and($data['errors'])->not->toBeEmpty();

    expect(Category::query()->where('name', 'Renta')->count())->toBe(1);
});
