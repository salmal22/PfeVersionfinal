<?php

namespace App\Http\Controllers;

use App\Models\HistoriqueIntervention;
use Illuminate\Http\Request;

class HistoriqueInterventionController extends Controller
{
    // Afficher tous les historiques d'interventions
    public function index()
    {
        $historiques = HistoriqueIntervention::all();
        return response()->json($historiques);
    }

    // Créer un nouvel historique d'intervention
    public function store(Request $request)
    {
        $request->validate([
            'intervention_id' => 'required|exists:interventions,id',
            'date_debut' => 'required|date',
            'date_fin' => 'required|date',
            'action_realisee' => 'required|string',
        ]);

        $historique = HistoriqueIntervention::create([
            'intervention_id' => $request->intervention_id,
            'date_debut' => $request->date_debut,
            'date_fin' => $request->date_fin,
            'action_realisee' => $request->action_realisee,
        ]);

        return response()->json($historique, 201);
    }

    // Afficher un historique d'intervention spécifique
    public function show($id)
    {
        $historique = HistoriqueIntervention::findOrFail($id);
        return response()->json($historique);
    }

    // Mettre à jour un historique d'intervention
    public function update(Request $request, $id)
    {
        $historique = HistoriqueIntervention::findOrFail($id);
        $historique->update($request->all());
        return response()->json($historique);
    }

    // Supprimer un historique d'intervention
    public function destroy($id)
    {
        $historique = HistoriqueIntervention::findOrFail($id);
        $historique->delete();
        return response()->json(null, 204);
    }
}
