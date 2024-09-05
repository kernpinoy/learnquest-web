import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { cn } from "~/lib/utils";
import ThemeProvider from "~/providers/use-theme";

const fontSans = FontSans({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-sans",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(`min-h-screen font-sans antialiased`, fontSans.variable)}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
