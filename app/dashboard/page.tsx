import HeroCarousel from "@/components/HeroCarousel"
import Searchbar from "@/components/Searchbar"
import Image from "next/image"
import { getAllProducts, getRecommendations } from "@/lib/actions"
import ProductCard from "@/components/ProductCard"
import * as crypto from 'crypto';



import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";

import { TypewriterEffectDemo } from "@/components/typewriter"
import UserInfo from "@/components/UserInfo"
import Navbar from "@/components/Navbar"
import { redirect } from "next/dist/server/api-utils"
import Footer from "@/components/Footer"
import { connectToDB } from "@/lib/mongoose"
import Product from "@/lib/models/product.model"





function pseudonymizeEmail(email: string): string {
    // Using crypto to generate an MD5 hash of the email address
    const hashedEmail = crypto.createHash('md5').update(email, 'utf-8').digest('hex');
    
    // Take the first 8 characters of the hash as a pseudonymous value
    const pseudonymousValue = hashedEmail.slice(0, 8);
    
    return pseudonymousValue;
}

const Home = async () => {

 

  const session = await getServerSession(authOptions);
  let setEmail
  if(session?.user?.email){
    setEmail=session?.user?.email
  }
  else{
    setEmail='test@mail.com'
  }
  
  const param = pseudonymizeEmail(setEmail);  
  
  
  
      const fetchData = async () => {
          try {
              const response = await fetch(`http://127.0.0.1:5000/api/data?param=${param}`);
              const jsonData = await response.json();
              return jsonData;
              
          } catch (error) {
              console.error('Error fetching data:', error);
          }
      };
  
      // Call fetchData
      
  
  let hybridArray:string[],popularArray:string[],flag,popularproducts:any
  const data = await fetchData();
  if(data){
    
    hybridArray=[]
    popularArray=[]
    flag=true
    for (const element of data){
      if(element=='end')
        flag=false
        

      if(flag)
        hybridArray.push(element)
      else{
        if(element!='end')
          popularArray.push(element)
      }

    }

    // console.log(hybridArray)
    //console.log(popularArray)
    
     popularproducts = await getRecommendations(popularArray)
    // console.log(popularproducts)

    if (popularproducts === null) {
      console.log('No matching products found.');
    } else {
      // console.log('Matching products:', popularproducts?.values());
    }
  }
  const allProducts = await getAllProducts();
   
   //
   let recentInteractions:any;
   try {
     await connectToDB();
     
     recentInteractions = await Product.find({ 'usersInteraction.email': setEmail }).sort({_id:-1}).limit(8);
   }
   catch(error:any){
     console.log(error.message);
   }
 
   //
  return (
    <>
      <Navbar />
      <section className="px-6 md:px-20 py-24">
        <div className="flex max-xl:flex-col gap-16">
          <div className="flex flex-col justify-center"> 
            <p className="small-text">
              Smart Shopping Starts Here:
              <Image 
                src="/assets/icons/arrow-right.svg"
                alt="arrow-right"
                width={16}
                height={16}
              />
            </p>

         <h1 className="head-text"> 
              Unleash the Power of
              <TypewriterEffectDemo />
            </h1>
           

            <p className="mt-6">
                Search a product to get started
            </p>

            <Searchbar  />
            
          </div>

          <HeroCarousel />
        </div>
      </section>

      <section className="trending-section">
        {popularproducts.length>0 && <h2 className="section-text">Trending Products</h2>}

        <div className="flex flex-wrap gap-x-8 gap-y-16">
          {popularproducts?.map((product:any) => (
            <ProductCard key={product._id} product={JSON.parse(JSON.stringify(product))} />
          ))}
        </div>
      </section>
      
      <section className="trending-section">
        {recentInteractions.length>0 && <h2 className="section-text">Recent Interactions</h2>}

        <div className="flex flex-wrap gap-x-8 gap-y-16">
          {recentInteractions?.map((product:any) => (
            <ProductCard key={product._id} product={JSON.parse(JSON.stringify(product))} />
          ))}
        </div>
      </section>

      
      <br/>
      <Footer />
    </>
  )
}

export default Home