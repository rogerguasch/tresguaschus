<?php

declare(strict_types=1);

use App\Category\Domain\Models\Category;

it('renders the Rentia single-page app', function (): void {
    $this->get(route('rentia'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('rentia'));
});

it('passes categories from the backend to the Rentia page', function (): void {
    $category = Category::factory()->ingreso()->create([
        'name' => 'Renta',
        'color' => '#16a34a',
    ]);

    $this->get(route('rentia'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('rentia')
            ->has('categories', 1)
            ->where('categories.0.id', (string) $category->id)
            ->where('categories.0.name', 'Renta')
            ->where('categories.0.type', 'ingreso')
            ->where('categories.0.color', '#16a34a'));
});
