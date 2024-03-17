import puppeteer from "puppeteer";
import cheerio from "cheerio";
import { connectToDB } from "../mongoose";
import RelianceProduct from "../models/reliance.model";
import CromaProduct from "../models/croma.model";


// interface Product {
//   title: string;
//   url: string;
//   price: Number;
//   currency:string;
//   image: string;
// }
export async function cromaCrawler(searchTerm: string) {
    const browser = await puppeteer.launch({
        // args: [
        //     '--disable-notifications', // Disable notification prompts
        //     // Add any other Chrome options as needed
        //   ],
        });
      const page = await browser.newPage();
    
    //   const latitude=37.7749;
    //   const longitude=122.4194;
    
      try {
        const cromaUrl =
          'https://www.croma.com/searchB?q=' + searchTerm.replace(/ /g, "%20") +  "%3Arelevance&text=" +
          searchTerm.replace(/ /g, "%20");
    
        console.log(cromaUrl);
    
        // await page.browserContext().overridePermissions(cromaUrl,['geolocation']);
        // await page.setGeolocation({latitude,longitude});
        await page.evaluateOnNewDocument(function() {
            navigator.geolocation.getCurrentPosition = function (cb) {
                setTimeout(() => {
                    cb({
                        'coords': {
                            accuracy: 21,
                            altitude: null,
                            altitudeAccuracy: null,
                            heading: null,
                            latitude: 23.129163,
                            longitude: 113.264435,
                            speed: null
                        },
                        'timestamp': new Date().getTime() // Adding timestamp property
                    });
                }, 10000);
            }
        });
        // await page.waitForSelector('body')
        
        await page.goto(cromaUrl, { waitUntil: "networkidle2" });
        
        const htmlContent = await page.content();
    
        
        const $ = cheerio.load(htmlContent);
    
       
     
        
        // const title=$(".product-title").text().trim() || " ";
        
        let products: any[] = [];

        $('li.product-item').each((_, element) => {
            const titleElement = $(element).find('h3.product-title');
            
            const url = "https://www.croma.com" + titleElement.find('a').attr('href');
            const title = titleElement.text().trim();
            // console.log("Title: " +title)
            // console.log("Url: " +url)
            const priceElement = $(element).find('span.amount.plp-srp-new-amount');
            const price = priceElement.text().trim().replace(/,/g, '').substring(1);
            // console.log("Price: " +price)
            
            const currency = (priceElement.text().trim().substring(0,1));
            // console.log("currency: " + currency)
            const ratingText = $(element).find('span.rating-text').text() || "none";
            const rating = ratingText.replace(/,/g,'');
            // console.log("rating:" + rating)
            const image = $(element).find('div.plp-card-thumbnail img').attr('src');
            // console.log("image: " +  image)
            if (title && url && price && currency && image && rating) {
                products.push({ title, url, price, currency, rating, image });
            }
            
        });
    
        console.log(products);

        await connectToDB();
        await CromaProduct.deleteMany({});
    // Save products to MongoDB
    
    products.map(async (product: any) => {
        
      
  
      const newProduct = await CromaProduct.findOneAndUpdate(
        { url: product.url },
        product,
        { upsert: true, new: true }
      );


      })


        return products;
        
      } catch (error:any) {
        console.error("Error:", error.message);
      } finally {
        await browser.close();
      }
}