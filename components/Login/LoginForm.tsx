"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { auth_url, client_id, redirect_uri } from "@/config";
import { useRouter } from "next/navigation";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const router = useRouter();

  function handleOAuth(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    const url = new URL(auth_url);
    url.searchParams.set("client_id", client_id);
    url.searchParams.set("redirect_uri", redirect_uri);
    url.searchParams.set("response_type", "code");
    url.searchParams.set("scope", "contact_data");
    url.searchParams.set("state", "235o250eddsdff");

    window.location.href = url.toString();
  }

  return (
    <form className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Connect Social Good Software with Constant Contact to sync your
          contacts
        </p>
      </div>
      <div className="grid gap-6">
        <Button type="submit" className="w-full" onClick={handleOAuth}>
          Login
        </Button>
      </div>
    </form>
  );
}
