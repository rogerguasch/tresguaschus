<?php

declare(strict_types=1);

namespace App\Category\Infrastructure\Ai\Tools;

use App\Category\Application\Actions\CreateCategoryAction;
use App\Category\Application\DTOs\CategoryData;
use App\Category\Domain\Enums\TransactionType;
use App\Category\Domain\Models\Category;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Laravel\Ai\Contracts\Tool;
use Laravel\Ai\Tools\Request;
use Stringable;

final readonly class CreateCategoryTool implements Tool
{
    public function __construct(private CreateCategoryAction $createCategory) {}

    public function description(): Stringable|string
    {
        return 'Crea una nueva categoría de ingreso o gasto. El nombre debe ser único. '
            .'El color es un código hexadecimal como #16a34a; si no se indica se usa un gris neutro.';
    }

    public function handle(Request $request): Stringable|string
    {
        $validator = Validator::make($request->all(), [
            'name' => ['required', 'string', 'max:255', Rule::unique(Category::class)->withoutTrashed()],
            'type' => ['required', Rule::enum(TransactionType::class)],
            'color' => ['nullable', 'string', 'regex:/^#[0-9a-fA-F]{6}$/'],
        ]);

        if ($validator->fails()) {
            return (string) json_encode([
                'ok' => false,
                'errors' => $validator->errors()->all(),
            ], JSON_UNESCAPED_UNICODE);
        }

        $category = $this->createCategory->handle(new CategoryData(
            $request->string('name')->value(),
            TransactionType::from($request->string('type')->value()),
            $request->filled('color') ? $request->string('color')->value() : '#71717a',
        ));

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
            'name' => $schema->string()->required()->description('Nombre único de la categoría.'),
            'type' => $schema->string()
                ->enum([TransactionType::Ingreso->value, TransactionType::Gasto->value])
                ->required()
                ->description('Tipo de categoría: ingreso o gasto.'),
            'color' => $schema->string()->description('Color hexadecimal, p. ej. #16a34a.'),
        ];
    }
}
