import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  userData: any;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userService.userData.subscribe(user => {
      this.userData = user;
      console.log(this.userData.name);
      console.log(this.userData.email);
    });
  }

}
