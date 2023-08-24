<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class ArticleRessource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $imageUrl = $this->photo ? Storage::url($this->photo) : null;

        return [
            "id" => $this->id,
            "libelle" => $this->libelle,
            "prix" => $this->prix,
            "stock" => $this->stock,
            "reference" => $this->reference,
            "photo" => $imageUrl,
            "categorie_id" => $this->categorie_id,
            "categorie_libelle" => $this->categorie->libelle,
        ];
    }
}
