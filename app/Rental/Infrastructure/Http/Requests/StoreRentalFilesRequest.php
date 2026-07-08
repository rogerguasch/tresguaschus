<?php

declare(strict_types=1);

namespace App\Rental\Infrastructure\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\UploadedFile;

final class StoreRentalFilesRequest extends FormRequest
{
    /**
     * @return array<string, array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'files' => ['required', 'array', 'min:1'],
            'files.*' => ['file', 'mimes:pdf,jpg,jpeg,png', 'max:10240'],
        ];
    }

    /**
     * @return list<UploadedFile>
     */
    public function uploadedFiles(): array
    {
        /** @var list<UploadedFile> $files */
        $files = $this->file('files', []);

        return $files;
    }
}
