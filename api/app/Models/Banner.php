<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Banner extends Model
{
    protected $table = 'banner';  

    protected $fillable = [
        'name',
        'description',
        'image',
        'small_image',
        'category',
        'brand',
        'date',
        'qty',
        'status',
    ];

    protected $casts = [
        'date' => 'date',
        'status' => 'boolean',
    ];
}
