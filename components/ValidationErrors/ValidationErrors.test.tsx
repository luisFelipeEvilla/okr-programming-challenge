import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ValidationErrors from "./ValidationErrors";
import { ZodError } from "zod";
import { z } from "zod";

describe("ValidationErrors", () => {
  it("renders validation errors correctly", () => {
    const schema = z.object({
      email: z.string().email("Invalid email format"),
      name: z.string().min(3, "Name must be at least 3 characters"),
    });

    const testData = {
      email: "invalid-email",
      name: "Jo",
    };

    const error = new ZodError(schema.safeParse(testData).error?.errors || []);

    render(<ValidationErrors error={error} />);

    // Check main error message
    expect(screen.getByText("Validation Errors")).toBeInTheDocument();
    expect(screen.getByText("Please fix these issues in your CSV file and try again.")).toBeInTheDocument();

    // Check field-specific errors
    expect(screen.getByText("email")).toBeInTheDocument();
    expect(screen.getByText("Invalid email format")).toBeInTheDocument();
    expect(screen.getByText("name")).toBeInTheDocument();
    expect(screen.getByText("Name must be at least 3 characters")).toBeInTheDocument();
  });

  it("handles multiple errors for the same field", () => {
    const schema = z.object({
      email: z.string()
        .email("Invalid email format")
        .min(5, "Email must be at least 5 characters"),
    });

    const testData = {
      email: "a@b",
    };

    const error = new ZodError(schema.safeParse(testData).error?.errors || []);

    render(<ValidationErrors error={error} />);

    const emailErrors = screen.getAllByText(/Invalid email format|Email must be at least 5 characters/);
    expect(emailErrors).toHaveLength(2);
  });

  it("formats field names correctly", () => {
    const schema = z.object({
      first_name: z.string().min(1, "First name is required"),
      email_address: z.string().email("Invalid email"),
    });

    const testData = {
      first_name: "",
      email_address: "invalid",
    };

    const error = new ZodError(schema.safeParse(testData).error?.errors || []);

    render(<ValidationErrors error={error} />);

    expect(screen.getByText("first name")).toBeInTheDocument();
    expect(screen.getByText("email address")).toBeInTheDocument();
  });

  it("renders empty when no errors are provided", () => {
    render(<ValidationErrors error={null} />);

    expect(screen.queryByText("Validation Errors")).not.toBeInTheDocument();
  });

  it("applies correct styling classes", () => {
    const schema = z.object({
      email: z.string().email("Invalid email"),
    });

    const testData = {
      email: "invalid",
    };

    const error = new ZodError(schema.safeParse(testData).error?.errors || []);

    render(<ValidationErrors error={error} />);

    // Check for destructive variant classes
    expect(screen.getByText("email")).toHaveClass("text-destructive");
    expect(screen.getByText("Invalid email")).toHaveClass("text-destructive/90");
  });
});
