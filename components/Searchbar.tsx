"use client"

import { scrapeAndStoreProduct } from '@/lib/actions';

import { useRouter } from 'next/navigation';

import { FormEvent, useState } from 'react'


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



const Searchbar = () => {
  const router = useRouter();
  const [searchPrompt, setSearchPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    
    event.preventDefault();

    const isValidLink = isValidProductURL(searchPrompt);
    
    if(isValidLink === "error" ) return alert('An error occured ! Please try again'+isValidLink); 
    
    
    try {
      setIsLoading(true);
      
        // Scrape the product page
         const product = await scrapeAndStoreProduct(searchPrompt,isValidLink);
         if (product && product.redirect) {
          await new Promise(resolve => setTimeout(resolve, 9000));
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
  }

  return (
    <form 
      className="flex flex-wrap gap-4 mt-12" 
      onSubmit={handleSubmit}
    >
      <input 
        type="text"
        value={searchPrompt}
        onChange={(e) => setSearchPrompt(e.target.value)}
        placeholder="Enter product link"
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
  )
}

export default Searchbar