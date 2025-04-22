<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Product extends Model
{
    use HasFactory;

    protected $table = 'product';

    protected $fillable = [
        'name',
        'description',
        'image',
        'gallery_image',
        'regular_price',
        'sale_price',
        'category',
        'size',
        'brand',
        'date',
        'qty',
        'tax',
        'discount',
        'color',
        'status',
    ];

    protected $casts = [
        'gallery_image' => 'array',
        'category' => 'array',
        'size' => 'array',
        'color' => 'array',
        'regular_price' => 'decimal:2',
        'sale_price' => 'decimal:2',
        'tax' => 'decimal:2',
        'discount' => 'decimal:2',
        'status' => 'boolean',
        'date' => 'date',
    ];
}
