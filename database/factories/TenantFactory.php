<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Rental\Domain\Models\Rental;
use App\Rental\Domain\Models\Tenant;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Tenant>
 */
final class TenantFactory extends Factory
{
    /**
     * @var class-string<Tenant>
     */
    protected $model = Tenant::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'rental_id' => Rental::factory(),
            'name' => fake()->name(),
            'email' => fake()->safeEmail(),
            'phone' => fake()->phoneNumber(),
            'since' => fake()->dateTimeBetween('-2 years', '-1 year')->format('Y-m-d'),
        ];
    }
}
