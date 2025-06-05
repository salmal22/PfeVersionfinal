<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('portiques', function (Blueprint $table) {
            $table->text('description')->nullable()->after('nom');
            $table->enum('statut', ['actif', 'en panne', 'maintenance'])->default('actif')->after('description');
        });
    }

    public function down(): void
    {
        Schema::table('portiques', function (Blueprint $table) {
            $table->dropColumn(['description', 'statut']);
        });
    }
};