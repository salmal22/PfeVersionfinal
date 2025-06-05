<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class HistoriqueIntervention extends Model
{
    use HasFactory;

    protected $fillable = [
        'intervention_id', 'portique_id', 'shift_id', 'conducteur_id',
        'type', 'detail', 'date_debut', 'date_fin', 'description', 'statut', 'updated_by'
    ];

    public function intervention()
    {
        return $this->belongsTo(Intervention::class);
    }

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

    public function updatedBy()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }
}
