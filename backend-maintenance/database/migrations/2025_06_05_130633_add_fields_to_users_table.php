<?php
// ==================================================
// MIGRATION 1: add_fields_to_users_table.php
// ==================================================

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('telephone', 20)->nullable()->after('email');
            $table->foreignId('shift_id')->nullable()->constrained()->onDelete('set null')->after('role');
            $table->enum('statut', ['actif', 'inactif', 'congé'])->default('actif')->after('shift_id');
            $table->date('date_embauche')->nullable()->after('statut');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['shift_id']);
            $table->dropColumn(['telephone', 'shift_id', 'statut', 'date_embauche']);
        });
    }
};
