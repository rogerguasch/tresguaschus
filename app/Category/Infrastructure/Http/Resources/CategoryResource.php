<?php

declare(strict_types=1);

namespace App\Category\Infrastructure\Http\Resources;

use App\Category\Domain\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Category
 */
final class CategoryResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => (string) $this->id,
            'name' => $this->name,
            'type' => $this->type->value,
            'color' => $this->color,
        ];
    }
}
