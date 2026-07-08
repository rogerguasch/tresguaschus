<?php

declare(strict_types=1);

use App\Category\Domain\Models\Category;
use App\User\Domain\Models\User;

beforeEach(fn () => $this->actingAs(User::factory()->create()));

it('surfaces a unique-name error in the category modal', function (): void {
    Category::factory()->gasto()->create(['name' => 'Comunidad']);

    $page = visit(route('dashboard'));

    $page->assertNoJavaScriptErrors()
        ->click('Configuración')
        ->click('Nueva categoría')
        ->fill('input[placeholder="Ej: Mantenimiento"]', 'Comunidad')
        ->click('Guardar')
        ->assertSee('has already been taken')
        ->assertNoJavaScriptErrors();

    expect(Category::query()->where('name', 'Comunidad')->count())->toBe(1);
});

it('creates a category from the modal', function (): void {
    $page = visit(route('dashboard'));

    $page->click('Configuración')
        ->click('Nueva categoría')
        ->fill('input[placeholder="Ej: Mantenimiento"]', 'Mantenimiento')
        ->click('Guardar')
        ->assertSee('Categoría creada')
        ->assertNoJavaScriptErrors();

    expect(Category::query()->where('name', 'Mantenimiento')->exists())->toBeTrue();
});
