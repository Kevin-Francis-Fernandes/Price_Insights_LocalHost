import mongoose from 'mongoose';

const relianceSchema = new mongoose.Schema({
  url: { type: String, unique: true },
  title: { type: String },
  price: {type :Number },
  currency : {type: String},
  rating: {type:Number},
  image: {type:String},
});




const RelianceProduct = mongoose.models.RelianceProduct || mongoose.model('RelianceProduct', relianceSchema);

export default RelianceProduct;