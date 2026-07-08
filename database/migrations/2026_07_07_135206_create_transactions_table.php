<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('rental_id')->constrained();
            $table->foreignId('category_id')->constrained();
            $table->date('date');
            $table->string('concept');
            $table->unsignedBigInteger('amount'); // Stored in minor units (cents).
            $table->string('method');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
