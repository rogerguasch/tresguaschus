<?php

declare(strict_types=1);

namespace App\User\Infrastructure\Http\Controllers;

use App\User\Application\Actions\UpdateUser;
use App\User\Domain\Models\User;
use App\User\Infrastructure\Http\Requests\UpdateUserRequest;
use Illuminate\Container\Attributes\CurrentUser;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

final readonly class UserProfileController
{
    public function edit(Request $request): Response
    {
        return Inertia::render('user-profile/edit', [
            'status' => $request->session()->get('status'),
        ]);
    }

    public function update(UpdateUserRequest $request, #[CurrentUser] User $user, UpdateUser $action): RedirectResponse
    {
        $action->handle($user, $request->validated());

        return to_route('user-profile.edit');
    }
}
