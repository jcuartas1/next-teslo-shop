import { FC, useEffect, useReducer } from "react";
import Cookie from 'js-cookie';

import { ICartProduct, IOrder, ShippingAddress } from "../../interfaces";
import { CartContext, cartReducer } from './';
import { tesloApi } from "../../api";
import axios from "axios";


export interface CartState {
  isLoaded: boolean;
  cart: ICartProduct[];
  numberOfItems: number;
  subTotal: number;
  tax: number;
  total: number;
  shippingAddress?:  ShippingAddress;
}



interface Props {
  children?: React.ReactNode | undefined
}

const CART_INITIAL_STATE: CartState  = {
  isLoaded: false,
  cart: [],
  numberOfItems: 0,
  subTotal: 0,
  tax: 0,
  total: 0,
  shippingAddress: undefined,
}


export const CartProvider:FC<Props> = ({children}) => {


  const [state, dispatch] = useReducer(cartReducer, CART_INITIAL_STATE);


  // Efecto recargar carrito de compras

  useEffect(() => {

    try {

      const cookieProducts = Cookie.get('cart') ? JSON.parse( Cookie.get('cart')! ) : []
    
      dispatch({ type: 'CART - LoadCart from cookies | storage', payload: cookieProducts})
    
    } catch (error) {
      dispatch({ type: 'CART - LoadCart from cookies | storage', payload: []})
    }

    
  }, [])

  useEffect(() => {
    
    try {

      if(Cookie.get('firstName') !== undefined){

        const shippingAddress = {
          firstName :Cookie.get('firstName') || '',
          lastName : Cookie.get('lastName') || '',
          address  : Cookie.get('address') || '',
          address2 : Cookie.get('address2') || '',
          zip :      Cookie.get('zip') || '', 
          city :     Cookie.get('city') || '', 
          country :  Cookie.get('country') || '',   
          phone :    Cookie.get('phone') || '',  
        }
  
        dispatch({ type: 'CART - LoadAddress from Cookies', payload:shippingAddress })

      }
      
    } catch (error) {
      //dispatch({ type: 'CART - LoadAddress from Cookies', payload:{} })
    }

    
    
  }, [])
  


  useEffect(() => {
    if(state.cart.length > 0 ) Cookie.set('cart', JSON.stringify(state.cart))
  }, [state.cart])

  useEffect(() => {
    
    const numberOfItems = state.cart.reduce( (prev, current) => current.quantity + prev , 0 );
    const subTotal = state.cart.reduce((prev, current) => (current.quantity * current.price) + prev , 0 );
    const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0);

    const orderSummary = {
      numberOfItems,
      subTotal,
      tax: subTotal * taxRate,
      total: subTotal * ( taxRate + 1 )
    }

    dispatch({ type: 'CART - Update order summary', payload: orderSummary });

  }, [state.cart])
  
  

  const addProductToCart = ( product: ICartProduct ) => {
      //! Nivel 1 

      //dispatch({ type: 'CART - Add Product', payload: product })

      //! Nivel 2
      // const productsInCart = state.cart.filter( p => p._id !== product._id && p.size !== product.size );
      // dispatch({ type: 'CART - Add Product', payload: [...productsInCart, product] })

      //! Nivel Final
      const productInCart = state.cart.some( p => p._id === product._id );
      if(!productInCart) return dispatch({ type: 'CART - Update products in cart', payload: [...state.cart, product] })

      const productInCartButDifferenteSize = state.cart.some ( p => p._id === product._id && p.size === product.size);
      if(!productInCartButDifferenteSize) return dispatch({ type: 'CART - Update products in cart', payload: [...state.cart, product] })

      // Acumular
      const updatedProducts = state.cart.map( p => {

        if(p._id !== product._id) return p;
        if(p.size !== product.size) return p;

        // Actualizar la cantidad
        p.quantity += product.quantity;

        return p;
      })

      dispatch({ type: 'CART - Update products in cart', payload: updatedProducts })

  }

  const updateCartQuantity = (product: ICartProduct) => {
    dispatch({ type: 'CART - Change cart quantity', payload:  product})
  }

  const removeCartProduct = (product: ICartProduct) => {
    dispatch({ type: 'CART - Remove product in cart', payload:  product})
  }

  const updateAddress = (address: ShippingAddress) => {

    Cookie.set('firstName', address.firstName);
    Cookie.set('lastName', address.lastName);
    Cookie.set('address', address.address);  
    Cookie.set('address2',address.address2 || '');   
    Cookie.set('zip', address.zip);       
    Cookie.set('city', address.city);      
    Cookie.set('country', address.country);   
    Cookie.set('phone', address.phone); 

    dispatch({ type: 'CART - Update Address from Cookies', payload: address })
  }


  const createOrder = async(): Promise<{hasError: boolean; message: string;}> => {


    if( !state.shippingAddress ){
      throw new Error('No hay direccion de entrega');
    }

    const body: IOrder = {
      orderItems: state.cart.map( p => ({
        ...p,
        size: p.size!
      })),
      shippingAddress: state.shippingAddress,
      numberOfItems: state.numberOfItems,
      subTotal: state.subTotal,
      tax: state.tax,
      total: state.total,
      isPaid: false
    }

    try {
       const { data } = await tesloApi.post<IOrder>('/orders', body); 
       

       dispatch({ type: 'CART - Order Complete' });

       return {
        hasError: false,
        message: data._id!
       }

    } catch (error) {
        if( axios.isAxiosError(error) ){
          const { message } = error.response?.data as { message:string }
          return {
            hasError: true,
            message
          }
        }

        return {
          hasError: true,
          message: 'Error no controlado, hable con el administrador'
        }

    }

  }

  return (
    <CartContext.Provider value={{ 
      ...state,
      
      //Metodos
      addProductToCart,
      updateCartQuantity,
      removeCartProduct,
      updateAddress,

      // Orders
      createOrder,
     }}>

      { children }

    </CartContext.Provider>
  )
}
