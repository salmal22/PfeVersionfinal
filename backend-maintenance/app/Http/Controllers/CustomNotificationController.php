<?php

namespace App\Http\Controllers;

use App\Models\CustomNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CustomNotificationController extends Controller
{
    // Mes notifications
    public function index()
    {
        $user = Auth::user();
        
        $notifications = CustomNotification::where('user_id', $user->id)
            ->with('intervention.portique')
            ->orderBy('created_at', 'desc')
            ->paginate(20);
            
        return response()->json($notifications);
    }

    // Notifications non lues
    public function nonLues()
    {
        $user = Auth::user();
        
        $notifications = CustomNotification::where('user_id', $user->id)
            ->where('lu', false)
            ->with('intervention.portique')
            ->orderBy('created_at', 'desc')
            ->get();
            
        return response()->json($notifications);
    }

    // Marquer comme lue
    public function marquerLue($id)
    {
        $user = Auth::user();
        
        $notification = CustomNotification::where('user_id', $user->id)
            ->where('id', $id)
            ->firstOrFail();
            
        $notification->marquerCommelue();
        
        return response()->json(['message' => 'Notification marquée comme lue']);
    }

    // Marquer toutes comme lues
    public function marquerToutesLues()
    {
        $user = Auth::user();
        
        CustomNotification::where('user_id', $user->id)
            ->where('lu', false)
            ->update(['lu' => true]);
            
        return response()->json(['message' => 'Toutes les notifications marquées comme lues']);
    }

    // Compter les non lues
    public function compterNonLues()
    {
        $user = Auth::user();
        
        $count = CustomNotification::where('user_id', $user->id)
            ->where('lu', false)
            ->count();
            
        return response()->json(['count' => $count]);
    }
}
