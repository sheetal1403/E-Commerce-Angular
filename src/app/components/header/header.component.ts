import { Component, OnInit } from '@angular/core';
import { CartModelServer } from 'src/app/models/cart.model';
import { CartServiceService } from 'src/app/services/cart-service.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  cartData: CartModelServer;
  cartTotal: number;
  isLoggedIn: boolean;
  userData: any;

  constructor(private cartService: CartServiceService,
              private userService: UserService) { }

  ngOnInit(): void {
    this.cartService.cartTotal$.subscribe(total => this.cartTotal = total);
    this.cartService.cartDataObs$.subscribe(cartData => this.cartData = cartData);
    this.userService.authState.subscribe(auth => this.isLoggedIn = auth);
    this.userService.userData.subscribe(user => this.userData = user);
  }

  deleteFromCart(i: number) {
    this.cartService.DeleteProductFromCart(i);
  }

  logout(){
    this.userService.logout();
  }
}
