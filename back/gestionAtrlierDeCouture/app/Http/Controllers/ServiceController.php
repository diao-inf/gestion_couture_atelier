<?php

namespace App\Http\Controllers;

use App\Http\Resources\ArticleRessource;
use App\Models\Article;
use App\Models\Categorie;
use App\Models\Fournisseur;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ServiceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try{
            $categories = Categorie::all();
            $fournisseurs = Fournisseur::all();
            $articles = Article::all();
            return response()->json($this->formatResponse("liste des données ont été récupérer avec succés..",["article"=>ArticleRessource::collection($articles), "fournisseur"=>$fournisseurs, "categorie"=>$categories]));
        }catch(\Exception $e){
            return response()->json($this->formatResponse("liste des données n'ont été récupérer avec succés..", $e->getMessage()));
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Categorie $categorie)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Categorie $categorie)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Categorie $categorie)
    {
        //
    }


    private function formatResponse($message="Les données ont été recuperé avec succés..", $data=null, $status=Response::HTTP_OK){
        return ["status" => $status, "message" => $message, "data"=> $data];
    }
}
