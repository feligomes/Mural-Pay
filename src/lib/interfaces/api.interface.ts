export interface ApiErrorData {
  statusCode: number;
  message: string;
  error: string;
}

export interface ApiError {
  status: number;
  data: ApiErrorData;
} 