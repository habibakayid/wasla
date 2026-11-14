import { HttpContext, HttpContextToken } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';


export const SKIP_ERROR_TOAST = new HttpContextToken<boolean>(() => false);

export const quietContext = () => new HttpContext().set(SKIP_ERROR_TOAST, true);


export function formThenJson<T>(
  sendForm: (ctx: HttpContext) => Observable<T>,
  sendJson: () => Observable<T>,
): Observable<T> {
  return sendForm(quietContext()).pipe(
    catchError((err) => {
      if ([400, 415, 422].includes(err?.status)) {
        return sendJson();
      }
     
      return throwError(() => err);
    }),
  );
}