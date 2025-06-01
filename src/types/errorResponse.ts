// Tipe untuk menangani response error umum
export interface ErrorResponse {
  code: string;
  message: string;
  details?: string;
}
