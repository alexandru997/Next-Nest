import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { CompanyService } from './company.service';
import { Company, CompanyInput } from './company.types';
import { GqlAuthGuard } from '../common/guards/gql-auth.guard';

@Resolver(() => Company)
export class CompanyResolver {
  constructor(private companyService: CompanyService) {}

  @Query(() => [Company])
  async companies() {
    return this.companyService.findAll();
  }

  @Query(() => Company)
  async company(@Args('id', { type: () => ID }) id: string) {
    return this.companyService.findOne(id);
  }

  @Mutation(() => Company)
  @UseGuards(GqlAuthGuard)
  async createCompany(@Args('input') input: CompanyInput) {
    return this.companyService.create(input);
  }

  @Mutation(() => Company)
  @UseGuards(GqlAuthGuard)
  async updateCompany(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: CompanyInput,
  ) {
    return this.companyService.update(id, input);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async deleteCompany(@Args('id', { type: () => ID }) id: string) {
    return this.companyService.delete(id);
  }
}
