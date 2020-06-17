import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

interface ProductResponseModel {
  id: number;
  title: string;
  description: string;
  price: number;
  quantityOrdered: number;
  image: string;
}

@Injectable({
  providedIn: 'root'
})


export class OrderServiceService {

  private ServerUrl = environment.SERVER_URL;


  constructor(private http: HttpClient) { }



  getSingleOrder(orderId: number) {
    return this.http.get<ProductResponseModel>(this.ServerUrl + '/orders/' + orderId).toPromise();
  }
}

