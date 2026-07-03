<?php

declare(strict_types=1);

use App\User\Application\Actions\UpdateUserPassword;
use App\User\Domain\Models\User;
use Illuminate\Support\Facades\Hash;

it('may update a user password', function (): void {
    $user = User::factory()->create([
        'password' => Hash::make('old-password'),
    ]);

    $action = app(UpdateUserPassword::class);

    $action->handle($user, 'new-password');

    expect(Hash::check('new-password', $user->refresh()->password))->toBeTrue()
        ->and(Hash::check('old-password', $user->password))->toBeFalse();
});
