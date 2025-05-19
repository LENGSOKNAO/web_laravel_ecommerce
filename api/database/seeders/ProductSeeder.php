<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;

class ProductSeeder extends Seeder
{
    public function run()
    {
        Product::create([
            'id' => 1,
            'name' => 'T-Shirt',
            'description' => 'Comfortable cotton T-shirt',
            'regular_price' => 34.99,
            'sale_price' => 29.99,
            'category' => ['casual', 'apparel'],
            'size' => ['S', 'M', 'L'],
            'brand' => 'Generic',
            'date' => now(),
            'qty' => 10,
            'tax' => 2.99,
            'discount' => 5.00,
            'color' => ['white', 'black'],
            'image' => 'tshirt.jpg',
            'gallery_image' => ['tshirt_front.jpg', 'tshirt_back.jpg'],
            'status' => true,
        ]);

        Product::create([
            'id' => 2,
            'name' => 'Jeans',
            'description' => 'Stylish denim jeans',
            'regular_price' => 59.99,
            'sale_price' => 49.99,
            'category' => ['casual', 'apparel'],
            'size' => ['30', '32', '34'],
            'brand' => 'Generic',
            'date' => now(),
            'qty' => 10,
            'tax' => 4.99,
            'discount' => 10.00,
            'color' => ['blue', 'black'],
            'image' => 'jeans.jpg',
            'gallery_image' => ['jeans_front.jpg', 'jeans_back.jpg'],
            'status' => true,
        ]);
    }
}