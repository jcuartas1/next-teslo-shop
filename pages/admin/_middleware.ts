import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { getToken } from 'next-auth/jwt'

export async function middleware (req: NextRequest, ev: NextFetchEvent){

  const session: any = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if(!session){
    const url = req.nextUrl.clone();
    const requesredPage = req.page.name;
    url.pathname = '/auth/login';
    url.search = `?p=${requesredPage}`
    return NextResponse.redirect(url);
  } 

  const validRoles = ['admin', 'super-user', 'SEO'];

  if( !validRoles.includes(  session.user.role ) ){
    const url = req.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();

}