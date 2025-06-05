<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    // Récupérer les notifications de l'utilisateur connecté
    public function getNotifications()
    {
        $user = Auth::user();
        return response()->json([
            'unread' => $user->unreadNotifications,
            'read' => $user->readNotifications->take(5)
        ]);
    }
    
    // Marquer une notification comme lue
    public function markAsRead($id)
    {
        $user = Auth::user();
        $notification = $user->notifications()->findOrFail($id);
        $notification->markAsRead();
        
        return response()->json(['success' => true]);
    }
    
    // Marquer toutes les notifications comme lues
    public function markAllAsRead()
    {
        $user = Auth::user();
        $user->unreadNotifications->markAsRead();
        
        return response()->json(['success' => true]);
    }
}