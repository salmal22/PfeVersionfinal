<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Conge;
use App\Models\User;

class CongeSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::all();
        $responsables = User::where('role', 'responsable')->get();
        
        foreach ($users as $user) {
            // Eviter de créer des congés pour les responsables
            if ($user->role === 'responsable') continue;
            
            Conge::create([
                'user_id' => $user->id,
                'date_debut' => now()->subDays(rand(10, 20)),
                'date_fin' => now()->addDays(rand(1, 5)),
                'type' => fake()->randomElement(['maladie', 'vacances']),
                'statut' => fake()->randomElement(['approuvé', 'en attente', 'refusé']),
                'raison' => fake()->sentence(),
                'approuve_par' => $responsables->isNotEmpty() ? $responsables->random()->id : null,
            ]);
        }
    }
}