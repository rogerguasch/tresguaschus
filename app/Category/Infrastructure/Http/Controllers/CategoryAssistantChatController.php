<?php

declare(strict_types=1);

namespace App\Category\Infrastructure\Http\Controllers;

use App\Category\Domain\Models\Category;
use App\Category\Infrastructure\Ai\Agents\CategoryAgent;
use App\Category\Infrastructure\Http\Requests\CategoryAssistantChatRequest;
use App\Category\Infrastructure\Http\Resources\CategoryResource;
use Illuminate\Http\JsonResponse;
use Laravel\Ai\Exceptions\FailoverableException;
use Throwable;

final readonly class CategoryAssistantChatController
{
    public function __invoke(CategoryAssistantChatRequest $request): JsonResponse
    {
        try {
            // Gemini can return transient "overloaded" errors; retry a few
            // times with backoff before giving up.
            $reply = retry(
                times: 3,
                callback: fn (): string => (new CategoryAgent($request->history()))
                    ->prompt($request->message())->text,
                sleepMilliseconds: 800,
                when: fn (Throwable $e): bool => $e instanceof FailoverableException,
            );
        } catch (FailoverableException) {
            $reply = 'El asistente está saturado ahora mismo. Prueba de nuevo en unos segundos.';
        }

        return response()->json([
            'reply' => $reply,
            'categories' => CategoryResource::collection(
                Category::query()->orderBy('id')->get()
            )->resolve(),
        ]);
    }
}
