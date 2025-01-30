import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { cn } from "~/lib/utils";
import { ThemeProvider } from "~/providers/theme-provider";
import { Toaster } from "~/components/ui/sonner";
import ReactQueryProvider from "~/providers/react-query-client";
import type { Metadata } from "next";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "LearnQuest | Login",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <ReactQueryProvider>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
            {children}
          </ThemeProvider>
        </ReactQueryProvider>
        <Toaster richColors closeButton position="top-right" />
      </body>
    </html>
  );
}
