"use client"
import { Product } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

import { scrapeAndStoreProduct } from '@/lib/actions';

import { useRouter } from 'next/navigation';

import { FormEvent, useState } from 'react'
interface Props {
  product: any;
}



const isValidProductURL = (url: string) => {
  try {

    
    const parsedURL = new URL(url);
    const hostname = parsedURL.hostname;

    if(hostname.includes('amazon.com')||
         hostname.includes('amazon.')||
         hostname.endsWith('amazon')){
            return "amazon"
         }
         else if(hostname.includes('croma.com')||
         hostname.includes('croma.')||
         hostname.endsWith('croma')){
            return "croma"
         }
         else if(hostname.includes('reliancedigital.com')||
         hostname.includes('reliancedigital.')||
         hostname.endsWith('reliancedigital')  )
         {return "reliance"}
         else{
          return "error";
         }
 
    }catch (error){
        return "search";
  }

  
}
const ProductCard = ({ product }: Props) => {
 

  // let prod;
  // try {
  //   await connectToDB();
  //   const url = product.url;
  //   prod = await Product.findOne({ url });
  // }
  // catch(error:any){
  //   console.log(error.message);
  // }

  const router = useRouter();

  const handleSubmit = async () => {
    
    
    const searchPrompt = product.url;
    const isValidLink = isValidProductURL(searchPrompt);
    
    if(isValidLink === "error" ) return alert('An error occured ! Please try again'+isValidLink); 
    
    
    try {
      
      
        // Scrape the product page
         const products = await scrapeAndStoreProduct(searchPrompt,isValidLink);
         if (products && products.redirect) {
          // await new Promise(resolve => setTimeout(resolve, 9000));
          router.push(products.redirect);
        }

        if (products && products.productRedirect) {
          router.push(products.productRedirect);
        }

         
         
     
      
    } catch (error) {
      console.log(error);
    }
  }


  return (
    
    <div className="product-card" onClick={handleSubmit}>   
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
            {product.sellerInfo || product.title.split(" ")[0]}
          </p>

          <p className="text-black text-lg font-semibold">
            <span>{product?.currency}</span>
            <span>{product?.originalPrice}</span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default ProductCard