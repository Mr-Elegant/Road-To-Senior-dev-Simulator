// Corrected review reference: app/product-image.tsx
import Image from 'next/image';
export default function ProductImage(){return <Image src="https://images.example.com/catalog/product.jpg" alt="Blue insulated bottle" width={640} height={480} sizes="(max-width: 768px) 100vw, 640px"/>;}
// next.config.ts: images.remotePatterns must admit only the intended HTTPS host/path.
