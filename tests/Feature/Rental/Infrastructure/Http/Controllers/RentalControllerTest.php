<?php

declare(strict_types=1);

use App\Rental\Domain\Enums\RentalStatus;
use App\Rental\Domain\Models\Rental;
use App\Rental\Domain\Models\Tenant;
use Money\Money;

/**
 * @param  array<string, mixed>  $overrides
 * @return array<string, mixed>
 */
function validRental(array $overrides = []): array
{
    return array_merge([
        'address' => 'Gran Vía 42, 3ºB',
        'city' => 'Madrid',
        'type' => 'Piso',
        'rent' => '1200',
        'deposit' => '2400',
        'contract_start' => '2024-09-01',
        'contract_end' => '2026-08-31',
        'tenant_name' => 'Laura Giménez',
        'tenant_email' => 'laura@email.com',
        'tenant_phone' => '+34 612 345 678',
    ], $overrides);
}

it('stores a rental with its tenant', function (): void {
    $response = $this->fromRoute('dashboard')
        ->post(route('rentals.store'), validRental());

    $response->assertRedirect(route('dashboard'));

    $rental = Rental::query()->firstOrFail();

    expect($rental->status)->toBe(RentalStatus::Alquilado)
        ->and($rental->rent->equals(Money::EUR(120_000)))->toBeTrue()
        ->and($rental->deposit->equals(Money::EUR(240_000)))->toBeTrue()
        ->and($rental->tenant->name)->toBe('Laura Giménez')
        ->and($rental->tenant->since->format('Y-m-d'))->toBe('2024-09-01');
});

it('stores a vacant rental without a tenant', function (): void {
    $response = $this->fromRoute('dashboard')
        ->post(route('rentals.store'), validRental([
            'tenant_name' => '',
            'tenant_email' => '',
            'tenant_phone' => '',
            'contract_start' => '',
            'contract_end' => '',
            'deposit' => '0',
        ]));

    $response->assertRedirect(route('dashboard'));

    $rental = Rental::query()->firstOrFail();

    expect($rental->status)->toBe(RentalStatus::Vacio)
        ->and($rental->contract_start)->toBeNull()
        ->and($rental->tenant)->toBeNull()
        ->and(Tenant::query()->count())->toBe(0);
});

it('requires the core rental fields', function (string $field): void {
    $response = $this->fromRoute('dashboard')
        ->post(route('rentals.store'), validRental([$field => '']));

    $response->assertSessionHasErrors($field);
})->with(['address', 'city', 'rent']);

it('requires a positive rent', function (): void {
    $response = $this->fromRoute('dashboard')
        ->post(route('rentals.store'), validRental(['rent' => '0']));

    $response->assertSessionHasErrors('rent');
});
