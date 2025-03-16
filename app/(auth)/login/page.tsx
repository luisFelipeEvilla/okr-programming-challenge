import { GalleryVerticalEnd } from "lucide-react";

import { LoginForm } from "@/components/Login/LoginForm";

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2 w-[100vw]">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Social Good Software
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="relative hidden lg:block h-full bg-muted">
        <div className="flex flex-col gap-8 items-center justify-center h-full">
          <p className="text-center text-2xl text-muted-foreground justify-center">
            Helping Museums integrate with Altru by Blackbaud
          </p>
          <img
            src="/login-banner.png"
            alt="Image"
            className="inset-0 h-full w-full object-cover max-w-[600px] max-h-[420px]"
          />
        </div>
      </div>
    </div>
  );
}
