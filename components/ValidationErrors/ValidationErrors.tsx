"use client";

import { AlertCircle } from "lucide-react";
import { ZodError } from "zod";
import { Alert, AlertTitle, AlertDescription } from "../ui/alert";

export default function ValidationErrors({ error }: { error: ZodError | null }) {
  if (!error) return null;

  const errorsByField = error.errors.reduce<Record<string, string[]>>(
    (acc, err) => {
      const field = err.path[0] as string;
      if (!acc[field]) {
        acc[field] = [];
      }
      acc[field].push(err.message);
      return acc;
    },
    {}
  );

  return (
    <Alert variant="destructive" className="mt-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle className="mb-2">Validation Errors</AlertTitle>
      <AlertDescription>
        <div className="mt-2 space-y-4">
          {Object.entries(errorsByField).map(([field, errors]) => (
            <div key={field} className="rounded-md bg-destructive/10 p-3">
              <h4 className="font-medium capitalize text-destructive">
                {field.replace(/_/g, " ")}
              </h4>
              <ul className="mt-1 list-disc pl-4">
                {errors.map((error, index) => (
                  <li key={index} className="text-sm text-destructive/90">
                    {error}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <p className="text-sm text-muted-foreground mt-2">
            Please fix these issues in your CSV file and try again.
          </p>
        </div>
      </AlertDescription>
    </Alert>
  );
}
