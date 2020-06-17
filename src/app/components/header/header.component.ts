import { Component, OnInit } from '@angular/core';
import { CartModelServer } from 'src/app/models/cart.model';
import { CartServiceService } from 'src/app/services/cart-service.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  cartData: CartModelServer;
  cartTotal: number;

  constructor(private cartService: CartServiceService) { }

  ngOnInit(): void {
    this.cartService.cartTotal$.subscribe(total => this.cartTotal = total);
    this.cartService.cartDataObs$.subscribe(cartData => this.cartData = cartData);
  }

  deleteFromCart(i:number){
    this.cartService.DeleteProductFromCart(i);
  }
}
