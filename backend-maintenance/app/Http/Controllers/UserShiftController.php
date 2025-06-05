<?php

namespace App\Http\Controllers;

use App\Models\UserShift;
use Illuminate\Http\Request;

class UserShiftController extends Controller
{
    // Afficher tous les UserShift
    public function index()
    {
        $userShifts = UserShift::all();
        return response()->json($userShifts);
    }

    // Ajouter un UserShift
    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'shift_id' => 'required|exists:shifts,id',
        ]);

        $userShift = UserShift::create([
            'user_id' => $request->user_id,
            'shift_id' => $request->shift_id,
        ]);

        return response()->json($userShift, 201);
    }

    // Afficher un UserShift spécifique
    public function show($id)
    {
        $userShift = UserShift::findOrFail($id);
        return response()->json($userShift);
    }

    // Mettre à jour un UserShift
    public function update(Request $request, $id)
    {
        $userShift = UserShift::findOrFail($id);
        $userShift->update($request->all());
        return response()->json($userShift);
    }

    // Supprimer un UserShift
    public function destroy($id)
    {
        $userShift = UserShift::findOrFail($id);
        $userShift->delete();
        return response()->json(null, 204);
    }
}
