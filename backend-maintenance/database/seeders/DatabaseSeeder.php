<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // ORDRE CORRECT : Dépendances respectées
        $this->call([
            // 1. Tables sans dépendances d'abord
            ShiftSeeder::class,              // ✅ Aucune dépendance
            PortiqueSeeder::class,           // ✅ Aucune dépendance
            
            // 2. Users (dépend de shifts)
            UserSeeder::class,               // ✅ Dépend de shifts
            
            // 3. Relations many-to-many
            UserShiftSeeder::class,          // ✅ Dépend de users + shifts
            
            // 4. Interventions (dépend de users, shifts, portiques)
            InterventionSeeder::class,       // ✅ Dépend de users + shifts + portiques
            
            // 5. Relations avec interventions
            TechnicienInterventionSeeder::class, // ✅ Dépend d'interventions + users
            
            // 6. Congés (dépend de users)
            CongeSeeder::class,              // ✅ Dépend de users
            
            // 7. Historique (dépend d'interventions + users)
            HistoriqueInterventionSeeder::class, // ✅ Dépend d'interventions + users
        ]);
    }
}