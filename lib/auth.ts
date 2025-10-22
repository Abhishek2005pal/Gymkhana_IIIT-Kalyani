import UserModel from '@/models/user.model';
import type { NextAuthConfig } from 'next-auth';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import dbConnect from './dbConnect';

// Type augmentation for next-auth
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      name: string;
      email: string;
    };
  }
  
  interface User {
    id: string;
    role: string;
    name: string;
    email: string;
  }
}

export const authConfig: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          console.log('[AUTH] Attempting login for:', credentials?.email);
          console.log('[AUTH] MONGODB_URI:', process.env.MONGODB_URI ? 'SET' : 'NOT SET');
          
          if (!credentials?.email || !credentials?.password) {
            console.log('[AUTH] Missing credentials');
            return null;
          }

          console.log('[AUTH] Connecting to database...');
          await dbConnect();
          console.log('[AUTH] Database connected');
          console.log('[AUTH] Connected to:', (await import('mongoose')).default.connection.host);
          console.log('[AUTH] Database name:', (await import('mongoose')).default.connection.db?.databaseName);
          
          console.log('[AUTH] Finding user...');
          const user = await UserModel.findOne({ email: credentials.email });
          
          console.log('[AUTH] User query result:', user ? 'FOUND' : 'NOT FOUND');
          
          // Let's also check how many users are in the database
          const userCount = await UserModel.countDocuments();
          console.log('[AUTH] Total users in database:', userCount);
          
          if (!user) {
            console.log('[AUTH] User not found');
            return null;
          }
          
          console.log('[AUTH] User found, checking password...');
          const isPasswordValid = await user.comparePassword(credentials.password as string);
          
          if (!isPasswordValid) {
            console.log('[AUTH] Invalid password');
            return null;
          }
          
          console.log('[AUTH] Login successful!');
          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
          };
        } catch (error) {
          console.error('[AUTH] Error during authentication:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET || 'your-secret-key-change-this-in-production',
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);

// For backward compatibility
export const authOptions = authConfig;