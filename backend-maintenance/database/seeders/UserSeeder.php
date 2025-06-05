<?php
// ==================================================
// MISE À JOUR: UserSeeder.php (avec nouveaux champs)
// ==================================================

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        User::truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // Responsables
        User::create([
            'name' => 'Administrateur',
            'email' => 'admin@marsamaroc.ma',
            'password' => Hash::make('admin123'),
            'role' => 'responsable',
            'telephone' => '+212600000001',
            'shift_id' => 1, // Matin
            'statut' => 'actif',
            'date_embauche' => '2024-01-01',
        ]);

        User::create([
            'name' => 'Responsable Test',
            'email' => 'responsable@marsamaroc.ma',
            'password' => Hash::make('responsable123'),
            'role' => 'responsable',
            'telephone' => '+212600000002',
            'shift_id' => 2, // Après-midi
            'statut' => 'actif',
            'date_embauche' => '2024-01-15',
        ]);

        // Conducteurs
        User::create([
            'name' => 'Ahmed Benali',
            'email' => 'conducteur@marsamaroc.ma',
            'password' => Hash::make('conducteur123'),
            'role' => 'conducteur',
            'telephone' => '+212600000003',
            'shift_id' => 1, // Matin
            'statut' => 'actif',
            'date_embauche' => '2024-02-01',
        ]);
        
        User::create([
            'name' => 'Youssef Kadiri',
            'email' => 'conducteur2@marsamaroc.ma',
            'password' => Hash::make('conducteur123'),
            'role' => 'conducteur',
            'telephone' => '+212600000004',
            'shift_id' => 2, // Après-midi
            'statut' => 'actif',
            'date_embauche' => '2024-02-15',
        ]);

        User::create([
            'name' => 'Karim Alaoui',
            'email' => 'conducteur3@marsamaroc.ma',
            'password' => Hash::make('conducteur123'),
            'role' => 'conducteur',
            'telephone' => '+212600000005',
            'shift_id' => 3, // Nuit
            'statut' => 'actif',
            'date_embauche' => '2024-03-01',
        ]);

        // Techniciens
        User::create([
            'name' => 'Hassan Tazi',
            'email' => 'technicien@marsamaroc.ma',
            'password' => Hash::make('technicien123'),
            'role' => 'technicien',
            'telephone' => '+212600000006',
            'shift_id' => 1, // Matin
            'statut' => 'actif',
            'date_embauche' => '2024-01-20',
        ]);
        
        User::create([
            'name' => 'Omar Sebti',
            'email' => 'technicien2@marsamaroc.ma',
            'password' => Hash::make('technicien123'),
            'role' => 'technicien',
            'telephone' => '+212600000007',
            'shift_id' => 2, // Après-midi
            'statut' => 'actif',
            'date_embauche' => '2024-03-10',
        ]);
        
        User::create([
            'name' => 'Said Bennani',
            'email' => 'technicien3@marsamaroc.ma',
            'password' => Hash::make('technicien123'),
            'role' => 'technicien',
            'telephone' => '+212600000008',
            'shift_id' => 3, // Nuit
            'statut' => 'actif',
            'date_embauche' => '2024-04-01',
        ]);
    }
}
