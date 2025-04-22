<?php

namespace App\Models;

 
use Illuminate\Database\Eloquent\Model;

class Logo extends Model
{
  

    protected $table = 'logo';

    protected $fillable = [
        'image',
        'category',
        'status',
    ];

    protected $casts = [
        'status' => 'boolean',
    ];
}