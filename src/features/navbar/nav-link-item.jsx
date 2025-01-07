import React from "react";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";

const NavLinkItem = ({ to, children, ...props }) => (
  <NavLink
    to={to}
    style={({ isActive }) => ({
      padding: "8px 16px",
      borderRadius: "8px",
      backgroundColor: isActive ? "#ebf8ff" : "transparent",
      color: isActive ? "#2b6cb0" : "#1a202c",
      textDecoration: "none",
    })}
    {...props}
  >
    {children}
  </NavLink>
);

NavLinkItem.propTypes = {
  to: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default NavLinkItem;
