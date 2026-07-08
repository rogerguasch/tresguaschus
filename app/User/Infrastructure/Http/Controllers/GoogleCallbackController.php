<?php

declare(strict_types=1);

namespace App\User\Infrastructure\Http\Controllers;

use App\User\Application\Actions\AuthenticateWithGoogleAction;
use App\User\Domain\Exceptions\EmailNotAllowed;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;

final readonly class GoogleCallbackController
{
    public function __invoke(AuthenticateWithGoogleAction $action): RedirectResponse
    {
        $googleUser = Socialite::driver('google')->user();

        try {
            $user = $action->handle(
                (string) $googleUser->getEmail(),
                (string) $googleUser->getName(),
                $googleUser->getAvatar(),
            );
        } catch (EmailNotAllowed) {
            return redirect()->route('home')->with(
                'error',
                'Esa cuenta de Google no tiene acceso a la aplicación.',
            );
        }

        Auth::login($user, remember: true);

        return redirect()->route('dashboard');
    }
}
