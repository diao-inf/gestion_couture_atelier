<?php

use App\Http\Controllers\CategorieController;
use App\Http\Controllers\ArticleController;
use App\Http\Controllers\FournisseurController;
use App\Http\Controllers\ServiceController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});



Route::delete("categories/delete", [CategorieController::class, 'destroyAll']);
Route::get("categories/paginations", [CategorieController::class, 'paginations']);
Route::delete("categories", [CategorieController::class, 'destroy']);
Route::apiResource("categories", CategorieController::class);
Route::apiResource("articles", ArticleController::class);
Route::apiResource("fournisseurs", FournisseurController::class);
Route::apiResource("services", ServiceController::class);
