import { ObjectType, Field, ID, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@ObjectType()
export class Company {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  industry?: string;

  @Field({ nullable: true })
  country?: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@InputType()
export class CompanyInput {
  @Field()
  @IsNotEmpty()
  name: string;

  @Field({ nullable: true })
  industry?: string;

  @Field({ nullable: true })
  country?: string;
}
