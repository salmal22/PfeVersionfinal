<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('interventions', function (Blueprint $table) {
            $table->enum('priorite', ['faible', 'normale', 'élevée', 'critique'])->default('normale')->after('statut');
            $table->integer('temps_resolution')->nullable()->comment('en minutes')->after('date_fin');
            $table->text('notes_technicien')->nullable()->after('description');
            $table->text('notes_responsable')->nullable()->after('notes_technicien');
        });
    }

    public function down(): void
    {
        Schema::table('interventions', function (Blueprint $table) {
            $table->dropColumn(['priorite', 'temps_resolution', 'notes_technicien', 'notes_responsable']);
        });
    }
};