import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import * as React from "react";

import { AppProvider } from "./provider";
import { Loading } from "@/components/ui/loading";

const ChildComponent = () => <div>Child Component</div>;

describe("AppProvider", () => {
  it("renders children without errors", async () => {
    render(
      <AppProvider>
        <ChildComponent />
      </AppProvider>
    );

    await waitFor(() =>
      expect(screen.getByText("Child Component")).toBeInTheDocument()
    );
  });

  it("shows spinner during loading in AuthLoader", () => {
    render(
      <AppProvider>
        <Loading />
      </AppProvider>
    );

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("shows error fallback when there is an error", async () => {
    const ErrorThrowingComponent = () => {
      throw new Error("Test Error");
    };

    render(
      <AppProvider>
        <ErrorThrowingComponent />
      </AppProvider>
    );

    await waitFor(() =>
      expect(screen.getByText("Coś poszło nie tak :(")).toBeInTheDocument()
    );
  });
});
