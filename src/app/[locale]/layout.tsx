import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ApiConfigProvider } from '@/providers/ApiConfigProvider';
import { AppLayout } from '@/providers/AppLayout';
import { I18nProvider } from '@/providers/I18nProvider';
import { GoogleAuthProvider } from '@/providers/GoogleAuthProvider';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { BuyMeACoffeeWidget } from '@/components/atoms/BuyMeACoffeeWidget';
import { ViewTransitions } from 'next-view-transitions';
import { Toaster } from 'sonner';
import '@/app/globals.css';

export const runtime = 'edge';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Ideological Atlas',
  description: 'Discover your true ideological position',
  icons: {
    icon: '/logo.png',
  },
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <ViewTransitions>
      <html lang={locale} suppressHydrationWarning>
        <head>
          {/* eslint-disable-next-line @next/next/no-page-custom-font, @next/next/google-font-display */}
          <link
            href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&amp;display=block"
            rel="stylesheet"
          />
        </head>
        <body className={`${inter.variable} bg-background text-foreground overflow-x-hidden font-sans`}>
          <I18nProvider locale={locale}>
            <ApiConfigProvider>
              <GoogleAuthProvider>
                <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                  <AppLayout>{children}</AppLayout>
                  <Toaster position="top-center" richColors />
                </ThemeProvider>
              </GoogleAuthProvider>
            </ApiConfigProvider>
          </I18nProvider>
          <BuyMeACoffeeWidget />
        </body>
      </html>
    </ViewTransitions>
  );
}
