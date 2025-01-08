import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import * as React from "react";
import { ErrorBoundary } from "react-error-boundary";
import PropTypes from "prop-types";

import { MainErrorFallback } from "@/components/errors/main-error-fallback";
import { AuthLoader } from "@/lib/auth";
import { queryClient } from "@/lib/react-query";
import { Provider } from "@/components/ui/provider";
import { Loading } from "@/components/ui/loading";

export const AppProvider = ({ children }) => {
  return (
    <Provider>
      <ErrorBoundary FallbackComponent={MainErrorFallback}>
        <React.Suspense fallback={<Loading />}>
          <QueryClientProvider client={queryClient}>
            {import.meta.env.DEV && <ReactQueryDevtools />}
            <AuthLoader renderLoading={() => <Loading />}>
              {children}
            </AuthLoader>
          </QueryClientProvider>
        </React.Suspense>
      </ErrorBoundary>
    </Provider>
  );
};

AppProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
