
export interface IApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

export const successResponse = <T>(
  data: T,
  message = "Success"
): IApiResponse<T> => ({
  success: true,
  message,
  data,
});

export const errorResponse = (message: string): IApiResponse<never> => ({
  success: false,
  message,
});
