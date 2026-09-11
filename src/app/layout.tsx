import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import { copy } from "@/data/copy";
import "./globals.css";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-cairo",
  display: "swap",
});

export const metadata: Metadata = {
  title: copy.meta.title,
  description: copy.meta.description,
  openGraph: {
    title: copy.meta.title,
    description: copy.meta.description,
    locale: "ar_PS",
    type: "website",
    images: [
      {
        url: "/images/ram/ram-hero.png",
        width: 1536,
        height: 1024,
        alt: copy.meta.ogAlt,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: copy.meta.title,
    description: copy.meta.description,
    images: ["/images/ram/ram-hero.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className={cairo.variable}>
      <body className="font-arabic antialiased">
        <a href="#main-content" className="skip-link">
          {copy.skipLink}
        </a>
        {children}
      </body>
    </html>
  );
}
