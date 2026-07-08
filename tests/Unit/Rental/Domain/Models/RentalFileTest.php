<?php

declare(strict_types=1);

use App\Rental\Domain\Models\Rental;
use App\Rental\Domain\Models\RentalFile;

it('belongs to a rental', function (): void {
    $rental = Rental::factory()->create();
    $file = RentalFile::factory()->for($rental)->create();

    expect($file->rental)->toBeInstanceOf(Rental::class)
        ->and($file->rental->id)->toBe($rental->id);
});

it('is exposed through the rental files relation', function (): void {
    $rental = Rental::factory()->create();
    RentalFile::factory()->for($rental)->count(2)->create();

    expect($rental->fresh()->files)->toHaveCount(2);
});
