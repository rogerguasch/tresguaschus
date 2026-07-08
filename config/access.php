<?php

declare(strict_types=1);

return [

    /*
    |--------------------------------------------------------------------------
    | Allowed Emails
    |--------------------------------------------------------------------------
    |
    | Only Google accounts whose email is in this list may sign in. Set the
    | ALLOWED_EMAILS environment variable to a comma-separated list.
    |
    */

    'emails' => array_values(array_filter(array_map(
        'trim',
        explode(',', (string) env('ALLOWED_EMAILS', 'roger.guasch.rion@gmail.com')),
    ))),

];
