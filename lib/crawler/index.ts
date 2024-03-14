import { scrapeAndStoreProduct } from "../actions";
import { amazonCrawler } from "./amazoncrawler";
// import { cromaCrawler } from "./cromacrawler";
import { relianceCrawler } from "./reliancecrawler";

export async function extractSearchTermInfo(searchTerm: any) {
  if (!searchTerm) return;

  // try {
  //   const amazoncrawlproducts = await amazonCrawler(searchTerm);
  //   amazoncrawlproducts.map(
  //     async (product: any) => await scrapeAndStoreProduct(product.url, "amazon")
  //   );
  // } catch (error: any) {
  //   console.log(`Error extracting amazon crawled products : ${error.message}`);
  // }

  // try {
  //   const cromacrawlproducts = await cromaCrawler(searchTerm);
  //   cromacrawlproducts.map(
  //     async (product: any) => await scrapeAndStoreProduct(product.url, "croma")
  //   );
  // } catch (error: any) {
  //   console.log(`Error extracting croma crawled products : ${error.message}`);
  // }

  try {
    const reliancecrawlproducts = await relianceCrawler(searchTerm);
    if(reliancecrawlproducts){
      reliancecrawlproducts.map(
        async (product: any) =>
          await scrapeAndStoreProduct(product.url, "reliance")
      );
    }
  } catch (error: any) {
    console.log(
      `Error extracting reliance crawled products : ${error.message}`
    );
  }
}
