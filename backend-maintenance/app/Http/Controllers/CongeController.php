<?php

namespace App\Http\Controllers;

use App\Models\Conge;
use Illuminate\Http\Request;

class CongeController extends Controller
{
    // Afficher tous les congés
    public function index()
    {
        $conges = Conge::all();
        return response()->json($conges);
    }

    
    // Créer un nouveau congé
    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'date_debut' => 'required|date',
            'date_fin' => 'required|date',
            'type' => 'required|string|in:maladie,vacances',
            'statut' => 'required|string|in:approuvé,en attente,refusé',
        ]);

        $conge = Conge::create([
            'user_id' => $request->user_id,
            'date_debut' => $request->date_debut,
            'date_fin' => $request->date_fin,
            'type' => $request->type,
            'statut' => $request->statut,
        ]);

        return response()->json($conge, 201);
    }

    // Afficher un congé spécifique
    public function show($id)
    {
        $conge = Conge::findOrFail($id);
        return response()->json($conge);
    }

    // Mettre à jour un congé
    public function update(Request $request, $id)
    {
        $conge = Conge::findOrFail($id);
        $conge->update($request->all());
        return response()->json($conge);
    }

    // Supprimer un congé
    public function destroy($id)
    {
        $conge = Conge::findOrFail($id);
        $conge->delete();
        return response()->json(null, 204);
    }
}
