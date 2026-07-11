<?php

declare(strict_types=1);

namespace App\Category\Infrastructure\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Laravel\Ai\Messages\Message;

final class CategoryAssistantChatRequest extends FormRequest
{
    /**
     * @return array<string, array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'message' => ['required', 'string', 'max:2000'],
            'history' => ['sometimes', 'array', 'max:40'],
            'history.*.role' => ['required', Rule::in(['user', 'assistant'])],
            'history.*.text' => ['required', 'string'],
        ];
    }

    /**
     * The prior conversation turns, as AI SDK messages.
     *
     * @return list<Message>
     */
    public function history(): array
    {
        /** @var list<array{role: string, text: string}> $history */
        $history = $this->array('history');

        return array_map(
            static fn (array $turn): Message => new Message($turn['role'], $turn['text']),
            $history,
        );
    }

    public function message(): string
    {
        return $this->string('message')->value();
    }
}
