/** @type {import("prettier").Config} */
const config = {
  arrowParens: 'avoid',
  endOfLine: 'lf',
  printWidth: 120,
  proseWrap: 'always',
  singleQuote: true,
  trailingComma: 'all',
  semi: true,
  tabWidth: 2,
  useTabs: false,
  plugins: ['prettier-plugin-tailwindcss'],
};

export default config;
