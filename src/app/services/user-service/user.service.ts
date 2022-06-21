import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { User } from 'src/app/model/user.interface';
import { ActivateUserResponse } from 'src/app/interfaces/activate-user-response';
import { JwtPayloadResponse } from 'src/app/interfaces/jwt-payload-response';
import { JwtPayload } from 'src/app/interfaces/jwt-payload';

// export interface UserDataResponse {
//   // items: User[],
//   version: string,
//   data: {
//     id: number;
//     activated: boolean;
//     username: string;
//     pseudo: string;
//     email: string;
//     d_creation: string;
//     role: {
//       id: number,
//       name: string,
//       description: string,
//     };
//   },
// links: {
//   first: string;
//   previous: string;
//   next: string;
//   last: string;
// }
// };

export interface UserData {
  // items: User[],
  id: number;
  activated: boolean;
  username: string;
  pseudo: string;
  email: string;
  d_creation: string;
  role: string
  // },
  // links: {
  //   first: string;
  //   previous: string;
  //   next: string;
  //   last: string;
  // }
};

@Injectable({
  providedIn: 'root'
})
export class UserService {
  u

  req: string = `http://localhost:3000/users/`;

  constructor(private http: HttpClient) { }

  findOne(id: number): Observable<JwtPayloadResponse> {
    console.log(`UserService.findOne()`);
    return this.http.get(this.req + id).pipe(
      map((user: JwtPayloadResponse) => user)
    )
  }

  updateOne(user): Observable<User> {
    console.log(`UserService.updateOne()`);
    return this.http.put(this.req + user.id, user);
  }

  findAll(page: number, size: number): Observable<JwtPayloadResponse> {
    console.log(`UserService.findAll()`);
    let params = new HttpParams();

    params = params.append('offset', String(page));
    params = params.append('limit', String(size));

    // return this.http.get(this.req, { params }).pipe(
    return this.http.get(this.req).pipe(
      map((userData: JwtPayloadResponse) => userData),
      catchError(err => throwError(err))
    )
  }

  /**
   * TODO : update ROLE
   */
  updateRoleOfOne(id: number, role: string) {
    console.log(`UserService.updateRoleOfOne(${id}, ${role})`);
    let params = new HttpParams();
    params = params.append('id', String(id));
    params = params.append('role', String(role));

    const req: string = this.req + `updaterole`;
    console.log(`send patch request: ${req}`);

    return this.http.patch<JwtPayload>(req, { id: id, name: role })
      .toPromise()
      .then()
      .catch(e => console.log(`error: ${e}`));
  }

  activateUser(id: number) {
    console.log(`UserService.activateUser()`);
    const req: string = this.req + `activate/` + id;
    console.log(`send patch request: ${req}`);
    return this.http.patch<{ version: string, data: { new_state: boolean } }>(req, {})
      .toPromise()
      .then()
      .catch(e => console.log(`error: ${e}`));


    // console.log(`New state: ${JSON.stringify(result)}`);
    // return result;
  }

  uploadProfileImage(formData: FormData): Observable<any> {
    return this.http.post<FormData>('/api/users/upload', formData, {
      reportProgress: true,
      observe: 'events'
    })
  }

  paginateByName(page: number, size: number, username: string): Observable<JwtPayloadResponse> {
    let params = new HttpParams();

    params = params.append('offset', String(page));
    params = params.append('limit', String(size));

    return this.http.get('/users', { params }).pipe(
      map((userData: JwtPayloadResponse) => userData),
      catchError(err => throwError(err))
    )
  }
}
