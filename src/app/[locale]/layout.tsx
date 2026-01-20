import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ApiConfigProvider } from '@/providers/ApiConfigProvider';
import { AppLayout } from '@/providers/AppLayout';
import { I18nProvider } from '@/providers/I18nProvider';
import { GoogleAuthProvider } from '@/providers/GoogleAuthProvider';
import { ThemeProvider } from '@/providers/ThemeProvider';
import 'material-symbols/outlined.css';
import '@/app/globals.css';

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
    <html lang={locale} suppressHydrationWarning>
      <body className={`${inter.variable} bg-background text-foreground overflow-x-hidden font-sans`}>
        <I18nProvider locale={locale}>
          <ApiConfigProvider>
            <GoogleAuthProvider>
              <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                <AppLayout>{children}</AppLayout>
              </ThemeProvider>
            </GoogleAuthProvider>
          </ApiConfigProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
