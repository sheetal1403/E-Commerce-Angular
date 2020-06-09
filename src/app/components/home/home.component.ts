import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ServerResponse } from '../../product.model';

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
    this.productService.getAllProducts().subscribe((products: ServerResponse) => {
      this.products = products.products;

    });

  }

  selectProduct(id: number) {
    // this.productService.getSingleProduct(id).subscribe(product => {
    //   console.log(product);
    // });
    this.router.navigate(['/product/', id], {relativeTo: this.route});
  }

}
