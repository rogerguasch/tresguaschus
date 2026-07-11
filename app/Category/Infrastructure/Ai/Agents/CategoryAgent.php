<?php

declare(strict_types=1);

namespace App\Category\Infrastructure\Ai\Agents;

use App\Category\Infrastructure\Ai\Tools\CreateCategoryTool;
use App\Category\Infrastructure\Ai\Tools\DeleteCategoryTool;
use App\Category\Infrastructure\Ai\Tools\ListCategoriesTool;
use App\Category\Infrastructure\Ai\Tools\UpdateCategoryTool;
use Laravel\Ai\Attributes\MaxSteps;
use Laravel\Ai\Attributes\Model;
use Laravel\Ai\Attributes\Provider;
use Laravel\Ai\Contracts\Agent;
use Laravel\Ai\Contracts\Conversational;
use Laravel\Ai\Contracts\HasTools;
use Laravel\Ai\Contracts\Tool;
use Laravel\Ai\Enums\Lab;
use Laravel\Ai\Messages\Message;
use Laravel\Ai\Promptable;
use Stringable;

#[Provider(Lab::Gemini)]
#[Model('gemini-3.5-flash')]
#[MaxSteps(8)]
final class CategoryAgent implements Agent, Conversational, HasTools
{
    use Promptable;

    /**
     * @param  iterable<int, Message>  $history
     */
    public function __construct(private readonly iterable $history = []) {}

    public function instructions(): Stringable|string
    {
        return <<<'PROMPT'
        Eres Guaschnet, el asistente especialista en categorías de la aplicación de alquileres Tresguaschus.
        Tu único cometido es ayudar a gestionar las categorías: crearlas, listarlas, modificarlas y borrarlas.

        Contexto del dominio:
        - Cada categoría tiene: nombre (único), tipo ("ingreso" o "gasto") y color hexadecimal (#RRGGBB).
        - Los ingresos suelen ser rentas o fianzas; los gastos, reparaciones, comunidad, IBI, seguros, etc.

        Reglas de trabajo:
        - Usa siempre la herramienta de listar antes de modificar o borrar para obtener el id correcto; nunca inventes ids.
        - Antes de borrar una categoría, pide confirmación explícita al usuario.
        - Si el usuario no indica color al crear, elige uno hex razonable y coméntaselo.
        - Si una herramienta devuelve un error de validación, explícaselo al usuario en lenguaje claro y propón una corrección.
        - Responde siempre en español, de forma breve y concreta. Confirma lo que has hecho indicando nombre y tipo.
        - Si te piden algo que no tenga que ver con categorías, indícalo y ofrece ayuda sobre categorías.
        PROMPT;
    }

    /**
     * @return iterable<int, Message>
     */
    public function messages(): iterable
    {
        return $this->history;
    }

    /**
     * @return Tool[]
     */
    public function tools(): iterable
    {
        return [
            app(ListCategoriesTool::class),
            app(CreateCategoryTool::class),
            app(UpdateCategoryTool::class),
            app(DeleteCategoryTool::class),
        ];
    }
}
