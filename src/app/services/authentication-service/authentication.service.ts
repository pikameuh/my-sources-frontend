import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { map, tap, switchMap } from "rxjs/operators";
import { JwtHelperService } from "@auth0/angular-jwt";
import { Observable, of } from 'rxjs';
import { User } from '../../model/user.interface';
import { SnackBarErrorComponent } from 'src/app/components/error/snackbar-error.component';
import { environment } from 'src/environments/environment';
import { LocalStorageKeys } from 'src/app/interfaces/local-storage-keys';

export interface LoginForm {
  email: string;
  username: string;
  password: string;
};

export interface RegisterForm {
  email: string;
};




@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  
  

  constructor(private http: HttpClient, private jwtHelper: JwtHelperService, private snackBar: SnackBarErrorComponent) { }


  login(loginForm: LoginForm) {  

    const req: string = `http://localhost:3000/auth/login?username=${loginForm.username}&password=${loginForm.password}`;
    this.log(`Sending POST request : ${req}`)
    return this.http.post<any>(req, {username: loginForm.username, email: loginForm.email, password: loginForm.password}).pipe(
      map((token) => {
        console.log('token received:' + JSON.stringify(token));
        localStorage.setItem(LocalStorageKeys.JWT_TOKEN.name, token.data.accessToken);
//         localStorage.setItem(LocalStorageKeys.JWT_EXPIRES_IN.name, token.data.expiresIn);
//         localStorage.setItem(LocalStorageKeys.JWT_PSEUDO.name, token.data.pseudo);
//         localStorage.setItem(LocalStorageKeys.JWT_ID.name, this.jwtHelper.decodeToken(localStorage.getItem(LocalStorageKeys.JWT_TOKEN.name)).id);
//         localStorage.setItem(LocalStorageKeys.JWT_ROLE_NAME.name, this.jwtHelper.decodeToken(localStorage.getItem(LocalStorageKeys.JWT_TOKEN.name)).role.name);
        
//         localStorage.setItem(LocalStorageKeys.JWT_ROLE_ID.name, this.jwtHelper.decodeToken(localStorage.getItem(LocalStorageKeys.JWT_TOKEN.name)).role.id);
// console.log(` +>  - - - localStorage.setItem( ${LocalStorageKeys.JWT_ROLE_ID.name}) > ` + this.jwtHelper.decodeToken(localStorage.getItem(LocalStorageKeys.JWT_TOKEN.name)).role.id);

//         localStorage.setItem(LocalStorageKeys.JWT_EMAIL.name, this.jwtHelper.decodeToken(localStorage.getItem(LocalStorageKeys.JWT_TOKEN.name)).email);
//         localStorage.setItem(LocalStorageKeys.JWT_D_CREATION.name, this.jwtHelper.decodeToken(localStorage.getItem(LocalStorageKeys.JWT_TOKEN.name)).d_creation);
        return token;
      })
    )
  }

  logout() {
    localStorage.removeItem(LocalStorageKeys.JWT_TOKEN.name);
    // localStorage.removeItem(LocalStorageKeys.JWT_EXPIRES_IN.name);
    // localStorage.removeItem(LocalStorageKeys.JWT_PSEUDO.name);
    // localStorage.removeItem(LocalStorageKeys.JWT_ID.name);
    // localStorage.removeItem(LocalStorageKeys.JWT_ROLE_NAME.name);
    // localStorage.removeItem(LocalStorageKeys.JWT_ROLE_ID.name);
    // localStorage.removeItem(LocalStorageKeys.JWT_EMAIL.name);
    // localStorage.removeItem(LocalStorageKeys.JWT_D_CREATION.name);
  }

  updateLocalStorageRole(name: string, id: number) {
    // localStorage.setItem(LocalStorageKeys.JWT_ROLE_NAME.name, name);
    // localStorage.setItem(LocalStorageKeys.JWT_ROLE_ID.name, ''+id);
    throw new Error('Method not implemented.');
  }

  register(user: User) {
    const req: string = `http://localhost:3000/users`;
    this.log(`Sending POST request : ${req}`)
    return this.http.post<any>(req, user);
  }

  isAuthenticated(): boolean {
    this.log(`AuthenticationService.isAuthenticated()`);
    const token = localStorage.getItem(LocalStorageKeys.JWT_TOKEN.name);
    // console.log(`token: ${token}`);
    return !this.jwtHelper.isTokenExpired(token);
  }

  decodedToken() {
    this.log(`AuthenticationService.getDecodedToken()`);
    return this.jwtHelper.decodeToken(localStorage.getItem(LocalStorageKeys.JWT_TOKEN.name));
  }

  getToken() {
    this.log(`AuthenticationService.getToken()`);
    const token = localStorage.getItem(LocalStorageKeys.JWT_TOKEN.name);
    // console.log(`token: ${token}`);
    return token;
  }

  resendCOnfirmationEmail(registerForm: RegisterForm) {  

    const req: string = `http://localhost:3000/users/resendconfirmationemail`;
    this.log(`Sending GET request : ${req}`)
    return this.http.post<any>(req, {email: registerForm.email}).pipe(
      map((result) => {
        console.log('token received:' + JSON.stringify(result));
        this.snackBar.openOKErrorSnackBar(`confirmation email sent`);
      })
    )
  }

  resetPassword(registerForm: RegisterForm) {
    this.log(`AuthenticationService.resetPassword() }}}}}> TODO`);
    // generate new password

    // update password

    // send email with new password

    throw new Error('Method resetPassword() not implemented.');

  }

  // getUserId(): Observable<number>{
  //   console.log(`AuthenticationService.getUserId()`);
  //   return of(localStorage.getItem(JWT_TOKEN)).pipe(
  //     switchMap((jwt: string) => of(this.jwtHelper.decodeToken(jwt)).pipe(
  //       map((jwt: any) => jwt.id)
  //     )
  //   ));
    
  // }

  // getUserRole(): Observable<number>{
  //   console.log(`AuthenticationService.getUserRole()`);
  //   return of(localStorage.getItem(JWT_TOKEN)).pipe(
  //     switchMap((jwt: string) => of(this.jwtHelper.decodeToken(jwt)).pipe(
  //       map((jwt: any) => jwt.user.id)
  //     )
  //   ));
  // }

  getDecodedToken() {
    return this.decodedToken();
  }

  getUserId(): number {
    return parseInt(this.decodedToken()?.id);
  } 

  getUserPseudo(): string {
    return this.decodedToken()?.pseudo;
  }

  getUserEmail(): string {
    return this.decodedToken()?.email;
  }

  getTokenExpiresIn(): string {
    return this.decodedToken()?.pseudo;
  }

  getUserRoleName(): string {
    return this.decodedToken()?.role.name;
  }

  getUserRoleId(): number {
    return this.decodedToken()?.role.id;
  }

  getUserDateCreation(): string {
    return this.decodedToken()?.d_creation;
  }

  log(message: string) {
    if (environment.debug && environment.debug_auth) {
      console.log(message);
    }
  }

}

