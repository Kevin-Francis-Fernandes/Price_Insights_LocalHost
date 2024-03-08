import { redirect } from "next/navigation";
import { amazonCrawler } from "./amazoncrawler";
import { cromaCrawler } from "./cromacrawler";


export async function extractSearchTermInfo(searchTerm: any) {
  if (!searchTerm) return;


 await amazonCrawler(searchTerm);
//  await cromaCrawler(searchTerm);
  

}


