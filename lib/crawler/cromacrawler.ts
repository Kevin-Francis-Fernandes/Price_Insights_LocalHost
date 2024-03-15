// import puppeteer from "puppeteer";
// import cheerio from "cheerio";
// import { connectToDB } from "../mongoose";
// import AmazonProduct from "../models/amazon.model";
// import CromaProduct from "../models/croma.model";
// export async function cromaCrawler(searchTerm:any) {
//     const browser = await puppeteer.launch({ headless: false, args: ['--disable-notifications'] });
//     const page = await browser.newPage();
   
//     try {
//        // Intercept and dismiss location access dialog
//       page.on('dialog', async (dialog) => {
//         console.log(`Dialog message: ${dialog.message()}`);
//         await dialog.dismiss();
//       });
  
//       await page.goto(url, {waitUntil : "networkidle2"}); 
//       await page.waitForNetworkIdle();
//       await page.waitForSelector('.product-list', { timeout: 40000}); 
  
//       async function waitForContent(maxRetries = 5) {
  
//         let retries = 0;
//         async function checkContent() {
//           const productCount = await page.$$eval('.cp-product.typ-plp.plp-srp-typ', items => items.length);
//           console.log("Product count:", productCount);
  
//           return productCount > 0;
//         }
  
//         while (retries < maxRetries) {
//           const isContentLoaded = await checkContent();
  
//           if (isContentLoaded) {
//             console.log("Content is loaded!");
//             return;
//           }
  
//           console.warn("Content not loaded yet, waiting again...");
//           await setTimeout(5000); // Adjust the wait time as needed
//           retries++;
//         }
  
//         console.error("Max retries reached. Content not loaded.");
//       }
  
//       await waitForContent();
  
//       const htmlContent = await page.content();
//       const $ = cheerio.load(htmlContent);
  
//       let products = []
  
//       $('.cp-product.typ-plp.plp-srp-typ').each((_, element) => {
//           const titleElement = $(element).find('.product-title.plp-prod-title a');
//           const title = titleElement.text().trim();
          
//           const link = "https://www.croma.com" + titleElement.attr('href');
          
//           const currentPriceElement = $(element).find(".amount.plp-srp-new-amount");
//           const currentPrice = currentPriceElement.text().trim();
          
//           const imageElement = $(element).find('img[data-src], img[src]');
//           const imageURL = imageElement.length ? imageElement.attr('data-src') || imageElement.attr('src') : undefined;
  
//           products.push({title,link,currentPrice,imageURL})
//         });
      
//       console.log(products);
  
//     } catch (error:any) {
//       console.error("Error:", error.message);
//     } finally {
//       await browser.close();
//     }
  
//   }
