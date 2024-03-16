import { scrapeAndStoreProduct } from "../actions";
import { amazonCrawler } from "./amazoncrawler";
import { cromaCrawler } from "./cromacrawler";
import { relianceCrawler } from "./reliancecrawler";

export async function extractSearchTermInfo(searchTerm: any) {
  if (!searchTerm) return;
  

  try {
    const cromacrawlproducts = await cromaCrawler(searchTerm);
    let i=0;
    if(cromacrawlproducts){
    for( const product  of cromacrawlproducts){
      if(i==6){
        break;
      }
      i++;
      await scrapeAndStoreProduct(product.url,"croma");
    }
   }
  } catch (error: any) {
    console.log(`Error extracting amazon crawled products : ${error.message}`);
  }

  try {
    const amazoncrawlproducts = await amazonCrawler(searchTerm);
    let i=0;
    for( const product  of amazoncrawlproducts){
      if(i==6){
        break;
      }
      i++;
      await scrapeAndStoreProduct(product.url,"amazon");
    }
  } catch (error: any) {
    console.log(`Error extracting amazon crawled products : ${error.message}`);
  }

  

  try {
    const reliancecrawlproducts = await relianceCrawler(searchTerm);
    // if(reliancecrawlproducts){
    //   reliancecrawlproducts.map(
    //     async (product: any) =>
    //       await scrapeAndStoreProduct(product.url, "reliance")
    //   );
    // }
    let i=0;
    if(reliancecrawlproducts){
    for( const product  of reliancecrawlproducts){
      if(i==6){
        break;
      }
      i++;
      await scrapeAndStoreProduct(product.url,"reliance");
    }
  }
  } catch (error: any) {
    console.log(
      `Error extracting reliance crawled products : ${error.message}`
    );
  }
}
