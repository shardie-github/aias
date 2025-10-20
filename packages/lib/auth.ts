import { createClient } from '@supabase/supabase-js';
import { config } from '@ai-consultancy/config';
import { prisma } from './database';
import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';

const supabase = createClient(
  config.supabase.url,
  config.supabase.serviceRoleKey
);

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  supabaseId?: string;
}

export class AuthService {
  static async createUser(userData: {
    email: string;
    name?: string;
    avatar?: string;
    supabaseId?: string;
  }): Promise<AuthUser> {
    const user = await prisma.user.create({
      data: userData,
    });

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      supabaseId: user.supabaseId,
    };
  }

  static async getUserByEmail(email: string): Promise<AuthUser | null> {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      supabaseId: user.supabaseId,
    };
  }

  static async getUserById(id: string): Promise<AuthUser | null> {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      supabaseId: user.supabaseId,
    };
  }

  static async getUserBySupabaseId(supabaseId: string): Promise<AuthUser | null> {
    const user = await prisma.user.findUnique({
      where: { supabaseId },
    });

    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      supabaseId: user.supabaseId,
    };
  }

  static async updateUser(id: string, data: Partial<AuthUser>): Promise<AuthUser> {
    const user = await prisma.user.update({
      where: { id },
      data: {
        email: data.email,
        name: data.name,
        avatar: data.avatar,
        supabaseId: data.supabaseId,
      },
    });

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      supabaseId: user.supabaseId,
    };
  }

  static async createJWT(user: AuthUser): Promise<string> {
    const secret = new TextEncoder().encode(config.security.jwtSecret);
    
    return new SignJWT({ 
      userId: user.id,
      email: user.email,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(secret);
  }

  static async verifyJWT(token: string): Promise<{ userId: string; email: string } | null> {
    try {
      const secret = new TextEncoder().encode(config.security.jwtSecret);
      const { payload } = await jwtVerify(token, secret);
      
      return {
        userId: payload.userId as string,
        email: payload.email as string,
      };
    } catch (error) {
      return null;
    }
  }

  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  static async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  static async getSupabaseUser(accessToken: string): Promise<any> {
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user) {
      throw new Error('Invalid access token');
    }

    return user;
  }

  static async createOrUpdateUserFromSupabase(supabaseUser: any): Promise<AuthUser> {
    const existingUser = await this.getUserBySupabaseId(supabaseUser.id);
    
    if (existingUser) {
      return this.updateUser(existingUser.id, {
        email: supabaseUser.email,
        name: supabaseUser.user_metadata?.full_name || supabaseUser.email,
        avatar: supabaseUser.user_metadata?.avatar_url,
        supabaseId: supabaseUser.id,
      });
    }

    return this.createUser({
      email: supabaseUser.email,
      name: supabaseUser.user_metadata?.full_name || supabaseUser.email,
      avatar: supabaseUser.user_metadata?.avatar_url,
      supabaseId: supabaseUser.id,
    });
  }
}