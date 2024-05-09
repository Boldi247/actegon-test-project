import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

import "rsuite/dist/rsuite.min.css";
import { CustomProvider } from "rsuite";

import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

const client = new ApolloClient({
  uri: "https://countries.trevorblades.com/graphql",
  cache: new InMemoryCache(),
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <CustomProvider theme="light">
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </CustomProvider>
  </React.StrictMode>
);
