import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthenticationService } from 'src/app/services/authentication-service/authentication.service';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { CustomValidators } from 'src/app/common/validatiors/custom-validators';
import { AuthPageLabels } from 'src/app/common/auth-page-labels';

// class CustomValidators {
//   static passwordContainsNumber(control: AbstractControl): ValidationErrors {
//     const regex = /\d/;

//     if (regex.test(control.value) && control.value !== null) {
//       return null;
//     } else {
//       return { passwordInvalid: true };
//     }
//   }

//   static passwordsMatch(control: AbstractControl): ValidationErrors {
//     const password = control.get('password').value;
//     const confirmPassword = control.get('confirmPassword').value;

//     if ((password === confirmPassword) && (password !== null && confirmPassword !== null)) {
//       return null;
//     } else {
//       return { passwordsNotMatching: true };
//     }
//   }

//   static emailValids(control: AbstractControl): ValidationErrors {
//     const regex = /.+@\S+\.\S+$/;

//     if (regex.test(control.value) && control.value !== null) {
//       return null;
//     } else {
//       return { passwordInvalid: true };
//     }
//   }
// }

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  resendMailForm: FormGroup;

  registerMainText: string = AuthPageLabels.registerMainText;
  registerParaText: string = AuthPageLabels.registerParaText;
  registerResendMainText: string = AuthPageLabels.registerResendMainText;
  registerResendParaText: string = AuthPageLabels.registerResendParaText;

  constructor(
    private authService: AuthenticationService,
    private formBuilder: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      pseudo: [null, [Validators.required]],
      username: [null, [Validators.required]],
      email: [null, [
        Validators.required,
        CustomValidators.emailValids,
        Validators.minLength(6)
      ]],
      password: [null, [
        Validators.required,
        Validators.minLength(3),
        CustomValidators.passwordContainsNumber
      ]],
      // role: '',
      // d_creation: new Date(),
      confirmPassword: [null, [Validators.required]]
    }, {
      validators: CustomValidators.passwordsMatch
    })

    this.resendMailForm = this.formBuilder.group({
      email: [null, [
        Validators.required,
        Validators.minLength(6),
        CustomValidators.emailValids,
      ]],
    })
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      return;
    }
    delete this.registerForm.value.confirmPassword;
    console.log(this.registerForm.value);
    this.authService.register(this.registerForm.value).pipe(
      map(user => this.router.navigate(['login']))
    ).subscribe()
  }

  resendConfirmationEmail() {
    if (this.resendMailForm.invalid) {
      return;
    }
    console.log(this.resendMailForm.value);
    this.authService.resendCOnfirmationEmail(this.resendMailForm.value).pipe(
      map(email => this.router.navigate(['login', email]))
    ).subscribe()
  }

  isRegisterFormValids() {
    if (this.registerForm?.valid) {
      return ;
    } else {
      return "disabled";
    }
  }

  isResendFormValids() {
    if (this.resendMailForm?.valid) {
      return ;
    } else {
      return "disabled";
    }
  }

  
  

}
