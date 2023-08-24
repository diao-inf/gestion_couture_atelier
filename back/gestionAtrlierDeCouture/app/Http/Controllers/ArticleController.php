<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateArticleRequest;
use App\Http\Resources\ArticleRessource;
use App\Http\Traits\ImageTrait;
use App\Models\Article;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ArticleController extends Controller
{
    use ImageTrait;
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $articles = Article::all();
            return response()->json(['status'=>Response::HTTP_OK,'message' => 'les donnèes ont été recupere...', 'data'=>ArticleRessource::collection($articles)]);
        } catch (\Exception $e) {
            return response()->json(['status'=>Response::HTTP_BAD_REQUEST,'message'=> 'Une erreur est survenue.']);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CreateArticleRequest $request)
    {
        try {
            DB::beginTransaction();
            $fournisseur_ids = explode(",",$request->fournisseur_ids);
            $fournisseur_ids = array_map('intval', $fournisseur_ids);
            $reference = $request->reference;
            // $photo = $request->photo;
            // $photoName = $reference."_".Str::random(5).".".$photo->getClientOriginalExtension();
            $data = [
                "libelle"=>$request->libelle,
                "prix"=>$request->prix,
                "stock"=>$request->stock,
                "reference"=>$reference,
                // "photo"=> $photoName,
                "photo"=> $this->upload($request->photo, $reference),
                "categorie_id"=>$request->categorie_id,
                "fournisseur_ids"=>$fournisseur_ids
            ];
            
            $article = Article::create($data);
            $article->fournisseurs()->sync($data['fournisseur_ids']);

            // Storage::disk("public")->put($photoName,file_get_contents($photo));
    
            DB::commit();
            return response()->json(['status'=>Response::HTTP_OK,'message' => 'le donnèes ont été enregistre...', 'data'=>$article], Response::HTTP_OK);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json(['status'=>Response::HTTP_BAD_REQUEST,'message' => 'Une erreur est survenue.', 'data'=>$e->getMessage()]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Article $article)
    {
        try {
            return response()->json(['status'=>Response::HTTP_OK,'message' => 'les donnèes ont été recupere...', 'data'=>$article], Response::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json(['status'=>Response::HTTP_BAD_REQUEST,'message'=> 'Une erreur est survenue.']);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(CreateArticleRequest $request, Article $article)
    {
        try {
            DB::beginTransaction();
            
            $fournisseur_ids = explode(",",$request->fournisseur_ids);
            $fournisseur_ids = array_map('intval', $fournisseur_ids);
            $reference = $request->reference;
            $data = [
                "libelle"=>$request->libelle,
                "prix"=>$request->prix,
                "stock"=>$request->stock,
                // "reference"=>$reference,
                "photo"=> $this->upload($request->photo, $reference),
                "categorie_id"=>$request->categorie_id,
                "fournisseur_ids"=>$fournisseur_ids
            ];
            
            $article->update($data);
            $this->updateFournisseurs($article, $data['fournisseur_ids']);
            // DB::rollBack();
            // return  $request->libelle;
            
            DB::commit();
            return response()->json(['status'=>Response::HTTP_OK,'message' => 'les donnèes ont été modifier...', 'data'=>$article], Response::HTTP_OK);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['status'=>Response::HTTP_BAD_REQUEST,'message'=> 'Une erreur est survenue.']);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Article $article)
    {
        try {
            $article->delete();
            return response()->json(['status'=>Response::HTTP_OK,'message' => 'les donnèes ont été supprimé...', 'data'=>$article], Response::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json(['status'=>Response::HTTP_OK,'message'=> 'Une erreur est survenue.']);
        }
    }

    protected function updateFournisseurs(Article $article, $nouveauxFournisseurs)
    {
        $fournisseursActuels = $article->fournisseurs->pluck('id');
        $fournisseursASupprimer = $fournisseursActuels->diff($nouveauxFournisseurs);

        $article->fournisseurs()->detach($fournisseursASupprimer);
        $article->fournisseurs()->sync($nouveauxFournisseurs);
    }
}
