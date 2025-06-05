<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\HistoriqueIntervention;
use App\Models\Intervention;
use App\Models\User;

class HistoriqueInterventionSeeder extends Seeder
{
    public function run(): void
    {
        $existingUserIds = User::pluck('id')->toArray();

        foreach (Intervention::all() as $intervention) {
            // Vérifie que le conducteur existe bien
            if (!in_array($intervention->conducteur_id, $existingUserIds)) {
                continue; // Ignore si le conducteur n'existe pas
            }

            HistoriqueIntervention::create([
                'intervention_id' => $intervention->id,
                'portique_id' => $intervention->portique_id,
                'shift_id' => $intervention->shift_id,
                'conducteur_id' => $intervention->conducteur_id,
                'type' => $intervention->type,
                'detail' => $intervention->detail,
                'date_debut' => $intervention->date_debut,
                'date_fin' => $intervention->date_fin,
                'description' => $intervention->description,
                'statut' => $intervention->statut,
                'updated_by' => User::inRandomOrder()->first()->id,
            ]);
        }
    }
}
