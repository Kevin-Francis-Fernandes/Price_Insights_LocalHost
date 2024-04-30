/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
    serverComponentsExternalPackages: ['mongoose']
  },
    // images: {
    //   domains: [
    //     'm.media-amazon.com',
    //     'media.croma.com',
    //     'media-ik.croma.com',
    //     'aitdgoa.edu.in',
    //     'croma.com',
    //     'reliancedigital.in',
    //     'www.reliancedigital.in'
    //   ]
    // }  
    images: {
      remotePatterns: [
          {protocol: 'https',hostname: 'm.media-amazon.com',pathname: '**',   },
          {protocol: 'https',hostname: 'media.croma.com',pathname: '**',   },  
          {protocol: 'https',hostname: 'media-ik.croma.com',pathname: '**',   },
          {protocol: 'https',hostname: 'croma.com',pathname: '**',   },
          {protocol: 'https',hostname: 'reliancedigital.in',pathname: '**',   },  
          {protocol: 'https',hostname: 'www.reliancedigital.in',pathname: '**',   }, ]
    }  
}
 
module.exports = nextConfig