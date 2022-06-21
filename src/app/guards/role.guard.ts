import { Injectable } from "@angular/core";
import { CanActivate, Router, ActivatedRouteSnapshot } from "@angular/router";
import { AuthenticationService } from "../services/authentication-service/authentication.service";
import { JwtHelperService } from "@auth0/angular-jwt";
import { SnackBarErrorComponent } from "../components/error/snackbar-error.component";
import { Errors } from "../interfaces/errors";
import { LocalStorageKeys } from "../interfaces/local-storage-keys";

@Injectable({
    providedIn: 'root'
})
export class RoleGuardService implements CanActivate {
    jwtHelper = new JwtHelperService()

    constructor(
        public auth: AuthenticationService,
        public router: Router,
        private snackBar: SnackBarErrorComponent
    ) { }

    canActivate(route: ActivatedRouteSnapshot): boolean {
        const expectedRole: string[] = route.data.expectedRole;
        const token = localStorage.getItem(LocalStorageKeys.JWT_TOKEN.name)
        const tokenPayLoad = this.jwtHelper.decodeToken(token)

        console.log(`expectedRole: ${expectedRole},\n tokenPayLoad: ${JSON.stringify(tokenPayLoad.role.name)}`);

        if (this.auth.isAuthenticated() && (expectedRole.indexOf(tokenPayLoad.role.name) === -1)) {
            // console.log(tokenPayLoad);
            this.router.navigate(['/']);
            this.snackBar.openClientErrorSnackBar(`#${Errors.NOT_ENOUGHT_RIGHT_FOR_PAGE.code} ${Errors.NOT_ENOUGHT_RIGHT_FOR_PAGE.message}`);
           // window.alert(`Vous n'avez pas les privilèges suffisent pour accéder à cette page..`);
            return false;
        }
        return true;
    }


    checkInput(input, words): boolean {
        return words.some(word => new RegExp(word, "i").test(input));
    }
}