
import { useProducts } from '../../hooks';
import { ShopLayout } from '../../components/layout';
import { Typography } from '@mui/material';
import { FullScreenLoading } from '../../components/ui';
import { ProductList } from '../../components/products';
import { NextPage } from 'next';



const MenPage: NextPage = () => {

  const { products, isLoading } =  useProducts('/products?gender=men');

  return (
    <ShopLayout title="Teslo-Shopt - Hombres" pageDescription="La mejor ropa  para hombres aqui!">
      <Typography variant='h1' component='h1'>Hombres</Typography>
      <Typography variant='h2' sx={{ marginBottom: 1 }}>Todos los productos</Typography>

      {
        isLoading
         ?<FullScreenLoading />
         : <ProductList products={products}/>
      }

    </ShopLayout>
  )
}

export default MenPage