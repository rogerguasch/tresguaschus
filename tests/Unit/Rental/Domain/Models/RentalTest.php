<?php

declare(strict_types=1);

use App\Rental\Domain\Enums\PropertyType;
use App\Rental\Domain\Enums\RentalStatus;
use App\Rental\Domain\Models\Rental;
use App\Rental\Domain\Models\Tenant;
use Carbon\CarbonImmutable;
use Money\Money;

it('casts its attributes', function (): void {
    $rental = Rental::factory()->create([
        'type' => PropertyType::Atico,
        'rent' => Money::EUR(120_000),
        'deposit' => Money::EUR(240_000),
        'contract_start' => '2025-01-01',
        'status' => RentalStatus::Alquilado,
    ]);

    $fresh = $rental->fresh();

    expect($fresh->type)->toBe(PropertyType::Atico)
        ->and($fresh->status)->toBe(RentalStatus::Alquilado)
        ->and($fresh->rent->equals(Money::EUR(120_000)))->toBeTrue()
        ->and($fresh->deposit->equals(Money::EUR(240_000)))->toBeTrue()
        ->and($fresh->contract_start)->toBeInstanceOf(CarbonImmutable::class)
        ->and($fresh->contract_start->format('Y-m-d'))->toBe('2025-01-01');

    $this->assertDatabaseHas('rentals', ['id' => $rental->id, 'rent' => 120_000, 'deposit' => 240_000]);
});

it('has one tenant', function (): void {
    $rental = Rental::factory()->create();
    $tenant = Tenant::factory()->for($rental)->create();

    expect($rental->fresh()->tenant)->toBeInstanceOf(Tenant::class)
        ->and($rental->tenant->id)->toBe($tenant->id);
});

it('may be vacant without a tenant', function (): void {
    $rental = Rental::factory()->vacant()->create();

    expect($rental->status)->toBe(RentalStatus::Vacio)
        ->and($rental->contract_start)->toBeNull()
        ->and($rental->tenant)->toBeNull();
});
