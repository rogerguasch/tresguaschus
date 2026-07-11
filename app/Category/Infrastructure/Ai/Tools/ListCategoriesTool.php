<?php

declare(strict_types=1);

namespace App\Category\Infrastructure\Ai\Tools;

use App\Category\Application\Actions\ListCategoriesAction;
use App\Category\Domain\Enums\TransactionType;
use App\Category\Domain\Models\Category;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Ai\Contracts\Tool;
use Laravel\Ai\Tools\Request;
use Stringable;

final readonly class ListCategoriesTool implements Tool
{
    public function __construct(private ListCategoriesAction $listCategories) {}

    public function description(): Stringable|string
    {
        return 'Lista las categorías existentes con su id, nombre, tipo (ingreso o gasto) y color. '
            .'Úsalo siempre antes de modificar o borrar una categoría para obtener el id correcto. '
            .'Puedes filtrar opcionalmente por tipo.';
    }

    public function handle(Request $request): Stringable|string
    {
        $type = $request->filled('type')
            ? TransactionType::from($request->string('type')->value())
            : null;

        $categories = $this->listCategories->handle($type)
            ->map(fn (Category $category): array => [
                'id' => $category->id,
                'name' => $category->name,
                'type' => $category->type->value,
                'color' => $category->color,
            ])
            ->all();

        return (string) json_encode([
            'count' => count($categories),
            'categories' => $categories,
        ], JSON_UNESCAPED_UNICODE);
    }

    /**
     * @return array<string, mixed>
     */
    public function schema(JsonSchema $schema): array
    {
        return [
            'type' => $schema->string()
                ->enum([TransactionType::Ingreso->value, TransactionType::Gasto->value])
                ->description('Filtro opcional por tipo de categoría.'),
        ];
    }
}
