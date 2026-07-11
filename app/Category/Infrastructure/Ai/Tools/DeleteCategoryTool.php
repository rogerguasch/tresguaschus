<?php

declare(strict_types=1);

namespace App\Category\Infrastructure\Ai\Tools;

use App\Category\Application\Actions\DeleteCategoryAction;
use App\Category\Domain\Models\Category;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Ai\Contracts\Tool;
use Laravel\Ai\Tools\Request;
use Stringable;

final readonly class DeleteCategoryTool implements Tool
{
    public function __construct(private DeleteCategoryAction $deleteCategory) {}

    public function description(): Stringable|string
    {
        return 'Borra una categoría existente identificada por su id. '
            .'Confirma con el usuario antes de borrar y usa la herramienta de listado para conocer el id.';
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

        $name = $category->name;

        $this->deleteCategory->handle($category);

        return (string) json_encode([
            'ok' => true,
            'deleted' => ['id' => $request->integer('id'), 'name' => $name],
        ], JSON_UNESCAPED_UNICODE);
    }

    /**
     * @return array<string, mixed>
     */
    public function schema(JsonSchema $schema): array
    {
        return [
            'id' => $schema->integer()->required()->description('Id de la categoría a borrar.'),
        ];
    }
}
