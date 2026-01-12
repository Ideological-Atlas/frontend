import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';

interface I18nProviderProps {
  children: React.ReactNode;
  locale: string;
}

export async function I18nProvider({ children, locale }: I18nProviderProps) {
  if (!['es', 'en'].includes(locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      {children}
    </NextIntlClientProvider>
  );
}
