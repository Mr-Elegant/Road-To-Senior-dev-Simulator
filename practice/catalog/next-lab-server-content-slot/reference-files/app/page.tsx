// Corrected review reference: app/page.tsx
import TogglePanel from './toggle-panel';
import SecretReport from './secret-report';
export default function Page(){return <TogglePanel><SecretReport/></TogglePanel>;}
// toggle-panel.tsx is a client leaf accepting children: React.ReactNode.
// secret-report.tsx remains a server module and authorizes its own data read.
