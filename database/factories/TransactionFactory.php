<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Category\Domain\Models\Category;
use App\Rental\Domain\Models\Rental;
use App\Transaction\Domain\Models\Transaction;
use Illuminate\Database\Eloquent\Factories\Factory;
use Money\Money;

/**
 * @extends Factory<Transaction>
 */
final class TransactionFactory extends Factory
{
    /**
     * @var class-string<Transaction>
     */
    protected $model = Transaction::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'rental_id' => Rental::factory(),
            'category_id' => Category::factory(),
            'date' => fake()->dateTimeBetween('-1 year')->format('Y-m-d'),
            'concept' => fake()->sentence(3),
            'amount' => Money::EUR(fake()->numberBetween(5_000, 200_000)),
            'method' => fake()->randomElement([
                'Transferencia',
                'Domiciliado',
                'Tarjeta',
                'Efectivo',
                'Bizum',
            ]),
        ];
    }
}
