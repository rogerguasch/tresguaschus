<?php

declare(strict_types=1);

use App\User\Domain\Models\User;
use Laravel\Socialite\Contracts\Provider;
use Laravel\Socialite\Facades\Socialite;
use Laravel\Socialite\Two\User as SocialiteUser;

function fakeGoogleUser(string $email, string $name = 'Google User'): void
{
    $socialiteUser = new SocialiteUser;
    $socialiteUser->map([
        'email' => $email,
        'name' => $name,
        'avatar' => 'https://lh3.googleusercontent.com/a/pic',
    ]);

    $provider = Mockery::mock(Provider::class);
    $provider->shouldReceive('user')->andReturn($socialiteUser);

    Socialite::shouldReceive('driver')->with('google')->andReturn($provider);
}

it('redirects to google', function (): void {
    $provider = Mockery::mock(Provider::class);
    $provider->shouldReceive('redirect')->andReturn(redirect('https://accounts.google.com/o/oauth2'));
    Socialite::shouldReceive('driver')->with('google')->andReturn($provider);

    $this->get(route('auth.google.redirect'))
        ->assertRedirect('https://accounts.google.com/o/oauth2');
});

it('logs in an allowed google account and creates the user', function (): void {
    config(['access.emails' => ['ok@gmail.com']]);
    fakeGoogleUser('ok@gmail.com', 'Roger');

    $this->get(route('auth.google.callback'))
        ->assertRedirect(route('dashboard'));

    $this->assertAuthenticated();
    expect(User::query()->where('email', 'ok@gmail.com')->value('name'))->toBe('Roger')
        ->and(User::query()->where('email', 'ok@gmail.com')->value('avatar'))->toBe('https://lh3.googleusercontent.com/a/pic');
});

it('rejects a google account that is not allowed', function (): void {
    config(['access.emails' => ['ok@gmail.com']]);
    fakeGoogleUser('intruder@gmail.com');

    $this->get(route('auth.google.callback'))
        ->assertRedirect(route('home'))
        ->assertSessionHas('error');

    $this->assertGuest();
    expect(User::query()->where('email', 'intruder@gmail.com')->exists())->toBeFalse();
});

it('logs out an authenticated user', function (): void {
    $this->actingAs(User::factory()->create())
        ->post(route('logout'))
        ->assertRedirect();

    $this->assertGuest();
});
