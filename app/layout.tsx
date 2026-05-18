import { Geist_Mono, Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { Providers } from "./providers";

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata = {
  title: "Pafyra — Perfect HTML to PDF API",
  description: "Generate highly professional PDFs from HTML with full Arabic (RTL) typography, async queuing, and usage metrics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased selection:bg-primary/20", fontSans.variable, fontMono.variable)}
    >
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
