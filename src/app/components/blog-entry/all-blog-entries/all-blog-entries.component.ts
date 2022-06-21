import { Inject } from '@angular/core';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ActivateUserResponse } from 'src/app/interfaces/activate-user-response';
import { JwtPayloadResponse } from 'src/app/interfaces/jwt-payload-response';
// import { BlogEntriesPageable } from 'src/app/model/blog-entry.interface';
import { BlogService } from 'src/app/services/blog-service/blog.service';
import { UserService } from 'src/app/services/user-service/user.service';
import { WINDOW } from 'src/app/window-token';

@Component({
  selector: 'app-all-blog-entries',
  templateUrl: './all-blog-entries.component.html',
  styleUrls: ['./all-blog-entries.component.scss']
})
export class AllBlogEntriesComponent {

  @Input() blogEntries: JwtPayloadResponse;
  @Output() paginate: EventEmitter<PageEvent> = new EventEmitter<PageEvent>();

  pageEvent: PageEvent;

  origin = this.window.location.origin;

  constructor(private router: Router, @Inject(WINDOW) private window: Window, private userService: UserService,) { }

  
  onPaginateChange(event: PageEvent) {
    console.log(`onPaginateChange(${JSON.stringify(event)})`);
    event.pageIndex = event.pageIndex + 1;
    this.paginate.emit(event);
  }

  navigate(id: number) {
    // this.router.navigateByUrl('blog-entries/' + id);
    this.activate(id);
    window.location.reload();
  }

  // onItemClick(event, item) {
  //   // console.log("Event: ", event, "\nItem: ", item);
  //   // return this.activate(item.id);
  // }

  /**
   * Sort the users from JwtPayloadResponse by 'prop'
   * @param prop -  the key
   * @returns 
   */
  sortBy(prop: string) {
    return this.blogEntries.data.sort((a, b) => a[prop] > b[prop] ? 1 : a[prop] === b[prop] ? 0 : -1);
  }

  async activate(id: number) {
    const newState = await this.userService.activateUser(id);
    console.log(`AllBlogEntriesComponent.activate(${id}) return ${JSON.stringify(newState)}`);

    // this.blogEntries.data.forEach(
    //   element => (element.id === id)? element.
    // )

    return newState;
  }

}
