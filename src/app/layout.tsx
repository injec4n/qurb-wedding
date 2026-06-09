import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
});

export const metadata: Metadata = {
  title: "قُرب - منصة دعوات الزفاف",
  description: "أنشئ موقع دعوة زفافك في دقائق - منصة احترافية لدعوات الزفاف بتصميم أنيق ومشاركة سهلة",
  keywords: ["قُرب", "دعوة زفاف", "زفاف", "دعوات", "RSVP", "موقع زفاف"],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={cairo.variable} suppressHydrationWarning>
      <body className="font-[family-name:var(--font-cairo)] antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
