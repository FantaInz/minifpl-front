import { QueryClientProvider } from "@tanstack/react-query";
import * as React from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Theme } from "@chakra-ui/react";
import PropTypes from "prop-types";

import { MainErrorFallback } from "@/components/errors/main-error-fallback";
import { AuthLoader } from "@/lib/auth";
import { queryClient } from "@/lib/react-query";
import { Provider } from "@/components/ui/provider";
import { Loading } from "@/components/ui/loading";
import { Toaster } from "@/components/ui/toaster";

export const AppProvider = ({ children }) => {
  return (
    <Provider>
      <Theme appearance="light">
        <Toaster />
        <ErrorBoundary FallbackComponent={MainErrorFallback}>
          <React.Suspense fallback={<Loading />}>
            <QueryClientProvider client={queryClient}>
              <AuthLoader renderLoading={() => <Loading />}>
                {children}
              </AuthLoader>
            </QueryClientProvider>
          </React.Suspense>
        </ErrorBoundary>
      </Theme>
    </Provider>
  );
};

AppProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
