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
    public function handle(string $email, string $name): User
    {
        $allowed = config('access.emails');
        assert(is_array($allowed));

        if (! in_array($email, $allowed, true)) {
            throw new EmailNotAllowed($email);
        }

        return DB::transaction(fn (): User => User::query()->firstOrCreate(
            ['email' => $email],
            [
                'name' => $name,
                'password' => Hash::make(Str::random(40)),
                'email_verified_at' => now(),
            ],
        ));
    }
}
