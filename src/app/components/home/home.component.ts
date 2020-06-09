import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  products: any[] = [];

  constructor(private productService: ProductService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.productService.getAllProducts(5).subscribe((products: {count: number, products: any}) => {
      this.products = products.products;
      console.log(this.products[0].image);
    });

  }

  selectProduct(id: number) {
    // this.productService.getSingleProduct(id).subscribe(product => {
    //   console.log(product);
    // });
    this.router.navigate(['/product/', id], {relativeTo: this.route});
  }

}
