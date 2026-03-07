import React, { useEffect } from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-markup'; // used for HTML

export default function CodeBlock({ code, language }) {
    useEffect(() => {
        Prism.highlightAll();
    }, [code, language]);

    return (
        <div className="glass-panel" style={{
            position: 'relative',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)'
        }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1rem',
                background: 'rgba(0,0,0,0.2)',
                borderBottom: '1px solid var(--border-color)',
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                fontFamily: 'monospace'
            }}>
                <div style={{ display: 'flex', gap: '6px' }}>
                    <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f56' }} />
                    <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ffbd2e' }} />
                    <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#27c93f' }} />
                </div>
                <span style={{ marginLeft: '1rem', textTransform: 'uppercase' }}>{language}</span>
            </div>
            <pre style={{ margin: 0, padding: '1.5rem', background: 'transparent' }}>
                <code className={`language-${language.toLowerCase()}`}>
                    {code}
                </code>
            </pre>
        </div>
    );
}
