// Tipe untuk Exception Message (digunakan untuk menangani error API)
export interface ExceptionMessage {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  fieldErrors?: Record<string, string>;
  generalErrors?: string[];
}
