import { CallHandler, ExecutionContext, NestInterceptor, Injectable } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class FileUploadInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            catchError(error => {
                if (error.message.includes('Solo se permiten imágenes')) {
                    return throwError(() => new Error('Formato de archivo no permitido'));
                }
                if (error.message.includes('File too large')) {
                    return throwError(() => new Error('El archivo es demasiado grande'));
                }
                return throwError(() => error);
            }),
        );
    }
}