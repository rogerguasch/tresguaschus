<?php

declare(strict_types=1);

namespace App\Rental\Domain\Enums;

enum RentalStatus: string
{
    case Alquilado = 'Alquilado';
    case Vacio = 'Vacío';
}
