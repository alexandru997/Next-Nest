import { ObjectType, Field, ID, InputType, Int, Float, registerEnumType } from '@nestjs/graphql';
import { IsNotEmpty, IsInt } from 'class-validator';

export enum MetricType {
  CO2 = 'CO2',
  ENERGY = 'ENERGY',
  WATER = 'WATER',
  WASTE = 'WASTE',
}

registerEnumType(MetricType, { name: 'MetricType' });

@ObjectType()
export class ReductionGoal {
  @Field(() => ID)
  id: string;

  @Field()
  companyId: string;

  @Field(() => MetricType)
  metric: MetricType;

  @Field(() => Float)
  targetValue: number;

  @Field(() => Int)
  targetYear: number;

  @Field(() => Float)
  baselineValue: number;

  @Field(() => Int)
  baselineYear: number;

  @Field()
  createdAt: Date;
}

@InputType()
export class GoalInput {
  @Field()
  @IsNotEmpty()
  companyId: string;

  @Field(() => MetricType)
  metric: MetricType;

  @Field(() => Float)
  targetValue: number;

  @Field(() => Int)
  @IsInt()
  targetYear: number;

  @Field(() => Float)
  baselineValue: number;

  @Field(() => Int)
  @IsInt()
  baselineYear: number;
}
