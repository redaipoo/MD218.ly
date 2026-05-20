import type { Metadata } from "next";
import { Tajawal } from "next/font/google";
import "./globals.css";

const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "700", "800", "900"],
  variable: "--font-tajawal",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MD218.LY | بطاقات رقمية وشحن فوري",
  description:
    "MD218.LY - متجرك الأول لبطاقات الألعاب والهدايا الرقمية. Xbox, PlayStation, Steam, Apple, Netflix وأكثر. اطلب عبر واتساب!",
  keywords: [
    "بطاقات رقمية",
    "شحن فوري",
    "اكس بوكس",
    "بلايستيشن",
    "ستيم",
    "ابل",
    "نتفلكس",
    "ببجي",
    "ليبيا",
    "MD218.LY",
  ],
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "MD218.LY | بطاقات رقمية وشحن فوري",
    description:
      "متجرك الأول لبطاقات الألعاب والهدايا الرقمية. اطلب عبر واتساب!",
    type: "website",
    locale: "ar_LY",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={tajawal.variable}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo.png" type="image/png" />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}

