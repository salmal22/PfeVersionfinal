<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Shift;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UserShiftSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::all();
        $shifts = Shift::all();

        foreach ($users as $user) {
            $user->shifts()->attach($shifts->random()->id);
        }
    }
}