<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Intervention;
use App\Models\Portique;
use App\Models\Shift;
use App\Models\User;

class InterventionSeeder extends Seeder
{
    public function run(): void
    {
        $conducteurs = User::where('role', 'conducteur')->get();
        $responsables = User::where('role', 'responsable')->get();

        if ($conducteurs->isEmpty() || $responsables->isEmpty()) {
            return;
        }

        // Intervention critique en cours
        Intervention::create([
            'portique_id' => 1, // P5
            'shift_id' => 1, // Matin
            'conducteur_id' => $conducteurs->first()->id,
            'responsable_id' => $responsables->first()->id,
            'type' => 'électrique',
            'detail' => 'ascenseur',
            'date_debut' => now()->subHours(2),
            'date_fin' => null,
            'description' => 'Panne électrique critique sur ascenseur P5 - Arrêt complet',
            'statut' => 'en cours',
            'priorite' => 'critique',
            'temps_resolution' => null,
            'notes_technicien' => 'Diagnostic en cours, problème au niveau du tableau électrique',
            'notes_responsable' => 'Priorité maximale - affecter 2 techniciens',
        ]);

        // Intervention résolue
        Intervention::create([
            'portique_id' => 2, // P8
            'shift_id' => 2, // Après-midi
            'conducteur_id' => $conducteurs->skip(1)->first()->id,
            'responsable_id' => $responsables->first()->id,
            'type' => 'hydraulique',
            'detail' => 'levage',
            'date_debut' => now()->subHours(4),
            'date_fin' => now()->subHours(1),
            'description' => 'Fuite hydraulique sur système de levage',
            'statut' => 'résolu',
            'priorite' => 'élevée',
            'temps_resolution' => 180, // 3 heures
            'notes_technicien' => 'Joint défaillant remplacé, test effectué avec succès',
            'notes_responsable' => 'Intervention réussie, portique remis en service',
        ]);

        // Intervention en attente
        Intervention::create([
            'portique_id' => 3, // P9
            'shift_id' => 3, // Nuit
            'conducteur_id' => $conducteurs->last()->id,
            'responsable_id' => null,
            'type' => 'mécanique',
            'detail' => 'chariot',
            'date_debut' => now()->subMinutes(30),
            'date_fin' => null,
            'description' => 'Bruit anormal au niveau du chariot, vibrations importantes',
            'statut' => 'en attente',
            'priorite' => 'normale',
            'temps_resolution' => null,
            'notes_technicien' => null,
            'notes_responsable' => null,
        ]);

        // Générer 7 interventions supplémentaires aléatoires
        for ($i = 0; $i < 7; $i++) {
            $dateDebut = now()->subHours(rand(1, 48));
            $estResolu = rand(0, 1);
            $dateFin = $estResolu ? $dateDebut->copy()->addHours(rand(1, 6)) : null;
            $tempsResolution = $estResolu ? $dateDebut->diffInMinutes($dateFin) : null;
            
            Intervention::create([
                'portique_id' => Portique::inRandomOrder()->first()->id,
                'shift_id' => Shift::inRandomOrder()->first()->id,
                'conducteur_id' => $conducteurs->random()->id,
                'responsable_id' => $estResolu ? $responsables->random()->id : null,
                'type' => fake()->randomElement(['électrique', 'hydraulique', 'mécanique']),
                'detail' => fake()->randomElement(['ascenseur', 'avant-bec', 'chariot', 'headblock', 'levage', 'TLS', 'spreader', 'translation']),
                'date_debut' => $dateDebut,
                'date_fin' => $dateFin,
                'description' => fake()->sentence(),
                'statut' => fake()->randomElement(['en attente', 'en cours', 'résolu']),
                'priorite' => fake()->randomElement(['faible', 'normale', 'élevée', 'critique']),
                'temps_resolution' => $tempsResolution,
                'notes_technicien' => $estResolu ? fake()->sentence() : null,
                'notes_responsable' => $estResolu ? fake()->sentence() : null,
            ]);
        }
    }
}
