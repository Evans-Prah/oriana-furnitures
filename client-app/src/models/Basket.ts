export interface Basket {
  success: boolean;
  responseMessage: string;
  data: {
    basketId: number;
    buyerId: string;
    message?: string;
    items: BasketItem[];
  };
}

export interface BasketItem {
  productUuid: string;
  product: string;
  brand: string;
  category: string;
  price: number;
  quantity: number;
  pictureUrl: string;
}
