export type PriceHistoryItem = {
  price: number;
  _id:any;
  date:any;
};

export type User = {
  email: string;
};

export type UserInteraction={
  email:string;
}

export type Product = {
  price: ReactNode;
  rating: string;
  _id?: string;
  url: string;
  currency: string;
  image: string;
  title: string;
  currentPrice: number;
  originalPrice: number;
  priceHistory: PriceHistoryItem[] | [];
  usersInteraction:  UserInteraction[] | [];
  highestPrice: number;
  lowestPrice: number;
  averagePrice: number;
  discountRate: number;
  description: string;
  category: string;
  ratingCount: number;
  isOutOfStock: Boolean;
  sellerInfo: string;
  users?: User[];
};

export type crawlerProduct = {
  rating: Number;
  price:string;
  url: string;
  currency: string;
  image: string;
  title: string;
  
};

export type NotificationType =
  | "WELCOME"
  | "CHANGE_OF_STOCK"
  | "LOWEST_PRICE"
  | "THRESHOLD_MET";

export type EmailContent = {
  subject: string;
  body: string;
};

export type EmailProductInfo = {
  title: string;
  url: string;
};
