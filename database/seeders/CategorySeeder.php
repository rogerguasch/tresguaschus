<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Category\Domain\Enums\TransactionType;
use App\Category\Domain\Models\Category;
use Illuminate\Database\Seeder;

final class CategorySeeder extends Seeder
{
    public function run(): void
    {
        foreach ($this->categories() as $category) {
            Category::query()->updateOrCreate(
                ['name' => $category['name']],
                $category,
            );
        }
    }

    /**
     * @return list<array{name: string, type: TransactionType, color: string}>
     */
    private function categories(): array
    {
        return [
            ['name' => 'Renta', 'type' => TransactionType::Ingreso, 'color' => '#16a34a'],
            ['name' => 'Fianza', 'type' => TransactionType::Ingreso, 'color' => '#0d9488'],
            ['name' => 'Otros ingresos', 'type' => TransactionType::Ingreso, 'color' => '#22c55e'],
            ['name' => 'Reparaciones', 'type' => TransactionType::Gasto, 'color' => '#ef4444'],
            ['name' => 'Comunidad', 'type' => TransactionType::Gasto, 'color' => '#4f46e5'],
            ['name' => 'IBI', 'type' => TransactionType::Gasto, 'color' => '#ea580c'],
            ['name' => 'Seguro', 'type' => TransactionType::Gasto, 'color' => '#0891b2'],
            ['name' => 'Suministros', 'type' => TransactionType::Gasto, 'color' => '#eab308'],
            ['name' => 'Gestión', 'type' => TransactionType::Gasto, 'color' => '#9333ea'],
            ['name' => 'Otros gastos', 'type' => TransactionType::Gasto, 'color' => '#71717a'],
        ];
    }
}
