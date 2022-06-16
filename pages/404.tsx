import { Box, Typography } from "@mui/material";
import { ShopLayout } from "../components/layout";

export const Custom404 = () => {

  /** Pagina 404 que determina la proteccion de rutas que no corresponde a lista blanca */

  return (
    <ShopLayout title='Pago not found' pageDescription='No hay nada que mostrar aqui!'>
      <Box 
        display='flex' 
        justifyContent='center' 
        alignItems='center' 
        height='calc(100vh - 200px)' 
        sx={{ flexDirection: {xs:'column', sm:'row'}}}
        >
        <Typography variant="h1" component="h1" fontSize={80} fontWeight={200}>404 |</Typography>     
        <Typography marginLeft={2}>No encontramos ninguna página aquí!</Typography>    
      </Box>
    </ShopLayout>
  )
}

export default Custom404;