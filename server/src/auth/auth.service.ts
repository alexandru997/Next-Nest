import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterInput, LoginInput, AuthPayload } from './auth.types';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {}

  async register(input: RegisterInput): Promise<AuthPayload> {
    const existing = await this.prisma.user.findUnique({
      where: { email: input.email },
    });

    if (existing) {
      throw new ConflictException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(input.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: input.email,
        password: hashedPassword,
        name: input.name,
      },
    });

    const token = this.generateToken(user.id, user.email, user.role);

    return { token, name: user.name, email: user.email, role: user.role };
  }

  async login(input: LoginInput): Promise<AuthPayload> {
    const user = await this.prisma.user.findUnique({
      where: { email: input.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordValid = await bcrypt.compare(input.password, user.password);

    if (!passwordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.generateToken(user.id, user.email, user.role);

    return { token, name: user.name, email: user.email, role: user.role };
  }

  async getMe(userId: string): Promise<AuthPayload> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) throw new UnauthorizedException('User not found');
    const token = this.generateToken(user.id, user.email, user.role);
    return { token, name: user.name, email: user.email, role: user.role };
  }

  private generateToken(userId: string, email: string, role: string): string {
    const secret = this.config.get<string>('JWT_SECRET') ?? 'fallback-secret';
    return jwt.sign({ userId, email, role }, secret, { expiresIn: '7d' });
  }
}
