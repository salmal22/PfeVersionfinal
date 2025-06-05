<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Portique extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom',
        'description',  // ✅ NOUVEAU
        'statut',       // ✅ NOUVEAU
    ];

    public function interventions()
    {
        return $this->hasMany(Intervention::class);
    }

    public function historiques()
    {
        return $this->hasMany(HistoriqueIntervention::class);
    }

    // ✅ MÉTHODES HELPER UTILES
    public function isActif()
    {
        return $this->statut === 'actif';
    }

    public function isEnPanne()
    {
        return $this->statut === 'en panne';
    }

    public function isEnMaintenance()
    {
        return $this->statut === 'maintenance';
    }

    // Nombre d'interventions en cours
    public function interventionsEnCours()
    {
        return $this->interventions()->whereIn('statut', ['en attente', 'en cours']);
    }
}