import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GoalService } from './goal.service';
import { ReductionGoal, GoalInput } from './goal.types';
import { GqlAuthGuard } from '../common/guards/gql-auth.guard';

@Resolver(() => ReductionGoal)
export class GoalResolver {
  constructor(private goalService: GoalService) {}

  @Query(() => [ReductionGoal])
  @UseGuards(GqlAuthGuard)
  async goals(@Args('companyId', { type: () => ID }) companyId: string) {
    return this.goalService.findAll(companyId);
  }

  @Mutation(() => ReductionGoal)
  @UseGuards(GqlAuthGuard)
  async createGoal(@Args('input') input: GoalInput) {
    return this.goalService.create(input);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async deleteGoal(@Args('id', { type: () => ID }) id: string) {
    return this.goalService.delete(id);
  }
}
