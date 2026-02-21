import type { Request } from 'express';

export interface JwtPayload {
  userId: string;
  email: string;
}

export interface GqlContext {
  req: Request & { user?: JwtPayload };
}
