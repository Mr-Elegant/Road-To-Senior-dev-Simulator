import type * as React from 'react';
export interface AppProps {
    post?: {
        title: string;
        author?: string;
        body: string;
        date?: string;
        tags?: string[];
    };
}
export default function App({ post }: AppProps = {}): React.JSX.Element { if (!post)
    return <p>Article unavailable</p>; return <article><h1>{post.title}</h1><p data-testid="author">{post.author || 'Unknown'}</p><time dateTime={post.date}>{post.date}</time><p data-testid="body">{post.body}</p></article>; }

