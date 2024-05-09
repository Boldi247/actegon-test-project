import { gql } from "@apollo/client";

export const GET_COUNTRIES = gql`
  query GetCountries {
    countries {
      continent {
        name
      }
      name
      code
      capital
      currency
      emoji
    }
  }
`;

export const GET_CONTINENTS = gql`
  query GetContinents {
    continents {
      name
    }
  }
`;
