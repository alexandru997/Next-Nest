export const LOGIN_MUTATION = `
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      token
      name
      email
      role
    }
  }
`;

export const REGISTER_MUTATION = `
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      token
      name
      email
      role
    }
  }
`;

export const CREATE_COMPANY_MUTATION = `
  mutation CreateCompany($input: CompanyInput!) {
    createCompany(input: $input) {
      id
      name
      industry
      country
      createdAt
    }
  }
`;

export const DELETE_COMPANY_MUTATION = `
  mutation DeleteCompany($id: ID!) {
    deleteCompany(id: $id)
  }
`;

export const CREATE_REPORT_MUTATION = `
  mutation CreateReport($input: ReportInput!) {
    createReport(input: $input) {
      id
      companyId
      year
      quarter
      co2Emissions
      energyUsage
      waterUsage
      wasteGenerated
      renewablePct
      notes
      createdAt
    }
  }
`;

export const DELETE_REPORT_MUTATION = `
  mutation DeleteReport($id: ID!) {
    deleteReport(id: $id)
  }
`;

export const CREATE_GOAL_MUTATION = `
  mutation CreateGoal($input: GoalInput!) {
    createGoal(input: $input) {
      id
      companyId
      metric
      targetValue
      targetYear
      baselineValue
      baselineYear
      createdAt
    }
  }
`;

export const DELETE_GOAL_MUTATION = `
  mutation DeleteGoal($id: ID!) {
    deleteGoal(id: $id)
  }
`;
