import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { BrandProvider } from "@/components/brand-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sphere Demo",
  description: "A demo application for Sphere Ramp",
};

const themeScript = `
(() => {
  try {
    var brand = null;
    try {
      var raw = localStorage.getItem('brand-config');
      if (raw) brand = JSON.parse(raw);
    } catch {}

    var allowDark = !brand || brand.allowDarkMode !== false;
    var stored = localStorage.getItem('theme');
    var mode = stored === 'dark' && allowDark ? 'dark' : stored === 'light' ? 'light' : (brand && brand.defaultMode) || 'light';
    document.documentElement.classList.toggle('dark', mode === 'dark');

    if (brand && typeof brand.primary === 'string') {
      var s = document.documentElement.style;
      if (brand.radius != null) s.setProperty('--radius', brand.radius / 16 + 'rem');
      if (brand.fontFamily) s.setProperty('--font-geist-sans', brand.fontFamily);
    }
  } catch {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <BrandProvider>{children}</BrandProvider>
      </body>
    </html>
  );
}
