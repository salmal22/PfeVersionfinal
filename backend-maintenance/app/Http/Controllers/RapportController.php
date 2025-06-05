<?php

namespace App\Http\Controllers;

use App\Models\Intervention;
use App\Models\Portique;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;

class RapportController extends Controller
{
    // Export des interventions en CSV
    public function exportInterventionsCSV(Request $request)
    {
        $interventions = Intervention::with(['portique', 'shift', 'conducteur', 'responsable'])
            ->orderBy('date_debut', 'desc');
            
        // Appliquer les filtres si présents
        if ($request->has('portique_id')) {
            $interventions->where('portique_id', $request->portique_id);
        }
        
        if ($request->has('statut')) {
            $interventions->where('statut', $request->statut);
        }
        
        if ($request->has('debut') && $request->has('fin')) {
            $interventions->whereBetween('date_debut', [$request->debut, $request->fin]);
        }
        
        $interventions = $interventions->get();
        
        // Préparer les données CSV
        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="interventions.csv"',
            'Pragma' => 'no-cache',
            'Cache-Control' => 'must-revalidate, post-check=0, pre-check=0',
            'Expires' => '0'
        ];
        
        $callback = function() use ($interventions) {
            $file = fopen('php://output', 'w');
            
            // En-têtes
            fputcsv($file, [
                'ID', 'Portique', 'Shift', 'Conducteur', 'Responsable', 
                'Type', 'Détail', 'Date Début', 'Date Fin', 
                'Description', 'Statut'
            ]);
            
            // Données
            foreach ($interventions as $intervention) {
                fputcsv($file, [
                    $intervention->id,
                    $intervention->portique->nom,
                    $intervention->shift->nom,
                    $intervention->conducteur->name,
                    $intervention->responsable ? $intervention->responsable->name : '-',
                    $intervention->type,
                    $intervention->detail,
                    $intervention->date_debut,
                    $intervention->date_fin ?? '-',
                    $intervention->description,
                    $intervention->statut
                ]);
            }
            
            fclose($file);
        };
        
        return Response::stream($callback, 200, $headers);
    }
    
    // Rapport de pannes par portique
    public function getRapportPannesParPortique(Request $request)
    {
        $debut = $request->debut ?? now()->subMonth()->format('Y-m-d');
        $fin = $request->fin ?? now()->format('Y-m-d');
        
        $portiques = Portique::all();
        $result = [];
        
        foreach ($portiques as $portique) {
            $stats = [
                'id' => $portique->id,
                'nom' => $portique->nom,
                'total_interventions' => 0,
                'en_attente' => 0,
                'en_cours' => 0,
                'resolues' => 0,
                'temps_moyen_resolution' => 0
            ];
            
            $interventions = Intervention::where('portique_id', $portique->id)
                ->whereBetween('date_debut', [$debut, $fin])
                ->get();
                
            $stats['total_interventions'] = $interventions->count();
            $stats['en_attente'] = $interventions->where('statut', 'en attente')->count();
            $stats['en_cours'] = $interventions->where('statut', 'en cours')->count();
            $stats['resolues'] = $interventions->where('statut', 'résolu')->count();
            
            // Temps moyen de résolution
            $interventionsResolues = $interventions->where('statut', 'résolu');
            if ($interventionsResolues->count() > 0) {
                $tempsTotal = 0;
                foreach ($interventionsResolues as $intervention) {
                    $debut = strtotime($intervention->date_debut);
                    $fin = strtotime($intervention->date_fin);
                    if ($fin && $debut) {
                        $tempsTotal += ($fin - $debut) / 3600; // en heures
                    }
                }
                $stats['temps_moyen_resolution'] = round($tempsTotal / $interventionsResolues->count(), 2);
            }
            
            $result[] = $stats;
        }
        
        return response()->json($result);
    }
}