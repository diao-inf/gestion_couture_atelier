<?php
namespace App\Http\Traits;

use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;


trait ImageTrait {
    public function upload($image, string $basename=null) {
        $photoName = $basename."_".Str::random(5).".".$image->getClientOriginalExtension();

        Storage::disk("public")->put($photoName,file_get_contents($image));

        return $photoName;
    }
}