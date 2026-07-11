<?php

declare(strict_types=1);

use App\Category\Domain\Models\Category;
use App\Category\Infrastructure\Http\Controllers\CategoryAssistantChatController;
use App\Category\Infrastructure\Http\Controllers\CreateCategoryController;
use App\Category\Infrastructure\Http\Controllers\DeleteCategoryController;
use App\Category\Infrastructure\Http\Controllers\UpdateCategoryController;
use App\Category\Infrastructure\Http\Resources\CategoryResource;
use App\Rental\Domain\Models\Rental;
use App\Rental\Infrastructure\Http\Controllers\CreateRentalController;
use App\Rental\Infrastructure\Http\Controllers\DownloadRentalFileController;
use App\Rental\Infrastructure\Http\Controllers\UploadRentalFilesController;
use App\Rental\Infrastructure\Http\Resources\RentalResource;
use App\Transaction\Domain\Models\Transaction;
use App\Transaction\Infrastructure\Http\Controllers\CreateTransactionController;
use App\Transaction\Infrastructure\Http\Resources\TransactionResource;
use App\User\Infrastructure\Http\Controllers\GoogleCallbackController;
use App\User\Infrastructure\Http\Controllers\GoogleRedirectController;
use App\User\Infrastructure\Http\Controllers\LogoutController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', fn () => Auth::check()
    ? redirect()->route('dashboard')
    : Inertia::render('login'))->name('home');

// Google OAuth...
Route::get('auth/google/redirect', GoogleRedirectController::class)->name('auth.google.redirect');
Route::get('auth/google/callback', GoogleCallbackController::class)->name('auth.google.callback');

Route::middleware('auth')->group(function (): void {
    // Rental dashboard (entry point).
    Route::get('dashboard', fn () => Inertia::render('dashboard', [
        'rentals' => RentalResource::collection(
            Rental::query()->with(['tenant', 'files'])->orderBy('id')->get()
        ),
        'categories' => CategoryResource::collection(Category::query()->orderBy('id')->get()),
        'transactions' => TransactionResource::collection(
            Transaction::query()
                ->with('category')
                ->orderByDesc('date')
                ->orderByDesc('id')
                ->get()
        ),
    ]))->name('dashboard');

    // Rentals...
    Route::post('rentals', CreateRentalController::class)->name('rentals.store');
    Route::post('rentals/{rental}/files', UploadRentalFilesController::class)->name('rentals.files.store');
    Route::get('rental-files/{rentalFile}', DownloadRentalFileController::class)->name('rental-files.download');

    // Categories...
    Route::post('categories', CreateCategoryController::class)->name('categories.store');
    Route::patch('categories/{category}', UpdateCategoryController::class)->name('categories.update');
    Route::delete('categories/{category}', DeleteCategoryController::class)->name('categories.destroy');
    Route::post('guaschnet/chat', CategoryAssistantChatController::class)->name('guaschnet.chat');

    // Transactions...
    Route::post('transactions', CreateTransactionController::class)->name('transactions.store');
});

Route::middleware('auth')->group(function (): void {
    // Appearance...
    Route::get('settings/appearance', fn () => Inertia::render('appearance/update'))->name('appearance.edit');

    // Session...
    Route::post('logout', LogoutController::class)->name('logout');
});
