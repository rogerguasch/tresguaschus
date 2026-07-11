<?php

declare(strict_types=1);

use App\Category\Domain\Models\Category;
use App\Category\Infrastructure\Ai\Agents\CategoryAgent;
use App\User\Domain\Models\User;
use Laravel\Ai\Exceptions\ProviderOverloadedException;

it('requires authentication', function (): void {
    $this->postJson(route('guaschnet.chat'), ['message' => 'Hola'])
        ->assertUnauthorized();
});

it('prompts the agent and returns its reply with the categories', function (): void {
    CategoryAgent::fake(['Aquí tienes tus categorías.']);

    Category::factory()->ingreso()->create(['name' => 'Renta']);

    $response = $this->actingAs(User::factory()->create())
        ->postJson(route('guaschnet.chat'), [
            'message' => 'Lista las categorías',
            'history' => [
                ['role' => 'assistant', 'text' => '¡Hola! Soy Guaschnet.'],
            ],
        ]);

    $response->assertOk()
        ->assertJsonPath('reply', 'Aquí tienes tus categorías.')
        ->assertJsonCount(1, 'categories')
        ->assertJsonPath('categories.0.name', 'Renta');

    CategoryAgent::assertPrompted('Lista las categorías');
});

it('replies gracefully when the provider is overloaded', function (): void {
    CategoryAgent::fake(function (): never {
        throw ProviderOverloadedException::forProvider('gemini');
    });

    $response = $this->actingAs(User::factory()->create())
        ->postJson(route('guaschnet.chat'), ['message' => 'Hola']);

    $response->assertOk()
        ->assertJsonPath('reply', 'El asistente está saturado ahora mismo. Prueba de nuevo en unos segundos.');
});

it('validates that a message is present', function (): void {
    $this->actingAs(User::factory()->create())
        ->postJson(route('guaschnet.chat'), ['message' => ''])
        ->assertJsonValidationErrors('message');
});

it('rejects an invalid history role', function (): void {
    CategoryAgent::fake(['ok']);

    $this->actingAs(User::factory()->create())
        ->postJson(route('guaschnet.chat'), [
            'message' => 'Hola',
            'history' => [
                ['role' => 'system', 'text' => 'nope'],
            ],
        ])
        ->assertJsonValidationErrors('history.0.role');
});
