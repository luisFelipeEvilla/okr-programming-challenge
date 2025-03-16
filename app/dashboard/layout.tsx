import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { AppSidebar } from "@/components/AppSidebar/AppSidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import Providers from "../providers";
import Header from "@/components/Header/Header";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
import { ToastContainer } from "react-toastify";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Contact List",
  description: "Contact List",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <AppSidebar />
          <SidebarInset>
            <Header />
            <div className="max-w-full p-4">
              {children}
            </div>
            <ToastContainer />
          </SidebarInset>
        </Providers>
      </body>
    </html>
  );
}
