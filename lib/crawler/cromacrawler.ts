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
export async function relianceCrawler(searchTerm: string) {
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
                }, 1000);
            }
        });
        // await page.waitForSelector('body')
        
        await page.goto(cromaUrl, { waitUntil: "networkidle2" });
        // page.on('dialog', async (dialog) => {
        //     if (dialog.type() === 'location') {
        //       // Allow location access
        //       await dialog.accept();
        //     } else {
        //       // Handle other types of dialogs (customize as needed)
        //       console.log(`Unhandled dialog type: ${dialog.type()}`);
        //       await dialog.dismiss(); // Dismiss the dialog (e.g., block access)
        //     }
        //   });
        // Get the HTML content after the page is loaded
        const htmlContent = await page.content();
    
        // Use Cheerio to load the HTML content
        const $ = cheerio.load(htmlContent);
    
        // Asynchronously write the text content to a file
       // await fs.writeFile("output.txt", $.text());
    
        //console.log($.text());
     
        // Check if the script tag is found
        // Extract the content of the script tag
     
        
        const title=$(".product-title").text().trim() || " ";
    
    
        console.log(title);
      } catch (error:any) {
        console.error("Error:", error.message);
      } finally {
        await browser.close();
      }
}