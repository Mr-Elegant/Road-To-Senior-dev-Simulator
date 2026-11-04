// Corrected review reference: app/contact-form.tsx
'use client';
import { useActionState } from 'react';
import { saveContact } from './actions';
export default function Form(){const [state,action,pending]=useActionState(saveContact,{message:''});return <form action={action}><label>Email<input name="email" type="email" required/></label><button disabled={pending}>Save</button><p role="status">{state.message}</p></form>;}
// actions.ts exports an authorized server function accepting (previousState, formData) and returning {message:string}.
