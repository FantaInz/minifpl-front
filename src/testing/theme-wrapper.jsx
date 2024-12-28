import React from "react";
import PropTypes from "prop-types";

import { Provider } from "@/components/ui/provider";

export const ThemeWrapper = ({ children }) => {
  return <Provider>{children}</Provider>;
};

ThemeWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ThemeWrapper;
