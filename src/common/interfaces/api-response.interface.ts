export interface ApiResponse<T = unknown> {
  statusCode: number;
  status: boolean;
  message: string;
  data: T | null;
}
