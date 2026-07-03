<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Category\Domain\Enums\TransactionType;
use App\Category\Domain\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Category>
 */
final class CategoryFactory extends Factory
{
    /**
     * @var class-string<Category>
     */
    protected $model = Category::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->unique()->words(2, true),
            'type' => fake()->randomElement(TransactionType::cases()),
            'color' => fake()->hexColor(),
        ];
    }

    public function ingreso(): self
    {
        return $this->state(fn (array $attributes): array => [
            'type' => TransactionType::Ingreso,
        ]);
    }

    public function gasto(): self
    {
        return $this->state(fn (array $attributes): array => [
            'type' => TransactionType::Gasto,
        ]);
    }
}
