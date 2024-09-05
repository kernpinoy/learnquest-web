import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { cn } from "~/lib/utils";

const fontSans = FontSans({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-inter",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          `min-h-screen bg-background font-sans antialiased`,
          fontSans.variable
        )}
      >
        {children}
      </body>
    </html>
  );
}
