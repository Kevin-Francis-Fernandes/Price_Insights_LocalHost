import puppeteer, { Dialog } from "puppeteer";
import cheerio from "cheerio";
import CromaProduct from "../models/croma.model";
import { connectToDB } from "../mongoose";

export async function cromaCrawler(searchTerm: string) {
  const username = String(process.env.BRIGHT_DATA_USERNAME);
  const password = String(process.env.BRIGHT_DATA_PASSWORD);
  const port = 22225;
  const session_id = (1000000 * Math.random()) | 0;

  const browser = await puppeteer.launch({headless:false});

  try {
    const page = await browser.newPage();
    await page.authenticate({
      username: `${username}-session-${session_id}`,
      password,
    });

    const cromaUrl  = 'https://www.croma.com/searchB?q='+searchTerm.replace(/ /g, "%20")+'%3Arelevance&text='+searchTerm.replace(/ /g, "%20")
      
    console.log(cromaUrl);
   
  
     
    await page.goto(cromaUrl, { timeout: 60000 }); // Set a timeout of 60 seconds

    
    const content = await page.content();
    const $ = cheerio.load(content);

    // Extract product titles and links
    const products: any = [];

    $("ul.product-list li.product-item").each((_, element) => {
      const titleElement = $(element).find(
        ".product-info-newplptile .plp-prod-title a"
      );

      const url = titleElement.attr("href");

      const title = titleElement.text().trim();

      const priceElement = $(element).find(".cp-price .plp-srp-new-amount");

      const price = priceElement.text().trim().replace(/,/g, "");

      const currencyElement = $(element).find(".cp-price .tax-text");

      const currency = currencyElement.text().trim();

      const ratingText =
        $(element).find(".cp-rating .rating-text span").text() || "0";

      const rating = Number(ratingText.replace(/[^\d.]/g, "").slice(0, 3));

      const image = $(element).find("div.product-img img").attr("src");

      if (title && url && price && currency && image && rating) {
        products.push({ title, url, price, currency, rating, image });
      }
    });

    console.log("Extracted Products:", products);

    // await connectToDB();
    // await CromaProduct.deleteMany({});
    // // Save products to MongoDB

    // products.map(async (product: any) => {

    //   const newProduct = await CromaProduct.findOneAndUpdate(
    //     { url: product.url },
    //     product,
    //     { upsert: true, new: true }
    //   );

    //   })
  } catch (error) {
    console.error(`Error during Puppeteer scraping: ${error}`);
  } finally {
    await browser.close();
  }
}
