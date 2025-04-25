<?php

namespace App\Http\Controllers;

use App\Models\Banner;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class BannerController extends Controller
{
    /**
     * Display a listing of banners.
     */
    public function index()
    {
        $banners = Banner::all();
        return response()->json(['banners' => $banners], 200);
    }

    /**
     * Store a newly created banner.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|file',
            'small_image' => 'nullable|image',
            'category' => 'nullable|string|max:100',
            'brand' => 'nullable|string|max:100',
            'date' => 'nullable|date',
            'qty' => 'nullable|integer|min:0',
            'status' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $request->all();

        // Handle image upload
        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('banners', 'public');
        }

        // Handle small image upload
        if ($request->hasFile('small_image')) {
            $data['small_image'] = $request->file('small_image')->store('banners', 'public');
        }

        $banner = Banner::create($data);

        return response()->json(['banner' => $banner, 'message' => 'Banner created successfully'], 201);
    }

    /**
     * Display the specified banner.
     */
    public function show(Banner $banner)
    {
        return response()->json(['banner' => $banner], 200);
    }

    /**
     * Update the specified banner.
     */
    public function update(Request $request, Banner $banner)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|file',
            'small_image' => 'nullable|image',
            'category' => 'nullable|string|max:100',
            'brand' => 'nullable|string|max:100',
            'date' => 'nullable|date',
            'qty' => 'nullable|integer|min:0',
            'status' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $request->all();

        // Handle image upload and delete old image
        if ($request->hasFile('image')) {
            if ($banner->image) {
                Storage::disk('public')->delete($banner->image);
            }
            $data['image'] = $request->file('image')->store('banners', 'public');
        }

        // Handle small image upload and delete old small image
        if ($request->hasFile('small_image')) {
            if ($banner->small_image) {
                Storage::disk('public')->delete($banner->small_image);
            }
            $data['small_image'] = $request->file('small_image')->store('banners', 'public');
        }

        $banner->update($data);

        return response()->json(['banner' => $banner, 'message' => 'Banner updated successfully'], 200);
    }

    /**
     * Remove the specified banner.
     */
    public function destroy(Banner $banner)
    {
        // Delete associated images
        if ($banner->image) {
            Storage::disk('public')->delete($banner->image);
        }
        if ($banner->small_image) {
            Storage::disk('public')->delete($banner->small_image);
        }

        $banner->delete();

        return response()->json(['message' => 'Banner deleted successfully'], 200);
    }
}