import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import FilesPreview from "./FilesPreview";

describe("FilesPreview", () => {
  it("renders file name correctly", () => {
    const mockFile = new File([""], "test.csv", { type: "text/csv" });
    render(<FilesPreview selectedFile={mockFile} />);
    expect(screen.getByText("test.csv")).toBeInTheDocument();
  });

  it("formats file size correctly for bytes", () => {
    const mockFile = new File([""], "test.csv", { type: "text/csv" });
    Object.defineProperty(mockFile, "size", { value: 500 });
    render(<FilesPreview selectedFile={mockFile} />);
    expect(screen.getByText("500 Bytes")).toBeInTheDocument();
  });

  it("formats file size correctly for kilobytes", () => {
    const mockFile = new File([""], "test.csv", { type: "text/csv" });
    Object.defineProperty(mockFile, "size", { value: 1024 * 2.5 });
    render(<FilesPreview selectedFile={mockFile} />);
    expect(screen.getByText("2.5 KB")).toBeInTheDocument();
  });

  it("formats file size correctly for megabytes", () => {
    const mockFile = new File([""], "test.csv", { type: "text/csv" });
    Object.defineProperty(mockFile, "size", { value: 1024 * 1024 * 1.5 });
    render(<FilesPreview selectedFile={mockFile} />);
    expect(screen.getByText("1.5 MB")).toBeInTheDocument();
  });

  it("handles zero file size", () => {
    const mockFile = new File([""], "test.csv", { type: "text/csv" });
    Object.defineProperty(mockFile, "size", { value: 0 });
    render(<FilesPreview selectedFile={mockFile} />);
    expect(screen.getByText("0 Bytes")).toBeInTheDocument();
  });

  it("renders check icon with correct styling", () => {
    const mockFile = new File([""], "test.csv", { type: "text/csv" });
    render(<FilesPreview selectedFile={mockFile} />);
    
    const checkIcon = screen.getByTestId("check-icon");
    expect(checkIcon).toHaveClass("ml-auto", "h-5", "w-5", "text-green-500");
  });
});
