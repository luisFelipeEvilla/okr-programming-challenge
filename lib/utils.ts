import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export const getClientSideCookie = (name: string): string | undefined => {
  const cookieValue = document.cookie
      .split('; ')
      .find((row) => row.startsWith(`${name}=`))
      ?.split('=')[1];

 return cookieValue;
};

export const removeClientSideCookie = (name: string) => {
  document.cookie = `${name}=; path=/; max-age=0`;
};