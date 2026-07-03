<?php

declare(strict_types=1);

use App\User\Application\Actions\DeleteUser;
use App\User\Domain\Models\User;

it('may delete a user', function (): void {
    $user = User::factory()->create();

    $action = app(DeleteUser::class);

    $action->handle($user);

    expect($user->exists)->toBeFalse();
});
