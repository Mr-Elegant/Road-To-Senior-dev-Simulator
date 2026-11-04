// Corrected review reference: app/hero.tsx
import Image from 'next/image';
export default function Hero(){return <Image src="/hero.jpg" alt="Product workspace" width={1200} height={800} sizes="100vw" preload/>;}
// Supply public/hero.jpg; use this 16-specific preload only for the deliberate critical image.
