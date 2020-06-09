import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  SERVER_URL = environment.SERVER_URL;

  constructor(private http: HttpClient) { }

  // get all products
  getAllProducts(numberOfResults: number = 10) {
    return this.http.get(this.SERVER_URL + '/products', {
      params: {
        limit: numberOfResults.toString(),
      }
    });
  }

getSingleProduct(id: number) {
  return this.http.get(this.SERVER_URL + '/products/' + id);
}

}
