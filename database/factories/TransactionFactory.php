<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Category\Domain\Models\Category;
use App\Transaction\Domain\Models\Transaction;
use Illuminate\Database\Eloquent\Factories\Factory;

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
            'rental_id' => 'r'.fake()->numberBetween(1, 6),
            'category_id' => Category::factory(),
            'date' => fake()->dateTimeBetween('-1 year')->format('Y-m-d'),
            'concept' => fake()->sentence(3),
            'amount' => fake()->numberBetween(50, 2000),
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
