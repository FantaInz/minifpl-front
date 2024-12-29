import React from "react";
import PropTypes from "prop-types";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "@/components/ui/provider";

const queryClient = new QueryClient();

export const ThemeWrapper = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Provider>{children}</Provider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

ThemeWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ThemeWrapper;
