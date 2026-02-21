import { ObjectType, Field, ID, InputType, Int, Float } from '@nestjs/graphql';
import { IsNotEmpty, IsInt, Min, Max } from 'class-validator';

@ObjectType()
export class EmissionReport {
  @Field(() => ID)
  id: string;

  @Field()
  companyId: string;

  @Field(() => Int)
  year: number;

  @Field(() => Int, { nullable: true })
  quarter?: number;

  @Field(() => Float, { nullable: true })
  co2Emissions?: number;

  @Field(() => Float, { nullable: true })
  energyUsage?: number;

  @Field(() => Float, { nullable: true })
  waterUsage?: number;

  @Field(() => Float, { nullable: true })
  wasteGenerated?: number;

  @Field(() => Float, { nullable: true })
  renewablePct?: number;

  @Field({ nullable: true })
  notes?: string;

  @Field()
  createdById: string;

  @Field()
  createdAt: Date;
}

@InputType()
export class ReportInput {
  @Field()
  @IsNotEmpty()
  companyId: string;

  @Field(() => Int)
  @IsInt()
  year: number;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @Min(1)
  @Max(4)
  quarter?: number;

  @Field(() => Float, { nullable: true })
  co2Emissions?: number;

  @Field(() => Float, { nullable: true })
  energyUsage?: number;

  @Field(() => Float, { nullable: true })
  waterUsage?: number;

  @Field(() => Float, { nullable: true })
  wasteGenerated?: number;

  @Field(() => Float, { nullable: true })
  renewablePct?: number;

  @Field({ nullable: true })
  notes?: string;
}
