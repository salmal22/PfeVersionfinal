<?php

namespace App\Http\Controllers;

use App\Models\Intervention;
use App\Models\HistoriqueIntervention;
use App\Models\TechnicienIntervention;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class InterventionController extends Controller
{
    // Afficher toutes les interventions
    public function index()
    {
        $interventions = Intervention::with(['portique', 'shift', 'conducteur', 'responsable', 'techniciens'])
            ->orderBy('date_debut', 'desc')
            ->get();
        return response()->json($interventions);
    }

    // Créer une nouvelle intervention
    public function store(Request $request)
    {
        Log::info('--------------------------------------------------------------------------------');
        Log::info('Creating new intervention', $request->all());
        $request->validate([
            'portique_id' => 'required|exists:portiques,id',
            'shift_id' => 'required|exists:shifts,id',
            'conducteur_id' => 'required|exists:users,id',
            'responsable_id' => 'nullable|exists:users,id',
            'type' => 'required|in:électrique,hydraulique,mécanique',
            'detail' => 'required|string',
            'date_debut' => 'required|date',
            'description' => 'nullable|string',
            'statut' => 'nullable|in:en attente,en cours,résolu',
        ]);

        // Si le statut n'est pas fourni, on le définit à "en attente" par défaut
        if (!$request->has('statut')) {
            $request->merge(['statut' => 'en attente']);
        }

        $intervention = Intervention::create($request->all());

        // Créer une entrée dans l'historique
        HistoriqueIntervention::create([
            'intervention_id' => $intervention->id,
            'portique_id' => $intervention->portique_id,
            'shift_id' => $intervention->shift_id,
            'conducteur_id' => $intervention->conducteur_id,
            'type' => $intervention->type,
            'detail' => $intervention->detail,
            'date_debut' => $intervention->date_debut,
            'date_fin' => $intervention->date_fin,
            'description' => $intervention->description,
            'statut' => $intervention->statut,
            'updated_by' => Auth::id()
        ]);

        return response()->json($intervention->load(['portique', 'shift', 'conducteur']), 201);
    }

    // Afficher une intervention spécifique
    public function show($id)
    {
        $intervention = Intervention::with(['portique', 'shift', 'conducteur', 'responsable', 'techniciens'])
            ->findOrFail($id);
        return response()->json($intervention);
    }

    // Mettre à jour une intervention
    public function update(Request $request, $id)
    {
        $intervention = Intervention::findOrFail($id);
        
        $request->validate([
            'portique_id' => 'sometimes|exists:portiques,id',
            'shift_id' => 'sometimes|exists:shifts,id',
            'conducteur_id' => 'sometimes|exists:users,id',
            'responsable_id' => 'nullable|exists:users,id',
            'type' => 'sometimes|in:électrique,hydraulique,mécanique',
            'detail' => 'sometimes|string',
            'date_debut' => 'sometimes|date',
            'date_fin' => 'nullable|date',
            'description' => 'nullable|string',
            'statut' => 'sometimes|in:en attente,en cours,résolu',
        ]);

        // Sauvegarder l'état avant mise à jour
        $oldData = $intervention->getAttributes();
        
        $intervention->update($request->all());
        
        // Créer une entrée dans l'historique si le statut change
        if ($oldData['statut'] != $intervention->statut || 
            $request->has('date_fin') && $oldData['date_fin'] != $intervention->date_fin) {
            
            HistoriqueIntervention::create([
                'intervention_id' => $intervention->id,
                'portique_id' => $intervention->portique_id,
                'shift_id' => $intervention->shift_id,
                'conducteur_id' => $intervention->conducteur_id,
                'type' => $intervention->type,
                'detail' => $intervention->detail,
                'date_debut' => $intervention->date_debut,
                'date_fin' => $intervention->date_fin,
                'description' => $intervention->description,
                'statut' => $intervention->statut,
                'updated_by' => Auth::id()
            ]);
        }
        
        return response()->json($intervention->load(['portique', 'shift', 'conducteur', 'responsable', 'techniciens']));
    }

    // Supprimer une intervention
    public function destroy($id)
    {
        $intervention = Intervention::findOrFail($id);
        $intervention->delete();
        return response()->json(null, 204);
    }
    
    // Récupérer toutes les anomalies (interventions en attente)
    public function getAnomalies()
    {
        $anomalies = Intervention::where('statut', 'en attente')
            ->with(['portique', 'shift', 'conducteur'])
            ->orderBy('date_debut', 'desc')
            ->get();
            
        return response()->json($anomalies);
    }
    
    // Récupérer toutes les pannes (interventions en cours ou résolues)
    public function getPannes()
    {
        $pannes = Intervention::whereIn('statut', ['en cours', 'résolu'])
            ->with(['portique', 'shift', 'conducteur', 'responsable', 'techniciens'])
            ->orderBy('date_debut', 'desc')
            ->get();
            
        return response()->json($pannes);
    }
    
    // Récupérer les interventions pour un portique spécifique
    public function getInterventionsParPortique($portiqueId)
    {
        $interventions = Intervention::where('portique_id', $portiqueId)
            ->with(['portique', 'shift', 'conducteur', 'responsable', 'techniciens'])
            ->orderBy('date_debut', 'desc')
            ->get();
            
        return response()->json($interventions);
    }
    
    // Récupérer les interventions pour un conducteur spécifique
    public function getInterventionsConducteur($conducteurId)
    {
        $interventions = Intervention::where('conducteur_id', $conducteurId)
            ->with(['portique', 'shift', 'responsable'])
            ->orderBy('date_debut', 'desc')
            ->get();
            
        return response()->json($interventions);
    }
    
    // Récupérer les interventions assignées à un technicien
    public function getInterventionsTechnicien($technicienId)
    {
        $interventions = Intervention::whereHas('techniciens', function($query) use ($technicienId) {
                $query->where('technicien_id', $technicienId);
            })
            ->with(['portique', 'shift', 'conducteur', 'responsable', 'techniciens'])
            ->orderBy('date_debut', 'desc')
            ->get();
            
        return response()->json($interventions);
    }
    
    // Assigner un responsable à une intervention (convertir anomalie en panne)
    public function assignerResponsable(Request $request, $id)
    {
        $intervention = Intervention::findOrFail($id);
        
        // Vérifier que l'intervention est bien en attente
        if ($intervention->statut !== 'en attente') {
            return response()->json([
                'message' => 'Cette intervention n\'est pas en attente d\'assignation'
            ], 400);
        }
        
        $request->validate([
            'responsable_id' => 'required|exists:users,id'
        ]);
        
        // Mise à jour du statut et du responsable
        $intervention->responsable_id = $request->responsable_id;
        $intervention->statut = 'en cours';
        $intervention->save();
        
        // Créer une entrée dans l'historique
        HistoriqueIntervention::create([
            'intervention_id' => $intervention->id,
            'portique_id' => $intervention->portique_id,
            'shift_id' => $intervention->shift_id,
            'conducteur_id' => $intervention->conducteur_id,
            'type' => $intervention->type,
            'detail' => $intervention->detail,
            'date_debut' => $intervention->date_debut,
            'date_fin' => null,
            'description' => $intervention->description,
            'statut' => 'en cours',
            'updated_by' => Auth::id()
        ]);
        
        return response()->json($intervention->load(['portique', 'shift', 'conducteur', 'responsable']));
    }
    
    // Assigner des techniciens à une intervention
    public function assignerTechniciens(Request $request, $id)
    {
        $intervention = Intervention::findOrFail($id);
        
        // Vérifier que l'intervention est bien en cours
        if ($intervention->statut !== 'en cours') {
            return response()->json([
                'message' => 'Cette intervention n\'est pas en cours'
            ], 400);
        }
        
        $request->validate([
            'techniciens' => 'required|array',
            'techniciens.*' => 'exists:users,id'
        ]);
        
        // Associer les techniciens à l'intervention
        foreach ($request->techniciens as $technicienId) {
            // Vérifier si le technicien est déjà assigné
            $existingAssignment = TechnicienIntervention::where('technicien_id', $technicienId)
                ->where('intervention_id', $intervention->id)
                ->first();
                
            if (!$existingAssignment) {
                $intervention->techniciens()->attach($technicienId, [
                    'date_debut' => now(),
                    'statut' => 'en cours'
                ]);
            }
        }
        
        return response()->json($intervention->load(['portique', 'shift', 'conducteur', 'responsable', 'techniciens']));
    }
    
    // Marquer une intervention comme résolue
    public function marquerResolue(Request $request, $id)
    {
        $intervention = Intervention::findOrFail($id);
        
        // Vérifier que l'intervention est bien en cours
        if ($intervention->statut !== 'en cours') {
            return response()->json([
                'message' => 'Cette intervention n\'est pas en cours'
            ], 400);
        }
        
        // Mise à jour du statut et de la date de fin
        $intervention->statut = 'résolu';
        $intervention->date_fin = now();
        $intervention->save();
        
        // Mettre à jour le statut des techniciens associés
        foreach ($intervention->techniciens as $technicien) {
            $pivotRow = $technicien->pivot;
            if ($pivotRow->statut !== 'résolu') {
                $pivotRow->statut = 'résolu';
                $pivotRow->date_fin = now();
                $pivotRow->save();
            }
        }
        
        // Créer une entrée dans l'historique
        HistoriqueIntervention::create([
            'intervention_id' => $intervention->id,
            'portique_id' => $intervention->portique_id,
            'shift_id' => $intervention->shift_id,
            'conducteur_id' => $intervention->conducteur_id,
            'type' => $intervention->type,
            'detail' => $intervention->detail,
            'date_debut' => $intervention->date_debut,
            'date_fin' => now(),
            'description' => $intervention->description,
            'statut' => 'résolu',
            'updated_by' => Auth::id()
        ]);
        
        return response()->json($intervention->load(['portique', 'shift', 'conducteur', 'responsable', 'techniciens']));
    }
    
    // Recherche d'interventions
    public function search(Request $request)
    {
        $query = Intervention::query();
        
        if ($request->has('keyword')) {
            $keyword = $request->keyword;
            $query->where(function($q) use ($keyword) {
                $q->where('description', 'like', "%{$keyword}%")
                  ->orWhere('type', 'like', "%{$keyword}%")
                  ->orWhere('detail', 'like', "%{$keyword}%");
            });
        }
        
        if ($request->has('portique_id')) {
            $query->where('portique_id', $request->portique_id);
        }
        
        if ($request->has('statut')) {
            $query->where('statut', $request->statut);
        }
        
        if ($request->has('date_debut_min')) {
            $query->whereDate('date_debut', '>=', $request->date_debut_min);
        }
        
        if ($request->has('date_debut_max')) {
            $query->whereDate('date_debut', '<=', $request->date_debut_max);
        }
        
        if ($request->has('conducteur_id')) {
            $query->where('conducteur_id', $request->conducteur_id);
        }
        
        if ($request->has('responsable_id')) {
            $query->where('responsable_id', $request->responsable_id);
        }
        
        return response()->json($query->with(['portique', 'shift', 'conducteur', 'responsable', 'techniciens'])
            ->orderBy('date_debut', 'desc')
            ->paginate($request->perPage ?? 15));
    }
    
    // Interventions par période
    public function getInterventionsParPeriode(Request $request)
    {
        $debut = $request->debut ?? now()->subMonth()->format('Y-m-d');
        $fin = $request->fin ?? now()->format('Y-m-d');
        
        $interventions = Intervention::whereBetween('date_debut', [$debut, $fin])
            ->with(['portique', 'shift', 'conducteur', 'responsable', 'techniciens'])
            ->orderBy('date_debut', 'desc')
            ->get();
            
        return response()->json($interventions);
    }
    
}