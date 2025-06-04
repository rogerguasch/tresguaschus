<?php

declare(strict_types=1);

use NunoMaduro\Essentials\Configurables\AggressivePrefetching;
use NunoMaduro\Essentials\Configurables\ForceScheme;
use NunoMaduro\Essentials\Configurables\Unguard;

return [
    Unguard::class => false,
    ForceScheme::class => false,
];
