import puppeteer from "puppeteer";
import cheerio from "cheerio";
// import {
//   extractCurrency,
//   extractDescription,
//   extractPrice,
//   extractRating
// } from "../utils";

export async function scrapeRelianceProduct(url: string) {
  if (!url) return;
 
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
 
  try {
    await page.goto(url, { waitUntil: "networkidle2" });
 
    // Get the HTML content after the page is loaded
    const htmlContent = await page.content();
 
    // Use Cheerio to load the HTML content
    const $ = cheerio.load(htmlContent);
    

    

    const scriptText = $('script[type="application/ld+json"]').first().text();

    // Parse the JSON data
    const jsonData = JSON.parse(scriptText);
    
    // Extract values from the 'Product' key
    const productData = jsonData['@type'] === 'Product' ? jsonData : null;
    
    // If the data is inside the 'Product' key
    if (productData) {
      
      const currency = productData.offers.priceCurrency=='INR'?'₹':'';
      const currentPrice = Number(productData.offers.price);
      //not sure of out of stock
      const isOutOfStock = productData.offers.availability=='http://schema.org/SoldOut'?false:true
      const image = productData.image;
      const title = productData.name;
      const mrpText = $('ul.pdp__priceSection__priceList li.pdp__priceSection__priceListText:contains("MRP")').text();

      // Extract the price using a regular expression
      const match = mrpText.match(/₹([\d,]+\.\d{2})/);

      // If there is a match, extract the price
      const originalPrice:any = match ? Number(match[1].replace(',','')) : null;
   


      
      const descriptiontext = productData.description
      const description = descriptiontext.replace(/<\/?li>/g, '').replace(/\n/g, '');
      const brand = productData.brand;
      const rating = productData.aggregateRating.ratingValue;
      const ratingCount = productData.aggregateRating.ratingCount;
      const discountRate = (
        ((originalPrice - currentPrice) / originalPrice) *
        100.0
      ).toFixed(2);

    //  console.log({
    //   url,
    //   title,
    //   image,
    //   currentPrice,
    //   originalPrice,
    //   currency,
    //   rating,
    //   ratingCount,
    //   discountRate,
    //   description,
    //   isOutOfStock,
    //   brand
    // });

    const sellerInfo="Reliance Digital";
       //constructing data object of scraped information 
       const data ={
        url,
        currency: currency || '₹',
        image,
        title,
        currentPrice: Number(currentPrice) || Number(originalPrice),
        originalPrice:Number(originalPrice) || Number(currentPrice),
        priceHistory:[],
        discountRate:Number(discountRate) || 0,
        ratingCount,
        usersInteraction:[],
        category:"category",
        isOutOfStock,
        sellerInfo,
        description,
        lowestPrice: Number(currentPrice) || Number(originalPrice),
        highestPrice: Number(originalPrice) || Number(currentPrice),
        averagePrice: Number(currentPrice) || Number(originalPrice),
        rating:Number(rating),
          sub_cat : "SmartPhones",
          main_cat : "Electronics", 
        }

        // const recommend = {
        //   url,
        //   title ,
        //   rating:Number(rating),
        //   sub_cat : "SmartPhones",
        //   main_cat : "Electronics", 
        //  }
    
        //  const s :any = [data, recommend]
        console.log("reliance scrapped")
        return data;
    } else {
      console.log('No product data found.');
    }

 
 

  } catch (error: any) {
    console.error("Error:", error.message);
  } finally {
    await browser.close();
  }
}
 