import { Resolver, Query, Mutation, Args, ID, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ReportService } from './report.service';
import { EmissionReport, ReportInput } from './report.types';
import { GqlAuthGuard } from '../common/guards/gql-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

interface JwtUser {
  userId: string;
  email: string;
}

@Resolver(() => EmissionReport)
export class ReportResolver {
  constructor(private reportService: ReportService) {}

  @Query(() => [EmissionReport])
  @UseGuards(GqlAuthGuard)
  async reports(
    @Args('companyId', { type: () => ID }) companyId: string,
    @Args('year', { type: () => Int, nullable: true }) year?: number,
  ) {
    return this.reportService.findAll(companyId, year);
  }

  @Query(() => EmissionReport)
  @UseGuards(GqlAuthGuard)
  async report(@Args('id', { type: () => ID }) id: string) {
    return this.reportService.findOne(id);
  }

  @Mutation(() => EmissionReport)
  @UseGuards(GqlAuthGuard)
  async createReport(
    @Args('input') input: ReportInput,
    @CurrentUser() user: JwtUser,
  ) {
    return this.reportService.create(input, user.userId);
  }

  @Mutation(() => EmissionReport)
  @UseGuards(GqlAuthGuard)
  async updateReport(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: ReportInput,
  ) {
    return this.reportService.update(id, input);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async deleteReport(@Args('id', { type: () => ID }) id: string) {
    return this.reportService.delete(id);
  }
}
