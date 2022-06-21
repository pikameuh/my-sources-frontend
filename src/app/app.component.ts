import { Component } from '@angular/core';
import { ChildrenOutletContexts, Router } from '@angular/router';
import { AuthenticationService } from './services/authentication-service/authentication.service';
import { slideInAnimation } from './ui/animation';
import { Location } from '@angular/common'
import { AuthPageLabels } from './common/auth-page-labels';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    slideInAnimation
  ]
})
export class AppComponent {
  primaryColor: string;
  secondaryColor: string;

  homeBtnText: string = AuthPageLabels.homeBtnText;

  constructor(
    private contexts: ChildrenOutletContexts, 
    private router: Router, 
    private authService: AuthenticationService,
    private location: Location,
    ) {
   // this.changeTheme('red', 'yellow'); // Set default theme
  }

  changeTheme(primary: string, secondary: string) {
    // console.log(` + AppComponent.changeTheme(${primary}, ${secondary})`);
    document.documentElement.style.setProperty('$first-color', primary);
    document.documentElement.style.setProperty('$second-color', secondary);
  }

  navigateTo(value) {
    this.router.navigate(['../', value]);
  }

  logout() {
    this.authService.logout();
    window.location.reload();
  }

  isAuth() {
    return this.authService.isAuthenticated();
  }

  isAdminOrAstek() {
    // console.log(` +>      + isAdminOrAstek(${this.authService.getUserRoleName()})?`);
    return ['admin', 'astek'].includes(this.authService.getUserRoleName());
  }

  getRouteAnimationData() {
    // console.log(` + AppComponent.getRouteAnimationData(${JSON.stringify(this.contexts.getContext('primary')?.route?.snapshot?.data?.['animation'])}`);
    return this.contexts.getContext('primary')?.route?.snapshot?.data?.['animation'];
  }

  back(): void {
    this.location.back()
  }

  isCurrentRoute(routeName: string) {
    return this.router.url === '/' + routeName;
  }

  
}
