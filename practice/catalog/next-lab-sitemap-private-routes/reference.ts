// Corrected review reference: app/sitemap.ts
import type { MetadataRoute } from 'next';
export default function sitemap():MetadataRoute.Sitemap{return [{url:'https://example.com/',changeFrequency:'weekly'},{url:'https://example.com/docs',changeFrequency:'weekly'}];}
// Use a trusted configured public origin and published canonical records for dynamic entries.
