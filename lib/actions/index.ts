"use server"

import { revalidatePath } from "next/cache";
import Product from "../models/product.model";
import { connectToDB } from "../mongoose";
import { scrapeAmazonProduct } from "../scraper";
import { getAveragePrice, getHighestPrice, getLowestPrice } from "../utils";
import { generateEmailBody, sendEmail } from "../nodemailer";
import { scrapeCromaProduct } from "../scraper/croma";
import { scrapeRelianceProduct } from "../scraper/reliance";
import { extractSearchTermInfo } from "../crawler";
import AmazonProduct from "../models/amazon.model";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import User from "../models/user.model";



export async function scrapeAndStoreProduct(productUrl: string,type:string) {
  // const router = useRouter();
  if(!productUrl) return;
  let userSession;

  
  try {
    connectToDB();
    const session = await getServerSession(authOptions);
    const userSession = await User.findOne({ email: session?.user?.email });
    let scrapedProduct;
    
    
    if(type=="amazon"){
       scrapedProduct = await scrapeAmazonProduct(productUrl);
    
    }
    else if(type=="croma"){
      scrapedProduct = await scrapeCromaProduct(productUrl);
    }
    else if (type=="reliance"){
      scrapedProduct = await scrapeRelianceProduct(productUrl);
    }
    else{
     
       const prod=await extractSearchTermInfo(productUrl);
      //how to redirect path here?
      return { redirect: '/dashboard/search' };
       
              
       
    }
    
    
    if(!scrapedProduct ) return;

    let product = scrapedProduct;
   
    const existingProduct = await Product.findOne({ url: scrapedProduct.url });
    
    if(existingProduct) {
      const updatedPriceHistory: any = [
        ...existingProduct.priceHistory,
        { price: scrapedProduct.currentPrice }
      ]

      const updateUsersInteraction:any  = [
        ...existingProduct.usersInteraction,
        { email: userSession.email, 
          age:userSession.age, 
          gender:userSession.gender, 
          location:userSession.location
        }
      ]

      product = {
        ...scrapedProduct,
        priceHistory: updatedPriceHistory,
        lowestPrice: getLowestPrice(updatedPriceHistory),
        highestPrice: getHighestPrice(updatedPriceHistory),
        averagePrice: getAveragePrice(updatedPriceHistory),
        usersInteraction: updateUsersInteraction,
      }

      
    }
    if(!existingProduct) {

      const updateUsersInteraction:any  = [
        
        { email: userSession.email, 
          age:userSession.age,
          gender:userSession.gender, 
          location:userSession.location
        }
      ]
    product = {
          ...scrapedProduct,
          usersInteraction: updateUsersInteraction,
  
    }
  }

    const newProduct = await Product.findOneAndUpdate(
      { url: scrapedProduct.url },
      product,
      { upsert: true, new: true }
    );

 

    return { productRedirect : `/products/${newProduct._id}`};
  } catch (error: any) {
    throw new Error(`Failed to create/update product: ${error.message}`)
  }
}

export async function getProductById(productId: string) {
  try {
    connectToDB();

    const product = await Product.findOne({ _id: productId });

    if(!product) return null;

    return product;
  } catch (error) {
    console.log(error);
  }
}

export async function getRecommendations(productId: string[]) {
  try {
    connectToDB();
    const product= await Product.find({ _id: { $in: productId } });

    if(!product) return null;

    return product;
  } catch (error) {
    console.log(error);
  }
}

export async function getAllProducts() {
  try {
    connectToDB();

    const products = await Product.find();

    return products;
  } catch (error) {
    console.log(error);
  }
}

export async function getAllCrawledAmazonProducts() {
  try {
    connectToDB();
    
      const products = await AmazonProduct.find()
      return products;
    
    

    
  } catch (error) {
    console.log(error);
  }
}

export async function getSimilarProducts(productId: string) {
  try {
    connectToDB();

    const currentProduct = await Product.findById(productId);

    if(!currentProduct) return null;

    const similarProducts = await Product.find({
      _id: { $ne: productId },
    }).limit(3);

    return similarProducts;
  } catch (error) {
    console.log(error);
  }
}

export async function addUserEmailToProduct(productId: string, userEmail: string) {
  try {
    const product = await Product.findById(productId);

    if(!product) return;

    const userExists = product.users.some((user: { email: string; }) => user.email === userEmail);

    if(!userExists) {
      product.users.push({ email: userEmail });

      await product.save();

      const emailContent = await generateEmailBody(product, "WELCOME");

      await sendEmail(emailContent, [userEmail]);
    }
  } catch (error) {
    console.log(error);
  }
}