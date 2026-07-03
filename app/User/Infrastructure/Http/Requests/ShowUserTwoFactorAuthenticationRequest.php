<?php

declare(strict_types=1);

namespace App\User\Infrastructure\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Laravel\Fortify\InteractsWithTwoFactorState;

final class ShowUserTwoFactorAuthenticationRequest extends FormRequest
{
    use InteractsWithTwoFactorState;
}
