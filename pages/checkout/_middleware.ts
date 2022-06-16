import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { getToken } from 'next-auth/jwt'

export async function middleware (req: NextRequest, ev: NextFetchEvent){

  const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  

  if(!session){
    const url = req.nextUrl.clone();
    const requesredPage = req.page.name;
    url.pathname = '/auth/login';
    url.search = `?p=${requesredPage}`
    return NextResponse.redirect(url);
  }  

  return NextResponse.next();





  // const { token = '' } = req.cookies;

  // try {

  //   //await jwt.isValidToken(token);
  //   return NextResponse.next();
    
  // } catch (error) {
    

  //   const requesredPage = req.page.name;
  //   return NextResponse.redirect(`/auth/login?=${requesredPage}`);

  // }

}