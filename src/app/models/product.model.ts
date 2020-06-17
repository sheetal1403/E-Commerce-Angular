export interface ProductModelServer {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  category: string;
  image: string;
  images: string;
}

export interface ServerResponse {
  count: number;
  products: ProductModelServer[];
}
