export interface IUser {
  _id: string;
  name: string;
  email: string;
  image?: string;
  phone: string;
  role: string;
  address: { governorate: string; city: string; street: string };
  isBlocked?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
