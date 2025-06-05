<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Shift;

class ShiftSeeder extends Seeder
{
    public function run(): void
    {
        Shift::create([
            'nom' => 'Shift Matin',
            'debut' => '06:00:00',
            'fin' => '14:00:00',
        ]);

        Shift::create([
            'nom' => 'Shift Après-midi',
            'debut' => '14:00:00',
            'fin' => '22:00:00',
        ]);

        Shift::create([
            'nom' => 'Shift Nuit',
            'debut' => '22:00:00',
            'fin' => '06:00:00',
        ]);
    }
}