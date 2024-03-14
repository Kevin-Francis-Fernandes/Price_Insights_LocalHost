import puppeteer from 'puppeteer';
import cheerio from 'cheerio';

interface Product {
  title: string;
  link: string;
  currentPrice: string;
  imageURL: string;
}

async function scrapeRelianceProducts(url: string): Promise<Product[] | void> {
  if (!url) return;

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  try {
    await page.goto(url, { waitUntil: 'networkidle2' });

    await page.waitForNetworkIdle();
    await page.waitForSelector('.pl__container', { timeout: 3000 });

    const waitForContent = async(maxRetries = 5) => {
        let retries = 0;
      
        while (retries < maxRetries) {
          const productCount = await page.$$eval('.sp.grid', (items) => items.length);
          console.log('Product count:', productCount);
      
          if (productCount > 0) {
            console.log('Content is loaded!');
            return;
          }
          console.warn('Content not loaded yet, waiting again...');
          await new Promise((resolve) => setTimeout(resolve, 5000));
          retries++;
        }
        console.error('Max retries reached. Content not loaded.');
      }

    await waitForContent();

    const htmlContent = await page.content();
    const $ = cheerio.load(htmlContent);

    const products: Product[] = [];

    $('.sp.grid').each((_, element) => {
      const titleElement = $(element).find('.sp__name');
      const title = titleElement.text().trim();

      const linkElement = $(element).find('.sp.grid a');
      const link = `https://www.reliancedigital.in${linkElement.attr('href')}`;

      const currentPriceElement = $(element).find('.TextWeb__Text-sc-1cyx778-0.gimCrs');
      const currentPrice = currentPriceElement.text().trim();

      const imageElement = $(element).find('.img-responsive.imgCenter');
      const imageURL = `https://www.reliancedigital.in${imageElement.attr('data-src') || imageElement.attr('data-srcset')}`;

      products.push({ title, link, currentPrice, imageURL });
    });

    console.log(products);
  } catch (error) {
    console.error('Error:', error.stack || error.message);
  } finally {
    await browser.close();
  }
}


scrapeRelianceProducts("https://www.reliancedigital.in/smartphones/c/S101711?searchQuery=samsung%20s24:relevance");