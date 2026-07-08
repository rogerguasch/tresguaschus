<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rental_files', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('rental_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('kind')->default('Documento');
            $table->string('path');
            $table->string('mime_type');
            $table->unsignedBigInteger('size'); // Bytes.
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rental_files');
    }
};
