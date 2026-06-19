import type { HttpInterceptorFn } from '@angular/common/http';
import { toast } from '@spartan-ng/brain/sonner';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error) => {
      const detail = error?.error?.message || error?.message || 'Erro na requisição';

      toast.error(detail);

      return throwError(() => error);
    }),
  );
};
