import { AbstractControl, ValidationErrors } from "@angular/forms";

export class CustomValidators {
    static passwordContainsNumber(control: AbstractControl): ValidationErrors {
        const regex = /\d/;

        if (regex.test(control.value) && control.value !== null) {
            return null;
        } else {
            return { passwordInvalid: true };
        }
    }

    static passwordsMatch(control: AbstractControl): ValidationErrors {
        const password = control.get('password').value;
        const confirmPassword = control.get('confirmPassword').value;

        if ((password === confirmPassword) && (password !== null && confirmPassword !== null)) {
            return null;
        } else {
            return { passwordsNotMatching: true };
        }
    }

    static emailValids(control: AbstractControl): ValidationErrors {
        const regex = /.+@\S+\.\S+$/;

        if (regex.test(control.value) && control.value !== null) {
            return null;
        } else {
            return { passwordInvalid: true };
        }
    }
}