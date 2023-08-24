<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ResponseResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            "status" => $this->status,
            "success" => $this->success,
            "message" => $this->message,
            "data" => $this->whenNotNull($this->data),
            "errorsList" => $this->whenNotNull($this->errorsList),
        ];
    }
}
