"use server"
import axios from 'axios'
import * as cheerio from 'cheerio'
import { extractCurrency, extractDescription, extractFlipkartPrice, extractPrice } from '../utils';

export async function scrapeFlipkartProduct(url:string){
    if(!url)
        return;

        
        //BrightData proxy configuration
    const username = String(process.env.BRIGHT_DATA_USERNAME); 
    const password = String(process.env.BRIGHT_DATA_PASSWORD);
    const port = 22225;
    const session_id = (1000000* Math.random()) | 0;
    const options = {
        auth:{
            username: `${username}-session-${session_id}`,
            password,
        },
        host:'brd.superproxy.io:22225',
        port,
        rejectUnauthorized:false,
    }


    try{
        //Fetch the product page
        const response = await axios.get(url,options);
        const $ = cheerio.load(response.data);
        
        //Extract Prtoduct Title
        const title = $('span.B_NuCI').text().trim();
        const currentPrice = extractFlipkartPrice(
            $('span.B_NuCI')
        ); 

        const originalPrice =  extractFlipkartPrice(
            $('div._3I9_wc _2p6lqe')
        );


        const outOfStock = $('#availability span').text().trim().toLowerCase() === 'currently unavailable';

        const image = $('img._396cs4 _2amPTt _3qGmMb') ;

        

        const currency = extractCurrency($('div._30jeq3 _16Jk6d'))


        const discountRate = $('div._3Ay6Sb._31Dcoz span').text().replace(/[^0-9]/g, "");
;
        
        const description = $('div._1mXcCf.RmoJUa p').text();

        // Construct data object with scrapped information
        const data = {
            url,
            currency: currency || '$' ,
            image : image ,
            title,
            currentPrice: Number(originalPrice) || Number(originalPrice),
            originalPrice: Number(originalPrice) || Number(currentPrice),
            priceHistory:[],
            discountRate:Number(discountRate),
            category:'category',
            reviewsCount: 100,
            stars: 4.5,
            isOutOfStock: outOfStock,
            description,
            lowestPrice: Number(currentPrice) || Number(originalPrice),
            highestPrice: Number(originalPrice) || Number(currentPrice)  ,
            average: Number(originalPrice) || Number(currentPrice)


        }

        return data;
        
    }catch(error:any){
        throw new Error(`Failed to scrape product: ${error.message}`);
    }



}