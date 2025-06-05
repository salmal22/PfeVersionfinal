<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class TechnicienIntervention extends Model
{
    use HasFactory;

    protected $table = 'technicien_intervention';

    protected $fillable = [
        'technicien_id', 'intervention_id', 'date_debut',
        'date_fin', 'action_realisee', 'statut'
    ];

    public function technicien()
    {
        return $this->belongsTo(User::class, 'technicien_id');
    }

    public function intervention()
    {
        return $this->belongsTo(Intervention::class);
    }
}