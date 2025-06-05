<?php

namespace App\Http\Controllers;

use App\Models\Shift;
use Illuminate\Http\Request;

class ShiftController extends Controller
{
    // Afficher tous les shifts
    public function index()
    {
        $shifts = Shift::all();
        return response()->json($shifts);
    }

    // Créer un nouveau shift
    public function store(Request $request)
    {
        $request->validate([
            'nom' => 'required|string|max:255',
            'debut' => 'required|date_format:H:i',
            'fin' => 'required|date_format:H:i',
        ]);

        $shift = Shift::create([
            'nom' => $request->nom,
            'debut' => $request->debut,
            'fin' => $request->fin,
        ]);

        return response()->json($shift, 201);
    }

    // Afficher un shift spécifique
    public function show($id)
    {
        $shift = Shift::findOrFail($id);
        return response()->json($shift);
    }

    // Mettre à jour un shift
    public function update(Request $request, $id)
    {
        $shift = Shift::findOrFail($id);
        $shift->update($request->all());
        return response()->json($shift);
    }

    // Supprimer un shift
    public function destroy($id)
    {
        $shift = Shift::findOrFail($id);
        $shift->delete();
        return response()->json(null, 204);
    }
}
