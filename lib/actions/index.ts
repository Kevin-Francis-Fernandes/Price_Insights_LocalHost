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
import { MongoClient } from "mongodb";


export async function scrapeAndStoreProduct(productUrl: string,type:string) {
  // const router = useRouter();
  if(!productUrl) return;
  // let userSession;

  
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
      return { redirect: `/dashboard/search/${productUrl}` };
       
              
       
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

export async function getAllCrawledAmazonProducts(id:any) {
  try {
    connectToDB();

    const agg = [
    {
      '$search': {
        'index': 'defaultAmazon', 
        'compound': {
          'should': [
            {
              'text': {
                'query': `${id}`, 
                'path': 'title', 
                'fuzzy': {
                  'maxEdits': 2
                }
              }
            },
          ],
          'minimumShouldMatch': 1 // Optional, depends on your use case
        }
      }
    },
    {
      '$sort': {
        'score': -1 // Sort in descending order based on the 'score' field
      }
    },
    {
      '$limit': 4
    }
    ];
    
    const client = await MongoClient.connect("mongodb+srv://kevinfrancisfernandes8:Kevin123@cluster0.e8uh7q9.mongodb.net/?retryWrites=true&w=majority");
    const coll = client.db('test').collection('amazonproducts');
      const cursor = coll.aggregate(agg);
      const products = await cursor.toArray();
      // console.log(products)
    
      return products;
    
    

    
  } catch (error) {
    console.log(error);
  }
}

export async function getAllCrawledCromaProducts(id:any) {
  try {
    connectToDB();

    const agg = [
    {
      '$search': {
        'index': 'defaultCroma', 
        'compound': {
          'should': [
            {
              'text': {
                'query': `${id}`, 
                'path': 'title', 
                'fuzzy': {
                  'maxEdits': 2
                }
              }
            },
          ],
          'minimumShouldMatch': 1 // Optional, depends on your use case
        }
      }
    },
    {
      '$sort': {
        'score': -1 // Sort in descending order based on the 'score' field
      }
    },
    {
      '$limit': 4
    }
    ];
    
    const client = await MongoClient.connect("mongodb+srv://kevinfrancisfernandes8:Kevin123@cluster0.e8uh7q9.mongodb.net/?retryWrites=true&w=majority");
    const coll = client.db('test').collection('cromaproducts');
      const cursor = coll.aggregate(agg);
      const products = await cursor.toArray();
      console.log(products)
    
      return products;
    
    

    
  } catch (error) {
    console.log(error);
  }
}

export async function getAllCrawledRelianceProducts(id:any) {
  try {
    connectToDB();

    const agg = [
    {
      '$search': {
        'index': 'defaultReliance', 
        'compound': {
          'should': [
            {
              'text': {
                'query': `${id}`, 
                'path': 'title', 
                'fuzzy': {
                  'maxEdits': 2
                }
              }
            },
          ],
          'minimumShouldMatch': 1 // Optional, depends on your use case
        }
      }
    },
    {
      '$sort': {
        'score': -1 // Sort in descending order based on the 'score' field
      }
    },
    {
      '$limit': 4
    }
    ];
    
    const client = await MongoClient.connect("mongodb+srv://kevinfrancisfernandes8:Kevin123@cluster0.e8uh7q9.mongodb.net/?retryWrites=true&w=majority");
    const coll = client.db('test').collection('relianceproducts');
      const cursor = coll.aggregate(agg);
      const products = await cursor.toArray();
      // console.log(products)
    
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