import { HomeTemplate } from '@/components/templates/HomeTemplate';
import { Hero } from '@/components/organisms/Hero';
import { Features } from '@/components/organisms/Features';
import { CTA } from '@/components/organisms/CTA';

export default function Home() {
  return <HomeTemplate hero={<Hero />} features={<Features />} cta={<CTA />} />;
}
