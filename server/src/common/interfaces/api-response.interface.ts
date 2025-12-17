export interface IPaginationMeta {
  total: number;
  totalPages: number;
  currentPage: number;
  perPage: number;
  hasNextPage: boolean;
}
export interface IApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  pagination?: IPaginationMeta;
}

export const successResponse = <T>(
  data: T,
  message = "Success",
  pagination?: IPaginationMeta
): IApiResponse<T> => ({
  success: true,
  message,
  data,
  ...(pagination && { pagination }),
});

export const errorResponse = (message: string): IApiResponse<never> => ({
  success: false,
  message,
});
