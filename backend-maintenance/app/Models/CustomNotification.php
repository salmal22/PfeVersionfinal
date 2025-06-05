<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CustomNotification extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'type',
        'titre',
        'message',
        'lu',
    ];

    protected $casts = [
        'lu' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function intervention()
    {
        return $this->belongsTo(Intervention::class);
    }

    // ✅ MÉTHODES HELPER UTILES
    public function marquerCommelue()
    {
        $this->update(['lu' => true]);
    }

    public function isLue()
    {
        return $this->lu;
    }

    // Scopes utiles
    public function scopeNonLues($query)
    {
        return $query->where('lu', false);
    }

    public function scopeParType($query, $type)
    {
        return $query->where('type', $type);
    }
}