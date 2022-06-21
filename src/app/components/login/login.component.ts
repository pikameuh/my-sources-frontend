import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication-service/authentication.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { CustomValidators } from 'src/app/common/validatiors/custom-validators';
import { AuthPageLabels } from 'src/app/common/auth-page-labels';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  resetPasswordForm: FormGroup;

  loginMainText: string = AuthPageLabels.loginMainText;
  loginParaText: string = AuthPageLabels.loginParaText;
  loginResetMainText: string = AuthPageLabels.loginResetMainText;
  loginResetParaText: string = AuthPageLabels.loginResetParaText;

  
  
  constructor(
    private authService: AuthenticationService,
    private formBuilder: FormBuilder,
    private router: Router
    ) { }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      username: new FormControl(null, [Validators.required, Validators.minLength(4)]),
      password: new FormControl(null, [Validators.required, Validators.minLength(3)])
    })

    this.resetPasswordForm = this.formBuilder.group({
      email: [null, [
        Validators.required,
        CustomValidators.emailValids,
        Validators.minLength(6)
      ]],
    })
  }

  onSubmit() {
    if(this.loginForm.invalid) {
      return;
    }
    this.authService.login(this.loginForm.value).pipe(
      map(token => this.router.navigate(['user']))
    ).subscribe()
    
  }

  isLoginFormValids(){
    if (this.loginForm?.valid) {
      return ;
    } else {
      return "disabled";
    }
  }

  isResetFormValids(){
    if (this.resetPasswordForm?.valid) {
      return ;
    } else {
      return "disabled";
    }
  }

  resetPassword() {
    if (this.resetPasswordForm.invalid) {
      return;
    }
    console.log(this.resetPasswordForm.value);
    this.authService.resetPassword(this.resetPasswordForm.value)
    // .pipe(
    //   map(email => this.router.navigate(['login', email]))
    // ).subscribe()
  }

  isPasswordInputNotEmpty(){
    console.log(` isPasswordInputNotEmpty') -----> ${this.loginForm?.controls['password'].value}`)
    if (this.loginForm?.controls['password'].value) {
      return true;
    } else {
      return false;
    }
  }

}
