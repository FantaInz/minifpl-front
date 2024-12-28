import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

const originalConsoleError = console.error;

const ignoredErrors = [
  "Error: Could not parse CSS stylesheet",
  "Test Error",
  "The above error occurred in the <ErrorThrowingComponent> component",
];

console.error = (...params) => {
  const message = params.join(" ");

  if (ignoredErrors.some((error) => message.includes(error))) {
    return;
  }

  originalConsoleError(...params);
};

afterEach(() => {
  cleanup();
});

window.matchMedia =
  window.matchMedia ||
  (() => ({
    matches: false,
    addListener: () => {},
    removeListener: () => {},
  }));
