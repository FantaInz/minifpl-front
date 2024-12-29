import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeAll, afterAll } from "vitest";
import * as React from "react";

import { AppProvider } from "./provider";
import { Loading } from "@/components/ui/loading";

vi.mock("@/lib/auth", () => ({
  useLogin: vi.fn(() => ({ mutate: vi.fn(), isLoading: false })),
  useRegister: vi.fn(() => ({ mutate: vi.fn(), isLoading: false })),
  AuthLoader: ({ children }) => children,
  getUser: vi.fn(() => Promise.resolve(null)),
}));

const ChildComponent = () => <div>Child Component</div>;

const ErrorThrowingComponent = () => {
  throw new Error("Test Error");
};

describe("AppProvider", () => {
  let originalLocation;

  beforeAll(() => {
    originalLocation = window.location;
    delete window.location;
    window.location = { ...originalLocation, reload: vi.fn() };
  });

  afterAll(() => {
    window.location = originalLocation;
  });

  it("renders children without errors", async () => {
    render(
      <AppProvider>
        <ChildComponent />
      </AppProvider>,
    );

    await waitFor(() =>
      expect(screen.getByText("Child Component")).toBeInTheDocument(),
    );
  });

  it("shows spinner during loading", () => {
    render(
      <AppProvider>
        <Loading />
      </AppProvider>,
    );

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("shows error fallback when there is an error", async () => {
    render(
      <AppProvider>
        <ErrorThrowingComponent />
      </AppProvider>,
    );

    await waitFor(() =>
      expect(screen.getByText("Coś poszło nie tak 😢")).toBeInTheDocument(),
    );
  });
});
