'use server';
export async function exportCustomers(){return await database.customer.findMany();}
// Proxy only matches /admin, but this action is used on /exports.