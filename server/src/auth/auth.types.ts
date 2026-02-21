import { ObjectType, Field, InputType } from '@nestjs/graphql';
import { IsEmail, MinLength } from 'class-validator';

@ObjectType()
export class AuthPayload {
  @Field()
  token: string;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  role: string;
}

@InputType()
export class RegisterInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @MinLength(6)
  password: string;

  @Field()
  name: string;
}

@InputType()
export class LoginInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  password: string;
}
