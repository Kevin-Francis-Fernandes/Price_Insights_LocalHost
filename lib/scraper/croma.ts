import puppeteer from "puppeteer";
import cheerio from "cheerio";
import {
  extractCurrency,
  extractDescription,
  extractPrice,
  extractRating
} from "../utils";

export async function scrapeCromaProduct(url: string) {
  if (!url) return;
 
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
 
  try {
    console.log("croma scraper url :"+url)
  //   await page.evaluateOnNewDocument(function() {
  //     navigator.geolocation.getCurrentPosition = function (cb) {
  //         setTimeout(() => {
  //             cb({
  //                 'coords': {
  //                     accuracy: 21,
  //                     altitude: null,
  //                     altitudeAccuracy: null,
  //                     heading: null,
  //                     latitude: 23.129163,
  //                     longitude: 113.264435,
  //                     speed: null
  //                 },
  //                 'timestamp': new Date().getTime() // Adding timestamp property
  //             });
  //         }, 1000);
  //     }
  // });
    await page.goto(url, { waitUntil: "networkidle2" });
 
    // Get the HTML content after the page is loaded
    const htmlContent = await page.content();
 
    // Use Cheerio to load the HTML content
    const $ = cheerio.load(htmlContent);

    const title = $(".pd-title.pd-title-normal").text().trim();
    const currentPrice = extractPrice($("#pdp-product-price"));
    const originalPrice = extractPrice($("#old-price"));
 
    //extracting the images
    const images:any = $("img[data-src]")
      .map((_, element) => $(element).attr("data-src"))
      .get();
    const imageUrls = images || [];
 
    //extracting currency
    const currency = $("#pdp-product-price").text().slice(1, 2).trim();
 
    const jsonLdScriptText = $('script[type="application/ld+json"]').text();
 
    // Perform a null check
 
    const ratingValueMatch = jsonLdScriptText.match(
      /"ratingValue":\s*"([^"]+)"/
    );
    const ratingCountMatch = jsonLdScriptText.match(
      /"ratingCount":\s*"([^"]+)"/
    );
 
    // const isOutOfStock= jsonLdScriptText.match(
    //     /"approvalStatus":"approved"/
    //   )? false :true;
 
    const scriptTag = $('script:contains("window.__INITIAL_DATA__")');
 
    // Check if the script tag is found
    // Extract the content of the script tag
    const scriptContent: any = scriptTag.html();
    let isOutOfStock;
 
    if (scriptContent) {
      // console.log(scriptContent);
 
      const isApprovalStatusApproved = /"approvalStatus"\s*:\s*"approved"/.test(
        scriptContent
      );
      if (isApprovalStatusApproved) {
        // console.log('Approval status is approved!');
        isOutOfStock = false;
      } else {
        //console.log('Approval status is not approved or the script content is incorrect.');
        isOutOfStock = true;
      }
    } else {
    }
    // Perform null checks
    const rating = ratingValueMatch ? ratingValueMatch[1] : "N/A";
    const ratingCount = ratingCountMatch ? ratingCountMatch[1] : "N/A";
 
    let discountRate = ((
      ((originalPrice - currentPrice) / originalPrice) *
      100.0
    ).toFixed(2)) ;
    // console.log("croma scraper :" + discountRate  );
    const details: any = [];
    $("div.cp-keyfeature ul li").each((index, element) => {
      const detailText = $(element).text().replace("|", " "); // Replace '|' with space
      details.push(detailText);
    });
 
    const description = details.join(" ");
 
    // console.log({
    //   title,
    //   imageUrls,
    //   currentPrice,
    //   originalPrice,
    //   currency,
    //   rating,
    //   ratingCount,
    //   discountRate,
    //   description,
    //   isOutOfStock,
    // });
    const sellerInfo="Croma";
       //constructing data object of scraped information 
       const data ={
        url,
        currency: currency || '₹',
        image:imageUrls[0],
        title,
        currentPrice: Number(currentPrice) || Number(originalPrice),
        originalPrice:Number(originalPrice) || Number(currentPrice),
        priceHistory:[],
        discountRate:Number(discountRate) || 0.1,
        ratingCount:  0,
        usersInteraction:[],
      //  rating,
        category:"category",
        isOutOfStock,
        sellerInfo,
        description,
        lowestPrice: Number(currentPrice) || Number(originalPrice),
        highestPrice: Number(originalPrice) || Number(currentPrice),
        averagePrice: Number(currentPrice) || Number(originalPrice),
        rating:2,
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
         
        // return s;

        return data;

  } catch (error: any) {
    console.error("Error:", error.message);
  } finally {
    await browser.close();
  }
}