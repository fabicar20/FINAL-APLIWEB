<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Equipment;
use App\Models\LoanRequest;
use Illuminate\Http\Request;

class LoanRequestController extends Controller
{
    public function index(Request $request)
    {
        $query = LoanRequest::with(['user', 'equipment']);

        if ($request->user()->role !== 'admin') {
            $query->where('user_id', $request->user()->id);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        return response()->json($query->latest()->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'equipment_id' => 'required|exists:equipment,id',
            'quantity' => 'required|integer|min:1',
            'observations' => 'nullable|string',
        ]);

        $equipment = Equipment::findOrFail($validated['equipment_id']);

        if ($equipment->available_quantity < $validated['quantity']) {
            return response()->json([
                'message' => 'No hay suficiente disponibilidad para este equipo'
            ], 422);
        }

        $loanRequest = LoanRequest::create([
            'user_id' => $request->user()->id,
            'equipment_id' => $validated['equipment_id'],
            'quantity' => $validated['quantity'],
            'status' => 'pending',
            'request_date' => now()->toDateString(),
            'observations' => $validated['observations'] ?? null,
        ]);

        return response()->json([
            'message' => 'Solicitud creada correctamente',
            'data' => $loanRequest->load(['user', 'equipment'])
        ], 201);
    }

    public function approve($id)
    {
        $loanRequest = LoanRequest::with('equipment')->findOrFail($id);

        if ($loanRequest->status !== 'pending') {
            return response()->json([
                'message' => 'Solo se pueden aprobar solicitudes pendientes'
            ], 422);
        }

        $equipment = $loanRequest->equipment;

        if ($equipment->available_quantity < $loanRequest->quantity) {
            return response()->json([
                'message' => 'No hay disponibilidad suficiente'
            ], 422);
        }

        $equipment->available_quantity -= $loanRequest->quantity;

        if ($equipment->available_quantity == 0) {
            $equipment->status = 'unavailable';
        }

        $equipment->save();

        $loanRequest->update([
            'status' => 'approved',
            'approved_at' => now()->toDateString(),
        ]);

        return response()->json([
            'message' => 'Solicitud aprobada correctamente',
            'data' => $loanRequest->load(['user', 'equipment'])
        ]);
    }

    public function reject($id)
    {
        $loanRequest = LoanRequest::findOrFail($id);

        if ($loanRequest->status !== 'pending') {
            return response()->json([
                'message' => 'Solo se pueden rechazar solicitudes pendientes'
            ], 422);
        }

        $loanRequest->update([
            'status' => 'rejected',
        ]);

        return response()->json([
            'message' => 'Solicitud rechazada correctamente',
            'data' => $loanRequest
        ]);
    }

    public function returnEquipment($id)
    {
        $loanRequest = LoanRequest::with('equipment')->findOrFail($id);

        if ($loanRequest->status !== 'approved') {
            return response()->json([
                'message' => 'Solo se pueden devolver solicitudes aprobadas'
            ], 422);
        }

        $equipment = $loanRequest->equipment;
        $equipment->available_quantity += $loanRequest->quantity;

        if ($equipment->available_quantity > 0) {
            $equipment->status = 'available';
        }

        $equipment->save();

        $loanRequest->update([
            'status' => 'returned',
            'returned_at' => now()->toDateString(),
        ]);

        return response()->json([
            'message' => 'Equipo devuelto correctamente',
            'data' => $loanRequest->load(['user', 'equipment'])
        ]);
    }
}