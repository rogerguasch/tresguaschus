<?php

declare(strict_types=1);

use App\User\Domain\Models\User;

test('to array', function (): void {
    $user = User::factory()->create()->refresh();

    expect(array_keys($user->toArray()))
        ->toBe([
            'id',
            'name',
            'email',
            'email_verified_at',
            'avatar',
            'created_at',
            'updated_at',
        ]);
});
