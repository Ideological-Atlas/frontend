import { useEffect } from 'react';
import { useAnimate, stagger } from 'framer-motion';

export function useMenuAnimation(isOpen: boolean) {
  const [scope, animate] = useAnimate();

  useEffect(() => {
    if (!scope.current) return;

    const menuAnimations = isOpen
      ? [
          [
            'nav',
            { transform: 'scale(1)', opacity: 1, filter: 'blur(0px)' },
            { type: 'spring', bounce: 0, duration: 0.3 },
          ],
          [
            'li',
            { transform: 'scale(1)', opacity: 1, filter: 'blur(0px)' },
            { delay: stagger(0.05, { from: 'first' }), at: '<' },
          ],
        ]
      : [
          [
            'li',
            { transform: 'scale(0.5)', opacity: 0, filter: 'blur(10px)' },
            { delay: stagger(0.05, { from: 'last' }), at: '<' },
          ],
          ['nav', { transform: 'scale(0.5)', opacity: 0, filter: 'blur(10px)' }, { at: '-0.1' }],
        ];

    // @ts-expect-error - Framer motion types complex match
    animate(menuAnimations);
  }, [isOpen, scope, animate]);

  return scope;
}
