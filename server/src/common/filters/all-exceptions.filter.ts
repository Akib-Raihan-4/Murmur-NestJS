import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
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

      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === "string") {
        message = exceptionResponse;
      } else if (
        typeof exceptionResponse === "object" &&
        exceptionResponse !== null
      ) {
        if (Array.isArray((exceptionResponse as any).message)) {
          message = (exceptionResponse as any).message.join(", ");
        } else if ((exceptionResponse as any).message) {
          message = (exceptionResponse as any).message;
        }
      }
    }

    const apiResponse: IApiResponse = {
      success: false,
      message,
    };

    response.status(status).json(apiResponse);
  }
}
