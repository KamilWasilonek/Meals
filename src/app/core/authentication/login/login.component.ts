import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { SpinnerService } from 'src/app/shared/services/spinners/spinner.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  loginErrorMessage = null;
  returnUrl: string;
  isSpinnerOn: boolean;

  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private spinnerService: SpinnerService
  ) {}

  ngOnInit() {
    this.spinnerService.loadingStatus$.pipe(takeUntil(this.destroy$)).subscribe(response => {
      this.isSpinnerOn = response;
    });

    this.loginForm = this.fb.group({
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        ],
      ],
      password: ['', [Validators.required, Validators.minLength(5)]],
    });

    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/';
  }

  login() {
    const credentials = {
      email: this.email.value,
      password: this.password.value,
    };

    this.authService
      .loginUser(credentials)
      .subscribe(
        () => {
          this.loginErrorMessage = null;
          this.router.navigateByUrl(this.returnUrl ? this.returnUrl : '/');
        },
        err => {
          this.loginErrorMessage = err;
        }
      );
  }

  get email() {
    return this.loginForm.get('email');
  }
  get password() {
    return this.loginForm.get('password');
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
