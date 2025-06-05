<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Intervention;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\TechnicienIntervention>
 */
class TechnicienInterventionFactory extends Factory
{
    public function definition(): array
    {
        $debut = $this->faker->dateTimeBetween('-2 days', 'now');
        $fin = (clone $debut)->modify('+2 hours');

        return [
            'technicien_id' => User::factory(),
            'intervention_id' => Intervention::factory(),
            'date_debut' => $debut,
            'date_fin' => $fin,
            'action_realisee' => $this->faker->sentence(),
            'statut' => $this->faker->randomElement(['en attente', 'en cours', 'résolu']),
        ];
    }
}