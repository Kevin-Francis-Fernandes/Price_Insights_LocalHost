import { scrapeAndStoreProduct } from "../actions";
import { amazonCrawler } from "./amazoncrawler";
import { cromaCrawler } from "./cromacrawler";


export async function extractSearchTermInfo(searchTerm: any) {
  if (!searchTerm) return;

try {
  const amazoncrawlproducts = await amazonCrawler(searchTerm);
  amazoncrawlproducts.map(async (product:any)=>
    await scrapeAndStoreProduct(product.url,"amazon")
  )
}
catch(error:any){
    console.log(`Error extracting amazon crawled products : ${error.message}`)
}

//  await cromaCrawler(searchTerm);
  

}


