// Corrected review reference: app/overview/page.tsx
import { getRevenue,getOrders } from '@/lib/overview';
export default async function Page(){const [revenue,orders]=await Promise.all([getRevenue(),getOrders()]);return <p>{revenue}: {orders}</p>;}
