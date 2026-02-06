import { useCallback } from 'react';
import confetti from 'canvas-confetti';

export function useConfetti() {
  const triggerConfetti = useCallback((customColors?: string[]) => {
    let colors = customColors;

    if (!colors || colors.length === 0) {
      if (typeof window !== 'undefined') {
        const style = getComputedStyle(document.documentElement);
        const getHex = (prop: string) => style.getPropertyValue(prop).trim();

        const cssColors = [
          getHex('--primary'),
          getHex('--accent'),
          getHex('--secondary'),
          getHex('--destructive'),
          getHex('--strong-accent'),
        ].filter(c => c && c.startsWith('#'));

        if (cssColors.length > 0) {
          colors = cssColors;
        }
      }
    }

    if (!colors) {
      colors = ['#16a34a', '#3476d8', '#f1f5f9'];
    }

    const end = Date.now() + 3 * 1000;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.6 },
        colors: colors,
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.6 },
        colors: colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  }, []);

  return { triggerConfetti };
}
