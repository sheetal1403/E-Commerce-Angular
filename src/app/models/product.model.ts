export interface ProductModelServer {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  category: string;
  image: string;
}

export interface ServerResponse {
  count: number;
  products: ProductModelServer[];
}
