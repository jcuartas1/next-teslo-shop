import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database';
import { IProduct } from '../../../interfaces';
import { Product } from '../../../models';
import { isValidObjectId } from 'mongoose';

import { v2 as cloudinary } from 'cloudinary';

cloudinary.config( process.env.CLOUDINARY_URL || ''); 


type Data = 
| { message: string }
| IProduct[]
| IProduct

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {


  switch (req.method) {
    case 'GET':
      return getProducts( req, res );
    case 'PUT':
      return updateProducts(req, res);
    case 'POST':
      return createProducts(req, res);  
  
    default:
      return res.status(400).json({ message: 'Bad Request' })
  }

  
}

async function getProducts(req: NextApiRequest, res: NextApiResponse<Data>) {

  await db.connect();
  const products = await Product.find()
    .sort({ title: 'asc'})
    .lean();



  await db.disconnect();

  // TODO:

  const updatedProducts = products.map( product => {
    product.images = product.images.map( image => {
      return image.includes('http') ? image : `${ process.env.HOST_NAME }products/${ image }`
    })

    return product;

  });

  res.status(200).json(updatedProducts);
}
async function updateProducts(req: NextApiRequest, res: NextApiResponse<Data>) {
  
  const { _id = '', images = [] } = req.body as IProduct;

  console.log(_id)

  if( !isValidObjectId(_id) ){
    return res.status(400).json({ message: 'El id del producto no es valido' })
  }

  if( images.length < 2){
    return res.status(400).json({ message: 'La cantidad de imagenes debe ser mayor de 2' })
  }

  // TODO: posiblemente tendremos un localhost:3000/products/asdsdd.jpg

  try {

    await db.connect();

    const product = await Product.findById(_id);
    if(!product){
      await db.disconnect();
      return res.status(400).json({ message: 'No existe un producto con ese ID' })
    }

    //TODO: eliminar imaganes en el Cloudinary
    // https://res.cloudinary.com/dtmzwbrvo/image/upload/v1655327164/b4h77khdbii3mcdreomq.webp

    product.images.forEach( async( image ) =>  {
      if( !images.includes(image) ){
        //Borrar de cloudinary
        const [fileId, extension] = image.substring( image.lastIndexOf('/') + 1).split('.');
        await cloudinary.uploader.destroy(fileId);
      }
    })

    await product.update(req.body);
    await db.disconnect();

    return res.status(200).json(product)

  } catch (error) {
    console.log(error)
    await db.disconnect();
    return res.status(400).json({ message: 'Revisar logs del servidor' })
    
  }

}

async function createProducts(req: NextApiRequest, res: NextApiResponse<Data>) {
  
  const { images = [] } = req.body as IProduct;

  if( images.length < 2 ) {
    return res.status(400).json({ message: 'La cantidad de imagenes debe ser mayor de 2' })
  }

  try {
    await db.connect();
    const productInDb = await Product.findOne({ slug: req.body.slug });
    if( productInDb ){
      await db.disconnect();
      return res.status(400).json({ message: 'el Slug debe ser unico' })
    }

    const product = new Product( req.body );
    await product.save();
    await db.disconnect();

    return res.status(201).json(product);
    
  } catch (error) {
    console.log(error)
    await db.disconnect();
    return res.status(400).json({ message: 'Revisar logs del servidor' })
  }

}

