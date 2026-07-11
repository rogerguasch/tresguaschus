<?php

declare(strict_types=1);

namespace App\Category\Infrastructure\Ai\Tools;

use App\Category\Application\Actions\UpdateCategoryAction;
use App\Category\Application\DTOs\CategoryData;
use App\Category\Domain\Enums\TransactionType;
use App\Category\Domain\Models\Category;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Laravel\Ai\Contracts\Tool;
use Laravel\Ai\Tools\Request;
use Stringable;

final readonly class UpdateCategoryTool implements Tool
{
    public function __construct(private UpdateCategoryAction $updateCategory) {}

    public function description(): Stringable|string
    {
        return 'Actualiza una categoría existente identificada por su id. '
            .'Solo cambia los campos que se indiquen (nombre, tipo o color); el resto se conserva. '
            .'Usa la herramienta de listado antes para conocer el id.';
    }

    public function handle(Request $request): Stringable|string
    {
        $category = Category::query()->find($request->integer('id'));

        if (! $category instanceof Category) {
            return (string) json_encode([
                'ok' => false,
                'errors' => ['No existe ninguna categoría con ese id.'],
            ], JSON_UNESCAPED_UNICODE);
        }

        $validator = Validator::make($request->all(), [
            'name' => ['sometimes', 'string', 'max:255', Rule::unique(Category::class)->ignore($category->id)->withoutTrashed()],
            'type' => ['sometimes', Rule::enum(TransactionType::class)],
            'color' => ['sometimes', 'string', 'regex:/^#[0-9a-fA-F]{6}$/'],
        ]);

        if ($validator->fails()) {
            return (string) json_encode([
                'ok' => false,
                'errors' => $validator->errors()->all(),
            ], JSON_UNESCAPED_UNICODE);
        }

        $this->updateCategory->handle($category, new CategoryData(
            $request->filled('name') ? $request->string('name')->value() : $category->name,
            $request->filled('type') ? TransactionType::from($request->string('type')->value()) : $category->type,
            $request->filled('color') ? $request->string('color')->value() : $category->color,
        ));

        $category->refresh();

        return (string) json_encode([
            'ok' => true,
            'category' => [
                'id' => $category->id,
                'name' => $category->name,
                'type' => $category->type->value,
                'color' => $category->color,
            ],
        ], JSON_UNESCAPED_UNICODE);
    }

    /**
     * @return array<string, mixed>
     */
    public function schema(JsonSchema $schema): array
    {
        return [
            'id' => $schema->integer()->required()->description('Id de la categoría a actualizar.'),
            'name' => $schema->string()->description('Nuevo nombre único de la categoría.'),
            'type' => $schema->string()
                ->enum([TransactionType::Ingreso->value, TransactionType::Gasto->value])
                ->description('Nuevo tipo: ingreso o gasto.'),
            'color' => $schema->string()->description('Nuevo color hexadecimal, p. ej. #16a34a.'),
        ];
    }
}
