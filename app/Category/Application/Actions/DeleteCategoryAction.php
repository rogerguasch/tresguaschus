<?php

declare(strict_types=1);

namespace App\Category\Application\Actions;

use App\Category\Domain\Models\Category;
use Illuminate\Support\Facades\DB;

final readonly class DeleteCategoryAction
{
    public function handle(Category $category): void
    {
        DB::transaction(fn (): ?bool => $category->delete());
    }
}
