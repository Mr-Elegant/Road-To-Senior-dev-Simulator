import type * as React from 'react';
export interface AppProps {
}
interface Task {
    id: string;
    state: 'queued' | 'running' | 'completed';
    progress: number;
}
import { useState, useRef } from 'react';
export default function App(): React.JSX.Element { const [tasks, setTasks] = useState<Task[]>([]), next = useRef(1); function schedule(list: Task[]): Task[] { let active = list.filter(t => t.state === 'running').length; return list.map<Task>(t => { if (t.state === 'queued' && active < 2) {
    active++;
    return { ...t, state: 'running' };
} return t; }); } return <section><button data-action="add" onClick={() => { const id = String(next.current++); setTasks(old => schedule([...old, { id, state: 'queued', progress: 0 }])); }}>Add task</button><button data-action="advance" onClick={() => setTasks(old => schedule(old.map(t => t.state === 'running' ? { ...t, progress: Math.min(100, t.progress + 50), state: t.progress + 50 >= 100 ? 'completed' : 'running' } : t)))}>Advance</button><ul>{tasks.map(t => <li key={t.id} data-task={t.id}>{t.state + ':' + t.progress}</li>)}</ul></section>; }

