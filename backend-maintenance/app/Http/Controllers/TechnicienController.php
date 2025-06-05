<?php

namespace App\Http\Controllers;

use App\Models\Intervention;
use App\Models\TechnicienIntervention;
use App\Models\CustomNotification;
use App\Models\Conge;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TechnicienController extends Controller
{
    // Dashboard technicien
    public function dashboard()
    {
        $user = Auth::user();
        
        // Mes interventions en cours
        $mesInterventions = $user->interventionsTechnicien()
            ->whereIn('statut', ['en attente', 'en cours'])
            ->with(['portique', 'shift', 'conducteur'])
            ->orderBy('priorite', 'desc')
            ->get();
        
        // Mes statistiques
        $stats = [
            'interventions_en_cours' => $user->interventionsTechnicien()
                ->whereIn('statut', ['en attente', 'en cours'])->count(),
            'interventions_resolues_ce_mois' => $user->interventionsTechnicien()
                ->where('statut', 'résolu')
                ->whereMonth('created_at', now()->month)->count(),
            'temps_moyen_resolution' => $this->calculerTempsMoyenResolution($user->id),
        ];
            
        return response()->json([
            'mes_interventions' => $mesInterventions,
            'stats' => $stats,
        ]);
    }

    // Mes interventions
    public function mesInterventions()
    {
        $user = Auth::user();
        
        $interventions = $user->interventionsTechnicien()
            ->with(['portique', 'shift', 'conducteur', 'responsable'])
            ->orderBy('priorite', 'desc')
            ->orderBy('pivot_created_at', 'desc')
            ->paginate(15);
            
        return response()->json($interventions);
    }

    // Démarrer une intervention
    public function demarrerIntervention($interventionId)
    {
        $user = Auth::user();
        
        $intervention = Intervention::findOrFail($interventionId);
        
        // Vérifier que le technicien est affecté
        $affectation = $intervention->techniciens()
            ->where('technicien_id', $user->id)
            ->first();
            
        if (!$affectation) {
            return response()->json([
                'message' => 'Vous n\'êtes pas affecté à cette intervention'
            ], 403);
        }

        if ($affectation->pivot->statut !== 'en attente') {
            return response()->json([
                'message' => 'Cette intervention a déjà été démarrée'
            ], 400);
        }

        // Mettre à jour le statut
        $intervention->techniciens()->updateExistingPivot($user->id, [
            'statut' => 'en cours',
            'date_debut' => now(),
        ]);

        return response()->json([
            'message' => 'Intervention démarrée',
            'intervention' => $intervention->load(['portique', 'techniciens'])
        ]);
    }

    // Ajouter des notes/actions
    public function ajouterAction(Request $request, $interventionId)
    {
        $request->validate([
            'action_realisee' => 'required|string|max:1000',
        ]);

        $user = Auth::user();
        $intervention = Intervention::findOrFail($interventionId);
        
        // Vérifier l'affectation
        $affectation = $intervention->techniciens()
            ->where('technicien_id', $user->id)
            ->first();
            
        if (!$affectation) {
            return response()->json([
                'message' => 'Vous n\'êtes pas affecté à cette intervention'
            ], 403);
        }

        // Mettre à jour les notes
        $intervention->techniciens()->updateExistingPivot($user->id, [
            'action_realisee' => $request->action_realisee,
        ]);

        // Mettre à jour les notes technicien globales
        $intervention->update([
            'notes_technicien' => $request->action_realisee,
        ]);

        return response()->json([
            'message' => 'Action ajoutée avec succès',
            'intervention' => $intervention->load(['portique', 'techniciens'])
        ]);
    }

    // Terminer une intervention
    public function terminerIntervention(Request $request, $interventionId)
    {
        $request->validate([
            'action_realisee' => 'required|string|max:1000',
        ]);

        $user = Auth::user();
        $intervention = Intervention::findOrFail($interventionId);
        
        // Vérifier l'affectation
        $affectation = $intervention->techniciens()
            ->where('technicien_id', $user->id)
            ->first();
            
        if (!$affectation || $affectation->pivot->statut !== 'en cours') {
            return response()->json([
                'message' => 'Intervention non trouvée ou non en cours'
            ], 400);
        }

        // Mettre à jour l'affectation du technicien
        $intervention->techniciens()->updateExistingPivot($user->id, [
            'statut' => 'résolu',
            'date_fin' => now(),
            'action_realisee' => $request->action_realisee,
        ]);

        // Mettre à jour les notes de l'intervention
        $intervention->update([
            'notes_technicien' => $request->action_realisee,
        ]);

        // Notifier le responsable
        if ($intervention->responsable_id) {
            CustomNotification::create([
                'user_id' => $intervention->responsable_id,
                'intervention_id' => $intervention->id,
                'type' => 'resolution',
                'titre' => "🔧 Travail terminé - Portique {$intervention->portique->nom}",
                'message' => "Le technicien {$user->name} a terminé son travail sur cette intervention",
            ]);
        }

        return response()->json([
            'message' => 'Intervention terminée avec succès',
            'intervention' => $intervention->load(['portique', 'techniciens'])
        ]);
    }

    // Demander un congé
    public function demanderConge(Request $request)
    {
        $request->validate([
            'date_debut' => 'required|date|after:today',
            'date_fin' => 'required|date|after:date_debut',
            'type' => 'required|in:maladie,vacances',
            'raison' => 'nullable|string|max:500',
        ]);

        $user = Auth::user();
        
        $conge = Conge::create([
            'user_id' => $user->id,
            'date_debut' => $request->date_debut,
            'date_fin' => $request->date_fin,
            'type' => $request->type,
            'statut' => 'en attente',
            'raison' => $request->raison,
        ]);

        return response()->json([
            'message' => 'Demande de congé envoyée',
            'conge' => $conge
        ], 201);
    }

    // Mes congés
    public function mesConges()
    {
        $user = Auth::user();
        
        $conges = Conge::where('user_id', $user->id)
            ->with('approbateur')
            ->orderBy('created_at', 'desc')
            ->paginate(10);
            
        return response()->json($conges);
    }

    // Helper - Calculer temps moyen de résolution
    private function calculerTempsMoyenResolution($technicienId)
    {
        $interventions = TechnicienIntervention::where('technicien_id', $technicienId)
            ->where('statut', 'résolu')
            ->whereNotNull('date_fin')
            ->get();

        if ($interventions->isEmpty()) {
            return 0;
        }

        $totalMinutes = $interventions->sum(function($intervention) {
            return $intervention->date_debut->diffInMinutes($intervention->date_fin);
        });

        return round($totalMinutes / $interventions->count());
    }
}
