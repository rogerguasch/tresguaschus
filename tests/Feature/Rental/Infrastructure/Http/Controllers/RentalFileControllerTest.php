<?php

declare(strict_types=1);

use App\Rental\Domain\Models\Rental;
use App\Rental\Domain\Models\RentalFile;
use App\User\Domain\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

beforeEach(fn () => $this->actingAs(User::factory()->create()));

it('uploads files to a rental', function (): void {
    Storage::fake();
    $rental = Rental::factory()->create();

    $response = $this->fromRoute('dashboard')
        ->post(route('rentals.files.store', $rental), [
            'files' => [
                UploadedFile::fake()->create('contrato.pdf', 120, 'application/pdf'),
                UploadedFile::fake()->create('dni.pdf', 40, 'application/pdf'),
            ],
        ]);

    $response->assertRedirect(route('dashboard'));

    $files = $rental->files()->get();

    expect($files)->toHaveCount(2)
        ->and($files->pluck('name')->all())->toContain('contrato.pdf', 'dni.pdf');

    $files->each(fn (RentalFile $file) => Storage::assertExists($file->path));
});

it('rejects invalid file types', function (): void {
    Storage::fake();
    $rental = Rental::factory()->create();

    $response = $this->fromRoute('dashboard')
        ->post(route('rentals.files.store', $rental), [
            'files' => [UploadedFile::fake()->create('virus.exe', 10, 'application/octet-stream')],
        ]);

    $response->assertSessionHasErrors('files.0');
    expect($rental->files()->count())->toBe(0);
});

it('requires at least one file', function (): void {
    $rental = Rental::factory()->create();

    $response = $this->fromRoute('dashboard')
        ->post(route('rentals.files.store', $rental), []);

    $response->assertSessionHasErrors('files');
});

it('downloads a rental file', function (): void {
    Storage::fake();
    $rental = Rental::factory()->create();
    Storage::put("rental-files/{$rental->id}/doc.pdf", 'contract contents');

    $file = RentalFile::factory()->for($rental)->create([
        'name' => 'doc.pdf',
        'path' => "rental-files/{$rental->id}/doc.pdf",
    ]);

    $this->get(route('rental-files.download', $file))
        ->assertOk()
        ->assertDownload('doc.pdf');
});
