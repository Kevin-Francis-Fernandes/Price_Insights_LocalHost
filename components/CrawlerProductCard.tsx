import AmazonProduct from '@/lib/models/amazon.model';
import Product from '@/lib/models/product.model';
import { connectToDB } from '@/lib/mongoose';
import { crawlerProduct } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';


interface Props {
  product: crawlerProduct;
}
 
const CrawlerProductCard = async ({ product }: Props) => {
 
  let prod;
  try {
    await connectToDB();
    const url = product.url;
    prod = await Product.findOne({ url });
  }
  catch(error:any){
    console.log(error.message);
  }

  


  return (
    
    <Link href={`/products/${prod._id}`}  className="product-card">   
      <div className="product-card_img-container">
        <Image 
          src={product.image}
          alt={product.title}
          width={200}
          height={200}
          className="product-card_img"
        />
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="product-title">{product.title}</h3>

        <div className="flex justify-between">
          <p className="text-black opacity-50 text-lg capitalize">
            {product.title.split(" ")[0]}
          </p>

          <p className="text-black text-lg font-semibold">
            <span>{product?.currency}</span>
            <span>{product?.price}</span>
          </p>
        </div>
      </div>
    </Link>
  )
}

export default CrawlerProductCard