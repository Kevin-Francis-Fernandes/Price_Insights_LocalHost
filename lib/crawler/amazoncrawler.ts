import puppeteer from "puppeteer";
import cheerio from "cheerio";
import { connectToDB } from "../mongoose";
import AmazonProduct from "../models/amazon.model";
export async function amazonCrawler(searchTerm:any){
    
  const username = String(process.env.BRIGHT_DATA_USERNAME);
  const password = String(process.env.BRIGHT_DATA_PASSWORD);
  const port = 22225;
  const session_id = (1000000 * Math.random()) | 0;
  
  const browser = await puppeteer.launch();

  try {
    const page = await browser.newPage();
    await page.authenticate({
      username: `${username}-session-${session_id}`,
      password,
    });

    const amazonUrl = 'https://www.amazon.in/s?k=' + searchTerm.replace(/ /g, '%20');
    console.log(amazonUrl);

    await page.goto(amazonUrl);

    const content = await page.content();
    const $ = cheerio.load(content);

    // Extract product titles and links
    const products: any = [];

    $('.s-result-item').each((_, element) => {
      const titleElement = $(element).find('.s-title-instructions-style h2 a');
      const url = "https://www.amazon.in"+titleElement.attr('href');
      const title = titleElement.text().trim();
  
      const priceSymbolElement = $(element).find('.a-price-symbol');
      const priceWholeElement = $(element).find('.a-price-whole');
  
      const currency = priceSymbolElement.text().trim();
      const price = priceWholeElement.text().trim().replace(/,/g, ''); 

      const ratingText = $(element).find('span.a-icon-alt').text() || "0"
      const rating = Number(ratingText.replace(/[^\d.]/g,'').slice(0,3));

      const image = $(element).find('div.a-section img.s-image').attr('src');

      if (title && url && price && currency &&  image && rating) {
          products.push({ title, url, price, currency , rating,image});
      }
  });
    console.log('Extracted Products:', products);

    await connectToDB();
    await AmazonProduct.deleteMany({});
    // Save products to MongoDB
    
    products.map(async (product: any) => {
        
      
  
      const newProduct = await AmazonProduct.findOneAndUpdate(
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