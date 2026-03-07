import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Send, Sparkles, MessageSquare, AlertTriangle, CheckCircle, ArrowLeft } from 'lucide-react';
import CodeBlock from '../components/CodeBlock';

const SAMPLE_CODE = `
import React, { useState, useEffect } from 'react';

// A component that fetches user data
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  
  // Bug 1: Missing dependency in useEffect
  useEffect(() => {
    fetch(\`/api/users/\${userId}\`)
      .then(res => res.json())
      .then(data => setUser(data));
  }, []); // <--- array should include userId

  // Optimization 1: Inline functions causing unnecessary re-renders in children
  const handleSave = () => {
    console.log("Saving user:", user);
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="profile">
      <h1>{user.name}</h1>
      <p>{user.email}</p>
      
      {/* Readability: Can use a cleaner button component */}
      <button onClick={handleSave} style={{ marginTop: 10, padding: 5 }}>
        Save Profile
      </button>
    </div>
  );
}`;

const INITIAL_EVENTS = [
  { id: 1, type: 'join', user: 'Alex JS', time: '1m ago' },
  { id: 2, type: 'comment', user: 'Alex JS', text: 'I think there might be a dependency array issue here.', category: 'bug', time: '30s ago' },
];

export default function ReviewRoom() {
  const { id } = useParams();
  const [events, setEvents] = useState(INITIAL_EVENTS);
  const [comment, setComment] = useState('');
  const [category, setCategory] = useState('bug');
  const [showAiHint, setShowAiHint] = useState(false);
  const feedEndRef = useRef(null);

  useEffect(() => {
    feedEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [events]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setEvents(prev => [...prev, {
        id: Date.now(),
        type: 'comment',
        user: 'Sarah Dev',
        text: 'The handleSave function will be recreated on every render.',
        category: 'optimization',
        time: 'just now'
      }]);
    }, 15000);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setEvents(prev => [...prev, {
      id: Date.now(),
      type: 'comment',
      user: 'You',
      text: comment,
      category,
      time: 'just now',
      isCurrentUser: true
    }]);
    setComment('');
  };

  const getCategoryColor = (cat) => {
    switch (cat) {
      case 'bug': return 'var(--danger)';
      case 'optimization': return 'var(--warning)';
      case 'readability': return 'var(--success)';
      default: return 'var(--primary)';
    }
  };

  const getCategoryIcon = (cat) => {
    switch (cat) {
      case 'bug': return <AlertTriangle size={14} />;
      case 'optimization': return <Zap size={14} />;
      case 'readability': return <CheckCircle size={14} />;
      default: return <MessageSquare size={14} />;
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', height: 'calc(100vh - 120px)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link to="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }} className="flex-center">
            <ArrowLeft size={20} />
          </Link>
          <h2 style={{ fontSize: '1.5rem' }}>Reviewing: UserProfile Component</h2>
          <span style={{
            background: 'rgba(236, 72, 153, 0.1)',
            color: 'var(--secondary)',
            padding: '0.25rem 0.75rem',
            borderRadius: '1rem',
            fontSize: '0.875rem',
            fontWeight: 600
          }}>
            3 Active Reviewers
          </span>
        </div>

        <button
          className="glass-button"
          style={{
            background: showAiHint ? 'var(--primary)' : 'rgba(99, 102, 241, 0.1)',
            borderColor: 'var(--primary)',
            color: showAiHint ? 'white' : 'var(--primary)'
          }}
          onClick={() => setShowAiHint(!showAiHint)}
        >
          <Sparkles size={16} />
          {showAiHint ? 'Hide AI Hints' : 'Get AI Hint (costs 10pt)'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', flex: 1, minHeight: 0 }}>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto', paddingRight: '0.5rem' }}>
          {showAiHint && (
            <div className="glass-panel animate-fade-in" style={{
              padding: '1rem',
              borderLeft: '4px solid var(--primary)',
              background: 'linear-gradient(90deg, rgba(99, 102, 241, 0.1) 0%, transparent 100%)'
            }}>
              <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>
                <Sparkles size={16} /> AI Assistant Hint
              </h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Take a close look at the <code>useEffect</code> hook on line 8. What happens when the <code>userId</code> prop changes?
              </p>
            </div>
          )}

          <CodeBlock code={SAMPLE_CODE} language="jsx" />
        </div>

        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div style={{
            padding: '1rem',
            borderBottom: '1px solid var(--border-color)',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <Users size={18} /> Room Activity
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {events.map(event => (
              <div key={event.id} className="animate-fade-in" style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.25rem',
                alignItems: event.isCurrentUser ? 'flex-end' : 'flex-start'
              }}>
                {event.type === 'join' ? (
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontStyle: 'italic', width: '100%', textAlign: 'center' }}>
                    {event.user} joined the room • {event.time}
                  </div>
                ) : (
                  <>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{event.user}</span>
                      <span>{event.time}</span>
                    </div>
                    <div style={{
                      background: event.isCurrentUser ? 'rgba(99, 102, 241, 0.15)' : 'var(--bg-panel-hover)',
                      padding: '0.75rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      borderTopRightRadius: event.isCurrentUser ? 0 : 'var(--radius-md)',
                      borderTopLeftRadius: !event.isCurrentUser ? 0 : 'var(--radius-md)',
                      border: `1px solid ${event.isCurrentUser ? 'var(--primary)' : 'var(--border-color)'}`,
                      maxWidth: '90%'
                    }}>
                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        fontSize: '0.7rem',
                        padding: '0.15rem 0.4rem',
                        borderRadius: '4px',
                        background: `var(--${event.category === 'bug' ? 'danger' : event.category === 'optimization' ? 'warning' : 'success'})`,
                        color: '#000',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        marginBottom: '0.5rem'
                      }}>
                        {getCategoryIcon(event.category)} {event.category}
                      </div>
                      <p style={{ fontSize: '0.9rem' }}>{event.text}</p>
                    </div>
                  </>
                )}
              </div>
            ))}
            <div ref={feedEndRef} />
          </div>

          <form onSubmit={handleSubmit} style={{ padding: '1rem', borderTop: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {['bug', 'optimization', 'readability'].map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  style={{
                    flex: 1,
                    padding: '0.4rem',
                    background: category === cat ? getCategoryColor(cat) : 'transparent',
                    color: category === cat ? '#000' : 'var(--text-muted)',
                    border: `1px solid ${category === cat ? getCategoryColor(cat) : 'var(--border-color)'}`,
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="Suggest an improvement..."
                style={{
                  flex: 1,
                  background: 'rgba(0,0,0,0.2)',
                  border: '1px solid var(--border-color)',
                  color: 'white',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  fontFamily: 'inherit',
                  outline: 'none'
                }}
              />
              <button type="submit" className="glass-button primary" style={{ padding: '0 1rem' }}>
                <Send size={18} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function Users({ size }) { return <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>; }
function Zap({ size }) { return <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>; }
