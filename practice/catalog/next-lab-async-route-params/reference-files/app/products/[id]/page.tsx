// Corrected review reference: app/products/[id]/page.tsx
export default async function Page({params}: {params:Promise<{id:string}>}) {
  const {id}=await params;
  return <h1>Product {id}</h1>;
}
