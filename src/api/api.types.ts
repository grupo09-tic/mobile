// Tipos de resposta da API
export interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
  success?: boolean;
}

export interface PaginationMeta {
  totalItems: number;
  totalPages?: number;
  currentPage?: number;
  pageSize?: number;
}

export interface ApiListResponse<T> {
  status: string;
  message: string;
  data: T[];
  pagination: PaginationMeta;
}

export interface DeleteInput {
  version: number;
}
