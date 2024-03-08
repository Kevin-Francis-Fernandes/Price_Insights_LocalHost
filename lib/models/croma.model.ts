import mongoose from 'mongoose';

const cromaSchema = new mongoose.Schema({
  url: { type: String, unique: true },
  title: { type: String },
  price: {type :Number },
  currency : {type: String},
  rating: {type:Number},
  image: {type:String},
});




const CromaProduct = mongoose.models.CromaProduct || mongoose.model('CromaProduct', cromaSchema);

export default CromaProduct;