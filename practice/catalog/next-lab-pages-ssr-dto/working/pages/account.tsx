export async function getServerSideProps(){return {props:{createdAt:new Date(),secret:'database-password'}};}
export default function Page(props:unknown){return <h1>Account</h1>;}