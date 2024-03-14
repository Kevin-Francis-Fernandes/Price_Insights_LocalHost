// import puppeteer from "puppeteer";
// import cheerio from "cheerio";
// import { connectToDB } from "../mongoose";
// import AmazonProduct from "../models/amazon.model";
// import CromaProduct from "../models/croma.model";
// export async function cromaCrawler(searchTerm:any) {
//     const browser = await puppeteer.launch({
//       // args: [
//       //     '--disable-notifications', // Disable notification prompts
//       //     // Add any other Chrome options as needed
//       //   ],
//       });
//     const page = await browser.newPage();
  
//     // const latitude=37.7749;
//     // const longitude=122.4194;
  
//     try {
//       const cromaUrl =
//         'https://www.croma.com/searchB?q=' +
//         searchTerm.replace(/ /g, "%20") +
//         "%3Arelevance&text=" +
//         searchTerm.replace(/ /g, "%20");
  
//       console.log(cromaUrl);
  
//       // await page.browserContext().overridePermissions(cromaUrl,['geolocation']);
//       // await page.setGeolocation({latitude,longitude});
//       await page.evaluateOnNewDocument(function() {
//       navigator.geolocation.getCurrentPosition = function (cb) {
//         setTimeout(() => {
//         cb({
//             'coords': {
//                 accuracy: 21,
//                 altitude: null,
//                 altitudeAccuracy: null,
//                 heading: null,
//                 latitude: 23.129163,
//                 longitude: 113.264435,
//                 speed: null
//             },
//             timestamp: 0
//         })
//         }, 1000)
//         }
//         });
  
//       // await page.waitForSelector('body')
      
//       await page.goto(cromaUrl, { waitUntil: "networkidle2" });
      
//       const htmlContent = await page.content();
  
      
//       const $ = cheerio.load(htmlContent);
  
//      // await fs.writeFile("output.txt", $.text());
  
     
      
      
//     //  const title=$(".product-title").text().trim() || " ";
     
//      let products;
//      $('ul.product-list li.product-item').each((_, element) => {
//             const titleElement = $(element).find('.product-info-newplptile .plp-prod-title a');
//             const url = titleElement.attr('href');
//             const title = titleElement.text().trim();
       
//             const priceElement = $(element).find('.cp-price .plp-srp-new-amount');
//             const price = priceElement.text().trim().replace(/,/g, '');
       
//             const currencyElement = $(element).find('.cp-price .tax-text');
//             const currency = currencyElement.text().trim();
       
//             const ratingText = $(element).find('.cp-rating .rating-text span').text() || "0";
//             const rating = Number(ratingText.replace(/[^\d.]/g,'').slice(0,3));
       
//             const image = $(element).find('div.product-img img').attr('src');
       
//             if (title && url && price && currency && image && rating) {
//                 products.push({ title, url, price, currency, rating, image });
//             }
//         });
  
//         await connectToDB();
//         await AmazonProduct.deleteMany({});
//         // Save products to MongoDB
        
//         products.map(async (product: any) => {
            
          
      
//           const newProduct = await CromaProduct.findOneAndUpdate(
//             { url: product.url },
//             product,
//             { upsert: true, new: true }
//           );
    
    
//           })
    
//           return products;
//     } catch (error:any) {
//       console.error("Error:", error.message);
//     } finally {
//       await browser.close();
//     }
//   }
