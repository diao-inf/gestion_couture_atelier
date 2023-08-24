<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Article extends Model
{
    use HasFactory, SoftDeletes;


    protected $fillable = [
        'libelle', 'prix', 'stock', 'reference', 'photo', 'categorie_id',
    ];
    


    public function categorie()
    {
        return $this->belongsTo(Categorie::class);
    }

    public function fournisseurs()
    {
        return $this->belongsToMany(Fournisseur::class);
    }
}
