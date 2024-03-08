import CrawlerProductCard from "@/components/CrawlerProductCard";
import { getAllCrawledAmazonProducts } from "@/lib/actions";


const index = async () => {
  
  const allProducts = await getAllCrawledAmazonProducts();
  return (
    <section className="trending-section">
        <h2 className="section-text">AMAZON</h2>

        <div className="flex flex-wrap gap-x-8 gap-y-16">
          {allProducts?.map((product) => (
            <CrawlerProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>
  )
}

export default index