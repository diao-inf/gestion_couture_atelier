<?php

namespace App\Http\Controllers;

use App\Models\Fournisseur;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class FournisseurController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try{
            return response()->json($this->formatResponse("liste des fournisseurs ont été récupérer avec succés..",Fournisseur::all()));
        }catch(\Exception $e){
            return response()->json($this->formatResponse("liste des fournisseurs n'ont été récupérer avec succés..", $e->getMessage()));
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        
    }

    /**
     * Display the specified resource.
     */
    public function show(Fournisseur $fournisseur)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Fournisseur $fournisseur)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Fournisseur $fournisseur)
    {
        //
    }

    private function formatResponse($message="Les données ont été recuperé avec succés..", $data=null, $status=Response::HTTP_OK){
        return ["status" => $status, "message" => $message, "data"=> $data];
    }
}

