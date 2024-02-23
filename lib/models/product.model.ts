import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  url: { type: String, required: true, unique: true },
  currency: { type: String, required: true },
  image: { type: String, required: true },
  title: { type: String, required: true },
  currentPrice: { type: Number, required: true },
  originalPrice: { type: Number, required: true },
  priceHistory: [
    { 
      price: { type: Number, required: true },
      date: { type: Date, default: Date.now }
    },
  ],
  usersInteraction: [
    {email: { type: String, required: true}}
  ],
  lowestPrice: { type: Number },
  highestPrice: { type: Number },
  averagePrice: { type: Number },
  discountRate: { type: Number },
  description: { type: String },
  category: { type: String },
  ratingCount: { type: Number },
  sellerInfo:{type:String},
  isOutOfStock: { type: Boolean, default: false },
  brand: { type: String },
  main_cat: { type: String },
  sub_cat: { type: String },
  rating: { type: Number },
  age: { type: Number },
  gender: { type: String },
  location: { type: String},
  
  users: [
    {email: { type: String, required: true}}
  ], default: [],
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

export default Product;