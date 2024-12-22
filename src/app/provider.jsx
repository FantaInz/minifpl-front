import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import * as React from "react";
import { ErrorBoundary } from "react-error-boundary";
import PropTypes from "prop-types";

import { MainErrorFallback } from "@/components/errors/main";
import { AuthLoader } from "@/lib/auth";
import { queryConfig } from "@/lib/react-query";
import { Provider } from "@/components/ui/provider";
import { Loading } from "@/components/ui/loading";

export const AppProvider = ({ children }) => {
  const [queryClient] = React.useState(
    () => new QueryClient({ defaultOptions: queryConfig })
  );

  return (
    <Provider>
      <React.Suspense fallback={<Loading />}>
        <ErrorBoundary FallbackComponent={MainErrorFallback}>
          <QueryClientProvider client={queryClient}>
            {import.meta.env.DEV && <ReactQueryDevtools />}
            <AuthLoader renderLoading={() => <Loading />}>
              {children}
            </AuthLoader>
          </QueryClientProvider>
        </ErrorBoundary>
      </React.Suspense>
    </Provider>
  );
};

AppProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
