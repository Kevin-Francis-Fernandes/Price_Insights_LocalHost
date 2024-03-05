
import puppeteer from "puppeteer";
import cheerio from "cheerio";
import axios from "axios";
import { connectToDB } from "../mongoose";
import AmazonProduct from "../models/amazon.model";

export async function extractSearchTermInfo(searchTerm: any) {
  if (!searchTerm) return;

  const username = String(process.env.BRIGHT_DATA_USERNAME);
  const password = String(process.env.BRIGHT_DATA_PASSWORD);
  const port = 22225;
  const session_id = (1000000 * Math.random()) | 0;
  const options = {
    auth: {
      username: `${username}-session-${session_id}`,
      password,
    },
    host: "brd.superproxy.io",
    port,
    rejectUnauthorised: false,
  };

  const browser = await puppeteer.launch();

  try {
    const page = await browser.newPage();
    await page.authenticate({
      username: `${username}-session-${session_id}`,
      password,
    });

    const amazonUrl = 'https://www.amazon.in/s?k=' + searchTerm.replace(/ /g, '%20');
    console.log(amazonUrl);

    await page.goto(amazonUrl);

    const content = await page.content();
    const $ = cheerio.load(content);

    // Extract product titles and links
    const products: any = [];

    $('.s-result-item').each((_, element) => {
      const titleElement = $(element).find('.s-title-instructions-style h2 a');
      const link = "https://www.amazon.in"+titleElement.attr('href');
      const title = titleElement.text().trim();
  
      const priceSymbolElement = $(element).find('.a-price-symbol');
      const priceWholeElement = $(element).find('.a-price-whole');
  
      const priceSymbol = priceSymbolElement.text().trim();
      const priceWhole = priceWholeElement.text().trim().replace(/,/g, ''); 
      if (title && link && priceSymbol && priceWhole) {
          products.push({ title, link, priceSymbol, priceWhole });
      }
  });
    console.log('Extracted Products:', products);
  } catch (error) {
    console.error(`Error during Puppeteer scraping: ${error}`);
  } finally {
    await browser.close();
  }
}


