// Corrected review reference: app/submit-button.tsx
'use client';
import { useFormStatus } from 'react-dom';
export default function SubmitButton(){const {pending}=useFormStatus();return <button disabled={pending}>{pending?'Saving…':'Save'}</button>;}
// Render <SubmitButton/> as a descendant of the parent <form action={serverAction}>.
