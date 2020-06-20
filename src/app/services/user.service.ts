import { Injectable } from '@angular/core';
import { SocialAuthService, GoogleLoginProvider } from 'angularx-social-login';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { SocialUser } from 'angularx-social-login';
import { BehaviorSubject } from 'rxjs';

export interface ResponseModel {
  token: string;
  auth: boolean;
  email: string;
  username: string;
  fname: string;
  lname: string;
  photoUrl: string;
  userId: number;
  type: string;
  role: number;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  auth = false;
  SERVER_URL: string = environment.SERVER_URL;
  authState: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.auth);
  userData: BehaviorSubject<SocialUser | ResponseModel> =  new BehaviorSubject<SocialUser>(null);

  constructor(private authService: SocialAuthService,
              private http: HttpClient) {

            this.authService.authState.subscribe((user: SocialUser) => {
              if (user !== null) {
                this.auth = true;
                this.authState.next(this.auth);
                this.userData.next(user);
                console.log(user);
              }
            });

  }

  loginUser(email: string, password: string) {
    this.http.post(`${this.SERVER_URL}/auth/login`, {email, password})
      .subscribe((data: ResponseModel) => {
        this.auth = data.auth;
        this.authState.next(this.auth);
        this.userData.next(data);
      });
  }

  googleLogin() {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  logout() {
    this.authService.signOut();
    this.auth =  false;
    this.authState.next(this.auth);
  }

}
