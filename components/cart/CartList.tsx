import NextLink from 'next/link';


import { Box, Button, CardActionArea, CardMedia, Grid, Link, Typography } from "@mui/material"

import { ItemCounter } from '../ui';
import { FC, useContext } from 'react';
import { CartContext } from '../../context';
import { ICartProduct, IOrderItem } from '../../interfaces';


interface Props {
  editable?: boolean;
  products?: IOrderItem[];
}

export const CartList: FC<Props> = ({editable = false, products}) => {

 const { cart, updateCartQuantity, removeCartProduct } = useContext(CartContext)

 const onNewCartQuantituValue = (product: ICartProduct, newQuantityValue: number) => {
  product.quantity = newQuantityValue;
  updateCartQuantity( product )
 }


 const productsToShow = products ? products : cart;

  return (
    <>
      {
        productsToShow.map( product => (
            <Grid container  spacing={2} key={product.slug + product.size} sx={{ mb:1 }}>
              <Grid item xs={3}>
                {/**TODO: Llevar a la pagina del producto */}
                <NextLink href={ `/products/${product.slug}` }  passHref>
                  <Link>
                    <CardActionArea>
                      <CardMedia
                        image = {  product.image  } 
                        component= 'img'
                        sx={{ borderRadius: '5px' }}
                      />
                    </CardActionArea>
                  </Link>
                </NextLink>
              </Grid>
              <Grid item xs={7}>
                <Box display='flex' flexDirection='column'>
                  <Typography variant='body1'>{ product.title }</Typography>
                  <Typography variant='body1'>Talla: <strong>{ product.size }</strong></Typography>

                  { /**Conditional */ }
                  {
                    editable
                    ? (
                      <ItemCounter 
                      currentValue={product.quantity} 
                      maxValue={ 10 } //Regla de negocio
                      updateQuantity={( value) => onNewCartQuantituValue(product as ICartProduct, value)}                      
                      />
                    )
                    : (
                      <Typography variant='h5'>{ product.quantity} { product.quantity > 1 ? 'productos' : 'producto' }</Typography>
                    )
                  }
                </Box>
              </Grid>
              <Grid item xs={2} display='flex' alignItems='center' flexDirection='column'>
                  <Typography variant='subtitle1'>{`$${product.price}`}</Typography>
                  { /**Editable */ }
                  {
                    editable && (
                      <Button
                        onClick={() => removeCartProduct(  product as ICartProduct ) } 
                        variant='text' color='secondary'>
                        Remover
                      </Button>
                    )
                  }
              </Grid>
            </Grid>
        ))
      }
    </>
  )
}
