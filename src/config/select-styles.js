const customStyles = (controlOverrides = {}) => ({
  control: (styles) => ({
    ...styles,
    backgroundColor: "white",
    borderColor: "#CBD5E0",
    boxShadow: "none",
    "&:hover": { borderColor: "#A0AEC0" },
    ...controlOverrides,
  }),
  multiValue: (styles) => ({
    ...styles,
    backgroundColor: "#E2E8F0",
    color: "#2D3748",
  }),
  multiValueLabel: (styles) => ({
    ...styles,
    color: "#2D3748",
  }),
  multiValueRemove: (styles) => ({
    ...styles,
    color: "#2D3748",
    "&:hover": {
      backgroundColor: "#CBD5E0",
      color: "#1A202C",
    },
  }),
});

export default customStyles;
