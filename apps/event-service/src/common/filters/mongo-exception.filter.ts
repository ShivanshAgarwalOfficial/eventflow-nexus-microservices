import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { MongoError } from 'mongodb';
import { Error } from 'mongoose';
import { Response } from 'express';

@Catch()
export class MongoExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(MongoExceptionFilter.name);

    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal Server Error';
        let errorType = 'InternalServerError';

        if (exception instanceof MongoError) {
            if (exception.code === 11000) {
                status = HttpStatus.CONFLICT;
                message = 'Duplicate key error';
                errorType = 'Conflict';
            }
        } else if (exception instanceof Error.ValidationError) {
            status = HttpStatus.BAD_REQUEST;
            message = exception.message;
            errorType = 'ValidationError';
        } else if (exception.status) {
            status = exception.status;
            message = exception.message;
            errorType = exception.name || 'HttpException';
        }

        this.logger.error(`Error: ${message}`, exception.stack);

        response.status(status).json({
            statusCode: status,
            error: errorType,
            message,
            timestamp: new Date().toISOString(),
        });
    }
}
