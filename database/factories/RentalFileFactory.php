<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Rental\Domain\Models\Rental;
use App\Rental\Domain\Models\RentalFile;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<RentalFile>
 */
final class RentalFileFactory extends Factory
{
    /**
     * @var class-string<RentalFile>
     */
    protected $model = RentalFile::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->word().'.pdf';

        return [
            'rental_id' => Rental::factory(),
            'name' => $name,
            'kind' => 'Documento',
            'path' => 'rental-files/'.fake()->uuid().'.pdf',
            'mime_type' => 'application/pdf',
            'size' => fake()->numberBetween(50_000, 2_000_000),
        ];
    }
}
