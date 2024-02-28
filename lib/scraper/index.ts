import axios from 'axios'
import * as cheerio from 'cheerio'
import { extractCurrency, extractDescription, extractPrice, extractRating, extractReview } from '../utils';
//npm install axios cheerio 
export async function scrapeAmazonProduct(url:string){

    if(!url) return;

    const username=String(process.env.BRIGHT_DATA_USERNAME);
    const password=String(process.env.BRIGHT_DATA_PASSWORD);
    const port=22225;
    const session_id=(1000000*Math.random()) | 0;
    const options={
        auth: {
            username:`${username}-session-${session_id}`,
            password,
        },
        host:"brd.superproxy.io",
        port,
        rejectUnauthorised:false,
    }

    try {
        //Fetch  the product page 
        const response =await axios.get(url,options);
        const $ = cheerio.load(response.data);

       // console.log(response.data);
    
       //extract product title 

       const title= $('#productTitle').text().trim();   //grabbing with respect to id so #
       const currentPrice= extractPrice(
        $('.priceToPay span.a-price-whole'), //class as a selector 
        $('a.size.base.a-color-price'),
        $('.a-button-selected .a-color-base')
       );   //not cherio function its a utility function 

       const originalPrice=extractPrice(
        $('#priceblock_ourprice'),
        $('.a-price.a-text-price span.a-offscreen'),
        $('#listPrice'),
        $('#priceblock_dealprice'),
        $('.a-size-base.a-color-price')
       );
       

       //to check if its currently in stock or not 
       const outOfStock = $('availability span').text().trim().toLowerCase()
        ==='currently unavailable';

        //extracting the images 
       const images = $('#imgBlkFront').attr('data-a-dynamic-image') ||
                     $('#landingImage').attr('data-a-dynamic-image') ||
                     '{}';//returns object of images 
                     //attr will give url 

       //to write image URLS properly 
       const imageUrls =Object.keys(JSON.parse(images));

       //extracting currency 
       const currency =extractCurrency($('.a-price-symbol'))

       let rating =extractRating($('span.a-size-base .a-color-base'));

       if(rating.length==2){
         rating=rating.slice(0,1);
       }

       const ratingCount=Number(extractReview($('span [data-hook=total-review-count]')));
       

       const discountRate = $('.savingsPercentage').text().replace(/[-%]/g,'');


       const description= extractDescription($);

       const g=typeof(ratingCount)
       console.log({title,currentPrice,originalPrice,
                    outOfStock,imageUrls,
                    currency,discountRate,g,rating});

        const sellerInfo="Amazon";
       //constructing data object of scraped information 
       const data ={
        url,
        currency: currency || '₹',
        image:imageUrls[0],
        title,
        currentPrice: Number(currentPrice) || Number(originalPrice),
        originalPrice:Number(originalPrice) || Number(currentPrice),
        priceHistory:[],
        discountRate:Number(discountRate),
        ratingCount,
        category:"category",
        usersInteraction:[],
        isOutOfStock:outOfStock,
        sellerInfo,
        description,
        lowestPrice: Number(currentPrice) || Number(originalPrice),
        highestPrice: Number(originalPrice) || Number(currentPrice),
        averagePrice: Number(currentPrice) || Number(originalPrice),
        rating,
      sub_cat : "SmartPhones",
      main_cat : "Electronics",
        }

        console.log(data)

        

    // const recommend = {
    //   url,
    //   title ,
    //   rating:Number(rating),
    //   sub_cat : "SmartPhones",
    //   main_cat : "Electronics", 
    //  }

    //  const s :any = [data, recommend]
     
    return data;
  } catch (error: any) {
    console.log(error);
  }
}