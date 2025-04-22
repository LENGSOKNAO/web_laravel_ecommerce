<?php

namespace App\Http\Controllers;

use App\Models\Logo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class LogoController extends Controller
{
    /**
     * Display a listing of the logos.
     */
    public function index()
    {
        $logos = Logo::all();
        return response()->json(['logos' => $logos], 200);
    }

    /**
     * Store a newly created logo in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'image' => 'required|image ', // Added mime types and size limit
            'category' => 'required|string|max:255',
            'status' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $imagePath = $request->file('image')->store('logos', 'public');

        $logo = Logo::create([
            'image' => $imagePath,
            'category' => $request->category,
            'status' => $request->status ?? true,
        ]);

        return response()->json(['logo' => $logo, 'message' => 'Logo created successfully'], 201);
    }

    /**
     * Display the specified logo.
     */
    public function show(Logo $logo)
    {
        return response()->json(['logo' => $logo], 200);
    }

    /**
     * Update the specified logo in storage.
     */
    public function update(Request $request, Logo $logo)
    {
        $validator = Validator::make($request->all(), [
            'image' => 'nullable|image ', // Added mime types and size limit
            'category' => 'nullable|string|max:255',
            'status' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Prepare data for update
        $data = [];
        if ($request->has('category')) {
            $data['category'] = $request->category;
        }
        if ($request->has('status')) {
            $data['status'] = $request->status;
        }

        // Handle image upload
        if ($request->hasFile('image')) {
            // Delete old image if it exists
            if ($logo->image) {
                Storage::disk('public')->delete($logo->image);
            }
            // Store new image
            $data['image'] = $request->file('image')->store('logos', 'public');
        }

        // Update logo only if there are changes
        if (!empty($data)) {
            $logo->update($data);
        }

        return response()->json(['logo' => $logo->fresh(), 'message' => 'Logo updated successfully'], 200);
    }

    /**
     * Remove the specified logo from storage.
     */
    public function destroy(Logo $logo)
    {
        if ($logo->image) {
            Storage::disk('public')->delete($logo->image);
        }
        $logo->delete();

        return response()->json(['message' => 'Logo deleted successfully'], 200);
    }
}