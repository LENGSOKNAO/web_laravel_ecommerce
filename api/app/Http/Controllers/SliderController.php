<?php

namespace App\Http\Controllers;

use App\Models\Slider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class SliderController extends Controller
{
    /**
     * Display a listing of the sliders.
     */
    public function index()
    {
        $sliders = Slider::all();
        return response()->json($sliders);
    }

    /**
     * Store a newly created slider in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|file',
            'small_image' => 'nullable|image',
            'category' => 'nullable|string|max:255',
            'brand' => 'nullable|string|max:255',
            'date' => 'nullable|date',
            'status' => 'boolean',
        ]);

        // Handle image uploads
        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('sliders', 'public');
        }

        if ($request->hasFile('small_image')) {
            $validated['small_image'] = $request->file('small_image')->store('sliders', 'public');
        }

        $slider = Slider::create($validated);

        return response()->json([
            'message' => 'Slider created successfully',
            'slider' => $slider
        ], 201);
    }

    /**
     * Display the specified slider.
     */
    public function show(Slider $slider)
    {
        return response()->json($slider);
    }

    /**
     * Update the specified slider in storage.
     */
    public function update(Request $request, Slider $slider)
    {
        $validated = $request->validate([
            'name' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|file',
            'small_image' => 'nullable|image',
            'category' => 'nullable|string|max:255',
            'brand' => 'nullable|string|max:255',
            'date' => 'nullable|date',
            'status' => 'boolean',
        ]);

        // Handle image uploads and delete old images if new ones are uploaded
        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($slider->image) {
                Storage::disk('public')->delete($slider->image);
            }
            $validated['image'] = $request->file('image')->store('sliders', 'public');
        }

        if ($request->hasFile('small_image')) {
            // Delete old small image if exists
            if ($slider->small_image) {
                Storage::disk('public')->delete($slider->small_image);
            }
            $validated['small_image'] = $request->file('small_image')->store('sliders', 'public');
        }

        $slider->update($validated);

        return response()->json([
            'message' => 'Slider updated successfully',
            'slider' => $slider
        ]);
    }

    /**
     * Remove the specified slider from storage.
     */
    public function destroy(Slider $slider)
    {
        // Delete associated images
        if ($slider->image) {
            Storage::disk('public')->delete($slider->image);
        }
        if ($slider->small_image) {
            Storage::disk('public')->delete($slider->small_image);
        }

        $slider->delete();

        return response()->json([
            'message' => 'Slider deleted successfully'
        ]);
    }
}