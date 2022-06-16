import type { NextPage } from 'next';


import { Typography } from '@mui/material';

import { ShopLayout } from '../components/layout';

import { ProductList } from '../components/products';
import { useProducts } from '../hooks';
import { FullScreenLoading } from '../components/ui';




const Home: NextPage = () => {




  const { products, isLoading } =  useProducts('/products');

  return (
    <ShopLayout title={'Teslo-Shop - Home'} pageDescription={'Encuentra los mejores productos de teslo'}>
      <Typography variant='h1' component='h1'>Home</Typography>
      <Typography variant='h2' sx={{ marginBottom: 1 }}>Todos los productos</Typography>

      {
        isLoading
         ?<FullScreenLoading />
         : <ProductList products={products}/>
      }

      
    </ShopLayout>
  )
}

export default Home
