import axios from 'axios'
import * as cheerio from 'cheerio'
import { extractCurrency, extractDescription, extractPrice, extractRating, extractReview } from '../utils';
 
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
       const response =await axios.get(url,options);
       const $ = cheerio.load(response.data);

       const title= $('#productTitle').text().trim();   
       const currentPrice= extractPrice(
        $('.priceToPay span.a-price-whole'), 
        $('a.size.base.a-color-price'),
        $('.a-button-selected .a-color-base')
       );  

       const originalPrice=extractPrice(
        $('#priceblock_ourprice'),
        $('.a-price.a-text-price span.a-offscreen'),
        $('#listPrice'),
        $('#priceblock_dealprice'),
        $('.a-size-base.a-color-price')
       );
       
       const outOfStock = $('availability span').text().trim().toLowerCase()
        ==='currently unavailable';

       const images = $('#imgBlkFront').attr('data-a-dynamic-image') ||
                     $('#landingImage').attr('data-a-dynamic-image') ||
                     '{}';
      
       const imageUrls =Object.keys(JSON.parse(images));

       const currency =extractCurrency($('.a-price-symbol'))

       let rating =extractRating($('span.a-size-base .a-color-base'));

       if(rating.length==2){
         rating=rating.slice(0,1);
       }

       const ratingCount=Number(extractReview($('span [data-hook=total-review-count]')));
       
       const discountRate = $('.savingsPercentage').text().replace(/[-%]/g,'');

       const description= extractDescription($);

       const g=typeof(ratingCount)
     
       const sellerInfo="Amazon";
       
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

       console.log("amazon scrapped")

     
      return data;
  } catch (error: any) {
    console.log(error);
  }
}