<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ConducteurController;
use App\Http\Controllers\ResponsableController;
use App\Http\Controllers\TechnicienController;
use App\Http\Controllers\CustomNotificationController;
use App\Http\Controllers\InterventionController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\PortiqueController;
use App\Http\Controllers\ShiftController;
use App\Http\Controllers\CongeController;
use App\Http\Controllers\StatistiqueController;
use App\Http\Controllers\RapportController;

// Routes publiques
Route::post('/login', [AuthController::class, 'login']);

// Routes protégées
Route::middleware(['auth:sanctum'])->group(function () {
    
    // ================================
    // ROUTES AUTH GÉNÉRALES
    // ================================
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/profile', [AuthController::class, 'profile']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);
    
    // ================================
    // ROUTES CONDUCTEUR
    // ================================
    Route::prefix('conducteur')->middleware('role:conducteur')->group(function () {
        Route::get('/dashboard', [ConducteurController::class, 'dashboard']);
        Route::post('/signaler-panne', [ConducteurController::class, 'signalerPanne']);
        Route::get('/mes-signalements', [ConducteurController::class, 'mesSignalements']);
        Route::get('/portiques', [ConducteurController::class, 'getPortiques']);
    });
    
    // ================================
    // ROUTES RESPONSABLE
    // ================================
    Route::prefix('responsable')->middleware('role:responsable')->group(function () {
        Route::get('/dashboard', [ResponsableController::class, 'dashboard']);
        Route::get('/interventions-en-attente', [ResponsableController::class, 'interventionsEnAttente']);
        Route::post('/interventions/{id}/affecter', [ResponsableController::class, 'affecterIntervention']);
        Route::get('/techniciens', [ResponsableController::class, 'gestionTechniciens']);
        Route::get('/conges', [ResponsableController::class, 'gestionConges']);
        Route::post('/conges/{id}/gerer', [ResponsableController::class, 'gererConge']);
        Route::post('/interventions/{id}/cloturer', [ResponsableController::class, 'cloturerIntervention']);
    });
    
    // ================================
    // ROUTES TECHNICIEN
    // ================================
    Route::prefix('technicien')->middleware('role:technicien')->group(function () {
        Route::get('/dashboard', [TechnicienController::class, 'dashboard']);
        Route::get('/mes-interventions', [TechnicienController::class, 'mesInterventions']);
        Route::post('/interventions/{id}/demarrer', [TechnicienController::class, 'demarrerIntervention']);
        Route::post('/interventions/{id}/action', [TechnicienController::class, 'ajouterAction']);
        Route::post('/interventions/{id}/terminer', [TechnicienController::class, 'terminerIntervention']);
        Route::post('/conges', [TechnicienController::class, 'demanderConge']);
        Route::get('/mes-conges', [TechnicienController::class, 'mesConges']);
    });
    
    // ================================
    // ROUTES NOTIFICATIONS
    // ================================
    Route::prefix('notifications')->group(function () {
        Route::get('/', [CustomNotificationController::class, 'index']);
        Route::post('/', [CustomNotificationController::class, 'store']);
        Route::get('/non-lues', [CustomNotificationController::class, 'nonLues']);
        Route::post('/{id}/lue', [CustomNotificationController::class, 'marquerLue']);
        Route::post('/marquer-toutes-lues', [CustomNotificationController::class, 'marquerToutesLues']);
        Route::get('/count-non-lues', [CustomNotificationController::class, 'compterNonLues']);
    });
    
    // ================================
    // ROUTES GÉNÉRALES (tous les rôles)
    // ================================
    Route::apiResource('interventions', InterventionController::class);
    Route::apiResource('users', UserController::class);
    Route::apiResource('portiques', PortiqueController::class);
    Route::apiResource('shifts', ShiftController::class);
    Route::apiResource('conges', CongeController::class);
    
    // Routes supplémentaires pour interventions
    Route::get('/interventions/anomalies', [InterventionController::class, 'getAnomalies']);
    Route::get('/interventions/pannes', [InterventionController::class, 'getPannes']);
    Route::get('/interventions/portique/{id}', [InterventionController::class, 'getInterventionsParPortique']);
    Route::get('/interventions/conducteur/{id}', [InterventionController::class, 'getInterventionsConducteur']);
    Route::get('/interventions/technicien/{id}', [InterventionController::class, 'getInterventionsTechnicien']);
    Route::post('/interventions/{id}/assigner-responsable', [InterventionController::class, 'assignerResponsable']);
    Route::post('/interventions/{id}/assigner-techniciens', [InterventionController::class, 'assignerTechniciens']);
    Route::post('/interventions/{id}/marquer-resolue', [InterventionController::class, 'marquerResolue']);
    Route::get('/interventions/search', [InterventionController::class, 'search']);
    Route::get('/interventions/periode', [InterventionController::class, 'getInterventionsParPeriode']);
    
    // ================================
    // ROUTES STATISTIQUES
    // ================================
    Route::prefix('stats')->group(function () {
        Route::get('/generales', [StatistiqueController::class, 'getStatistiquesGenerales']);
        Route::get('/par-portique', [StatistiqueController::class, 'getStatistiquesParPortique']);
        Route::get('/par-type', [StatistiqueController::class, 'getStatistiquesParType']);
        Route::get('/par-detail', [StatistiqueController::class, 'getStatistiquesParDetail']);
        Route::get('/par-periode', [StatistiqueController::class, 'getStatistiquesParPeriode']);
        Route::get('/taux-pannes-portique', [StatistiqueController::class, 'getTauxPannesParPortique']);
        Route::get('/performance-techniciens', [StatistiqueController::class, 'getPerformanceTechniciens']);
        Route::get('/interventions-periode-temps', [StatistiqueController::class, 'getInterventionsParPeriodeDeTemps']);
        Route::get('/temps-immobilisation-portique', [StatistiqueController::class, 'getTempsImmobilisationParPortique']);
    });
    
    // ================================
    // ROUTES RAPPORTS
    // ================================
    Route::prefix('rapports')->group(function () {
        Route::get('/export-csv', [RapportController::class, 'exportInterventionsCSV']);
        Route::get('/pannes-par-portique', [RapportController::class, 'getRapportPannesParPortique']);
    });
});