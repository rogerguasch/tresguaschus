<?php

declare(strict_types=1);

namespace App\User\Application\Actions;

use App\User\Domain\Models\User;

final readonly class DeleteUser
{
    public function handle(User $user): void
    {
        $user->delete();
    }
}
