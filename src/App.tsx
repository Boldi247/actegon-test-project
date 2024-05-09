import { useQuery } from "@apollo/client";
import { useEffect, useState } from "react";

import {
  Pagination,
  Table,
  Form,
  RadioGroup,
  Radio,
  Input,
  SelectPicker,
} from "rsuite";
import { GET_CONTINENTS, GET_COUNTRIES } from "./utility/requests";
import { useFormik } from "formik";
import { ValueType } from "rsuite/esm/Radio";

interface ContinentDefinition {
  name: string;
}

interface CountryDefinition {
  capital: string;
  code: string;
  continent: ContinentDefinition;
  currency: string;
  emoji: string;
  name: string;
  nameWithEmoji?: string;
}

type SearchType = "search-continent&currency" | "search-code";

function App() {
  const countriesQuery = useQuery(GET_COUNTRIES);
  const continentsQuery = useQuery(GET_CONTINENTS);

  const [countries, setCountries] = useState<CountryDefinition[]>([]);
  const [filteredCountries, setFilteredCountries] = useState<
    CountryDefinition[]
  >([]);
  const [continents, setContinents] = useState<ContinentDefinition[]>([]);

  const [activePage, setActivePage] = useState<number>(1);
  const dataLimit: number = 20;

  const indexOfLastCountry = activePage * dataLimit;
  const indexOfFirstCountry = indexOfLastCountry - dataLimit;

  const currencies = Array.from(
    new Set(
      countries
        .map((country) => country.currency)
        .filter((curr) => curr !== null)
    )
  );

  const formik = useFormik({
    initialValues: {
      searchTypeSelected: "search-continent&currency" as SearchType,
      continentSelected: null,
      currencySelected: null,
      codeSelected: null,
    },
    onSubmit: (values) => {
      console.log(values);
    },
  });

  useEffect(() => {
    if (continentsQuery.data) {
      const countriesWithEmojiNames = countriesQuery.data.countries.map(
        (country: CountryDefinition) => {
          return {
            ...country,
            nameWithEmoji: `${country.name} ${country.emoji}`,
          };
        }
      );
      setCountries(countriesWithEmojiNames);
      console.log(countriesWithEmojiNames);
      setFilteredCountries(countriesWithEmojiNames);
    }
  }, [countriesQuery.loading, countriesQuery.error, countriesQuery.data]);

  useEffect(() => {
    if (continentsQuery.data) {
      console.log(continentsQuery.data.continents);
      setContinents(continentsQuery.data.continents);
    }
  }, [continentsQuery.data]);

  useEffect(() => {
    let filtered = countries;

    if (formik.values.searchTypeSelected === "search-continent&currency") {
      if (formik.values.continentSelected) {
        filtered = filtered.filter(
          (country) =>
            country.continent.name === formik.values.continentSelected
        );
      }
      if (formik.values.currencySelected) {
        filtered = filtered.filter(
          (country) => country.currency === formik.values.currencySelected
        );
      }
    } else if (formik.values.searchTypeSelected === "search-code") {
      if (formik.values.codeSelected) {
        const selectedCodeString = formik.values.codeSelected as string;

        filtered = countries.filter((country) =>
          country.code
            .toLowerCase()
            .toString()
            .includes(selectedCodeString.toLowerCase())
        );
      }
    }

    setFilteredCountries(filtered);
  }, [formik.values, countries]);

  return (
    <>
      <div className="w-full mx-auto p-5 max-w-[700px]">
        <Form className="p-4 border rounded-md shadow-md">
          <div>
            <h1>Country Finder</h1>
            <div className="flex flex-col gap-2">
              <RadioGroup
                defaultValue={formik.initialValues.searchTypeSelected}
                onChange={(e: ValueType) => {
                  formik.setFieldValue("searchTypeSelected", e);
                }}
              >
                <Radio value="search-continent&currency">
                  Search by Continent and Currency
                </Radio>
                <Radio value="search-code">Search by Country Code</Radio>
              </RadioGroup>
              <div className="w-full flex gap-2">
                <SelectPicker
                  data={continents.map((continent) => ({
                    label: continent.name,
                    value: continent.name,
                  }))}
                  placeholder="Select Continent"
                  onChange={(e) => {
                    setActivePage(1);
                    formik.setFieldValue("continentSelected", e);
                  }}
                  disabled={
                    formik.values.searchTypeSelected !==
                    "search-continent&currency"
                  }
                />
                <SelectPicker
                  data={currencies.map((curr) => ({
                    label: curr,
                    value: curr,
                  }))}
                  placeholder="Currency"
                  onChange={(e) => {
                    setActivePage(1);
                    formik.setFieldValue("currencySelected", e);
                  }}
                  disabled={
                    formik.values.searchTypeSelected !==
                    "search-continent&currency"
                  }
                />
              </div>
              <Input
                placeholder="Country Code"
                onChange={(e) => {
                  setActivePage(1);
                  formik.setFieldValue("codeSelected", e);
                  console.log(formik.values.codeSelected);
                }}
                disabled={formik.values.searchTypeSelected !== "search-code"}
              />
            </div>
          </div>
          <div className="mt-2">
            <Table
              data={filteredCountries.slice(
                indexOfFirstCountry,
                indexOfLastCountry
              )}
              height={800}
            >
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
              size="md"
              layout={["total", "-", "|", "pager"]}
              total={filteredCountries.length}
              limit={20}
              activePage={activePage}
              onChangePage={setActivePage}
              className="mt-2"
            />
          </div>
        </Form>
      </div>
    </>
  );
}

export default App;
