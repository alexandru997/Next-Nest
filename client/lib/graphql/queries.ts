export const COMPANIES_QUERY = `
  query Companies {
    companies {
      id
      name
      industry
      country
      createdAt
    }
  }
`;

export const COMPANY_QUERY = `
  query Company($id: ID!) {
    company(id: $id) {
      id
      name
      industry
      country
      createdAt
    }
  }
`;

export const REPORTS_QUERY = `
  query Reports($companyId: ID!, $year: Int) {
    reports(companyId: $companyId, year: $year) {
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

export const GOALS_QUERY = `
  query Goals($companyId: ID!) {
    goals(companyId: $companyId) {
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
