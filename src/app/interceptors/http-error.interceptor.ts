import {

    HttpEvent,

    HttpInterceptor,

    HttpHandler,

    HttpRequest,

    HttpResponse,

    HttpErrorResponse

} from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, throwError } from 'rxjs';

import { retry, catchError } from 'rxjs/operators';
import { SnackBarErrorComponent } from '../components/error/snackbar-error.component';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

    constructor( private snackBar: SnackBarErrorComponent){}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        return next.handle(request)
            .pipe(
                retry(1),
                catchError((error: HttpErrorResponse) => {

                    let errorMessage;

                    if (error.error instanceof ErrorEvent) {
                        // client-side error
                        errorMessage = `Client-side-error Code: ${ error.status } \n message: ${ JSON.stringify(error.error) }`;
                        this.snackBar.openSnackBar(`Internal error : ${ error.status } ${ JSON.stringify(error.error) }`,'Close','blue-snackbar');

                    } else {
                        // server-side error
                        if ( ! error?.error?.code) {
                            // not prepared error (non listed in BKEND)
                            errorMessage = `${ error?.statusText } Server-side-error #${ error?.status }  - ${ error?.message}`;
                            this.snackBar.openSnackBar(`From server : ${ error?.status } ${ error?.statusText } - ${ error?.message}`,'Close','green-snackbar');
                        } else {
                            errorMessage = `${ error.status } Server-side-error #${ JSON.stringify(error?.error?.code)} \nMessage: ${ JSON.stringify(error.error.message) }`;
                            this.snackBar.openSnackBar(`From server : ${ JSON.stringify(error?.error?.code) } ${ JSON.stringify(error.error.message) }`,'Close','green-snackbar');
                        }

                        

                    }

                    

                    // window.alert(errorMessage);
                    console.log(`HttpErrorInterceptor: ${errorMessage}`);
                    return throwError(errorMessage);
                })
            )
    }
}