"use client"

import { scrapeAndStoreProduct } from '@/lib/actions';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { Circles } from 'react-loader-spinner';

const isValidProductURL = (url: string) => {
  try {
    const parsedURL = new URL(url);
    const hostname = parsedURL.hostname;

    if (hostname.includes('amazon.in') ||
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

const Searchbar = () => {
  const router = useRouter();
  const [searchPrompt, setSearchPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const isValidLink = isValidProductURL(searchPrompt);

    if (isValidLink === "error") return alert('An error occurred! Please try again: ' + isValidLink);

    try {
      setIsLoading(true);

      // Scrape the product page
      const product = await scrapeAndStoreProduct(searchPrompt, isValidLink);
      if (product && product.redirect) {
        // await new Promise(resolve => setTimeout(resolve, 20000));
        router.push(product.redirect);
      }

      if (product && product.productRedirect) {
        router.push(product.productRedirect);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && (
        <div className="loader-overlay">
          <div className="loader-content">
            <Circles height="80" width="80" color="#123abc" ariaLabel="loading" />
            <p className="loader-text mt-4 text-lg font-semibold text-blue-600">Searching...</p>
          </div>
        </div>
      )}
      <form 
        className="flex flex-wrap gap-4 mt-12" 
        onSubmit={handleSubmit}
        style={{ pointerEvents: isLoading ? 'none' : 'auto' }} // Prevent clicks when loading
      >
        <input 
          type="text"
          value={searchPrompt}
          onChange={(e) => setSearchPrompt(e.target.value)}
          placeholder="Enter product link or product name" 
          className="searchbar-input"
        />

        <button 
          type="submit" 
          className="searchbar-btn"
          disabled={searchPrompt === ''}
        >
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </form>

      <style jsx>{`
        .loader-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.75);
          z-index: 9999; // Ensure the loader is on top
        }
        .loader-content {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .loader-text {
          margin-top: 16px;
          font-size: 18px;
          color: #123abc;
        }
      `}</style>
    </>
  );
};

export default Searchbar;