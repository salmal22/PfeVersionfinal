<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('conges', function (Blueprint $table) {
            $table->id();

            // Référence à l'utilisateur concerné
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');

            // Plage de congé
            $table->date('date_debut');
            $table->date('date_fin');
            
            // Ajouté selon le contrôleur
            $table->enum('type', ['maladie', 'vacances']);
            $table->enum('statut', ['approuvé', 'en attente', 'refusé']);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('conges');
    }
};