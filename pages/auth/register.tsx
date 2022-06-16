import NextLink from 'next/link';
import { GetServerSideProps } from 'next';
import { Box, Button, Grid, Link, TextField, Typography, Chip } from '@mui/material'
import { ErrorOutline } from '@mui/icons-material';

import React, { useState } from 'react'
import { useForm, SubmitHandler } from "react-hook-form";

import { AuthLayout } from '../../components/layout'
import { tesloApi } from '../../api';
import { validations } from '../../utils';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { AuthContext } from '../../context';
import { signIn, getSession } from 'next-auth/react';


type FormData = {
  name: string;
  email: string;
  password: string;
}

const RegisterPage = () => {

  const router = useRouter();

  const { registerUser } = useContext(AuthContext); 

  const { register, handleSubmit,  formState: { errors } } = useForm<FormData>();
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');


  const onRegisterForm = async ( { email, password, name }: FormData ) => {


    setShowError(false);

    // Forma de registro con el context

    const { hasError, message } = await registerUser(name, email, password);

    if( hasError ){
      setShowError(true);
      setErrorMessage(message!)
      setTimeout(() => setShowError(false), 3000);
      return;
    }

    // const destination = router.query.p?.toString() || '/';

    // router.replace(destination);

    await signIn('credentials', { email, password });
    
    // Forma de registro tradicional sin el context
    // try {
      
    //   const { data } = await tesloApi.post('/user/register', { email, password, name });

    //   const { token, user } = data;

    //   console.log({token, user, name})

    // } catch (error) {
    //   console.log('Error en las credenciales');
    //   setShowError(true);
    //   setTimeout(() => setShowError(false), 3000);
    // }

  }


  return (
    <AuthLayout title={'Registro'}>
      <form onSubmit={ handleSubmit(onRegisterForm) } noValidate>
        <Box sx={{ width: 350, padding: '10px 20px' }}>
          <Grid container spacing={2}> 
            <Grid item xs={12}>
              <Typography variant='h1' component='h1'>Crear Cuenta</Typography>
              <Chip 
                  label='Error en los datos'
                  color='error'
                  icon={  <ErrorOutline />}
                  className="fadeIn"
                  sx={{ display: showError ? 'flex' : 'none' }}
                />
            </Grid>
            <Grid item xs={12}>
              <TextField  
                label='Nombre Completo' 
                variant='filled' 
                fullWidth
                {...register('name', {
                  required: 'Este campo es requerido',
                  minLength: { value: 2, message: 'Minimo 2 carateres' }
                })}
                error={ !!errors.name }
                helperText={ errors.name?.message }
                />
            </Grid>
            <Grid item xs={12}>
              <TextField
                type='email'  
                label='Correo' 
                variant='filled' 
                fullWidth
                {...register('email', {
                  required: 'Este campo es requerido',
                  validate: (val) => validations.isEmail(val)
                })}
                error={ !!errors.email }
                helperText={ errors.email?.message }
                />
            </Grid>
            <Grid item xs={12}>
              <TextField  
                label='Contraseña' 
                type='password'
                variant='filled' 
                fullWidth
                {...register('password', {
                  required: 'Este campo es requerido',
                  minLength: { value: 6, message: 'Minimo 6 carateres' }
                })}
                error={ !!errors.password }
                helperText={ errors.password?.message }
                />
            </Grid>
            <Grid item xs={12}>
              <Button 
                type="submit"
                color='secondary' 
                className='circular-btn' 
                size='large' 
                fullWidth>
                Registrar
              </Button>
            </Grid>
            <Grid item xs={12} display='flex' justifyContent='end'>
              <NextLink href={ router.query.p ? `/auth/login?p=${ router.query.p }` : '/auth/login'} passHref>
                <Link underline='always'>¿Ya tienes cuenta?</Link>
              </NextLink>
            </Grid>
          </Grid>
        </Box>
      </form>
    </AuthLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {

  const session = await getSession({ req });

  const {p = '/' }  = query;

  if(session){
    return {
      redirect: {
        destination: p.toString(),
        permanent: false
      }
    }
  }

  return {
    props: { }
  }
}

export default RegisterPage