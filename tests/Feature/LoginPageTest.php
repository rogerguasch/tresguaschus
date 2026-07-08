<?php

declare(strict_types=1);

use App\User\Domain\Models\User;

it('shows the login page to guests', function (): void {
    $this->get('/')
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('login'));
});

it('sends authenticated users from the root to the dashboard', function (): void {
    $this->actingAs(User::factory()->create())
        ->get('/')
        ->assertRedirect(route('dashboard'));
});

it('gates the dashboard behind authentication', function (): void {
    $this->get(route('dashboard'))->assertRedirect('/');
});
