import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  BadRequestException,
} from "@nestjs/common";
import { Response } from "express";
import { IApiResponse } from "../interfaces/api-response.interface";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = 500;
    let message = "Internal server error";

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();

      if (
        exception instanceof BadRequestException &&
        typeof res === "object" &&
        res !== null
      ) {
        const validationErrors = (res as any).message;

        if (Array.isArray(validationErrors)) {
          if (validationErrors.includes("text must be a string")) {
            message = "Text must be a string";
          } else if (validationErrors.includes("Text cannot be empty")) {
            message = "Text cannot be empty";
          } else if (
            validationErrors.includes("Murmur cannot exceed 280 characters")
          ) {
            message = "Murmur cannot exceed 280 characters";
          } else {
            message = validationErrors[0];
          }
        } else if (typeof validationErrors === "string") {
          message = validationErrors;
        }
      } else if (typeof res === "string") {
        message = res;
      } else if ((res as any).message) {
        message = (res as any).message;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    const apiResponse: IApiResponse = {
      success: false,
      message,
    };

    response.status(status).json(apiResponse);
  }
}
