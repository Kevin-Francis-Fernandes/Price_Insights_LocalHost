import puppeteer from "puppeteer";
import cheerio from "cheerio";
import { connectToDB } from "../mongoose";
import RelianceProduct from "../models/reliance.model";


interface Product {
  title: string;
  url: string;
  price: Number;
  currency:string;
  image: string;
}
export async function relianceCrawler(searchTerm: string): Promise<Product[] | void> {

    
  
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  try {
    
    
    const relianceUrl = "https://www.reliancedigital.in/search?q="+ searchTerm.replace(/ /g, '%20')+"%20smartphone:relevance" ;
    console.log(relianceUrl);

    await page.goto(relianceUrl,{ waitUntil: 'networkidle2' });
    await page.waitForNetworkIdle();
    await page.waitForSelector('.pl__container', { timeout: 3000 });

    const waitForContent = async(maxRetries = 5) => {
        let retries = 0;
      
        while (retries < maxRetries) {
          const productCount = await page.$$eval('.sp.grid', (items) => items.length);
          console.log('Product count:', productCount);
      
          if (productCount > 0) {
            console.log('Content is loaded!');
            return;
          }
          console.warn('Content not loaded yet, waiting again...');
          await new Promise((resolve) => setTimeout(resolve, 5000));
          retries++;
        }
        console.error('Max retries reached. Content not loaded.');
      }

    await waitForContent();

    const htmlContent = await page.content();
    const $ = cheerio.load(htmlContent);

    let products: Product[] = [];

    $('.sp.grid').each((_, element) => {
      const titleElement = $(element).find('.sp__name');
      const title = titleElement.text().trim();

      const linkElement = $(element).find('.sp.grid a');
      const url = `https://www.reliancedigital.in${linkElement.attr('href')}`;

      const currentPriceElement = $(element).find('.TextWeb__Text-sc-1cyx778-0.gimCrs');
      const priceElement = currentPriceElement.text().trim();

      const currency = priceElement.substring(0,1);
      const price = parseFloat(priceElement.substring(1).replace(/,/g, ''));
      const imageElement = $(element).find('.img-responsive.imgCenter');
      const image = `https://www.reliancedigital.in${imageElement.attr('data-src') || imageElement.attr('data-srcset')}`;
      if(title && url && price && currency && image )
        products.push({ title, url, price,currency, image });
    });

    // console.log('Extracted Products:', products);
    // // products.push({ title, url, price,  currency, rating ,image });
    await connectToDB();
    await RelianceProduct.deleteMany({});
    // Save products to MongoDB
    // products=products.slice(0,6)
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