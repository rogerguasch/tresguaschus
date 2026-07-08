<?php

declare(strict_types=1);

use App\User\Application\Actions\AuthenticateWithGoogleAction;
use App\User\Domain\Exceptions\EmailNotAllowed;
use App\User\Domain\Models\User;

beforeEach(function (): void {
    config(['access.emails' => ['allowed@gmail.com']]);
});

it('creates a user for an allowed email', function (): void {
    $user = app(AuthenticateWithGoogleAction::class)
        ->handle('allowed@gmail.com', 'Allowed', 'https://lh3.googleusercontent.com/a/pic');

    expect($user->email)->toBe('allowed@gmail.com')
        ->and($user->name)->toBe('Allowed')
        ->and($user->avatar)->toBe('https://lh3.googleusercontent.com/a/pic');

    $this->assertDatabaseHas('users', ['email' => 'allowed@gmail.com']);
});

it('reuses an existing user and refreshes name and avatar', function (): void {
    $existing = User::factory()->create(['email' => 'allowed@gmail.com', 'avatar' => null]);

    $user = app(AuthenticateWithGoogleAction::class)
        ->handle('allowed@gmail.com', 'Fresh Name', 'https://lh3.googleusercontent.com/a/new');

    expect($user->id)->toBe($existing->id)
        ->and($user->name)->toBe('Fresh Name')
        ->and($user->avatar)->toBe('https://lh3.googleusercontent.com/a/new')
        ->and(User::query()->where('email', 'allowed@gmail.com')->count())->toBe(1);
});

it('rejects an email that is not allowed', function (): void {
    app(AuthenticateWithGoogleAction::class)->handle('nope@gmail.com', 'Nope', null);
})->throws(EmailNotAllowed::class);
