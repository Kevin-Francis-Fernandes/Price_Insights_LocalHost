import CrawlerProductCard from "@/components/CrawlerProductCard";
import NavBarTwo from "@/components/NavBarTwo";

import { getAllCrawledAmazonProducts, getAllCrawledCromaProducts, getAllCrawledRelianceProducts } from "@/lib/actions";
import { Key } from "react";
type Props = {
  params: { id: string }
}

const index = async ({ params: { id } }: Props) => {
  let allAmazonProducts:any=[];
  let allCromaProducts:any=[];
  let allRelianceProducts:any=[];

  try {
     allAmazonProducts = await getAllCrawledAmazonProducts(id);
  } catch (error) {
    console.error("Failed to fetch Amazon products:", error);
  }
  try {
     allCromaProducts = await getAllCrawledCromaProducts(id);
  } catch (error) {
    console.error("Failed to fetch Amazon products:", error);
  }
  try {
     allRelianceProducts = await getAllCrawledRelianceProducts(id);
  } catch (error) {
    console.error("Failed to fetch Amazon products:", error);
  }
  return (
    <>
     <NavBarTwo/>
    { allAmazonProducts?.length >0 && (
    <section className="trending-section">
        <h2 className="section-text">AMAZON</h2>

        <div className="flex flex-wrap gap-x-8 gap-y-16">
          {allAmazonProducts?.map((product: { _id: Key | null | undefined; }) => (
            <CrawlerProductCard key={product._id} product={JSON.parse(JSON.stringify(product))} />
          ))}
        </div>
      </section>
    )
     }

     { allCromaProducts?.length > 0 && (
      <section className="trending-section">
        <h2 className="section-text">CROMA</h2>

        <div className="flex flex-wrap gap-x-8 gap-y-16">
          {allCromaProducts?.map((product: { _id: Key | null | undefined; }) => (
            <CrawlerProductCard key={product._id} product={JSON.parse(JSON.stringify(product))} />
          ))}
        </div>
      </section>
  )}
    { allRelianceProducts?.length > 0 && (
      <section className="trending-section">
        <h2 className="section-text">RELIANCE</h2>

        <div className="flex flex-wrap gap-x-8 gap-y-16">
          {allRelianceProducts?.map((product: { _id: Key | null | undefined; }) => (
            <CrawlerProductCard key={product._id} product={JSON.parse(JSON.stringify(product))} />
          ))}
        </div>
      </section>
      )}
      </>
  )
}

export default index