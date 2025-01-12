import React from "react";

import { AppProvider } from "./provider";
import { AppRouter } from "./router";
/* eslint-disable-next-line no-unused-vars */
import i18n from "@/utils/i18n";

export const App = () => {
  return (
    <AppProvider>
      <AppRouter />
    </AppProvider>
  );
};
