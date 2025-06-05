<?php
// ==================================================
// MODEL 1: User.php (COMPLET avec nouveaux champs)
// ==================================================

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'telephone',        // ✅ NOUVEAU
        'shift_id',         // ✅ NOUVEAU
        'statut',           // ✅ NOUVEAU
        'date_embauche',    // ✅ NOUVEAU
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'date_embauche' => 'date',  // ✅ NOUVEAU
    ];

    // ✅ NOUVELLE RELATION - Shift direct
    public function shift()
    {
        return $this->belongsTo(Shift::class);
    }

    // Relations many-to-many avec shifts (pour la table pivot)
    public function shifts()
    {
        return $this->belongsToMany(Shift::class, 'user_shift');
    }

    // Interventions signalées par le conducteur
    public function interventionsSignalees()
    {
        return $this->hasMany(Intervention::class, 'conducteur_id');
    }

    // Interventions validées par le responsable
    public function interventionsValidees()
    {
        return $this->hasMany(Intervention::class, 'responsable_id');
    }

    // Interventions affectées au technicien
    public function interventionsTechnicien()
    {
        return $this->belongsToMany(Intervention::class, 'technicien_intervention', 'technicien_id', 'intervention_id')
                    ->withPivot('date_debut', 'date_fin', 'action_realisee', 'statut')
                    ->withTimestamps();
    }

    // Congés de l'utilisateur
    public function conges()
    {
        return $this->hasMany(Conge::class, 'user_id');
    }

    // ✅ NOUVELLE RELATION - Congés approuvés par ce responsable
    public function congesApprouves()
    {
        return $this->hasMany(Conge::class, 'approuve_par');
    }

    // Historiques modifiés par cet utilisateur
    public function historiquesModifies()
    {
        return $this->hasMany(HistoriqueIntervention::class, 'updated_by');
    }

    // ✅ NOUVELLE RELATION - Notifications personnalisées
    public function customNotifications()
    {
        return $this->hasMany(CustomNotification::class);
    }

    // ✅ MÉTHODES HELPER UTILES
    public function isConducteur()
    {
        return $this->role === 'conducteur';
    }

    public function isTechnicien()
    {
        return $this->role === 'technicien';
    }

    public function isResponsable()
    {
        return $this->role === 'responsable';
    }

    public function isActif()
    {
        return $this->statut === 'actif';
    }
}