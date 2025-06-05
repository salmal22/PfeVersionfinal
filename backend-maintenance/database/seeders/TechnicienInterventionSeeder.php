<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Intervention;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class TechnicienInterventionSeeder extends Seeder
{
    public function run(): void
    {
        $techniciens = User::where('role', 'technicien')->get(); // Corrigé: seulement les techniciens
        $interventions = Intervention::all();
        
        if ($techniciens->isEmpty()) {
            return; // Évite les erreurs si aucun technicien
        }

        foreach ($interventions as $intervention) {
            // Assigner 1-3 techniciens par intervention
            $nombreTechniciens = rand(1, min(3, $techniciens->count()));
            $techniciensSelectionnes = $techniciens->random($nombreTechniciens);
            
            foreach ($techniciensSelectionnes as $technicien) {
                $intervention->techniciens()->attach($technicien->id, [
                    'date_debut' => now()->subHours(rand(1, 5)),
                    'date_fin' => now(),
                    'action_realisee' => fake()->sentence(),
                    'statut' => fake()->randomElement(['en attente', 'en cours', 'résolu']),
                ]);
            }
        }
    }
}