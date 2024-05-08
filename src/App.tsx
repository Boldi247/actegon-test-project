import { useQuery, gql } from "@apollo/client";
import { useEffect, useState } from "react";

import { Pagination, Table } from "rsuite";

interface CountryDefinition {
  capital: string;
  code: string;
  continent: {
    name: string;
  };
  currency: string;
  emoji: string;
  name: string;
  nameWithEmoji?: string;
}

const GET_COUNTRIES = gql`
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

function App() {
  const { loading, error, data } = useQuery(GET_COUNTRIES);
  const [countries, setCountries] = useState<CountryDefinition[]>([]);

  const [activePage, setActivePage] = useState<number>(1);
  const dataLimit: number = 20;

  const indexOfLastCountry = activePage * dataLimit;
  const indexOfFirstCountry = indexOfLastCountry - dataLimit;
  const currentCountries = countries.slice(
    indexOfFirstCountry,
    indexOfLastCountry
  );

  useEffect(() => {
    if (loading) {
      console.log("Loading GraphQL data...");
    } else if (error) {
      console.error(error);
    } else {
      const countriesWithEmojiNames = data.countries.map(
        (country: CountryDefinition) => {
          return {
            ...country,
            nameWithEmoji: `${country.name} ${country.emoji}`,
          };
        }
      );
      setCountries(countriesWithEmojiNames);
    }
  }, [loading, error, data]);

  useEffect(() => {
    console.log(countries);
  }, [countries]);

  return (
    <>
      <div className="w-full mx-auto p-5 max-w-[700px]">
        <Table data={currentCountries} height={800}>
          <Table.Column width={50}>
            <Table.HeaderCell>Code</Table.HeaderCell>
            <Table.Cell dataKey="code" />
          </Table.Column>
          <Table.Column width={250}>
            <Table.HeaderCell>Country</Table.HeaderCell>
            <Table.Cell dataKey="nameWithEmoji" />
          </Table.Column>
          <Table.Column width={250}>
            <Table.HeaderCell>Capital</Table.HeaderCell>
            <Table.Cell dataKey="capital" />
          </Table.Column>
          <Table.Column width={100}>
            <Table.HeaderCell>Currency</Table.HeaderCell>
            <Table.Cell dataKey="currency" />
          </Table.Column>
        </Table>
        <Pagination
          prev
          next
          first
          last
          ellipsis
          boundaryLinks
          maxButtons={5}
          size="xs"
          layout={["total", "-", "|", "pager"]}
          total={countries.length}
          limit={20}
          activePage={activePage}
          onChangePage={setActivePage}
        />
      </div>
    </>
  );
}

export default App;
