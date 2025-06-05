<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Portique>
 */
class PortiqueFactory extends Factory
{
    public function definition(): array
    {
        return [
            'nom' => $this->faker->unique()->randomElement(['P5', 'P8', 'P9']),
        ];
    }
}
