import { Injectable } from '@angular/core';
import { ProductService } from './product.service';
import { OrderServiceService } from './order-service.service';
import { environment } from '../../environments/environment';
import { CartModelServer, CartModelPublic } from '../models/cart.model';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { ProductModelServer } from '../models/product.model';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class CartServiceService {

  private ServerUrl = environment.SERVER_URL;

  // Cart Data variable to store the cart information on the client local storage
  private cartDataClient: CartModelPublic = {prodData: [{incart: 0, id: 0}], total: 0};

  // Cart Data variable to store the cart information on the server (Angular server, not backend)
  private cartDataServer: CartModelServer = {
    data: [{
      product: undefined,
      numInCart: 0
    }],
    total: 0
  };

  // Data variable to store the cart information on the client's local storage
cartTotal$ = new BehaviorSubject<number>(0);
cartDataObs$ = new BehaviorSubject<CartModelServer>(this.cartDataServer);



constructor(private productService: ProductService,
            private orderService: OrderServiceService,
            private router: Router,
            private toastr: ToastrService) {

                // Emit data in the beginning
                this.cartTotal$.next(this.cartDataServer.total);
                this.cartDataObs$.next(this.cartDataServer);

                // Get info from local storage
                const info: CartModelPublic = JSON.parse(localStorage.getItem('cart'));
                if (info !== null && info !== undefined && info.prodData[0].incart !== 0) {
                  // Local storage is not empty
                  this.cartDataClient = info;

                  // Loop through each element
                  this.cartDataClient.prodData.forEach(p => {
                    this.productService.getSingleProduct(p.id).subscribe((actualProduct: ProductModelServer) => {
                      if (this.cartDataServer.data[0].numInCart === 0) {
                        // CartDataServer is empty
                        this.cartDataServer.data[0].numInCart = p.incart;
                        this.cartDataServer.data[0].product = actualProduct;

                        // Calculate total and fill the total in CartData Server
                        this.CalculateTotal();
                        this.cartDataClient.total = this.cartDataServer.total;
                        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
                      } else {
                        // CartDataServer is not empty
                        this.cartDataServer.data.push({
                          product: actualProduct,
                          numInCart: p.incart
                        });

                        // Calculate total and fill the total in CartData Server
                        this.CalculateTotal();
                        this.cartDataClient.total = this.cartDataServer.total;
                        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
                      }
                      this.cartDataObs$.next(this.cartDataServer);
                    });
                  });
                }

               }

addProductToCart(id: number, quantity?: number) {
  // 1. If Cart is empty
  this.productService.getSingleProduct(id).subscribe((prod: ProductModelServer) => {
    if (this.cartDataServer.data[0].product === undefined) {
      this.cartDataServer.data[0].product = prod;
      this.cartDataServer.data[0].numInCart = quantity !== undefined ? quantity : 1;
      console.log(this.cartDataServer);
      // Calculation of total amount
      this.CalculateTotal();




      // Update Client cart storage

      this.cartDataClient.prodData[0].id = prod.id;
      this.cartDataClient.prodData[0].incart = this.cartDataServer.data[0].numInCart;
      this.cartDataClient.total = this.cartDataServer.total;
      localStorage.setItem('cart', JSON.stringify(this.cartDataClient));

      // Emit cart data
      this.cartDataObs$.next({...this.cartDataServer});

      // Display a toast notification
      this.toastr.success(`${prod.name} has been added!`, 'Product added', {
        timeOut: 1500,
        progressBar: true,
        progressAnimation: 'increasing',
        positionClass: 'toast-top-right'
      });


    } else {

      // 2. Cart has some items
      const index = this.cartDataServer.data.findIndex(p => p.product.id === id);

      if (index !== -1) {

        // 2a: If the item already exists
        if (quantity !== undefined && quantity <= prod.quantity) {
          this.cartDataServer.data[index].numInCart = this.cartDataServer.data[index].numInCart < quantity ? quantity : prod.quantity;
        } else { // quantity is not set, default is increase by 1
          // tslint:disable-next-line: max-line-length
          console.log(this.cartDataServer.data[index]);
          console.log(prod.quantity);
          console.log(prod.quantity > this.cartDataServer.data[index].numInCart);
          // tslint:disable-next-line: max-line-length
          this.cartDataServer.data[index].numInCart = prod.quantity > this.cartDataServer.data[index].numInCart ? this.cartDataServer.data[index].numInCart + 1  : prod.quantity;
          // if(prod.quantity > this.cartDataServer.data[index].numInCart){
          //   this.cartDataServer.data[index].numInCart++
          // }else{
          //   this.cartDataServer.data[index].numInCart = prod.quantity;
          // }
          console.log(this.cartDataServer.data[index]);

        }

        this.cartDataClient.prodData[index].incart = this.cartDataServer.data[index].numInCart;

        this.CalculateTotal();
        this.cartDataClient.total = this.cartDataServer.total;
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
        this.cartDataObs$.next(this.cartDataServer);
        // Display a toast notification


      } else {
        // 2b: Selected item does not exist on the cart

        this.cartDataServer.data.push({
          product: prod,
          numInCart: 1
        });

        this.cartDataClient.prodData.push({
          id: prod.id, incart: 1
        });

        // Display a toast notification
        // TODO calculate total of server
        this.CalculateTotal();
        this.cartDataClient.total = this.cartDataServer.total;
        // this.cartDataClient.total = 5;
        console.log(this.cartDataClient);
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
        this.cartDataObs$.next(this.cartDataServer);
      }
    }
  });
}



DeleteProductFromCart(index) {
  /*    console.log(this.cartDataClient.prodData[index].prodId);
      console.log(this.cartDataServer.data[index].product.id);*/

  if (window.confirm('Are you sure you want to delete the item?')) {
    this.cartDataServer.data.splice(index, 1);
    this.cartDataClient.prodData.splice(index, 1);
    this.CalculateTotal();
    this.cartDataClient.total = this.cartDataServer.total;

    if (this.cartDataClient.total === 0) {
      this.cartDataClient = {prodData: [{incart: 0, id: 0}], total: 0};
      localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
    } else {
      localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
    }

    if (this.cartDataServer.total === 0) {
      this.cartDataServer = {
        data: [{
          product: undefined,
          numInCart: 0
        }],
        total: 0
      };
      this.cartDataObs$.next({...this.cartDataServer});
    } else {
      this.cartDataObs$.next({...this.cartDataServer});
    }
  } else {
    return;
  }


}

private CalculateTotal() {
  let Total = 0;

  this.cartDataServer.data.forEach(p => {
    const {numInCart} = p;
    const {price} = p.product;
    // @ts-ignore
    Total += numInCart * price;
  });
  this.cartDataServer.total = Total;
  this.cartTotal$.next(this.cartDataServer.total);
}

CalculateSubTotal(index): number {
  let subTotal = 0;

  const p = this.cartDataServer.data[index];
  // @ts-ignore
  subTotal = p.product.price * p.numInCart;

  return subTotal;
}




}
