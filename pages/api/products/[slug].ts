import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database';
import { IProduct } from '../../../interfaces'
import { Product } from '../../../models';

type Data = 
|{ message: string }
| IProduct

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

  switch (req.method) {
    case 'PUT':
      
      return //updateEntry(req, res);
    
    case 'GET':

      return getProductBySlug(req, res);
  
    default:
      return res.status(400).json({message:'Metodo no existe '})
  }
  
}


const getProductBySlug = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  
  const { slug } = req.query;

  await db.connect();
  const prductToFind = await Product.findOne({slug}).lean();
  await db.disconnect();

  if( !prductToFind ){ 
    await db.connect(); 
    return res.status(400).json({ message: 'Np hay Producto con es ID:' + slug })
  }

  try {

    prductToFind.images = prductToFind.images.map( image => {
      return image.includes('http') ? image : `${ process.env.HOST_NAME }products/${ image }`
    })

    res.status(200).json(prductToFind!);
    
  } catch (error:any) {
    
    await db.disconnect();
    res.status(400).json({
      message: error.errors.status
    })

  }
}

