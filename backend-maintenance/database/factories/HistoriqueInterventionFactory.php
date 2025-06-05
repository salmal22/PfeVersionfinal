<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Intervention;
use App\Models\Portique;
use App\Models\Shift;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\HistoriqueIntervention>
 */
class HistoriqueInterventionFactory extends Factory
{
    public function definition(): array
    {
        $debut = $this->faker->dateTimeBetween('-3 days', 'now');
        $fin = (clone $debut)->modify('+1 hour');

        return [
            'intervention_id' => Intervention::factory(),
            'portique_id' => Portique::factory(),
            'shift_id' => Shift::factory(),
            'conducteur_id' => User::factory(),
            'type' => $this->faker->randomElement(['électrique', 'hydraulique', 'mécanique']),
            'detail' => $this->faker->randomElement(['ascenseur', 'avant-bec', 'chariot', 'headblock', 'levage', 'TLS', 'spreader', 'translation']),
            'date_debut' => $debut,
            'date_fin' => $fin,
            'description' => $this->faker->sentence(),
            'statut' => $this->faker->randomElement(['en attente', 'en cours', 'résolu']),
            'updated_by' => User::factory(),
        ];
    }
}