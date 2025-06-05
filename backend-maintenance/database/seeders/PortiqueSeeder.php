<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Portique;

class PortiqueSeeder extends Seeder
{
    public function run(): void
    {
        Portique::create([
            'nom' => 'P5',
            'description' => 'Portique 5 - Zone principale de chargement',
            'statut' => 'actif'
        ]);
        
        Portique::create([
            'nom' => 'P8',
            'description' => 'Portique 8 - Zone secondaire',
            'statut' => 'actif'
        ]);
        
        Portique::create([
            'nom' => 'P9',
            'description' => 'Portique 9 - Zone de stockage',
            'statut' => 'maintenance'
        ]);
    }
}