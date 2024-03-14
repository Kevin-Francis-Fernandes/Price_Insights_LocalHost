import puppeteer from "puppeteer";
import cheerio from "cheerio";
import { connectToDB } from "../mongoose";
import RelianceProduct from "../models/reliance.model";
export async function relianceCrawler(searchTerm:any){
    
  
  const browser = await puppeteer.launch();

  try {
    const page = await browser.newPage();
    
    const relianceUrl = "https://www.reliancedigital.in/search?q="+ searchTerm.replace(/ /g, '%20')+"%20smartphone:relevance" ;
    console.log(relianceUrl);

    await page.goto(relianceUrl,{ waitUntil: 'networkidle2' });

    const content = await page.content();
    const $ = cheerio.load(content);

    let products: any;
    // console.log($);
   
    $('li.grid').each((_, element) => {
        
        const title = $(element).find('.sp__name').text().trim();
        console.log("TITLE: " + title)
        const url = "https://www.reliancedigital.in" + $(element).find('.sp.grid a').attr('href');
        console.log("URL: "+ url)
        // const price = $(element).find('.TextWeb__Text-sc-1cyx778-0.gimCrs').text().trim()

        const priceElement = $(element).find('.TextWeb__Text-sc-1cyx778-0.gimCrs');
        const priceText = priceElement.text().trim();

        // Use regex to separate currency and numeric part
        const priceMatch = priceText.match(/([^\d]+)([\d,.]+)/);

        let currency, price;

        if (priceMatch) {
            currency = priceMatch[1].trim();
            price = parseFloat(priceMatch[2].replace(/,/g, ''));
        }
        console.log(currency);
        console.log("PRICE: "+price)
        const imageElement = $(element).find('.img-responsive.imgCenter');
        const image = "https://www.reliancedigital.in" + (imageElement.attr('data-src') || imageElement.attr('data-srcset'));
        console.log("IMAGE: " +image)
        const rating = 5;
        if (title && url && price &&  image && currency && rating ) {
            if (!products) {
                products = [];
            }
            products.push({ title, url, price,  currency, rating ,image });
        }

    });



    console.log('Extracted Products:', products);

    await connectToDB();
    await RelianceProduct.deleteMany({});
    // Save products to MongoDB
    
    products.map(async (product: any) => {
        
      
  
      const newProduct = await RelianceProduct.findOneAndUpdate(
        { url: product.url },
        product,
        { upsert: true, new: true }
      );


      })
     
      return products;
    
  } catch (error) {
    console.error(`Error during Puppeteer scraping: ${error}`);
  } finally {
    await browser.close();
  }
}