import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import Papa from "papaparse";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const getClientSideCookie = (name: string): string | undefined => {
  const cookieValue = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`))
    ?.split("=")[1];

  return cookieValue;
};

export const removeClientSideCookie = (name: string) => {
  document.cookie = `${name}=; path=/; max-age=0`;
};

export async function readCsvFile(
  file: File,
  onComplete: (data: ArrayIterator<[number, unknown]>) => void,
  onError: (error: Error) => void
) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const csv = e.target?.result;
    if (typeof csv === "string") {
      Papa.parse(csv, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          onComplete(results.data.entries());
        },
        error: (error: Error) => {
          onError(error);
        },
      });
    }
  };
  reader.readAsText(file);
}
