export interface IUserRef {
  _id: string;
  name: string;
  image?: string; 
}

export interface ITestimonial {
  _id?: string;
  userId?: IUserRef;
  comment: string;
  rating: number;
  isApproved?: boolean;
  createdAt?: string;
}


