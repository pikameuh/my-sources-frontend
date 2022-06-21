import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ActivatedRoute, Params } from '@angular/router';
import { UserService } from 'src/app/services/user-service/user.service';
import { map, switchMap, tap } from 'rxjs/operators';
import { User } from 'src/app/model/user.interface';
// import { BlogEntriesPageable } from 'src/app/model/blog-entry.interface';
import { BlogService } from 'src/app/services/blog-service/blog.service';
import { PageEvent } from '@angular/material/paginator';
import { WINDOW } from 'src/app/window-token';
import { Inject } from '@angular/core';
import { JwtPayloadResponse } from 'src/app/interfaces/jwt-payload-response';
import { AuthenticationService } from 'src/app/services/authentication-service/authentication.service';
import { JwtPayload } from 'src/app/interfaces/jwt-payload';
import { Roles } from 'src/app/interfaces/roles.enum';

@Component({
  selector: 'users-profile',
  templateUrl: './users-profile.component.html',
  styleUrls: ['./users-profile.component.scss']
})
export class UsersProfileComponent {


  origin = this.window.location.origin;
  dataSource: JwtPayload = null;
  savedRoleName: string;
  savedRoleId: number;
  currentUserRole: string;
  

  // private userId$: Observable<number> = this.activatedRoute.params.pipe(
  //   map((params: Params) => parseInt(params['id']))
  // )

  // user$: Observable<JwtPayloadResponse> = this.userId$.pipe(
  //   switchMap((userId: number) => this.userService.findOne(userId))
  // )

  // blogEntries$: Observable<JwtPayloadResponse> = this.userId$.pipe(
  //   switchMap((userId: number) => this.blogService.indexByUser(userId, 1, 10))
  // )

  constructor(
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private authService: AuthenticationService,
    private blogService: BlogService,
    @Inject(WINDOW) private window: Window
  ) { }

  ngOnInit(): void {
    this.initDataSource();
  }

  async initDataSource() {
      console.log(`AllUsersProfileComponent.initDataSource()`);
      // using currentUser ID
      this.userService.findOne(parseInt(this.activatedRoute.snapshot.paramMap.get("id"))).pipe(
          map((userData: JwtPayloadResponse) => {
            console.log(` + set userData                : ${JSON.stringify(userData)}`);
            console.log(` - set dataSource from userData: ${JSON.stringify(userData.data[0])}`);
            this.dataSource = userData.data[0];
            this.savedRoleName = this.dataSource.role.name;
            this.savedRoleId = this.dataSource.role.id;
            this.currentUserRole = this.authService.getUserRoleName();
          })
        ).subscribe();
      
      console.log(`UsersComponent.initDataSource() end`);
    }

  onPaginateChange(event: PageEvent) {
    // return this.userId$.pipe(
    //   tap((userId: number) => this.blogEntries$ = this.blogService.indexByUser(userId, event.pageIndex, event.pageSize))
    // ).subscribe();
  }

  canUpgradeTo(roleToUpgrade: string, roleOfCurrentUser: string){
    const loggedUserRoleCode = Roles.getCodeFromName(this.currentUserRole);
    const currentCardUserRoleCode = Roles.getCodeFromName(roleOfCurrentUser)
    const toUpgradeRoleCode = Roles.getCodeFromName(roleToUpgrade)

    if (loggedUserRoleCode > currentCardUserRoleCode) {
      if (loggedUserRoleCode > toUpgradeRoleCode) {
        return true;
      }      
    }

    return false;
  }

  canUpdateRoleOf( roleOfCurrentUser: string){
    const loggedUserRoleCode = Roles.getCodeFromName(this.currentUserRole);
    const currentCardUserRoleCode = Roles.getCodeFromName(roleOfCurrentUser)

    if(loggedUserRoleCode > currentCardUserRoleCode) {
      return true;
    }

    return false;
  }

  updateRole(){
    this.userService.updateRoleOfOne(this.dataSource?.id, this.dataSource?.role.name)
    this.dataSource.role.id = Roles.getCodeFromName(this.dataSource?.role.name)
    this.savedRoleName = this.dataSource.role.name;
    this.savedRoleId = this.dataSource.role.id;
    this.authService.updateLocalStorageRole(this.savedRoleName, this.savedRoleId);
  }

}



// this.userService.findAll(1, 10).pipe(
//   map((userData: JwtPayloadResponse) => {
//     console.log(`set dataSource from userData: ${JSON.stringify(userData)}`);
//     this.dataSource = userData;
//   })
//   //this.dataSource = userData) // console.log(`userData: ${JSON.stringify(userData)}`))//, 
// ).subscribe();
