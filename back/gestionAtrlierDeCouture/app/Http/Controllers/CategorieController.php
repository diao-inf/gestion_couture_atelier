<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateRequest;
use App\Models\Categorie;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class CategorieController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try{
            return response()->json($this->formatResponse("liste des catégorie ont été récupérer avec succés..",Categorie::all()));
        }catch(\Exception $e){
            return response()->json($this->formatResponse("liste des catégorie n'ont été récupérer avec succés..", $e->getMessage()));
        }
    }

    public function paginations(Request $request){
        try{
            $nbreElementParPage = $request->input('nbreElementParPage', 10);
            $query = Categorie::query();
            if ($request->has('search')) {
                $search = $request->input('search');
                $query->where('libelle', 'like', '%' . $search . '%');
            }
            $data = $query->paginate($nbreElementParPage);
            return response()->json($this->formatResponse("liste des catégorie ont été récupérer avec succés..", $data));
        }catch(\Exception $e){
            return response()->json($this->formatResponse("liste des catégorie n'ont été récupérer avec succés..", $e->getMessage()));
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CreateRequest $request)
    {
        try {
            $categorie = new Categorie();
            $categorie->libelle = $request->libelle;
            $categorie->save();
            return response()->json($this->formatResponse("La catégorie a été ajouté avec succés..", $categorie));
        } catch (\Exception $e) {
            return response()->json($this->formatResponse("La catégorie n'a été ajouté avec succés..", $e->getMessage(),500));
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        try {
            $categorie = Categorie::find($id);
            if ($categorie) {
                return response()->json($this->formatResponse("La catégorie a été récuperer avec succés..", $categorie));
            }
            return response()->json($this->formatResponse("La catégorie n'a été récuperer avec succés..", $categorie));
        } catch (\Exception $e) {
            return response()->json($this->formatResponse("La catégorie n'a été récupéré avec succés..", $e->getMessage()));
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(CreateRequest $request, $id)
    {
        try {
            $categorie = Categorie::find($id);
            if (!$categorie) {
                return response()->json($this->formatResponse("La catégorie n'a pas été trouvé avec succés..", $categorie));
            }
            $categorie->libelle = $request->libelle;
            $categorie->save();
            return response()->json($this->formatResponse("La catégorie a été modifié avec succés..", $categorie));
        } catch (\Exception $e) {
            return response()->json($this->formatResponse("La catégorie n'a été modifié avec succés..", $e->getMessage()));
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, $id=0)
    {
        if ($id == 0){
            try {
                $ids = $request->ids;
                Categorie::whereIn('id', $ids)->delete();
                return response()->json($this->formatResponse("Les catégories ont été supprimé avec succés..", null));
            } catch (\Exception $e) {
                return response()->json($this->formatResponse("Les catégories n'ont pas été supprimé avec succés..", $e->getMessage()));
            
            }
        }
        try {
            $categorie = Categorie::find($id);
            if (!$categorie) {
                return response()->json($this->formatResponse("La catégorie n'a pas été trouvé avec succés..",$categorie));
            }
            $categorie->delete();
            return response()->json($this->formatResponse("La catégorie a été supprimé avec succés..", $categorie));
        } catch (\Exception $e) {
            return response()->json($this->formatResponse("La catégorie n'a été supprimé avec succés..", $e->getMessage()));
        }
    }

    public function destroyAll(Request $request){
        try {
            $ids = $request->ids;
            Categorie::whereIn('id', $ids)->delete();
            return response()->json($this->formatResponse("Les catégories ont été supprimé avec succés..", null));
        } catch (\Exception $e) {
            return response()->json($this->formatResponse("Les catégories n'ont pas été supprimé avec succés..", $e->getMessage()));
        
        }
    }

    private function formatResponse($message="Les données ont été recuperé avec succés..", $data=null, $status=Response::HTTP_OK){
        return ["status" => $status, "message" => $message, "data"=> $data];
    }
}
