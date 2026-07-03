<?php

declare(strict_types=1);

namespace App\Category\Domain\Enums;

enum TransactionType: string
{
    case Ingreso = 'ingreso';
    case Gasto = 'gasto';
}
