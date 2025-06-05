<?php

namespace Database\Factories;

use App\Models\Portique;
use App\Models\Shift;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Intervention>
 */
class InterventionFactory extends Factory
{
    public function definition(): array
    {
        return [
            'portique_id' => Portique::factory(),
            'shift_id' => Shift::factory(),
            'conducteur_id' => User::factory(),
            'responsable_id' => User::factory(),
            'type' => $this->faker->randomElement(['électrique', 'hydraulique', 'mécanique']),
            'detail' => $this->faker->randomElement(['ascenseur', 'avant-bec', 'chariot', 'headblock', 'levage', 'TLS', 'spreader', 'translation']),
            'date_debut' => now(),
            'date_fin' => now()->addHours(2),
            'description' => $this->faker->sentence(),
            'statut' => $this->faker->randomElement(['en attente', 'en cours', 'résolu']),
        ];
    }
}