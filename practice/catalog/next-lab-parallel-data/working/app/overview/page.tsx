import { getRevenue,getOrders } from '@/lib/overview';
export default async function Page(){const revenue=await getRevenue();const orders=await getOrders();return <p>{revenue}: {orders}</p>;}