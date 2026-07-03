<?php

declare(strict_types=1);

namespace App\User\Application\Actions;

use App\User\Domain\Models\User;
use Illuminate\Support\Facades\Hash;
use SensitiveParameter;

final readonly class UpdateUserPassword
{
    public function handle(User $user, #[SensitiveParameter] string $password): void
    {
        $user->update([
            'password' => Hash::make($password),
        ]);
    }
}
