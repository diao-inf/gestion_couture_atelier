<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Contracts\Validation\Validator;

class CreateRequest extends FormRequest
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
            "libelle"=>"required|unique:categories,libelle|min:3|max:50",
        ];
    }


    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'status' => -1,
            'success' => false,
            'error' => true,
            'message' => 'Erreur de validation',
            'errorsList' => $validator->errors()
        ]));
    }

    public function messages()
    {
        return [
            'libelle.required' => 'Le champ libelle est requis.',
            'libelle.unique' => 'Le champ libelle doit être unique.',
            'libelle.min' => 'Le champ libelle doit avoir minimun 3 caractères.',
            'libelle.max' => 'Le champ libelle doit avoir maximun 50 caractères.',
        ];
    }

}
