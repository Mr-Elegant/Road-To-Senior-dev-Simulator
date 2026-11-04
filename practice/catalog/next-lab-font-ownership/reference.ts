// Corrected review reference: app/layout.tsx
import localFont from 'next/font/local';
const ui=localFont({src:'./fonts/ui.woff2',display:'swap',variable:'--font-ui'});
export default function Layout({children}:{children:React.ReactNode}){return <html lang="en"><body className={ui.className}>{children}</body></html>;}
// Supply a licensed ui.woff2 at app/fonts/ui.woff2 in this lab.
