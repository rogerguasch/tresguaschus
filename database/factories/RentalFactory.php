<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Rental\Domain\Enums\PropertyType;
use App\Rental\Domain\Enums\RentalStatus;
use App\Rental\Domain\Models\Rental;
use Illuminate\Database\Eloquent\Factories\Factory;
use Money\Money;

/**
 * @extends Factory<Rental>
 */
final class RentalFactory extends Factory
{
    /**
     * @var class-string<Rental>
     */
    protected $model = Rental::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'address' => fake()->streetAddress(),
            'city' => fake()->randomElement(['Madrid', 'Barcelona', 'Sevilla', 'Valencia', 'Oviedo']),
            'type' => fake()->randomElement(PropertyType::cases()),
            'rent' => Money::EUR(fake()->numberBetween(50_000, 200_000)),
            'deposit' => Money::EUR(fake()->numberBetween(0, 400_000)),
            'contract_start' => fake()->dateTimeBetween('-2 years', '-1 year')->format('Y-m-d'),
            'contract_end' => fake()->dateTimeBetween('+1 year', '+2 years')->format('Y-m-d'),
            'status' => RentalStatus::Alquilado,
        ];
    }

    public function vacant(): self
    {
        return $this->state(fn (array $attributes): array => [
            'contract_start' => null,
            'contract_end' => null,
            'status' => RentalStatus::Vacio,
        ]);
    }
}
