<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\BannerController;
use App\Http\Controllers\SliderController;
use App\Http\Controllers\LogoController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\OrderController;


Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

 
Route::get('/orders/{id}', [OrderController::class, 'show']);

Route::get('/sanctum/csrf-cookie', [\Laravel\Sanctum\Http\Controllers\CsrfCookieController::class, 'show']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/orders', [CheckoutController::class, 'getOrders']);
Route::delete('/orders/{id}', [CheckoutController::class, 'deleteOrder']);
Route::post('/checkout', [CheckoutController::class, 'checkout']);
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{id}', [ProductController::class, 'show']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
});


Route::apiResource('logos', LogoController::class);

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