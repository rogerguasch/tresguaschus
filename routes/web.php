<?php

declare(strict_types=1);

use App\Category\Domain\Models\Category;
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
use App\User\Infrastructure\Http\Controllers\SessionController;
use App\User\Infrastructure\Http\Controllers\UserController;
use App\User\Infrastructure\Http\Controllers\UserEmailResetNotification;
use App\User\Infrastructure\Http\Controllers\UserEmailVerification;
use App\User\Infrastructure\Http\Controllers\UserEmailVerificationNotificationController;
use App\User\Infrastructure\Http\Controllers\UserPasswordController;
use App\User\Infrastructure\Http\Controllers\UserProfileController;
use App\User\Infrastructure\Http\Controllers\UserTwoFactorAuthenticationController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', fn () => Inertia::render('welcome'))->name('home');

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

// Rentals... (TODO: move behind auth once the dashboard requires authentication)
Route::post('rentals', CreateRentalController::class)->name('rentals.store');
Route::post('rentals/{rental}/files', UploadRentalFilesController::class)->name('rentals.files.store');
Route::get('rental-files/{rentalFile}', DownloadRentalFileController::class)->name('rental-files.download');

// Categories... (TODO: move behind auth once the dashboard requires authentication)
Route::post('categories', CreateCategoryController::class)->name('categories.store');
Route::patch('categories/{category}', UpdateCategoryController::class)->name('categories.update');
Route::delete('categories/{category}', DeleteCategoryController::class)->name('categories.destroy');

// Transactions... (TODO: move behind auth once the dashboard requires authentication)
Route::post('transactions', CreateTransactionController::class)->name('transactions.store');

Route::middleware('auth')->group(function (): void {
    // User...
    Route::delete('user', [UserController::class, 'destroy'])->name('user.destroy');

    // User Profile...
    Route::redirect('settings', '/settings/profile');
    Route::get('settings/profile', [UserProfileController::class, 'edit'])->name('user-profile.edit');
    Route::patch('settings/profile', [UserProfileController::class, 'update'])->name('user-profile.update');

    // User Password...
    Route::get('settings/password', [UserPasswordController::class, 'edit'])->name('password.edit');
    Route::put('settings/password', [UserPasswordController::class, 'update'])
        ->middleware('throttle:6,1')
        ->name('password.update');

    // Appearance...
    Route::get('settings/appearance', fn () => Inertia::render('appearance/update'))->name('appearance.edit');

    // User Two-Factor Authentication...
    Route::get('settings/two-factor', [UserTwoFactorAuthenticationController::class, 'show'])
        ->name('two-factor.show');
});

Route::middleware('guest')->group(function (): void {
    // User...
    Route::get('register', [UserController::class, 'create'])
        ->name('register');
    Route::post('register', [UserController::class, 'store'])
        ->name('register.store');

    // User Password...
    Route::get('reset-password/{token}', [UserPasswordController::class, 'create'])
        ->name('password.reset');
    Route::post('reset-password', [UserPasswordController::class, 'store'])
        ->name('password.store');

    // User Email Reset Notification...
    Route::get('forgot-password', [UserEmailResetNotification::class, 'create'])
        ->name('password.request');
    Route::post('forgot-password', [UserEmailResetNotification::class, 'store'])
        ->name('password.email');

    // Session...
    Route::get('login', [SessionController::class, 'create'])
        ->name('login');
    Route::post('login', [SessionController::class, 'store'])
        ->name('login.store');
});

Route::middleware('auth')->group(function (): void {
    // User Email Verification...
    Route::get('verify-email', [UserEmailVerificationNotificationController::class, 'create'])
        ->name('verification.notice');
    Route::post('email/verification-notification', [UserEmailVerificationNotificationController::class, 'store'])
        ->middleware('throttle:6,1')
        ->name('verification.send');

    // User Email Verification...
    Route::get('verify-email/{id}/{hash}', [UserEmailVerification::class, 'update'])
        ->middleware(['signed', 'throttle:6,1'])
        ->name('verification.verify');

    // Session...
    Route::post('logout', [SessionController::class, 'destroy'])
        ->name('logout');
});
