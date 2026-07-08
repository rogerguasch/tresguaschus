<?php

declare(strict_types=1);

namespace App\User\Application\Actions;

use App\User\Domain\Exceptions\EmailNotAllowed;
use App\User\Domain\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

final readonly class AuthenticateWithGoogleAction
{
    /**
     * @throws EmailNotAllowed
     */
    public function handle(string $email, string $name, ?string $avatar): User
    {
        $allowed = config('access.emails');
        assert(is_array($allowed));

        if (! in_array($email, $allowed, true)) {
            throw new EmailNotAllowed($email);
        }

        return DB::transaction(function () use ($email, $name, $avatar): User {
            $user = User::query()->firstOrNew(['email' => $email]);

            // Keep name and avatar in sync with Google on every sign-in.
            $user->fill(['name' => $name, 'avatar' => $avatar]);

            if (! $user->exists) {
                $user->fill([
                    'password' => Hash::make(Str::random(40)),
                    'email_verified_at' => now(),
                ]);
            }

            $user->save();

            return $user;
        });
    }
}
