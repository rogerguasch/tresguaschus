<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Category\Domain\Models\Category;
use App\Transaction\Domain\Models\Transaction;
use Illuminate\Database\Seeder;
use Money\Money;

final class TransactionSeeder extends Seeder
{
    public function run(): void
    {
        /** @var array<string, int> $categoryIds */
        $categoryIds = Category::query()->pluck('id', 'name')->all();

        foreach ($this->transactions() as $transaction) {
            Transaction::query()->updateOrCreate(
                [
                    'rental_id' => $transaction['rental_id'],
                    'date' => $transaction['date'],
                    'concept' => $transaction['concept'],
                ],
                [
                    'category_id' => $categoryIds[$transaction['category']],
                    'amount' => Money::EUR($transaction['amount'] * 100),
                    'method' => $transaction['method'],
                ],
            );
        }
    }

    /**
     * @return list<array{rental_id: string, date: string, category: string, concept: string, amount: int, method: string}>
     */
    private function transactions(): array
    {
        $transactions = [];

        // Monthly rent for active rentals (Jan–Jun 2026).
        foreach ($this->activeRentals() as $id => $rent) {
            for ($month = 1; $month <= 6; $month++) {
                $transactions[] = [
                    'rental_id' => $id,
                    'date' => sprintf('2026-%02d-05', $month),
                    'category' => 'Renta',
                    'concept' => 'Renta mensual',
                    'amount' => $rent,
                    'method' => 'Transferencia',
                ];
            }
        }

        // Rent for Nov–Dec 2025 (so the year filter has data).
        foreach (['r1' => 1200, 'r2' => 1450, 'r3' => 950, 'r4' => 1800] as $id => $rent) {
            foreach ([11, 12] as $month) {
                $transactions[] = [
                    'rental_id' => $id,
                    'date' => sprintf('2025-%02d-05', $month),
                    'category' => 'Renta',
                    'concept' => 'Renta mensual',
                    'amount' => $rent,
                    'method' => 'Transferencia',
                ];
            }
        }

        foreach ($this->expenses() as $expense) {
            $transactions[] = [
                'rental_id' => $expense[0],
                'date' => $expense[1],
                'category' => $expense[2],
                'concept' => $expense[3],
                'amount' => $expense[4],
                'method' => $expense[5],
            ];
        }

        return $transactions;
    }

    /**
     * @return array<string, int>
     */
    private function activeRentals(): array
    {
        return ['r1' => 1200, 'r2' => 1450, 'r3' => 950, 'r4' => 1800, 'r5' => 750];
    }

    /**
     * @return list<array{0: string, 1: string, 2: string, 3: string, 4: int, 5: string}>
     */
    private function expenses(): array
    {
        return [
            ['r1', '2026-01-12', 'Comunidad', 'Cuota comunidad', 85, 'Domiciliado'],
            ['r1', '2026-02-20', 'Reparaciones', 'Reparación caldera', 240, 'Transferencia'],
            ['r1', '2026-05-03', 'IBI', 'IBI anual (1er plazo)', 310, 'Domiciliado'],
            ['r2', '2026-01-18', 'Comunidad', 'Cuota comunidad', 110, 'Domiciliado'],
            ['r2', '2026-03-09', 'Suministros', 'Derrama ascensor', 180, 'Transferencia'],
            ['r2', '2026-04-27', 'Reparaciones', 'Fontanería baño', 150, 'Transferencia'],
            ['r3', '2026-02-14', 'Seguro', 'Seguro del local', 420, 'Domiciliado'],
            ['r3', '2026-06-01', 'Reparaciones', 'Pintura fachada', 600, 'Transferencia'],
            ['r4', '2026-01-30', 'Comunidad', 'Cuota comunidad', 160, 'Domiciliado'],
            ['r4', '2026-03-22', 'Gestión', 'Honorarios gestoría', 95, 'Transferencia'],
            ['r4', '2026-05-16', 'Reparaciones', 'Aire acondicionado', 380, 'Tarjeta'],
            ['r5', '2026-02-08', 'Suministros', 'Alta luz y agua', 120, 'Transferencia'],
            ['r5', '2026-04-11', 'Comunidad', 'Cuota comunidad', 60, 'Domiciliado'],
            ['r6', '2026-03-05', 'Reparaciones', 'Acondicionamiento piso', 540, 'Transferencia'],
            ['r6', '2026-05-19', 'Gestión', 'Publicación anuncio', 75, 'Tarjeta'],
            ['r2', '2025-12-10', 'Reparaciones', 'Cambio cerradura', 200, 'Transferencia'],
            ['r1', '2025-11-15', 'Comunidad', 'Cuota comunidad', 85, 'Domiciliado'],
        ];
    }
}
