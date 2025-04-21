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
        Schema::create('historique_interventions', function (Blueprint $table) {
            $table->id();

            // Champs repris de la table interventions
            $table->foreignId('intervention_id')->constrained('interventions')->onDelete('cascade');
            $table->foreignId('portique_id')->constrained('portiques');
            $table->foreignId('shift_id')->constrained('shifts');
            $table->foreignId('conducteur_id')->constrained('users');

            $table->string('type'); // électrique, hydraulique, etc.
            $table->string('detail'); // chariot, ascenseur, etc.

            $table->dateTime('date_debut');
            $table->dateTime('date_fin')->nullable();

            $table->text('description')->nullable();
            $table->enum('statut', ['en attente', 'en cours', 'résolu'])->default('en attente');

            // Qui a fait la modification
            $table->foreignId('updated_by')->constrained('users');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('historique_interventions');
    }
};