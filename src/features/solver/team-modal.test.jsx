import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import TeamModal from "./team-modal";
import ThemeWrapper from "@/testing/theme-wrapper";

describe("TeamModal", () => {
  let mockOnSubmit;

  beforeEach(() => {
    mockOnSubmit = vi.fn();
  });

  const renderModal = (isOpen) => {
    render(<TeamModal isOpen={isOpen} onSubmit={mockOnSubmit} />, {
      wrapper: ThemeWrapper,
    });
  };

  it("renders modal with correct title and input field", () => {
    renderModal(true);

    expect(screen.getByText("Dodaj Team ID")).toBeInTheDocument();
    expect(
      screen.getByText("Podaj ID swojego zespołu w FPL, aby przejść dalej."),
    ).toBeInTheDocument();
    expect(screen.getByTestId("team-id-input")).toBeInTheDocument();
  });

  it("displays required validation error when input is empty", async () => {
    renderModal(true);

    const submitButton = screen.getByText("Zapisz");
    await act(async () => {
      fireEvent.click(submitButton);
    });

    expect(screen.getByText("ID jest wymagane")).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it("displays error when input value is below 1", async () => {
    renderModal(true);

    const input = screen.getByTestId("team-id-input");
    const submitButton = screen.getByText("Zapisz");

    await act(async () => {
      fireEvent.input(input, { target: { value: "0" } });
      fireEvent.click(submitButton);
    });

    expect(screen.getByText("ID musi być większe od zera")).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it("displays error when input value exceeds 20 million", async () => {
    renderModal(true);

    const input = screen.getByTestId("team-id-input");
    const submitButton = screen.getByText("Zapisz");

    await act(async () => {
      fireEvent.input(input, { target: { value: "20000001" } });
      fireEvent.click(submitButton);
    });

    expect(
      screen.getByText("ID nie może być większe niż 20 milionów"),
    ).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it("submits valid ID successfully", async () => {
    renderModal(true);

    const input = screen.getByTestId("team-id-input");
    const submitButton = screen.getByText("Zapisz");

    await act(async () => {
      fireEvent.input(input, { target: { value: "123456" } });
      fireEvent.click(submitButton);
    });

    expect(mockOnSubmit).toHaveBeenCalledWith("123456");
    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
  });

  it("clears error message when input value is corrected", async () => {
    renderModal(true);

    const input = screen.getByTestId("team-id-input");
    const submitButton = screen.getByText("Zapisz");

    await act(async () => {
      fireEvent.input(input, { target: { value: "0" } });
      fireEvent.click(submitButton);
    });

    expect(screen.getByText("ID musi być większe od zera")).toBeInTheDocument();

    await act(async () => {
      fireEvent.input(input, { target: { value: "1234" } });
    });

    expect(
      screen.queryByText("ID musi być większe od zera"),
    ).not.toBeInTheDocument();
  });

  it("displays server error if submit fails", async () => {
    mockOnSubmit.mockRejectedValueOnce(new Error("Nieprawidłowe Team ID"));
    renderModal(true);

    const input = screen.getByTestId("team-id-input");
    const submitButton = screen.getByText("Zapisz");

    await act(async () => {
      fireEvent.input(input, { target: { value: "1234" } });
      fireEvent.click(submitButton);
    });

    expect(
      screen.getByText("Nieprawidłowe Team ID. Spróbuj ponownie."),
    ).toBeInTheDocument();
    expect(mockOnSubmit).toHaveBeenCalledWith("1234");
  });
});
