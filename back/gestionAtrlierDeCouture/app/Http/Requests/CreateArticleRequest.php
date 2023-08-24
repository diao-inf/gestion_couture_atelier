<?php

namespace App\Http\Requests;

use App\Http\Resources\ResponseResource;
use Illuminate\Foundation\Http\FormRequest;

use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Contracts\Validation\Validator;

class CreateArticleRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'libelle' => ['required', 'string', 'min:5', 'max:50', 'unique:articles'],
            'prix' => ['required', 'numeric', 'min:0'],
            'stock' => ['required', 'integer', 'min:0'],
            'categorie_id' => ['required', 'exists:categories,id'],
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        $data = [
            'status' => 422,
            'success' => false,
            'error' => true,
            'message' => 'Erreur de validation',
            'errorsList' => $validator->errors()
        ];
        throw new HttpResponseException(response()->json($data,422));
    }

    public function messages()
    {
        return [
            'libelle.required' => 'Le champ libelle est requis.',
            'libelle.unique' => 'Le champ libelle doit être unique.',
            'libelle.min' => 'Le champ libelle doit avoir minimun 3 caractères.',
            'libelle.max' => 'Le champ libelle doit avoir maximun 50 caractères.',

            'prix.required' => 'Le champ prix est requis.',
            'prix.numeric' => 'Le champ prix doit être numérique.',
            'prix.min' => 'Le champ prix doit être d\'au moins :min.',
            
            'stock.required' => 'Le champ stock est requis.',
            'stock.integer' => 'Le champ stock doit être un entier.',
            'stock.min' => 'Le champ stock doit être d\'au moins :min.',
            
            'categorie_id.required' => 'Le champ catégorie est requis.',
            'categorie_id.exists' => 'La catégorie sélectionnée est invalide.',
        ];
    }
}
