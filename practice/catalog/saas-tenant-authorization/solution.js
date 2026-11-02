function solution({ session, invoice }) {
  return { allowed: Boolean(session && invoice) };
}