<?php

declare(strict_types=1);

use App\User\Application\Actions\AuthenticateWithGoogleAction;
use App\User\Domain\Exceptions\EmailNotAllowed;
use App\User\Domain\Models\User;

beforeEach(function (): void {
    config(['access.emails' => ['allowed@gmail.com']]);
});

it('creates a user for an allowed email', function (): void {
    $user = app(AuthenticateWithGoogleAction::class)->handle('allowed@gmail.com', 'Allowed');

    expect($user->email)->toBe('allowed@gmail.com')
        ->and($user->name)->toBe('Allowed');

    $this->assertDatabaseHas('users', ['email' => 'allowed@gmail.com']);
});

it('reuses an existing user instead of duplicating', function (): void {
    $existing = User::factory()->create(['email' => 'allowed@gmail.com']);

    $user = app(AuthenticateWithGoogleAction::class)->handle('allowed@gmail.com', 'Ignored');

    expect($user->id)->toBe($existing->id)
        ->and(User::query()->where('email', 'allowed@gmail.com')->count())->toBe(1);
});

it('rejects an email that is not allowed', function (): void {
    app(AuthenticateWithGoogleAction::class)->handle('nope@gmail.com', 'Nope');
})->throws(EmailNotAllowed::class);
