import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from 'next';

import './src/env';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {};

export default withNextIntl(nextConfig);
