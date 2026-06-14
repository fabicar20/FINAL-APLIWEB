<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\EquipmentController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\LoanRequestController;

Route::get('/test', function () {
    return response()->json([
        'message' => 'API funcionando correctamente'
    ]);
});

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
});

Route::get('/equipment', [EquipmentController::class, 'index']);
Route::get('/equipment/{equipment}', [EquipmentController::class, 'show']);

Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::post('/equipment', [EquipmentController::class, 'store']);
    Route::put('/equipment/{equipment}', [EquipmentController::class, 'update']);
    Route::delete('/equipment/{equipment}', [EquipmentController::class, 'destroy']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/loan-requests', [LoanRequestController::class, 'index']);
    Route::post('/loan-requests', [LoanRequestController::class, 'store']);
});

Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::post('/loan-requests/{id}/approve', [LoanRequestController::class, 'approve']);
    Route::post('/loan-requests/{id}/reject', [LoanRequestController::class, 'reject']);
    Route::post('/loan-requests/{id}/return', [LoanRequestController::class, 'returnEquipment']);
});

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
