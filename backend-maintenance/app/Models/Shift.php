<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Shift extends Model
{
    use HasFactory;

    protected $fillable = ['nom', 'debut', 'fin'];

    public function users()
    {
        return $this->belongsToMany(User::class, 'user_shift');
    }

    public function interventions()
    {
        return $this->hasMany(Intervention::class);
    }

    public function historiques()
    {
        return $this->hasMany(HistoriqueIntervention::class);
    }
}