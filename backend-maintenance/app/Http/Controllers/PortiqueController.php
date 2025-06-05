<?php

namespace App\Http\Controllers;

use App\Models\Portique;
use Illuminate\Http\Request;

class PortiqueController extends Controller
{
    // Afficher tous les portiques
    public function index()
    {
        $portiques = Portique::all();
        return response()->json($portiques);
    }

    // Créer un nouveau portique
    public function store(Request $request)
    {
        $request->validate([
            'nom' => 'required|string|max:255',
        ]);

        $portique = Portique::create([
            'nom' => $request->nom,
        ]);

        return response()->json($portique, 201);
    }

    // Afficher un portique spécifique
    public function show($id)
    {
        $portique = Portique::findOrFail($id);
        return response()->json($portique);
    }

    // Mettre à jour un portique
    public function update(Request $request, $id)
    {
        $portique = Portique::findOrFail($id);
        $portique->update($request->all());
        return response()->json($portique);
    }

    // Supprimer un portique
    public function destroy($id)
    {
        $portique = Portique::findOrFail($id);
        $portique->delete();
        return response()->json(null, 204);
    }
}
