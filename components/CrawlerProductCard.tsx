"use client"
import AmazonProduct from '@/lib/models/amazon.model';
import Product from '@/lib/models/product.model';
import { connectToDB } from '@/lib/mongoose';
import { crawlerProduct } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { ThreeDots } from 'react-loader-spinner';

import { scrapeAndStoreProduct } from '@/lib/actions';
import { useRouter } from 'next/navigation';

interface Props {
  product: crawlerProduct;
}

const isValidProductURL = (url: string) => {
  try {
    const parsedURL = new URL(url);
    const hostname = parsedURL.hostname;

    if (hostname.includes('amazon.com') ||
      hostname.includes('amazon.') ||
      hostname.endsWith('amazon')) {
      return "amazon";
    } else if (hostname.includes('croma.com') ||
      hostname.includes('croma.') ||
      hostname.endsWith('croma')) {
      return "croma";
    } else if (hostname.includes('reliancedigital.com') ||
      hostname.includes('reliancedigital.') ||
      hostname.endsWith('reliancedigital')) {
      return "reliance";
    } else {
      return "error";
    }
  } catch (error) {
    return "search";
  }
};

const CrawlerProductCard = ({ product }: Props) => {
  const [initialLoading, setInitialLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Simulate a delay to show the skeleton loader
    const timer = setTimeout(() => setInitialLoading(false), 2000); // Adjust the delay as needed
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async () => {
    const searchPrompt = product.url;
    const isValidLink = isValidProductURL(searchPrompt);

    if (isValidLink === "error") return alert('An error occurred! Please try again: ' + isValidLink);

    try {
      setSubmitLoading(true);
      const products = await scrapeAndStoreProduct(searchPrompt, isValidLink);
      if (products && products.redirect) {
        router.push(products.redirect);
      }

      if (products && products.productRedirect) {
        router.push(products.productRedirect);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="product-card" onClick={handleSubmit} style={{ position: 'relative' }}>
      {initialLoading ? (
        <Skeleton height={200} width={200} />
      ) : (
        <div className="product-card_img-container">
          <Image
            src={product.image}
            alt={product.title}
            width={200}
            height={200}
            className="product-card_img"
          />
        </div>
      )}

      <div className="flex flex-col gap-3">
        <h3 className="product-title">
          {initialLoading ? <Skeleton width="80%" /> : product.title}
        </h3>

        <div className="flex justify-between">
          <p className="text-black opacity-50 text-lg capitalize">
            {initialLoading ? <Skeleton width="50%" /> : product.title.split(" ")[0]}
          </p>

          <p className="text-black text-lg font-semibold">
            {initialLoading ? (
              <Skeleton width="60%" />
            ) : (
              <>
                <span>{product?.currency}</span>
                <span>{product?.price}</span>
              </>
            )}
          </p>
        </div>
      </div>

      {submitLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
          <ThreeDots visible={true} height="80" width="80" color="#4fa94d" radius="9"
  ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClass=""/>
        </div>
      )}
    </div>
  );
};

export default CrawlerProductCard;