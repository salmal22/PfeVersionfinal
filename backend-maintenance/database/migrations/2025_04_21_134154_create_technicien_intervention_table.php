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
        Schema::create('technicien_intervention', function (Blueprint $table) {
            $table->id();

            // Références
            $table->foreignId('technicien_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('intervention_id')->constrained()->onDelete('cascade');

            // Détails de l’intervention
            $table->dateTime('date_debut');
            $table->dateTime('date_fin')->nullable(); // Peut être vide si pas encore terminé

            // Action réalisée par le technicien
            $table->text('action_realisee')->nullable();

            // Statut du travail du technicien sur l’intervention
            $table->enum('statut', ['en attente', 'en cours', 'résolu'])->default('en attente');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('technicien_intervention');
    }
};