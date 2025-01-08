export const getLastName = (fullName) => {
  if (typeof fullName !== "string") {
    throw new Error("Input must be a string");
  }

  const parts = fullName.trim().split(" ");
  return parts[parts.length - 1];
};
