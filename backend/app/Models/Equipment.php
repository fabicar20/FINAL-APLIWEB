<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Equipment extends Model
{
    use HasFactory;

    protected $table = 'equipment';

    protected $fillable = [
        'name',
        'code',
        'category',
        'description',
        'quantity',
        'available_quantity',
        'status',
    ];

    public function loanRequests()
    {
        return $this->hasMany(LoanRequest::class);
    }
}