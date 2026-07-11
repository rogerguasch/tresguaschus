<?php

declare(strict_types=1);

use App\Category\Domain\Models\Category;
use App\Category\Infrastructure\Ai\Tools\ListCategoriesTool;
use Laravel\Ai\Tools\Request;

it('returns the categories as json', function (): void {
    Category::factory()->ingreso()->create(['name' => 'Renta']);
    Category::factory()->gasto()->create(['name' => 'IBI']);

    $result = app(ListCategoriesTool::class)->handle(new Request);

    $data = json_decode((string) $result, true);

    expect($data['count'])->toBe(2)
        ->and(collect($data['categories'])->pluck('name')->all())
        ->toContain('Renta', 'IBI');
});

it('filters the categories by type', function (): void {
    Category::factory()->ingreso()->create(['name' => 'Renta']);
    Category::factory()->gasto()->create(['name' => 'IBI']);

    $result = app(ListCategoriesTool::class)->handle(new Request(['type' => 'gasto']));

    $data = json_decode((string) $result, true);

    expect($data['count'])->toBe(1)
        ->and($data['categories'][0]['name'])->toBe('IBI');
});
