import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { JwtPayload } from 'src/app/interfaces/jwt-payload';
import { JwtPayloadResponse } from 'src/app/interfaces/jwt-payload-response';
import {  BlogEntry } from 'src/app/model/blog-entry.interface';

@Injectable({
  providedIn: 'root'
})
export class BlogService {


  req: string = `http://localhost:3000/users/`;

  constructor(private http: HttpClient) { }

  findOne(id: number): Observable<BlogEntry> {
    return this.http.get<BlogEntry>('/api/blog-entries/' + id);
  }

  indexAll(page: number, limit: number): Observable<JwtPayloadResponse> {
    let params = new HttpParams();

    params = params.append('offset', String(page));
    params = params.append('limit', String(limit));

    console.log(`BlogService.indexAll() - ${this.req} + ${JSON.stringify(params)})`);

    // const res = this.http.get<BlogEntriesPageable>(this.req, {params});
    const result = this.http.get<JwtPayloadResponse>(this.req, {params});
    result.forEach( 
      payload => payload.data.some( 
                          data => {
                            console.log(` ${JSON.stringify(data)}`)
                            // result.push(data);
                          }
              )
    );

    return result;//await Promise.resolve(res);
  }

  indexByUser(userId: number, page: number, limit: number): Observable<JwtPayloadResponse> {
    let params = new HttpParams();

    params = params.append('page', String(page));
    params = params.append('limit', String(limit));

    console.log(`indexByUser.indexAll(${userId}) - ${this.req} + ${JSON.stringify(params)})`);

    return this.http.get<JwtPayloadResponse>(this.req + String(userId), {params});
  }

  post(blogEntry: BlogEntry): Observable<BlogEntry> {
    return this.http.post<BlogEntry>('/api/blog-entries', blogEntry);
  }

  uploadHeaderImage(formData: FormData): Observable<any> {
    return this.http.post<FormData>('/api/blog-entries/image/upload', formData, {
      reportProgress: true,
      observe: 'events'
    });
  }

}
