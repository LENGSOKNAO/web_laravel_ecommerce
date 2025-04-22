<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\BannerController;
use App\Http\Controllers\SliderController;
use App\Http\Controllers\LogoController;

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

Route::apiResource('logos', LogoController::class);


Route::prefix('sliders')->group(function () {
    Route::get('/', [SliderController::class, 'index'])->name('sliders.index');
    Route::post('/', [SliderController::class, 'store'])->name('sliders.store');
    Route::get('/{slider}', [SliderController::class, 'show'])->name('sliders.show');
    Route::put('/{slider}', [SliderController::class, 'update'])->name('sliders.update');
    Route::delete('/{slider}', [SliderController::class, 'destroy'])->name('sliders.destroy');
});


Route::prefix('sliders')->group(function () {
    Route::get('/', [SliderController::class, 'index'])->name('sliders.index');
    Route::post('/', [SliderController::class, 'store'])->name('sliders.store');
    Route::get('/{slider}', [SliderController::class, 'show'])->name('sliders.show');
    Route::put('/{slider}', [SliderController::class, 'update'])->name('sliders.update');
    Route::delete('/{slider}', [SliderController::class, 'destroy'])->name('sliders.destroy');
});

Route::prefix('banners')->group(function () {
    Route::get('/', [BannerController::class, 'index']);  
    Route::post('/', [BannerController::class, 'store']);  
    Route::get('/{banner}', [BannerController::class, 'show']);  
    Route::put('/{banner}', [BannerController::class, 'update']);  
    Route::delete('/{banner}', [BannerController::class, 'destroy']);  
});

Route::prefix('products')->group(function () {
    Route::get('/', [ProductController::class, 'index'])->name('products.index');
    Route::post('/', [ProductController::class, 'store'])->name('products.store');
    Route::get('/{id}', [ProductController::class, 'show'])->name('products.show');
    Route::put('/{id}', [ProductController::class, 'update'])->name('products.update');
    Route::delete('/{id}', [ProductController::class, 'destroy'])->name('products.destroy');
});