export interface ISubCategory{
    _id?: string;
    name: string;
    image?: string;
     category: {
    _id: string;
    name: string;
  };
}