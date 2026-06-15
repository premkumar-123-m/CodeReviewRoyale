import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Send, Sparkles, MessageSquare, AlertTriangle, CheckCircle, ArrowLeft } from 'lucide-react';
import CodeBlock from '../components/CodeBlock';
import { db } from '../lib/firebase';
import { doc, getDoc, collection, query, where, orderBy, onSnapshot, addDoc, updateDoc, serverTimestamp, increment } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

export default function ReviewRoom() {
  const { id } = useParams();
  const { user } = useAuth();
  const [challenge, setChallenge] = useState(null);
  const [events, setEvents] = useState([]);
  const [comment, setComment] = useState('');
  const [category, setCategory] = useState('bug');
  const [showAiHint, setShowAiHint] = useState(false);
  const feedEndRef = useRef(null);

  useEffect(() => {
    async function fetchChallenge() {
      if (!id) return;
      const challengeRef = doc(db, 'challenges', id);
      const challengeSnap = await getDoc(challengeRef);
      if (challengeSnap.exists()) {
        const cData = challengeSnap.data();
        // Also fetch author profile if we needed username
        setChallenge({ id: challengeSnap.id, ...cData });
      }
    }
    fetchChallenge();
  }, [id]);

  useEffect(() => {
    if (!id) return;
    
    const q = query(
      collection(db, 'reviews'),
      where('challenge_id', '==', id),
      orderBy('created_at', 'asc')
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const newEvents = [];
      for (const docSnap of snapshot.docs) {
        const r = docSnap.data();
        let username = 'Unknown';
        
        // Fetch reviewer profile
        if (r.reviewer_id) {
          const profileSnap = await getDoc(doc(db, 'profiles', r.reviewer_id));
          if (profileSnap.exists()) {
            username = profileSnap.data().username || 'Unknown';
          }
        }
        
        let timeString = '';
        if (r.created_at) {
          // r.created_at could be a Firebase Timestamp
          const date = r.created_at.toDate ? r.created_at.toDate() : new Date();
          timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
        
        newEvents.push({
          id: docSnap.id,
          type: 'comment',
          user: username,
          reviewer_id: r.reviewer_id,
          text: r.text,
          category: r.category,
          time: timeString,
          isCurrentUser: user ? r.reviewer_id === user.uid : false,
          isAccepted: r.is_accepted || false
        });
      }
      setEvents(newEvents);
    });

    return () => unsubscribe();
  }, [id, user]);

  const handleAcceptReview = async (reviewId, reviewerId, category) => {
    try {
      // 1. Update the review to accepted
      await updateDoc(doc(db, 'reviews', reviewId), {
        is_accepted: true
      });
      
      // 2. Client-side trigger logic: Award points to the reviewer
      if (reviewerId && challenge) {
        const challengePoints = challenge.points || 0;
        
        await updateDoc(doc(db, 'profiles', reviewerId), {
          total_points: increment(challengePoints),
          reviews_completed: increment(1),
          bugs_found: increment(category === 'bug' ? 1 : 0),
          optimizations_suggested: increment(category === 'optimization' ? 1 : 0)
        });
      }
    } catch (err) {
      console.error("Error accepting review:", err);
      alert("Failed to accept review.");
    }
  };

  useEffect(() => {
    feedEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [events]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim() || !user || !id) return;

    try {
      await addDoc(collection(db, 'reviews'), {
        challenge_id: id,
        reviewer_id: user.uid,
        text: comment,
        category: category,
        is_accepted: false,
        created_at: serverTimestamp()
      });

      setComment('');
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review.");
    }
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
          <h2 style={{ fontSize: '1.5rem' }}>Reviewing: {challenge ? challenge.title : 'Loading...'}</h2>
          <span style={{
            background: 'rgba(236, 72, 153, 0.1)',
            color: 'var(--secondary)',
            padding: '0.25rem 0.75rem',
            borderRadius: '1rem',
            fontSize: '0.875rem',
            fontWeight: 600
          }}>
            {challenge ? challenge.active_reviewers : 0} Active Reviewers
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

          <CodeBlock code={challenge ? challenge.code_preview : 'Loading code...'} language={challenge ? challenge.language.toLowerCase() : 'javascript'} />
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
                      border: `1px solid ${event.isAccepted ? 'var(--success)' : event.isCurrentUser ? 'var(--primary)' : 'var(--border-color)'}`,
                      maxWidth: '90%',
                      boxShadow: event.isAccepted ? '0 0 10px rgba(16, 185, 129, 0.3)' : 'none'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
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
                          textTransform: 'uppercase'
                        }}>
                          {getCategoryIcon(event.category)} {event.category}
                        </div>
                        {event.isAccepted && (
                          <div style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', fontWeight: 600 }}>
                            <CheckCircle size={14} /> Accepted
                          </div>
                        )}
                      </div>
                      <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>{event.text}</p>
                      
                      {challenge && user && challenge.author_id === user.uid && !event.isAccepted && !event.isCurrentUser && (
                        <button 
                          onClick={() => handleAcceptReview(event.id, event.reviewer_id, event.category)}
                          style={{
                            background: 'rgba(16, 185, 129, 0.1)',
                            border: '1px solid var(--success)',
                            color: 'var(--success)',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            marginTop: '0.5rem',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(e) => e.target.style.background = 'var(--success)'}
                          onMouseLeave={(e) => e.target.style.background = 'rgba(16, 185, 129, 0.1)'}
                        >
                          Accept Review
                        </button>
                      )}
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
