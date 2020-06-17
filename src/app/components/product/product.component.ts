import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';
import { ProductModelServer } from 'src/app/models/product.model';
import { CartServiceService } from 'src/app/services/cart-service.service';

declare let $: any;

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit, AfterViewInit {

  product: ProductModelServer;
  images: string[] = [];

  @ViewChild('quantity') quantityInput;

  constructor(private route: ActivatedRoute,
              private productService: ProductService,
              private cartService: CartServiceService) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.productService.getSingleProduct(+params.id).subscribe(product => {
        this.product = product;
        if (product.images !== null) {
          this.images = product.images.split(';');
        }
        console.log(this.images.length);

      });
    });
  }

  ngAfterViewInit(): void {
    $('#product-main-img').slick({
      infinite: true,
      speed: 300,
      dots: false,
      arrows: true,
      fade: true,
      asNavFor: '#product-imgs',
    });

    // Product imgs Slick
    $('#product-imgs').slick({
      slidesToShow: 3,
      slidesToScroll: 1,
      arrows: true,
      centerMode: true,
      focusOnSelect: true,
      centerPadding: 0,
      vertical: true,
      asNavFor: '#product-main-img',
      responsive: [{
          breakpoint: 991,
          settings: {
            vertical: false,
            arrows: false,
            dots: true,
          }
        },
      ]
    });

    // Product img zoom
    // tslint:disable-next-line: prefer-const
    let zoomMainProduct = document.getElementById('product-main-img');
    if (zoomMainProduct) {
      $('#product-main-img .product-preview').zoom();
    }
  }

  addToCart(id: number) {
    this.cartService.addProductToCart(id, this.quantityInput.nativeElement.value);
  }

  increase() {
    let value = +this.quantityInput.nativeElement.value;

    if (this.product.quantity >= 0) {
      value++;

      if (value >= this.product.quantity) {
        value = this.product.quantity;
      }
    } else {
      return;
    }
    this.quantityInput.nativeElement.value = value.toString();
  }

  decrease() {
    let value = +this.quantityInput.nativeElement.value;

    if (this.product.quantity > 0) {
      value--;

      if (value < 1) {
        value = 1;
      }
    } else {
      return;
    }

    this.quantityInput.nativeElement.value = value.toString();
  }

}
