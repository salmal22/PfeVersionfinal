<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('conges', function (Blueprint $table) {
            $table->text('raison')->nullable()->after('statut');
            $table->foreignId('approuve_par')->nullable()->constrained('users')->onDelete('set null')->after('raison');
        });
    }

    public function down(): void
    {
        Schema::table('conges', function (Blueprint $table) {
            $table->dropForeign(['approuve_par']);
            $table->dropColumn(['raison', 'approuve_par']);
        });
    }
};