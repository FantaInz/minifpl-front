export const translateError = (error) => {
  if (!error) return "Wystąpił nieznany błąd.";

  const errorMap = {
    "Incorrect username or password":
      "Nieprawidłowa nazwa użytkownika lub hasło.",
    "User with this username or email already exists":
      "Użytkownik z tą nazwą użytkownika lub adresem e-mail już istnieje.",
  };

  return errorMap[error] || "Wystąpił błąd. Spróbuj ponownie później.";
};

export const translateErrorSolver = (message) => {
  if (
    message === "Optimization failed, probably due to unfeasible constraints"
  ) {
    return "Nie można spełnić wymagań.";
  }
  return "Wystąpił błąd podczas optymalizacji.";
};
