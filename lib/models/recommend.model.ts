import mongoose from 'mongoose';

const recommendSchema = new mongoose.Schema({
  url: { type: String, required: true, unique: true },
  title: { type: String, required: true },
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




const RecommendProduct = mongoose.models.RecommendProduct || mongoose.model('RecommendProduct', recommendSchema);

export default RecommendProduct;