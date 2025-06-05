<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Shift>
 */
class ShiftFactory extends Factory
{
    public function definition(): array
    {
        return [
            'nom' => $this->faker->randomElement(['Matin', 'Midi', 'Soir']),
            'debut' => $this->faker->time('H:i'),
            'fin' => $this->faker->time('H:i'),
        ];
    }
}