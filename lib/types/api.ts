// lib/types/api.ts

export interface ApiError {
  response?: {
    data?: {
      message?: string;
      statusCode?: number;
      error?: string;
    };
  };
  message?: string;
}
