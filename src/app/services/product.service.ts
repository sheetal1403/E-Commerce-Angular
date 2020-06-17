import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { ServerResponse, ProductModelServer } from '../models/product.model';



@Injectable({
  providedIn: 'root'
})
export class ProductService {

  SERVER_URL = environment.SERVER_URL;

  constructor(private http: HttpClient) { }

  // get all products
  getAllProducts(numberOfResults: number = 10): Observable<ServerResponse> {
    return this.http.get<ServerResponse>(this.SERVER_URL + '/products', {
      params: {
        limit: numberOfResults.toString(),
      }
    });
  }

getSingleProduct(id: number): Observable<ProductModelServer> {
  return this.http.get<ProductModelServer>(this.SERVER_URL + '/products/' + id);
}

getProductsFromSingleCategory(catName: string): Observable<ProductModelServer[]> {
  return this.http.get<ProductModelServer[]>(this.SERVER_URL + '/products/' + catName);
}

}
