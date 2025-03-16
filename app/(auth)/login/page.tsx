import { GalleryVerticalEnd, CheckCircle2 } from "lucide-react";
import { LoginForm } from "@/components/Login/LoginForm";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2 w-full">
      {/* Left Column - Login Form */}
      <div className="flex flex-col justify-between gap-8 p-8 md:p-12 lg:p-20 bg-white dark:bg-slate-950">
        <div>
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-purple-600 via-purple-500 to-blue-500 text-white shadow-lg shadow-purple-500/25 group-hover:shadow-purple-500/40 transition-all duration-300">
              <GalleryVerticalEnd className="size-5" />
            </div>
            <span className="text-xl font-semibold bg-gradient-to-r from-purple-600 via-purple-500 to-blue-500 bg-clip-text text-transparent">
              Social Good Software
            </span>
          </Link>
        </div>
        
        <div className="flex-1 flex items-center justify-center w-full max-w-md mx-auto">
          <div className="w-full space-y-8">
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-600 via-purple-500 to-blue-500 bg-clip-text text-transparent">
                Welcome back
              </h1>
              <p className="text-base text-slate-600 dark:text-slate-400">
                Sign in to your account to continue
              </p>
            </div>
            <LoginForm />
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Need help? Contact us at{" "}
            <a 
              href="mailto:hello@socialgoodsoftware.com" 
              className="font-medium text-purple-600 hover:text-purple-500 dark:text-purple-400 dark:hover:text-purple-300 transition-colors"
            >
              hello@socialgoodsoftware.com
            </a>
          </p>
        </div>
      </div>

      {/* Right Column - Banner */}
      <div className="relative hidden lg:block bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-purple-950/40 dark:via-slate-950 dark:to-blue-950/40">
        <div className="absolute inset-0 bg-grid-black/[0.02] -z-10" />
        <div className="flex flex-col gap-12 items-center justify-center h-full p-20">
          <div className="space-y-6 text-center max-w-2xl">
            <h2 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-purple-600 via-purple-500 to-blue-500 bg-clip-text text-transparent">
              Helping Museums integrate with Altru by Blackbaud
            </h2>
            <p className="text-xl leading-relaxed text-slate-600 dark:text-slate-400">
              The most complete integration solution for Altru. You can now easily dedupe, build, validate, convert, retain, customize, and innovate.
            </p>
          </div>
          
          <div className="relative w-full max-w-4xl">
            {/* Main Desktop Frame */}
            <div className="relative rounded-2xl overflow-hidden bg-white dark:bg-slate-900 shadow-[0_20px_70px_-15px_rgba(0,0,0,0.3)] ring-1 ring-black/[0.05] dark:ring-white/[0.05]">
              <div className="absolute top-0 inset-x-0 h-12 bg-slate-100 dark:bg-slate-800 flex items-center px-4 gap-2">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
              </div>
              <div className="pt-12">
                <Image
                  src="/Untitled-1.png"
                  alt="Social Good Software Dashboard"
                  width={1200}
                  height={675}
                  className="w-full object-cover"
                  priority
                  quality={100}
                />
              </div>
            </div>
            
            {/* Floating Elements */}
            <div className="absolute -bottom-6 -right-6 w-48 h-32 rounded-xl overflow-hidden shadow-lg ring-1 ring-black/[0.05] dark:ring-white/[0.05] bg-white dark:bg-slate-900 transform rotate-6">
              <Image
                src="/Untitled-1.png"
                alt="Mobile View"
                width={400}
                height={300}
                className="w-full h-full object-cover"
                quality={90}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 w-full max-w-2xl">
            <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/50 dark:bg-white/[0.03] backdrop-blur-sm ring-1 ring-black/[0.03] dark:ring-white/[0.03]">
              <CheckCircle2 className="size-5 text-purple-500" />
              <span className="font-medium text-slate-700 dark:text-slate-300">Deduplication</span>
            </div>
            <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/50 dark:bg-white/[0.03] backdrop-blur-sm ring-1 ring-black/[0.03] dark:ring-white/[0.03]">
              <CheckCircle2 className="size-5 text-purple-500" />
              <span className="font-medium text-slate-700 dark:text-slate-300">Calendar Builder</span>
            </div>
            <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/50 dark:bg-white/[0.03] backdrop-blur-sm ring-1 ring-black/[0.03] dark:ring-white/[0.03]">
              <CheckCircle2 className="size-5 text-purple-500" />
              <span className="font-medium text-slate-700 dark:text-slate-300">Email Designer</span>
            </div>
            <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/50 dark:bg-white/[0.03] backdrop-blur-sm ring-1 ring-black/[0.03] dark:ring-white/[0.03]">
              <CheckCircle2 className="size-5 text-purple-500" />
              <span className="font-medium text-slate-700 dark:text-slate-300">Barcode Scanner</span>
            </div>
          </div>

          <div className="p-6 rounded-xl bg-gradient-to-r from-purple-500/[0.08] to-blue-500/[0.08] backdrop-blur-sm ring-1 ring-purple-500/10 dark:ring-purple-400/10">
            <p className="text-center text-base font-medium text-slate-700 dark:text-slate-300">
              Unlock Altru to its full potential and book your demo today.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
