<?php

declare(strict_types=1);

use App\User\Application\Actions\CreateUserEmailVerificationNotification;
use App\User\Domain\Models\User;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Support\Facades\Notification;

it('may send email verification notification', function (): void {
    Notification::fake();

    $user = User::factory()->create([
        'email_verified_at' => null,
    ]);

    $action = app(CreateUserEmailVerificationNotification::class);

    $action->handle($user);

    Notification::assertSentTo($user, VerifyEmail::class);
});
