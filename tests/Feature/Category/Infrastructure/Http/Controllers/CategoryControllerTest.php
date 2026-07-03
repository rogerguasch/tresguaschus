<?php

declare(strict_types=1);

use App\Category\Domain\Enums\TransactionType;
use App\Category\Domain\Models\Category;
use App\User\Domain\Models\User;

it('requires authentication to store', function (): void {
    $response = $this->post(route('categories.store'), [
        'name' => 'Renta',
        'type' => 'ingreso',
        'color' => '#16a34a',
    ]);

    $response->assertRedirectToRoute('login');

    expect(Category::query()->count())->toBe(0);
});

it('may store a category', function (): void {
    $response = $this->actingAs(User::factory()->create())
        ->fromRoute('rentia')
        ->post(route('categories.store'), [
            'name' => 'Renta',
            'type' => 'ingreso',
            'color' => '#16a34a',
        ]);

    $response->assertRedirect(route('rentia'));

    $category = Category::query()->firstOrFail();

    expect($category->name)->toBe('Renta')
        ->and($category->type)->toBe(TransactionType::Ingreso)
        ->and($category->color)->toBe('#16a34a');
});

it('requires a name', function (): void {
    $response = $this->actingAs(User::factory()->create())
        ->fromRoute('rentia')
        ->post(route('categories.store'), [
            'type' => 'ingreso',
            'color' => '#16a34a',
        ]);

    $response->assertSessionHasErrors('name');
});

it('requires a unique name', function (): void {
    Category::factory()->create(['name' => 'Renta']);

    $response = $this->actingAs(User::factory()->create())
        ->fromRoute('rentia')
        ->post(route('categories.store'), [
            'name' => 'Renta',
            'type' => 'ingreso',
            'color' => '#16a34a',
        ]);

    $response->assertSessionHasErrors('name');
});

it('requires a valid type', function (): void {
    $response = $this->actingAs(User::factory()->create())
        ->fromRoute('rentia')
        ->post(route('categories.store'), [
            'name' => 'Renta',
            'type' => 'invalid',
            'color' => '#16a34a',
        ]);

    $response->assertSessionHasErrors('type');
});

it('requires a valid hex color', function (): void {
    $response = $this->actingAs(User::factory()->create())
        ->fromRoute('rentia')
        ->post(route('categories.store'), [
            'name' => 'Renta',
            'type' => 'ingreso',
            'color' => 'red',
        ]);

    $response->assertSessionHasErrors('color');
});

it('may update a category', function (): void {
    $category = Category::factory()->ingreso()->create(['name' => 'Renta']);

    $response = $this->actingAs(User::factory()->create())
        ->fromRoute('rentia')
        ->patch(route('categories.update', $category), [
            'name' => 'Comunidad',
            'type' => 'gasto',
            'color' => '#4f46e5',
        ]);

    $response->assertRedirect(route('rentia'));

    expect($category->fresh())
        ->name->toBe('Comunidad')
        ->type->toBe(TransactionType::Gasto)
        ->color->toBe('#4f46e5');
});

it('allows keeping the same name on update', function (): void {
    $category = Category::factory()->ingreso()->create(['name' => 'Renta']);

    $response = $this->actingAs(User::factory()->create())
        ->fromRoute('rentia')
        ->patch(route('categories.update', $category), [
            'name' => 'Renta',
            'type' => 'ingreso',
            'color' => '#22c55e',
        ]);

    $response->assertRedirect(route('rentia'))
        ->assertSessionHasNoErrors();

    expect($category->fresh()->color)->toBe('#22c55e');
});

it('may destroy a category', function (): void {
    $category = Category::factory()->create();

    $response = $this->actingAs(User::factory()->create())
        ->fromRoute('rentia')
        ->delete(route('categories.destroy', $category));

    $response->assertRedirect(route('rentia'));

    expect($category->fresh())->toBeNull();
});
