'use client';
import { useFormStatus } from 'react-dom';
export default function Form(){const {pending}=useFormStatus();return <form><button disabled={pending}>Save</button></form>;}