export interface IProduct {
  _id?: string;
  name: string;
  description: string;
  price: number;
  quantity: number;


  category:
    | string
    | {
        _id: string;
        name?: string;
      };

  subcategory?:
    | string
    | {
        _id: string;
        name?: string;
      };

  stock: number;
  image?: string;
  ratingsAverage?: number;
  reviews?: IReview[];
  isActive?: boolean;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
export interface IReview {
  _id?: string;
   productId: string;
  user: string;
  comment: string;
  rating: number;
  date?: string;
}
