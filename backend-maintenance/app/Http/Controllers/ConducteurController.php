<?php
// ==================================================
// FICHIER 1: ConducteurController.php (COPIER COMPLET)
// ==================================================

namespace App\Http\Controllers;

use App\Models\Intervention;
use App\Models\Portique;
use App\Models\Shift;
use App\Models\CustomNotification;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ConducteurController extends Controller
{
    // Dashboard conducteur
    public function dashboard()
    {
        $user = Auth::user();
        
        // Mes signalements récents
        $mesSignalements = Intervention::where('conducteur_id', $user->id)
            ->with(['portique', 'shift', 'responsable'])
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();
            
        // Statistiques personnelles
        $stats = [
            'total_signalements' => Intervention::where('conducteur_id', $user->id)->count(),
            'en_attente' => Intervention::where('conducteur_id', $user->id)->where('statut', 'en attente')->count(),
            'en_cours' => Intervention::where('conducteur_id', $user->id)->where('statut', 'en cours')->count(),
            'resolus' => Intervention::where('conducteur_id', $user->id)->where('statut', 'résolu')->count(),
        ];
            
        return response()->json([
            'user' => $user->load('shift'),
            'mes_signalements' => $mesSignalements,
            'stats' => $stats
        ]);
    }

    // Signaler une panne
    public function signalerPanne(Request $request)
    {
        $request->validate([
            'portique_id' => 'required|exists:portiques,id',
            'type' => 'required|in:électrique,hydraulique,mécanique',
            'detail' => 'required|in:ascenseur,avant-bec,chariot,headblock,levage,TLS,spreader,translation',
            'description' => 'required|string|max:1000',
            'urgence' => 'boolean',
        ]);

        $user = Auth::user();
        
        // Déterminer la priorité basée sur l'urgence
        $priorite = $request->urgence ? 'critique' : 'normale';
        
        // Créer l'intervention
        $intervention = Intervention::create([
            'portique_id' => $request->portique_id,
            'shift_id' => $user->shift_id,
            'conducteur_id' => $user->id,
            'type' => $request->type,
            'detail' => $request->detail,
            'description' => $request->description,
            'date_debut' => now(),
            'statut' => 'en attente',
            'priorite' => $priorite,
        ]);

        // Notifier tous les responsables
        $responsables = User::where('role', 'responsable')->get();
        foreach ($responsables as $responsable) {
            CustomNotification::create([
                'user_id' => $responsable->id,
                'intervention_id' => $intervention->id,
                'type' => $request->urgence ? 'urgence' : 'nouvelle_panne',
                'titre' => $request->urgence ? 
                    "🚨 PANNE CRITIQUE - Portique {$intervention->portique->nom}" : 
                    "🔧 Nouvelle panne - Portique {$intervention->portique->nom}",
                'message' => "Signalée par {$user->name}: {$request->description}",
            ]);
        }

        return response()->json([
            'message' => 'Signalement envoyé avec succès',
            'intervention' => $intervention->load(['portique', 'shift'])
        ], 201);
    }

    // Mes signalements
    public function mesSignalements()
    {
        $user = Auth::user();
        
        $interventions = Intervention::where('conducteur_id', $user->id)
            ->with(['portique', 'shift', 'responsable', 'techniciens'])
            ->orderBy('created_at', 'desc')
            ->paginate(15);
            
        return response()->json($interventions);
    }

    // Portiques disponibles
    public function getPortiques()
    {
        $portiques = Portique::all();
        return response()->json($portiques);
    }
}
