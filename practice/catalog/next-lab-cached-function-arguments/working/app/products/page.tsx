import { cookies } from 'next/headers';
export async function Products(){'use cache';const tenant=(await cookies()).get('tenant')?.value;return <p>{tenant}</p>;}