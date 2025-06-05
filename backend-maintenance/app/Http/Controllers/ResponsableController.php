<?php

namespace App\Http\Controllers;

use App\Models\Intervention;
use App\Models\User;
use App\Models\Portique;
use App\Models\CustomNotification;
use App\Models\Conge;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ResponsableController extends Controller
{
    // Dashboard responsable
    public function dashboard()
    {
        $user = Auth::user();
        
        // Statistiques principales
        $stats = [
            'interventions_en_attente' => Intervention::where('statut', 'en attente')->count(),
            'interventions_en_cours' => Intervention::where('statut', 'en cours')->count(),
            'interventions_critiques' => Intervention::where('priorite', 'critique')
                ->whereIn('statut', ['en attente', 'en cours'])->count(),
            'techniciens_disponibles' => User::where('role', 'technicien')
                ->where('statut', 'actif')->count(),
        ];
        
        // Dernières interventions critiques
        $interventionsCritiques = Intervention::where('priorite', 'critique')
            ->whereIn('statut', ['en attente', 'en cours'])
            ->with(['portique', 'conducteur', 'techniciens'])
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();
            
        return response()->json([
            'stats' => $stats,
            'interventions_critiques' => $interventionsCritiques,
        ]);
    }

    // Gérer les interventions en attente
    public function interventionsEnAttente()
    {
        $interventions = Intervention::where('statut', 'en attente')
            ->with(['portique', 'shift', 'conducteur'])
            ->orderBy('priorite', 'desc') // Critiques en premier
            ->orderBy('created_at', 'asc')
            ->paginate(20);
            
        return response()->json($interventions);
    }

    // Affecter une intervention
    public function affecterIntervention(Request $request, $interventionId)
    {
        $request->validate([
            'techniciens' => 'required|array|min:1',
            'techniciens.*' => 'exists:users,id',
            'notes_responsable' => 'nullable|string|max:1000',
        ]);

        $intervention = Intervention::findOrFail($interventionId);
        
        if ($intervention->statut !== 'en attente') {
            return response()->json([
                'message' => 'Cette intervention n\'est plus en attente'
            ], 400);
        }

        DB::transaction(function() use ($intervention, $request) {
            // Mettre à jour l'intervention
            $intervention->update([
                'responsable_id' => Auth::id(),
                'statut' => 'en cours',
                'notes_responsable' => $request->notes_responsable,
            ]);

            // Affecter les techniciens
            foreach ($request->techniciens as $technicienId) {
                $intervention->techniciens()->attach($technicienId, [
                    'date_debut' => now(),
                    'statut' => 'en cours'
                ]);
                
                // Notifier le technicien
                CustomNotification::create([
                    'user_id' => $technicienId,
                    'intervention_id' => $intervention->id,
                    'type' => 'affectation',
                    'titre' => "🔧 Nouvelle affectation - Portique {$intervention->portique->nom}",
                    'message' => "Intervention {$intervention->type} - {$intervention->detail}",
                ]);
            }
        });

        return response()->json([
            'message' => 'Intervention affectée avec succès',
            'intervention' => $intervention->load(['portique', 'techniciens'])
        ]);
    }

    // Gestion des techniciens
    public function gestionTechniciens()
    {
        $techniciens = User::where('role', 'technicien')
            ->with(['shift', 'interventionsTechnicien' => function($query) {
                $query->whereIn('statut', ['en attente', 'en cours']);
            }])
            ->get();
            
        return response()->json($techniciens);
    }

    // Gestion des congés
    public function gestionConges()
    {
        $conges = Conge::with(['user', 'approbateur'])
            ->orderBy('created_at', 'desc')
            ->paginate(20);
            
        return response()->json($conges);
    }

    // Approuver/refuser un congé
    public function gererConge(Request $request, $congeId)
    {
        $request->validate([
            'action' => 'required|in:approuver,refuser',
            'commentaire' => 'nullable|string|max:500',
        ]);

        $conge = Conge::findOrFail($congeId);
        
        if ($conge->statut !== 'en attente') {
            return response()->json([
                'message' => 'Ce congé a déjà été traité'
            ], 400);
        }

        $conge->update([
            'statut' => $request->action === 'approuver' ? 'approuvé' : 'refusé',
            'approuve_par' => Auth::id(),
            'raison' => $request->commentaire,
        ]);

        // Notifier l'utilisateur
        CustomNotification::create([
            'user_id' => $conge->user_id,
            'type' => $request->action === 'approuver' ? 'resolution' : 'affectation',
            'titre' => $request->action === 'approuver' ? 
                "✅ Congé approuvé" : 
                "❌ Congé refusé",
            'message' => $request->commentaire ?: 
                ($request->action === 'approuver' ? 
                    "Votre congé du {$conge->date_debut} au {$conge->date_fin} a été approuvé" :
                    "Votre congé du {$conge->date_debut} au {$conge->date_fin} a été refusé"),
        ]);

        return response()->json([
            'message' => 'Congé traité avec succès',
            'conge' => $conge->load(['user', 'approbateur'])
        ]);
    }

    // Clôturer une intervention
    public function cloturerIntervention(Request $request, $interventionId)
    {
        $request->validate([
            'notes_responsable' => 'nullable|string|max:1000',
        ]);

        $intervention = Intervention::findOrFail($interventionId);
        
        if ($intervention->statut !== 'en cours') {
            return response()->json([
                'message' => 'Cette intervention n\'est pas en cours'
            ], 400);
        }

        $intervention->update([
            'statut' => 'résolu',
            'date_fin' => now(),
            'notes_responsable' => $request->notes_responsable,
        ]);

        // Calculer automatiquement le temps de résolution
        $intervention->calculerTempsResolution();

        // Notifier le conducteur
        CustomNotification::create([
            'user_id' => $intervention->conducteur_id,
            'intervention_id' => $intervention->id,
            'type' => 'resolution',
            'titre' => "✅ Intervention résolue - Portique {$intervention->portique->nom}",
            'message' => "Votre signalement a été résolu. Temps de résolution: {$intervention->temps_resolution} minutes",
        ]);

        return response()->json([
            'message' => 'Intervention clôturée avec succès',
            'intervention' => $intervention->load(['portique', 'techniciens'])
        ]);
    }
}