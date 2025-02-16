import mongoose from 'mongoose';

const amazonSchema = new mongoose.Schema({
  url: { type: String, unique: true },
  title: { type: String },
  price: {type :Number },
  currency : {type: String},
  rating: {type:Number},
  image: {type:String},
});




const AmazonProduct = mongoose.models.AmazonProduct || mongoose.model('AmazonProduct', amazonSchema);

export default AmazonProduct;