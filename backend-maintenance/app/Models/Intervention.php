<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Carbon\Carbon;

class Intervention extends Model
{
    use HasFactory;

    protected $fillable = [
        'portique_id',
        'shift_id',
        'conducteur_id',
        'responsable_id',
        'type',
        'detail',
        'date_debut',
        'date_fin',
        'description',
        'statut',
        'priorite',           // ✅ NOUVEAU
        'temps_resolution',   // ✅ NOUVEAU
        'notes_technicien',   // ✅ NOUVEAU
        'notes_responsable',  // ✅ NOUVEAU
    ];

    protected $casts = [
        'date_debut' => 'datetime',
        'date_fin' => 'datetime',
    ];

    // Relations
    public function portique()
    {
        return $this->belongsTo(Portique::class);
    }

    public function shift()
    {
        return $this->belongsTo(Shift::class);
    }

    public function conducteur()
    {
        return $this->belongsTo(User::class, 'conducteur_id');
    }

    public function responsable()
    {
        return $this->belongsTo(User::class, 'responsable_id');
    }

    public function techniciens()
    {
        return $this->belongsToMany(User::class, 'technicien_intervention', 'intervention_id', 'technicien_id')
                    ->withPivot('date_debut', 'date_fin', 'action_realisee', 'statut')
                    ->withTimestamps();
    }

    public function historiques()
    {
        return $this->hasMany(HistoriqueIntervention::class);
    }

    // ✅ NOUVELLE RELATION - Notifications liées
    public function customNotifications()
    {
        return $this->hasMany(CustomNotification::class);
    }

    // ✅ MÉTHODES HELPER UTILES
    public function isEnAttente()
    {
        return $this->statut === 'en attente';
    }

    public function isEnCours()
    {
        return $this->statut === 'en cours';
    }

    public function isResolu()
    {
        return $this->statut === 'résolu';
    }

    public function isCritique()
    {
        return $this->priorite === 'critique';
    }

    // Calculer automatiquement le temps de résolution
    public function calculerTempsResolution()
    {
        if ($this->date_debut && $this->date_fin) {
            $this->temps_resolution = $this->date_debut->diffInMinutes($this->date_fin);
            $this->save();
        }
    }

    // Durée depuis le début
    public function dureeDepuisDebut()
    {
        if ($this->date_debut) {
            return $this->date_debut->diffForHumans();
        }
        return null;
    }
}