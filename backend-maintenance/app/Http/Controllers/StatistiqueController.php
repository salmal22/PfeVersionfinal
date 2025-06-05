<?php

namespace App\Http\Controllers;

use App\Models\Intervention;
use App\Models\Portique;
use App\Models\User;
use App\Models\TechnicienIntervention;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StatistiqueController extends Controller
{
    // Obtenir les statistiques générales
    public function getStatistiquesGenerales()
    {
        $totalInterventions = Intervention::count();
        $interventionsEnAttente = Intervention::where('statut', 'en attente')->count();
        $interventionsEnCours = Intervention::where('statut', 'en cours')->count();
        $interventionsResolues = Intervention::where('statut', 'résolu')->count();
        
        $tempsResolutionMoyen = Intervention::whereNotNull('date_fin')
            ->select(DB::raw('AVG(TIMESTAMPDIFF(HOUR, date_debut, date_fin)) as temps_moyen'))
            ->first()->temps_moyen ?? 0;
            
        return response()->json([
            'total_interventions' => $totalInterventions,
            'interventions_en_attente' => $interventionsEnAttente,
            'interventions_en_cours' => $interventionsEnCours,
            'interventions_resolues' => $interventionsResolues,
            'temps_resolution_moyen' => round($tempsResolutionMoyen, 2)
        ]);
    }
    
    // Statistiques par portique
    public function getStatistiquesParPortique()
    {
        $statistiques = Portique::withCount(['interventions as total_interventions',
            'interventions as interventions_en_attente' => function($query) {
                $query->where('statut', 'en attente');
            },
            'interventions as interventions_en_cours' => function($query) {
                $query->where('statut', 'en cours');
            },
            'interventions as interventions_resolues' => function($query) {
                $query->where('statut', 'résolu');
            }
        ])->get();
        
        return response()->json($statistiques);
    }
    
    // Statistiques par type de panne
    public function getStatistiquesParType()
    {
        $statistiques = Intervention::select('type', DB::raw('COUNT(*) as total'))
            ->groupBy('type')
            ->get();
            
        return response()->json($statistiques);
    }
    
    // Statistiques par détail de panne
    public function getStatistiquesParDetail()
    {
        $statistiques = Intervention::select('detail', DB::raw('COUNT(*) as total'))
            ->groupBy('detail')
            ->get();
            
        return response()->json($statistiques);
    }
    
    // Statistiques par période (semaine, mois, année)
    public function getStatistiquesParPeriode(Request $request)
    {
        $periode = $request->periode ?? 'mois';
        $format = '%Y-%m';
        $dateColumn = "DATE_FORMAT(date_debut, '$format')";
        
        if ($periode === 'semaine') {
            $format = '%Y-%u'; // Année-Semaine
            $dateColumn = "DATE_FORMAT(date_debut, '$format')";
        } else if ($periode === 'annee') {
            $format = '%Y';
            $dateColumn = "DATE_FORMAT(date_debut, '$format')";
        }
        
        $statistiques = Intervention::select(
                DB::raw("$dateColumn as periode"),
                DB::raw('COUNT(*) as total')
            )
            ->groupBy('periode')
            ->orderBy('periode')
            ->get();
            
        return response()->json($statistiques);
    }
    
    // Taux de pannes par portique et par période
    public function getTauxPannesParPortique(Request $request)
    {
        $periode = $request->periode ?? 'mois';
        $format = '%Y-%m';
        
        if ($periode === 'semaine') {
            $format = '%Y-%u'; // Année-Semaine
        } else if ($periode === 'annee') {
            $format = '%Y';
        }
        
        $statistiques = Intervention::select(
                'portique_id',
                DB::raw("DATE_FORMAT(date_debut, '$format') as periode"),
                DB::raw('COUNT(*) as total')
            )
            ->groupBy('portique_id', 'periode')
            ->orderBy('periode')
            ->get();
            
        // Restructurer les données pour le frontend
        $result = [];
        foreach ($statistiques as $stat) {
            if (!isset($result[$stat->periode])) {
                $result[$stat->periode] = [
                    'periode' => $stat->periode
                ];
            }
            
            $portique = Portique::find($stat->portique_id);
            $result[$stat->periode][$portique->nom] = $stat->total;
        }
        
        return response()->json(array_values($result));
    }
    
    // Performance des techniciens
    public function getPerformanceTechniciens()
    {
        $techniciens = User::where('role', 'technicien')
            ->withCount(['technicienInterventions as interventions_total'])
            ->get();
            
        $result = [];
        foreach ($techniciens as $tech) {
            // Calculer le temps moyen de résolution
            $tempsResolution = TechnicienIntervention::where('technicien_id', $tech->id)
                ->whereNotNull('date_fin')
                ->select(DB::raw('AVG(TIMESTAMPDIFF(HOUR, date_debut, date_fin)) as temps_moyen'))
                ->first()->temps_moyen ?? 0;
            
            // Calculer le taux de résolution
            $interventionsResolues = TechnicienIntervention::where('technicien_id', $tech->id)
                ->where('statut', 'résolu')
                ->count();
                
            $tauxResolution = $tech->interventions_total > 0 
                ? ($interventionsResolues / $tech->interventions_total) * 100 
                : 0;
            
            $result[] = [
                'id' => $tech->id,
                'name' => $tech->name,
                'interventions_total' => $tech->interventions_total,
                'interventions_resolues' => $interventionsResolues,
                'temps_moyen_resolution' => round($tempsResolution, 2),
                'taux_resolution' => round($tauxResolution, 2)
            ];
        }
        
        return response()->json($result);
    }
    
    // Interventions par période de temps
    public function getInterventionsParPeriodeDeTemps(Request $request)
    {
        $debut = $request->input('debut', Carbon::now()->subMonth()->format('Y-m-d'));
        $fin = $request->input('fin', Carbon::now()->format('Y-m-d'));
        
        $interventions = Intervention::whereBetween('date_debut', [$debut, $fin])
            ->select(
                DB::raw('DATE(date_debut) as date'),
                DB::raw('COUNT(*) as total')
            )
            ->groupBy('date')
            ->orderBy('date')
            ->get();
            
        return response()->json($interventions);
    }
    
    // Temps d'immobilisation par portique
    public function getTempsImmobilisationParPortique()
    {
        $portiques = Portique::all();
        $result = [];
        
        foreach ($portiques as $portique) {
            $tempsTotal = Intervention::where('portique_id', $portique->id)
                ->whereNotNull('date_fin')
                ->select(DB::raw('SUM(TIMESTAMPDIFF(HOUR, date_debut, date_fin)) as temps_total'))
                ->first()->temps_total ?? 0;
                
            $result[] = [
                'id' => $portique->id,
                'nom' => $portique->nom,
                'temps_immobilisation' => $tempsTotal
            ];
        }
        
        return response()->json($result);
    }
}