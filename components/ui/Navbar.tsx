import  NextLink from 'next/link';

import { AppBar, Badge, Box, Button, IconButton, Input, InputAdornment, Link, Toolbar, Typography } from "@mui/material"
import { ClearOutlined, SearchOutlined, ShoppingCartCheckoutOutlined } from '@mui/icons-material';
import { useRouter } from 'next/router';
import { useContext, useState } from 'react';
import { UiContext } from '../../context';
import { CartContext } from '../../context/cart/CartContext';


export const Navbar = () => {

  const { asPath, push } = useRouter();

  const { toogleSideMenu } = useContext( UiContext );
  const { numberOfItems } = useContext( CartContext )

  const [searchTerm, setSearchTerm] = useState('');

  const [isSerchVisible, setIsSearchVisible] = useState(false);


    const onSearchTerm = () => {
        if(searchTerm.trim().length === 0) return;
        push( `/search/${ searchTerm }` );

    }

  return (
    <AppBar>
      <Toolbar>
        <NextLink href='/' passHref>
          <Link display='flex' alignItems='center'>
            <Typography variant='h6'>Teslo |  </Typography>
            <Typography sx={{ ml: 0.5 }}>Shop  </Typography>
          </Link>
        </NextLink>

        <Box flex={1}/>

        <Box sx={{ display: isSerchVisible ? 'none' : { xs: 'none', sm: 'block' } }} className='fadeIn'>
          <NextLink href='/category/men' passHref>
          <Link>
            <Button color={  asPath === '/category/men' ? 'primary' : 'info'}>Hombres</Button>
          </Link>
          </NextLink>
          <NextLink href='/category/women' passHref>
          <Link>
            <Button color= {  asPath === '/category/women' ? 'primary' : 'info'}>Mujeres</Button>
          </Link>
          </NextLink>
          <NextLink href='/category/kid' passHref>
          <Link>
            <Button color= {  asPath === '/category/kid' ? 'primary' : 'info'}>Niños</Button>
          </Link>
          </NextLink>  
        </Box>
            
        <Box flex={1}/>      
        
        {/**Pantallas grandes */}
        {

          isSerchVisible 
           ? (
            <Input
              sx={{ display: { xs: 'none', sm: 'flex' } }}
              className='fadeIn'
              autoFocus
              value={ searchTerm }
              onChange={ e => setSearchTerm( e.target.value)}
              onKeyPress={ (e) => e.key === 'Enter' ? onSearchTerm() : null }
              type='text'
              placeholder="Buscar..."
              endAdornment={
                  <InputAdornment position="end">
                      <IconButton
                          onClick = { () => setIsSearchVisible(false) }
                      >
                        <ClearOutlined />
                      </IconButton>
                  </InputAdornment>
              }
            />
           )
          : (
            <IconButton
              className='fadeIn'
              onClick={ () => setIsSearchVisible(true) }
              sx={{ display: { xs: 'none', sm: 'flex' } }}
            >
              <SearchOutlined />
            </IconButton>
          )

        }
        


        {/**Pantallas Pequeñas */}
        <IconButton
          sx={{ display: { xs: 'flex', sm: 'none' } }}
          onClick={ toogleSideMenu }
        >
          <SearchOutlined />
        </IconButton>

        <NextLink href='/cart' passHref>
          <Link>
            <IconButton>
              <Badge badgeContent={numberOfItems > 9 ? '+9' : numberOfItems } color="secondary">
                <ShoppingCartCheckoutOutlined />
              </Badge>
            </IconButton>
          </Link>
          </NextLink>

          <Button onClick={toogleSideMenu}>
            Menu
          </Button>


      </Toolbar>
    </AppBar>
  )
}
