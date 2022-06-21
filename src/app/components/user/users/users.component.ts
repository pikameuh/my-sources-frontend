import { Component, Inject, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user-service/user.service';
import { map, tap } from 'rxjs/operators';
import { PageEvent } from '@angular/material/paginator';
import { Router, ActivatedRoute } from '@angular/router';
import { JwtPayload } from 'src/app/interfaces/jwt-payload';
import { JwtPayloadResponse } from 'src/app/interfaces/jwt-payload-response';
import { AuthenticationService } from 'src/app/services/authentication-service/authentication.service';
import { LocalStorageKeys } from 'src/app/interfaces/local-storage-keys';
import { WINDOW } from 'src/app/window-token';
import { Roles } from 'src/app/interfaces/roles.enum';2

import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';

interface Dictionary<T> {
  [Key: string]: T;
}

// export class SearchParameters {
//   SearchFor: Dictionary<string> = {};
// }

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  id: string = localStorage.getItem(LocalStorageKeys.JWT_ID.name);
  // role: string = localStorage.getItem(JWT_ROLE);
  filterValue: string = null;
  dataSource: JwtPayload[] = null;
  dataSourceSelected: JwtPayload = null;
  pageEvent: PageEvent;
  displayedColumns: string[] = ['id', 'name', 'username', 'email', 'role'];
  // sortedBy: string = 'id';

  sortedActivatedBy: string = 'id';
  sortedDesactivatedBy: string = 'id';

  origin = this.window.location.origin;
  selectedDataSource: number = -1;
  savedRoleName: string;
  savedRoleId: number;

  matTabIndex = 1;

  activatedUsers: string[] = [];
  desactivatedUsers: string[] = [];
  // usersList: { [id: string] : JwtPayload; } = {};
  usersList: Dictionary<string> = {};

  constructor(
    private userService: UserService,
    private authService: AuthenticationService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    @Inject(WINDOW) private window: Window

  ) { }

  ngOnInit(): void {
    this.initDataSource();
  }

  isActivated(element, index, array) { 
    return (element.activated === true); 
 }

 isDesactivated(element, index, array) { 
  return (element.activated === false); 
}

  initDataSource() {
    console.log(`UsersComponent.initDataSource()`);
    // behavior dedicated to admin and astek
    // const role = localStorage.getItem(JWT_ROLE);
    this.userService.findAll(1, 100).pipe(
      map((userData: JwtPayloadResponse) => {
        console.log(`set dataSource from userData: ${JSON.stringify(userData)}`);
        this.dataSource = userData?.data?.sort((a, b) => a['id'] > b['id'] ? 1 : a['id'] === b['id'] ? 0 : -1);

        this.dataSource.forEach( user => {
          // Check canActivate
          if (user && this.canUpdateRoleOf(user.role.name)) {
            if (user.activated) {
              this.activatedUsers.push(user.pseudo);
            } else {
              this.desactivatedUsers.push(user.pseudo);
            }
            this.usersList[user.pseudo] = ''+user.id;
          }
        })

        console.log(` +++++ ----- >  this.usersList : ${JSON.stringify(this.usersList)}`);

        // this.activatedUsers = this.dataSource.filter(this.isActivated);
        // this.desactivatedUsers = this.dataSource.filter(this.isDesactivated);
      })
      //this.dataSource = userData) // console.log(`userData: ${JSON.stringify(userData)}`))//, 
    ).subscribe();

    // this.userService.findOne(parseInt(localStorage.getItem(JWT_ID))).pipe(
    //   map((userData: JwtPayloadResponse) => {
    //     console.log(`set dataSource from userData: ${JSON.stringify(userData)}`);
    //     this.dataSource = userData;
    //   })
    //   //this.dataSource = userData) // console.log(`userData: ${JSON.stringify(userData)}`))//, 
    // ).subscribe();

    console.log(`UsersComponent.initDataSource() end`);
  }

  onPaginateChange(event: PageEvent) {
    let page = event.pageIndex;
    let size = event.pageSize;


    if (this.filterValue == null) {
      page = page + 1;
      this.userService.findAll(page, size).pipe(
        map((userData: JwtPayloadResponse) => this.dataSource = userData.data)
      ).subscribe();
    } else {
      this.userService.paginateByName(page, size, this.filterValue).pipe(
        map((userData: JwtPayloadResponse) => this.dataSource = userData.data)
      ).subscribe()
    }

  }

  /**
   * Sort the users from JwtPayloadResponse by 'prop'
   * @param prop -  the key
   * @returns 
   */
  sortBy(sortedBy: string) {
    console.log(`UsersComponent.sortBy(${sortedBy})`);
    if (sortedBy === 'id' || sortedBy === 'pseudo' || sortedBy === 'email') {
      // ASC
      this.dataSource = this.dataSource?.sort((a, b) => a[sortedBy] > b[sortedBy] ? 1 : a[sortedBy] === b[sortedBy] ? 0 : -1);
    } else if (sortedBy === 'role') {
      // DESC numeric
      this.dataSource = this.dataSource?.sort((a, b) => a[sortedBy].id > b[sortedBy].id ? -1 : a[sortedBy].id === b[sortedBy].id ? 0 : 1);
    } else {
      // Date and boolean
      this.dataSource = this.dataSource?.sort((a, b) => a[sortedBy] > b[sortedBy] ? -1 : a[sortedBy] === b[sortedBy] ? 0 : 1);
    }

    // console.log(`sorted: ${JSON.stringify(sorted)}`);
    console.log(`sorted: [...]`);
    return this.dataSource;
  }

  sortActivatedBy() {
    console.log(`UsersComponent.sortActivatedBy(${this.sortedActivatedBy})`);

    const res = this.sortBy(this.sortedActivatedBy);

    this.activatedUsers.length = 0;

    this.dataSource.forEach( user => {
      // Check canActivate
      if (user && this.canUpdateRoleOf(user.role.name)) {
        if (user.activated) {
          this.activatedUsers.push(user.pseudo);
        }
      }
    });
    
    return this.activatedUsers;
  }

  sortDesactivatedBy() {
    console.log(`UsersComponent.sortActivatedBy(${this.sortedDesactivatedBy})`);

    const res = this.sortBy(this.sortedDesactivatedBy);

    this.desactivatedUsers.length = 0;

    this.dataSource.forEach( user => {
      // Check canActivate
      if (user && this.canUpdateRoleOf(user.role.name)) {
        if (!user.activated) {
          this.desactivatedUsers.push(user.pseudo);
        }
      }
    });
    
    return this.desactivatedUsers;
  }

  getSelectedUser() {
    return this.dataSourceSelected;
  }

  getSelectedUserRoleName() {
    return this.getSelectedUser()?.role.name;
  }

  getSelectedUserRoleId() {
    return this.getSelectedUser()?.role.id;
  }

  findByName(username: string) {
    console.log(`UsersComponent.findByName(${username})`);
    this.userService.paginateByName(0, 10, username).pipe(
      map((userData: JwtPayloadResponse) => this.dataSource = userData.data)
    ).subscribe()
  }

  async navigateToProfile(pseudo) {
    console.log(`UsersComponent.navigateToProfile(${pseudo})`);
    // this.router.navigate(['./' + id], { relativeTo: this.activatedRoute });
    this.selectedDataSource = parseInt(this.usersList[pseudo]);
    this.dataSourceSelected = await this.dataSource.find(data => data.id === this.selectedDataSource);
    this.savedRoleName = this.getSelectedUserRoleName();
    this.savedRoleId = this.getSelectedUserRoleId();
    this.matTabIndex = 2;

    console.log(`this.selectedDataSource = ${this.selectedDataSource}`);
    console.log(`this.savedRoleName = ${this.savedRoleName}`);
    console.log(`this.savedRoleId = ${this.savedRoleId}`);
    return;
    // TODO
  }

  async activate(id: number) {
    const newState = await this.userService.activateUser(id);
    console.log(`UsersComponent.activate(${id}) return ${JSON.stringify(newState)}`);

    if (newState === undefined){
      return false;
    }

    console.log(`reload component`);
    this.dataSource?.some(user => ((user.id === id) && newState && newState?.data && (user.activated !== newState?.data?.new_state)) ?
      this.updateActivateState(user, newState.data.new_state)
      // console.log(`(${user.id}) yes !!! `)

      : console.log(`(${user.id === id}) does not match criteria `)
    );

    return true;
  }
  updateActivateState(user: JwtPayload, new_state: boolean) {
    user.activated = new_state;
    // window.location.reload();
    console.log(`updateActivateState - new_state: ${user.activated}`);
  }


  canUpgradeTo(roleToUpgrade: string, roleOfCurrentUser: string) {
    console.log(` *** canUpgradeTo() ---> roleToUpgrade[${roleToUpgrade}] , roleOfCurrentUser[${roleOfCurrentUser}]`)


    const loggedUserRoleCode = Roles.getCodeFromName(this.authService.getUserRoleName());
    const currentCardUserRoleCode = Roles.getCodeFromName(roleOfCurrentUser)
    const toUpgradeRoleCode = Roles.getCodeFromName(roleToUpgrade)

    if (loggedUserRoleCode > currentCardUserRoleCode) {
      if (loggedUserRoleCode > toUpgradeRoleCode) {
        return true;
      }
    }

    return false;
  }

  canUpdateRoleOf(roleOfCurrentUser: string) : boolean {
    console.log(` *** canUpdateRoleOf() ---> roleOfCurrentUser[${roleOfCurrentUser}]`)
    const loggedUserRoleCode = Roles.getCodeFromName(this.authService.getUserRoleName());
    const currentCardUserRoleCode = Roles.getCodeFromName(roleOfCurrentUser)

    console.log(` *** loggedUserRoleCode[${loggedUserRoleCode}] > currentCardUserRoleCode[${currentCardUserRoleCode}]`)

    if (loggedUserRoleCode > currentCardUserRoleCode) {
      return true;
    }

    return false;
  }

  updateRole() {
    this.userService.updateRoleOfOne(this.getSelectedUser()?.id, this.getSelectedUser()?.role.name)
    this.getSelectedUser().role.id = Roles.getCodeFromName(this.getSelectedUser()?.role.name)
    this.savedRoleName = this.getSelectedUser()?.role.name;
    this.savedRoleId = this.getSelectedUser()?.role.id;
    this.authService.updateLocalStorageRole(this.savedRoleName, this.savedRoleId);
  }

  async drop(event: CdkDragDrop<string[]>) {
    // console.log(` +--------> transfertArrayItem :\n + event.previousContainer.data: ${JSON.stringify(event.previousContainer.data)} \n + event.container.data: ${JSON.stringify(event.container.data)}`)
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {

      // update selected user
      const pseudoToUpdate = event.previousContainer.data[event.previousIndex];
      const idToUpdate = this.usersList[pseudoToUpdate];
      const updated = await this.activate(parseInt(idToUpdate));
      
      // transferDragableElement, if updated succeeded
      if (updated) {
        transferArrayItem(event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex);
      }      
    }
  }

}
