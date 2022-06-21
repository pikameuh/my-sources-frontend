import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Observable } from 'rxjs';
import { JwtPayload } from 'src/app/interfaces/jwt-payload';
import { JwtPayloadResponse } from 'src/app/interfaces/jwt-payload-response';
// import { BlogEntriesPageable } from 'src/app/model/blog-entry.interface';
import { BlogService } from 'src/app/services/blog-service/blog.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  blogEntries$: Observable<JwtPayloadResponse> = this.blogService.indexAll(1, 10);

  constructor(private blogService: BlogService) { }

  onPaginateChange(event: PageEvent) {
    console.log(`HomeComponent.onPaginateChange(): `);
    this.blogEntries$ = this.blogService.indexAll(event.pageIndex, event.pageSize);
  }

}
