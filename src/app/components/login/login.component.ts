import { Component, OnInit } from '@angular/core';
import { SocialAuthService } from 'angularx-social-login';
import { GoogleLoginProvider } from 'angularx-social-login';
import { SocialUser } from 'angularx-social-login';
import { NgForm } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  email: string;
  password: string;
  loginMessage: string;

  constructor(private authService: SocialAuthService,
              private userService: UserService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.userService.authState.subscribe(auth => {
      if (auth) {
        this.router.navigateByUrl(this.route.snapshot.queryParams.returnUrl || '/profile');
      } else {
        this.router.navigateByUrl('/login');
      }
    });
  }

  login(form: NgForm) {
    const email = this.email;
    const password = this.password;
    if (form.invalid) {
      return;
    }

    form.reset();

    this.userService.loginUser(email, password);
  }

  signInWithGoogle() {
    this.userService.googleLogin();
  }
}
