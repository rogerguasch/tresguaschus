<?php

declare(strict_types=1);

namespace App\Providers;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

final class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        $this->bootModelsDefaults();
        $this->bootPasswordDefaults();
        $this->bootResourcesDefaults();
    }

    private function bootModelsDefaults(): void
    {
        Model::unguard();
    }

    private function bootResourcesDefaults(): void
    {
        JsonResource::withoutWrapping();
    }

    private function bootPasswordDefaults(): void
    {
        Password::defaults(fn () => app()->isLocal() || app()->runningUnitTests() ? Password::min(12)->max(255) : Password::min(12)->max(255)->uncompromised());
    }
}
