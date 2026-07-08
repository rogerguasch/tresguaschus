<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rentals', function (Blueprint $table): void {
            $table->id();
            $table->string('address');
            $table->string('city');
            $table->string('type');
            $table->unsignedBigInteger('rent'); // Stored in minor units (cents).
            $table->unsignedBigInteger('deposit'); // Stored in minor units (cents).
            $table->date('contract_start')->nullable();
            $table->date('contract_end')->nullable();
            $table->string('status');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rentals');
    }
};
