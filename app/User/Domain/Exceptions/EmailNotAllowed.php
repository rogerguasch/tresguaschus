<?php

declare(strict_types=1);

namespace App\User\Domain\Exceptions;

use Exception;

final class EmailNotAllowed extends Exception
{
    public function __construct(string $email)
    {
        parent::__construct("The email [{$email}] is not allowed to sign in.");
    }
}
