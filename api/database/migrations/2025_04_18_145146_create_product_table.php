<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('product', function (Blueprint $table) {
            $table->id();
            $table->string('name')->nullable();
            $table->text('description')->nullable();  
            $table->string('image')->nullable();
            $table->json('gallery_image')->nullable();
            $table->decimal('regular_price', 8, 2)->nullable();
            $table->decimal('sale_price', 8, 2)->nullable(); 
            $table->json('category')->nullable();
            $table->json('size')->nullable();
            $table->string('brand')->nullable();
            $table->date('date')->nullable();
            $table->integer('qty')->nullable();
            $table->decimal('tax', 8, 2)->nullable();  
            $table->decimal('discount', 8, 2)->nullable();  
            $table->json('color')->nullable();
            $table->boolean('status')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product');
    }
};
