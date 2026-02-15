'use client';

import { useEffect } from 'react';

export function BuyMeACoffeeWidget() {
  useEffect(() => {
    if (document.getElementById('bmc-wbtn')) return;

    const script = document.createElement('script');
    script.setAttribute('data-name', 'BMC-Widget');
    script.setAttribute('data-cfasync', 'false');
    script.src = 'https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js';
    script.setAttribute('data-id', 'martingaldk');
    script.setAttribute('data-description', 'Support me on Buy me a book!');
    script.setAttribute('data-message', 'Help support this project!');
    script.setAttribute('data-color', '#16a34a');
    script.setAttribute('data-position', 'Right');
    script.setAttribute('data-x_margin', '18');
    script.setAttribute('data-y_margin', '18');
    script.async = true;

    script.onload = () => {
      const evt = new Event('DOMContentLoaded', {
        bubbles: true,
        cancelable: true,
      });
      window.document.dispatchEvent(evt);
    };

    document.body.appendChild(script);

    return () => {
      const existingScript = document.querySelector('script[data-name="BMC-Widget"]');
      if (existingScript) existingScript.remove();
      const widget = document.getElementById('bmc-wbtn');
      if (widget) widget.remove();
    };
  }, []);

  return null;
}
