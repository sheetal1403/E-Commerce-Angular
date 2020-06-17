import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ServerResponse } from '../../models/product.model';
import { CartServiceService } from 'src/app/services/cart-service.service';
import { ProductModelServer } from '../../models/product.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  products: any[] = [];

  constructor(private productService: ProductService,
              private cartService: CartServiceService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.productService.getAllProducts().subscribe((produ: ServerResponse) => {
      console.log(produ.count);
      this.products = produ.products;

    });

  }

  selectProduct(id: number) {
    // this.productService.getSingleProduct(id).subscribe(product => {
    //   console.log(product);
    // });
    this.router.navigate(['/product/', id], {relativeTo: this.route});
  }

  addToCart(id: number) {
    this.cartService.addProductToCart(id);

  }




}
