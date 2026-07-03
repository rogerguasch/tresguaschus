<?php

declare(strict_types=1);

namespace App\Category\Infrastructure\Http\Requests;

use App\Category\Domain\Enums\TransactionType;
use App\Category\Domain\Models\Category;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

final class StoreCategoryRequest extends FormRequest
{
    /**
     * @return array<string, array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255', Rule::unique(Category::class)],
            'type' => ['required', Rule::enum(TransactionType::class)],
            'color' => ['required', 'string', 'regex:/^#[0-9a-fA-F]{6}$/'],
        ];
    }
}
