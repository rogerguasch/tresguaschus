<?php

declare(strict_types=1);

namespace App\Transaction\Infrastructure\Http\Requests;

use App\Category\Domain\Models\Category;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

final class StoreTransactionRequest extends FormRequest
{
    /**
     * @return array<string, array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'rental_id' => ['required', 'string', 'max:255'],
            'category' => ['required', 'string', Rule::exists(Category::class, 'name')],
            'date' => ['required', 'date'],
            'concept' => ['required', 'string', 'max:255'],
            'amount' => ['required', 'integer', 'min:1'],
            'method' => ['required', 'string', 'max:255'],
        ];
    }
}
