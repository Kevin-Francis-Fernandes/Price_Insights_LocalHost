"use server"

import { revalidatePath } from "next/cache";
import Product from "../models/product.model";
import { connectToDB } from "../mongoose";
import { scrapeAmazonProduct } from "../scraper";
import { getAveragePrice, getHighestPrice, getLowestPrice } from "../utils";
import { User } from "@/types";
import { generateEmailBody, sendEmail } from "../nodemailer";
import RecommendProduct from "../models/recommend.model";
import username from "@/app/login";
import { scrapeCromaProduct } from "../scraper/croma";
import { scrapeRelianceProduct } from "../scraper/reliance";

export async function scrapeAndStoreProduct(productUrl: string,type:string) {
  if(!productUrl) return;

  try {
    connectToDB();

    let scrapedProduct;

    let scrappedrecommend;
    if(type=="amazon"){
       scrapedProduct = await scrapeAmazonProduct(productUrl);
      //  [scrapedProduct,scrappedrecommend] = await scrapeAmazonProduct(productUrl);
    
    }
    else if(type=="croma"){
      // [scrapedProduct,scrappedrecommend] = await scrapeCromaProduct(productUrl);
      scrapedProduct = await scrapeCromaProduct(productUrl);
    }
    else{
      //if reliance
     // [scrapedProduct,scrappedrecommend] = await scrapeRelianceProduct(productUrl);
      scrapedProduct = await scrapeRelianceProduct(productUrl);
    }
    
    
    if(!scrapedProduct) return;

    let product = scrapedProduct;
    // let recommend = scrappedrecommend;

    const existingProduct = await Product.findOne({ url: scrapedProduct.url });
    // const existingRecommend = await RecommendProduct.findOne({ url: scrappedrecommend.url });
    
    if(existingProduct) {
      const updatedPriceHistory: any = [
        ...existingProduct.priceHistory,
        { price: scrapedProduct.currentPrice }
      ]

      const updateUsersInteraction:any  = [
        ...existingProduct.usersInteraction,
        { email: username}
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

    // use same database just add another field

    
    // if(existingRecommend) {

    //   const updateUsers :any = [
    //     ...existingRecommend.users,
    //     { email: username}
    //   ]

    //   recommend = {
    //     ...scrappedrecommend,
    //     users: updateUsers,

    //   }
    // }
    if(!existingProduct) {

      const updateUsersInteraction:any  = [
        
        { email: username}
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

    // if(!existingRecommend) {
    // recommend = {
    //   ...scrappedrecommend,
    //   users: [{ email: username}],

    // }
 // }

    // console.log(recommend)
    // await RecommendProduct.findOneAndUpdate(
    //   { url: scrappedrecommend.url },
    //   recommend,
    //   { upsert: true, new: true }
    // );

    revalidatePath(`/products/${newProduct._id}`);
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

    const userExists = product.users.some((user: User) => user.email === userEmail);

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