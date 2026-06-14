<?php

namespace Database\Seeders;

use App\Models\Equipment;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        User::updateOrCreate(
            ['email' => 'admin@lab.com'],
            [
                'name' => 'Administrador',
                'password' => Hash::make('123456'),
                'role' => 'admin',
            ]
        );

        $equipment = [
            [
                'code' => 'MIC-001',
                'name' => 'Microscopio binocular',
                'category' => 'Optica',
                'description' => 'Microscopio para practicas de laboratorio.',
                'quantity' => 5,
                'available_quantity' => 5,
                'status' => 'available',
            ],
            [
                'code' => 'BAL-002',
                'name' => 'Balanza analitica',
                'category' => 'Medicion',
                'description' => 'Balanza de precision para muestras.',
                'quantity' => 2,
                'available_quantity' => 2,
                'status' => 'available',
            ],
            [
                'code' => 'CEN-003',
                'name' => 'Centrifuga digital',
                'category' => 'Procesamiento',
                'description' => 'Centrifuga de mesa con control de velocidad.',
                'quantity' => 1,
                'available_quantity' => 1,
                'status' => 'available',
            ],
        ];

        foreach ($equipment as $item) {
            Equipment::updateOrCreate(
                ['code' => $item['code']],
                $item
            );
        }
    }
}
