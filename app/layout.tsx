import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "@/styles/globals.css";
import { ThemeProvider } from "@/components/common/ThemeProvider";
import { SessionProvider } from "@/components/auth/SessionProvider";
import { LayoutShell } from "@/components/common/LayoutShell";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: "Nutyum | Premium Makhana Snacks",
  description: "Discover Nutyum's premium makhana snacks — healthy, bold, and crafted with care.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${cormorant.variable} ${manrope.variable} antialiased min-h-screen flex flex-col`}
        style={
          {
            "--font-heading": "var(--font-cormorant)",
            "--font-body": "var(--font-manrope)",
          } as React.CSSProperties
        }
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <SessionProvider>
            <LayoutShell>{children}</LayoutShell>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}


