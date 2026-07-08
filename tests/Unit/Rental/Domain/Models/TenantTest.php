<?php

declare(strict_types=1);

use App\Rental\Domain\Models\Rental;
use App\Rental\Domain\Models\Tenant;
use Carbon\CarbonImmutable;

it('belongs to a rental', function (): void {
    $rental = Rental::factory()->create();
    $tenant = Tenant::factory()->for($rental)->create();

    expect($tenant->rental)->toBeInstanceOf(Rental::class)
        ->and($tenant->rental->id)->toBe($rental->id);
});

it('casts the since date', function (): void {
    $tenant = Tenant::factory()->create(['since' => '2024-09-01']);

    expect($tenant->fresh()->since)->toBeInstanceOf(CarbonImmutable::class)
        ->and($tenant->since->format('Y-m-d'))->toBe('2024-09-01');
});
