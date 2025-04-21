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
        Schema::create('interventions', function (Blueprint $table) {
            $table->id();

            // Références
            $table->foreignId('portique_id')->constrained()->onDelete('cascade');
            $table->foreignId('shift_id')->constrained()->onDelete('cascade');
            $table->foreignId('conducteur_id')->constrained('users')->onDelete('cascade');

            // Responsable qui a validé la résolution
            $table->foreignId('responsable_id')->nullable()->constrained('users')->onDelete('set null');
            // Informations sur l'arrêt/panne
            $table->enum('type', ['électrique', 'hydraulique', 'mécanique']);
            $table->enum('detail', [
                'ascenseur',
                'avant-bec',
                'chariot',
                'headblock',
                'levage',
                'TLS',
                'spreader',
                'translation'
            ]);

            $table->datetime('date_debut');
            $table->datetime('date_fin')->nullable();

            $table->text('description')->nullable();

            $table->enum('statut', ['en attente', 'en cours', 'résolu'])->default('en attente');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('interventions');
    }
};