import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';
import { brand } from '@/config/brand';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: brand.meta.title,
    template: brand.meta.titleTemplate,
  },
  description: brand.description,
  keywords: [...brand.meta.keywords],
  applicationName: brand.name,
  icons: {
    icon: [
      { url: brand.icon16, sizes: '16x16', type: 'image/png' },
      { url: brand.icon32, sizes: '32x32', type: 'image/png' },
    ],
    apple: brand.appleTouchIcon,
    shortcut: brand.favicon,
  },
  openGraph: {
    title: brand.meta.title,
    description: brand.description,
    siteName: brand.name,
    images: [
      {
        url: brand.ogImage,
        width: 1200,
        height: 630,
        alt: brand.name,
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: brand.meta.title,
    description: brand.description,
    images: [brand.ogImage],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content={brand.colors.dark} />
        <link rel="icon" href={brand.favicon} />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
