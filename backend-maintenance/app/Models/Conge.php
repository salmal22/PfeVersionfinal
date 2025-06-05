<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Conge extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'date_debut',
        'date_fin',
        'type',
        'statut',
        'raison',       // ✅ NOUVEAU
        'approuve_par', // ✅ NOUVEAU
    ];

    protected $casts = [
        'date_debut' => 'date',
        'date_fin' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // ✅ NOUVELLE RELATION - Qui a approuvé
    public function approbateur()
    {
        return $this->belongsTo(User::class, 'approuve_par');
    }

    // ✅ MÉTHODES HELPER UTILES
    public function isApprouve()
    {
        return $this->statut === 'approuvé';
    }

    public function isEnAttente()
    {
        return $this->statut === 'en attente';
    }

    public function isRefuse()
    {
        return $this->statut === 'refusé';
    }

    public function nombreJours()
    {
        return $this->date_debut->diffInDays($this->date_fin) + 1;
    }
}
