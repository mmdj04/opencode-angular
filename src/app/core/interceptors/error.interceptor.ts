import type { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const messageService = inject(MessageService);

  return next(req).pipe(
    catchError((error) => {
      const detail = error?.error?.message || error?.message || 'Erro na requisição';

      messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail,
      });

      return throwError(() => error);
    }),
  );
};
