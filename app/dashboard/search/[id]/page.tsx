import CrawlerProductCard from "@/components/CrawlerProductCard";
import { getAllCrawledAmazonProducts, getAllCrawledCromaProducts, getAllCrawledRelianceProducts } from "@/lib/actions";
type Props = {
  params: { id: string }
}



const index = async ({ params: { id } }: Props) => {
  // console.log(id);
  const allAmazonProducts = await getAllCrawledAmazonProducts(id);
  const allCromaProducts = await getAllCrawledCromaProducts(id);
  const allRelianceProducts = await getAllCrawledRelianceProducts(id);
  
  return (
    <>
    <section className="trending-section">
        <h2 className="section-text">AMAZON</h2>

        <div className="flex flex-wrap gap-x-8 gap-y-16">
          {allAmazonProducts?.map((product:any) => (
            
            <CrawlerProductCard key={product._id} product={product}  />
          ))}
        </div>
      </section>
      <section className="trending-section">
        <h2 className="section-text">CROMA</h2>

        <div className="flex flex-wrap gap-x-8 gap-y-16">
          {allCromaProducts?.map((product:any) => (
            <CrawlerProductCard key={product._id} product={product}  />
          ))}
        </div>
      </section>
      <section className="trending-section">
        <h2 className="section-text">RELIANCE</h2>

        <div className="flex flex-wrap gap-x-8 gap-y-16">
          {allRelianceProducts?.map((product:any) => (
            <CrawlerProductCard key={product._id} product={product}  />
          ))}
        </div>
      </section>
      </>
  )
}

export default index