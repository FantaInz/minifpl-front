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
