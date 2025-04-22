<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Slider extends Model
{
    protected $table = 'slider';  

    protected $fillable = [
        'name',
        'description',
        'image',
        'small_image',
        'category',
        'brand',
        'date',
        'status',
    ];

    protected $casts = [
        'date' => 'date',
        'status' => 'boolean',
    ];
}
