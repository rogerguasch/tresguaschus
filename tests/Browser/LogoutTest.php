<?php

declare(strict_types=1);

use App\User\Domain\Models\User;

it('logs out from the sidebar', function (): void {
    $this->actingAs(User::factory()->create());

    $page = visit(route('dashboard'));

    $page->assertNoJavaScriptErrors()
        ->click('[title="Cerrar sesión"]')
        ->assertSee('Continuar con Google')
        ->assertNoJavaScriptErrors();

    $this->assertGuest();
});
