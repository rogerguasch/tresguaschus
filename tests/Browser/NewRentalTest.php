<?php

declare(strict_types=1);

use App\Rental\Domain\Enums\RentalStatus;
use App\Rental\Domain\Models\Rental;
use App\User\Domain\Models\User;

beforeEach(fn () => $this->actingAs(User::factory()->create()));

it('creates a rental from the form', function (): void {
    $page = visit(route('dashboard'));

    $page->assertNoJavaScriptErrors()
        ->click('Alquileres')
        ->click('Nuevo alquiler')
        ->fill('input[placeholder="Calle, número, piso"]', 'Calle Nueva 1')
        ->fill('input[placeholder="Madrid"]', 'Valencia')
        ->fill('input[placeholder="1200"]', '900')
        ->fill('input[placeholder="2400"]', '1800')
        ->click('Dar de alta')
        ->assertSee('Alquiler dado de alta')
        ->assertNoJavaScriptErrors();

    $rental = Rental::query()->firstOrFail();

    expect($rental->address)->toBe('Calle Nueva 1')
        ->and($rental->city)->toBe('Valencia')
        ->and($rental->status)->toBe(RentalStatus::Vacio);
});
