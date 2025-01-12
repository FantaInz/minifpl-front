import { useTranslation } from "react-i18next";

export const useTranslateError = () => {
  const { t } = useTranslation();

  const translateError = (error) => {
    if (!error) return t("errors.unknownError");

    const errorMap = {
      "Incorrect username or password": t("errors.incorrectCredentials"),
      "User with this username or email already exists": t("errors.userExists"),
    };

    return errorMap[error] || t("errors.unknownError");
  };

  const translateErrorSolver = (message) => {
    if (
      message === "Optimization failed, probably due to unfeasible constraints"
    ) {
      return t("errors.optimizationFailed");
    }
    return t("errors.defaultSolverError");
  };

  return { translateError, translateErrorSolver };
};
