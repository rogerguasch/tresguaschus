<?php

declare(strict_types=1);

namespace App\Rental\Domain\Enums;

enum PropertyType: string
{
    case Piso = 'Piso';
    case Atico = 'Ático';
    case Estudio = 'Estudio';
    case Casa = 'Casa';
    case LocalComercial = 'Local comercial';
    case PlazaGaraje = 'Plaza garaje';
    case Trastero = 'Trastero';
}
