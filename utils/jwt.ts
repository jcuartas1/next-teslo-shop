import jwt from 'jsonwebtoken';

export const signToken = (_id: string, email: string) => {

  if(!process.env.JWT_SECTRET_SEED){
    throw new Error('No hay semilla de JWT');
  }

  return jwt.sign(
    //Payload
    {_id, email},
    //Seed
    process.env.JWT_SECTRET_SEED,
    //Opciones 
    { expiresIn: '30d' }
  )

}

export const isValidToken = (token: string): Promise<string> => {

  if(!process.env.JWT_SECTRET_SEED){
    throw new Error('No hay semilla de JWT');
  }

  if( token.length <= 10 ){
    return Promise.reject('JWT no es valido');
  }

  return new Promise( ( resolve, reject ) => {
    try {

      jwt.verify( token, process.env.JWT_SECTRET_SEED || '', (error, payload) => {
          if(error) return reject('JWT no es valido');

          const { _id } = payload as { _id: string };

          resolve(_id);
      })

    } catch (error) {
      reject('JWT no es valido');
    }
  })

}