import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import Credentials from "next-auth/providers/credentials";
import { dbUsers } from "../../../database";

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    // ...add more providers here
    Credentials({
      name: 'Custom Login',
      credentials: {
        email: { label: 'Correo', type: 'email', placeholder: 'correo@google.com' },
        password: { label: 'Contraseña', type: 'password', placeholder: 'Contraseña' },
      },
      async authorize(credentials) {

        console.log({credentials})

        return await dbUsers.checkUserEmailPassword( credentials!.email, credentials!.password );


      }
    })
  ],

  // Custom Pages
  pages: {
    signIn: '/auth/login',
    newUser: '/auth/register'
  },

  jwt: {

  },

  session: {
    maxAge: 2592000,
    strategy: 'jwt',
    updateAge: 86400,

  },

  // Callbacks

  callbacks: {

    async jwt({ token, account, user }){

      if( account ) {
        token.accessToken = account.access_token;

        switch (account.type) {
          case 'credentials':
              token.user = user;
            break;
          case 'oauth':
              token.user = await dbUsers.oAuthToDbUser(user?.email || '', user?.name || '' );
            break;

          default:
            break;
        }
      }
      return token;
    },

    async session({session, token, user}){

      session.accessToken = token.accessToken;
      session.user = token.user as any;
      return session;
    }

  }
});