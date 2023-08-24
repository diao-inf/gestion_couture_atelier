export interface ResponseApi<T> {
    status: number,
    message: string,
    errorsList?: string[];
    data: T 
}
