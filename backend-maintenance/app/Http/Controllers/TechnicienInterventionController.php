<?php

namespace App\Http\Controllers;

use App\Models\TechnicienIntervention;
use Illuminate\Http\Request;

class TechnicienInterventionController extends Controller
{
    // Afficher toutes les interventions des techniciens
    public function index()
    {
        $technicienInterventions = TechnicienIntervention::all();
        return response()->json($technicienInterventions);
    }

    // Ajouter une intervention d'un technicien
    public function store(Request $request)
    {
        $request->validate([
            'technicien_id' => 'required|exists:users,id',
            'intervention_id' => 'required|exists:interventions,id',
            'date_debut' => 'required|date',
        ]);

        $technicienIntervention = TechnicienIntervention::create([
            'technicien_id' => $request->technicien_id,
            'intervention_id' => $request->intervention_id,
            'date_debut' => $request->date_debut,
            'date_fin' => $request->date_fin,
            'action_realisee' => $request->action_realisee,
            'statut' => $request->statut,
        ]);

        return response()->json($technicienIntervention, 201);
    }

    // Afficher une intervention spécifique
    public function show($id)
    {
        $technicienIntervention = TechnicienIntervention::findOrFail($id);
        return response()->json($technicienIntervention);
    }

    // Mettre à jour une intervention d'un technicien
    public function update(Request $request, $id)
    {
        $technicienIntervention = TechnicienIntervention::findOrFail($id);
        $technicienIntervention->update($request->all());
        return response()->json($technicienIntervention);
    }

    // Supprimer une intervention d'un technicien
    public function destroy($id)
    {
        $technicienIntervention = TechnicienIntervention::findOrFail($id);
        $technicienIntervention->delete();
        return response()->json(null, 204);
    }
}
