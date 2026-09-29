import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Noto_Sans_Bengali } from "next/font/google";
import { cookies } from "next/headers";
import { Providers } from "@/components/providers";
import { APP_NAME, LANG_COOKIE } from "@/lib/config";
import { isLang } from "@/lib/i18n/lang";
import "./globals.css";

const geistSans = Geist({ variable: "--font-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const notoBengali = Noto_Sans_Bengali({ variable: "--font-bengali", subsets: ["bengali"], weight: ["400", "500", "600", "700"] });

export const metadata: Metadata = {
  title: { default: `${APP_NAME} · Courier management`, template: `%s · ${APP_NAME}` },
  description: "Send, manage and track parcels from pickup to doorstep.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafaff" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1020" },
  ],
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const langCookie = (await cookies()).get(LANG_COOKIE)?.value;
  const lang = isLang(langCookie) ? langCookie : "en";

  return (
    <html lang={lang} suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} ${notoBengali.variable}`}>
      <body className="min-h-dvh antialiased">
        <Providers lang={lang}>{children}</Providers>
      </body>
    </html>
  );
}
