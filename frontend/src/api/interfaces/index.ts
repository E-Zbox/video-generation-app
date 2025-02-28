export interface IGenericResponse<T> {
  data: T;
  error: string;
  success: boolean;
}

export interface INumberResponse extends IGenericResponse<number> {}
