import React from "react";
import userEvent from "@testing-library/user-event";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import SearchForm from "./search-form";
import ThemeWrapper from "@/testing/theme-wrapper";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key,
    i18n: {
      on: vi.fn(),
      off: vi.fn(),
    },
  }),
}));

const mockOnSubmit = vi.fn();

describe("SearchForm", () => {
  const maxWeek = 38;

  beforeEach(() => {
    localStorage.clear();
    mockOnSubmit.mockClear();
  });

  it("renders the search form with default values", () => {
    render(<SearchForm maxWeek={maxWeek} onSubmit={mockOnSubmit} />, {
      wrapper: ThemeWrapper,
    });

    expect(
      screen.getByPlaceholderText("searchForm.placeholders.searchPlayers"),
    ).toBeInTheDocument();
    expect(screen.getByText("searchForm.labels.minPrice")).toBeInTheDocument();
    expect(screen.getByText("searchForm.labels.maxPrice")).toBeInTheDocument();
    expect(
      screen.getByText("searchForm.labels.enableSorting"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "searchForm.buttons.search" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "searchForm.buttons.reset" }),
    ).toBeInTheDocument();
  });

  it("submits the form and saves data to localStorage", async () => {
    render(<SearchForm maxWeek={maxWeek} onSubmit={mockOnSubmit} />, {
      wrapper: ThemeWrapper,
    });

    const searchInput = screen.getByPlaceholderText(
      "searchForm.placeholders.searchPlayers",
    );
    const submitButton = screen.getByRole("button", {
      name: "searchForm.buttons.search",
    });

    await userEvent.type(searchInput, "Harry Kane");
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "Harry Kane",
        }),
      );
    });

    const savedData = JSON.parse(localStorage.getItem("searchForm"));
    expect(savedData).toMatchObject({ searchQuery: "Harry Kane" });
  });

  it("resets the form and clears localStorage", async () => {
    render(<SearchForm maxWeek={maxWeek} onSubmit={mockOnSubmit} />, {
      wrapper: ThemeWrapper,
    });

    const searchInput = screen.getByPlaceholderText(
      "searchForm.placeholders.searchPlayers",
    );
    const resetButton = screen.getByRole("button", {
      name: "searchForm.buttons.reset",
    });

    await userEvent.type(searchInput, "Harry Kane");
    fireEvent.click(resetButton);

    await waitFor(() => {
      expect(localStorage.getItem("searchForm")).toBeNull();
      expect(searchInput).toHaveValue("");
    });
  });

  it("enables sorting options when checked", async () => {
    render(<SearchForm maxWeek={maxWeek} onSubmit={mockOnSubmit} />, {
      wrapper: ThemeWrapper,
    });

    const sortCheckbox = screen
      .getByText("searchForm.labels.enableSorting")
      .closest("label");
    expect(sortCheckbox).toBeInTheDocument();

    const enableSortingInput = sortCheckbox.querySelector(
      "input[type='checkbox']",
    );
    expect(enableSortingInput).not.toBeChecked();

    await userEvent.click(enableSortingInput);

    const sortBySelect = screen.getByText(
      "searchForm.labels.sortBy",
    ).nextElementSibling;
    expect(sortBySelect).toBeInTheDocument();
  });

  it("loads saved form data from localStorage on mount", async () => {
    const savedForm = {
      searchQuery: "Saved Player",
      minPrice: 5,
      maxPrice: 10,
      positions: ["1"],
      teams: ["12"],
      startGameweek: { label: "Kolejka 30", value: "30" },
      rangeGameweek: { label: "3", value: "3" },
      pageSize: { label: "20", value: "20" },
      sortBy: { label: "Punkty rzeczywiste", value: "realPoints" },
      sortOrder: { label: "Malejąco", value: "desc" },
      sortGameweek: { label: "Kolejka 36", value: "36" },
      enableSorting: true,
    };

    localStorage.setItem("searchForm", JSON.stringify(savedForm));

    render(<SearchForm maxWeek={maxWeek} onSubmit={mockOnSubmit} />, {
      wrapper: ThemeWrapper,
    });

    expect(
      screen.getByPlaceholderText("searchForm.placeholders.searchPlayers"),
    ).toHaveValue("Saved Player");

    const sortCheckbox = screen.getByRole("checkbox", {
      name: /searchForm.labels.enableSorting/i,
    });
    expect(sortCheckbox).toBeChecked();
  });
});
