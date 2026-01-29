'use client';

import { Link as ViewTransitionLink } from 'next-view-transitions';
import { useLocale } from 'next-intl';
import type { ComponentProps } from 'react';

type Props = ComponentProps<typeof ViewTransitionLink>;

export function Link({ href, onClick, children, ...props }: Props) {
  const locale = useLocale();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Lógica automática: Si vamos al inicio, activamos la animación de "volver"
    const targetPath = href.toString();
    const isHome = targetPath === `/${locale}` || targetPath === '/';

    if (isHome) {
      document.documentElement.classList.add('back-transition');
    } else {
      document.documentElement.classList.remove('back-transition');
    }

    if (onClick) onClick(e);
  };

  return (
    <ViewTransitionLink href={href} onClick={handleClick} {...props}>
      {children}
    </ViewTransitionLink>
  );
}
