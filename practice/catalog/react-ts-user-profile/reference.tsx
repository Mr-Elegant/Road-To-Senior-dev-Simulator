import type * as React from 'react';
export interface AppProps {
    profile?: {
        name: string;
        email?: string;
        bio?: string;
        avatar?: string;
    };
}
export default function App({ profile }: AppProps = {}): React.JSX.Element { if (!profile)
    return <p>Profile unavailable</p>; return <section><h1>{profile.name}</h1>{profile.avatar ? <img src={profile.avatar} alt={profile.name}/> : <span data-testid="avatar-fallback">{Array.from(profile.name)[0]?.toUpperCase() || '?'}</span>}<p data-testid="bio">{profile.bio || 'No biography'}</p></section>; }

