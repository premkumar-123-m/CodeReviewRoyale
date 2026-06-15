import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Code2, Clock, Users, ArrowRight, Zap } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, query, orderBy, getDocs, doc, getDoc } from 'firebase/firestore';

export default function Dashboard() {
    const [filter, setFilter] = useState('All');
    const [challenges, setChallenges] = useState([]);
    const [loading, setLoading] = useState(true);
    const languages = ['All', 'React', 'JavaScript', 'Python', 'Java', 'HTML'];

    useEffect(() => {
        async function fetchChallenges() {
            try {
                const q = query(collection(db, 'challenges'), orderBy('created_at', 'desc'));
                const querySnapshot = await getDocs(q);
                
                const challengesData = [];
                for (const document of querySnapshot.docs) {
                    const c = document.data();
                    let authorName = 'Unknown User';
                    
                    if (c.author_id) {
                        const profileRef = doc(db, 'profiles', c.author_id);
                        const profileSnap = await getDoc(profileRef);
                        if (profileSnap.exists()) {
                            authorName = profileSnap.data().username || 'Unknown User';
                        }
                    }

                    challengesData.push({
                        id: document.id,
                        title: c.title,
                        language: c.language,
                        author: authorName,
                        difficulty: c.difficulty,
                        points: c.points,
                        activeReviewers: c.active_reviewers || 0,
                        timeLeft: c.time_left || '24h',
                        tags: c.tags || [],
                        codePreview: c.code_preview
                    });
                }
                setChallenges(challengesData);
            } catch (err) {
                console.error('Unexpected error:', err);
            } finally {
                setLoading(false);
            }
        }
        fetchChallenges();
    }, []);

    const filteredChallenges = filter === 'All'
        ? challenges
        : challenges.filter(c => c.language === filter);

    return (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Header Section */}
            <section style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '2rem',
                borderRadius: 'var(--radius-lg)',
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)',
                border: '1px solid rgba(255,255,255,0.05)'
            }}>
                <div>
                    <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Zap size={28} color="var(--primary)" />
                        Active Review Challenges
                    </h2>
                    <p style={{ color: 'var(--text-muted)' }}>Find bugs, suggest optimizations, and climb the leaderboard.</p>
                </div>
                <Link to="/submit" style={{ textDecoration: 'none' }}>
                    <button className="glass-button primary" style={{ padding: '0.75rem 1.5rem', fontSize: '1rem' }}>
                        + Submit Code for Review
                    </button>
                </Link>
            </section>

            {/* Filters */}
            <section style={{ display: 'flex', gap: '1rem' }}>
                {languages.map(lang => (
                    <button
                        key={lang}
                        onClick={() => setFilter(lang)}
                        className="glass-button"
                        style={{
                            background: filter === lang ? 'rgba(255,255,255,0.1)' : '',
                            borderColor: filter === lang ? 'var(--primary)' : 'var(--border-color)'
                        }}
                    >
                        {lang}
                    </button>
                ))}
            </section>

            {/* Challenge Grid */}
            <section style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                gap: '1.5rem'
            }}>
                {loading ? (
                    <div style={{ color: 'var(--text-muted)' }}>Loading challenges...</div>
                ) : filteredChallenges.length === 0 ? (
                    <div style={{ color: 'var(--text-muted)' }}>No challenges found.</div>
                ) : filteredChallenges.map(challenge => (
                    <div key={challenge.id} className="glass-panel" style={{
                        padding: '1.5rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem',
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                        cursor: 'pointer'
                    }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-4px)';
                            e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.5)';
                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                            e.currentTarget.style.borderColor = 'var(--border-color)';
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <span style={{
                                    fontSize: '0.75rem',
                                    color: 'var(--primary)',
                                    fontWeight: 600,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em'
                                }}>
                                    {challenge.language}
                                </span>
                                <h3 style={{ fontSize: '1.25rem', marginTop: '0.25rem' }}>{challenge.title}</h3>
                                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                                    by {challenge.author}
                                </p>
                            </div>
                            <div style={{
                                background: 'rgba(16, 185, 129, 0.1)',
                                color: 'var(--success)',
                                padding: '0.25rem 0.5rem',
                                borderRadius: 'var(--radius-sm)',
                                fontWeight: 600,
                                fontSize: '0.875rem'
                            }}>
                                +{challenge.points} pt
                            </div>
                        </div>

                        <div style={{
                            background: 'rgba(0,0,0,0.3)',
                            padding: '1rem',
                            borderRadius: 'var(--radius-sm)',
                            fontFamily: 'monospace',
                            fontSize: '0.875rem',
                            color: '#d4d4d8',
                            border: '1px solid rgba(255,255,255,0.05)'
                        }}>
                            <code>{challenge.codePreview}</code>
                        </div>

                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            {challenge.tags.map(tag => (
                                <span key={tag} style={{
                                    fontSize: '0.75rem',
                                    padding: '0.25rem 0.5rem',
                                    background: 'rgba(255,255,255,0.05)',
                                    borderRadius: '1rem',
                                    color: 'var(--text-muted)'
                                }}>
                                    {tag}
                                </span>
                            ))}
                        </div>

                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginTop: 'auto',
                            paddingTop: '1rem',
                            borderTop: '1px solid var(--border-color)'
                        }}>
                            <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                                <span className="flex-center" style={{ gap: '0.25rem' }}><Users size={14} /> {challenge.activeReviewers}</span>
                                <span className="flex-center" style={{ gap: '0.25rem' }}><Clock size={14} /> {challenge.timeLeft}</span>
                            </div>
                            <Link to={`/review/${challenge.id}`} style={{ textDecoration: 'none' }}>
                                <button className="glass-button" style={{
                                    color: 'var(--primary)',
                                    borderColor: 'rgba(99, 102, 241, 0.3)',
                                    background: 'rgba(99, 102, 241, 0.05)'
                                }}>
                                    Join Room <ArrowRight size={14} />
                                </button>
                            </Link>
                        </div>
                    </div>
                ))}
            </section>
        </div>
    );
}
