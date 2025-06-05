<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Conge>
 */
class CongeFactory extends Factory
{
    public function definition(): array
    {
        $start = $this->faker->dateTimeBetween('-1 month', '+1 month');
        $end = (clone $start)->modify('+3 days');

        return [
            'user_id' => User::factory(), // Corrigé: user_id au lieu de technicien_id
            'date_debut' => $start->format('Y-m-d'),
            'date_fin' => $end->format('Y-m-d'),
            'type' => $this->faker->randomElement(['maladie', 'vacances']), // Ajouté
            'statut' => $this->faker->randomElement(['approuvé', 'en attente', 'refusé']), // Ajouté
        ];
    }
}