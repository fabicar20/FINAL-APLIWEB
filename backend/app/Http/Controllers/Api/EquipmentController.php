<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Equipment;
use Illuminate\Http\Request;

class EquipmentController extends Controller
{
    public function index(Request $request)
    {
        $query = Equipment::query();

        if ($request->has('search')) {
            $search = $request->search;

            $query->where('name', 'like', "%{$search}%")
                ->orWhere('code', 'like', "%{$search}%")
                ->orWhere('category', 'like', "%{$search}%");
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        return response()->json($query->latest()->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:100|unique:equipment,code',
            'category' => 'required|string|max:255',
            'description' => 'nullable|string',
            'quantity' => 'required|integer|min:1',
            'available_quantity' => 'nullable|integer|min:0',
            'status' => 'nullable|string',
        ]);

        $validated['available_quantity'] = $validated['available_quantity'] ?? $validated['quantity'];
        $validated['status'] = $validated['status'] ?? 'available';

        $equipment = Equipment::create($validated);

        return response()->json([
            'message' => 'Equipo creado correctamente',
            'data' => $equipment
        ], 201);
    }

    public function show($id)
    {
        $equipment = Equipment::findOrFail($id);

        return response()->json($equipment);
    }

    public function update(Request $request, $id)
    {
        $equipment = Equipment::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'code' => 'sometimes|required|string|max:100|unique:equipment,code,' . $equipment->id,
            'category' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'quantity' => 'sometimes|required|integer|min:1',
            'available_quantity' => 'sometimes|required|integer|min:0',
            'status' => 'sometimes|required|string',
        ]);

        $equipment->update($validated);

        return response()->json([
            'message' => 'Equipo actualizado correctamente',
            'data' => $equipment
        ]);
    }

    public function destroy($id)
    {
        $equipment = Equipment::findOrFail($id);
        $equipment->delete();

        return response()->json([
            'message' => 'Equipo eliminado correctamente'
        ]);
    }
}