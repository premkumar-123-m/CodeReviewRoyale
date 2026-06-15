import { useState, useEffect } from 'react';
import { Trophy, Medal, Star, Flame } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';

export default function Leaderboard() {
    const [category, setCategory] = useState('Global');
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchLeaderboard() {
            setLoading(true);
            try {
                const q = query(
                    collection(db, 'profiles'),
                    orderBy('total_points', 'desc'),
                    limit(50)
                );
                
                const querySnapshot = await getDocs(q);
                
                const formatted = [];
                let rank = 1;
                querySnapshot.forEach((doc) => {
                    const user = doc.data();
                    formatted.push({
                        rank: rank++,
                        name: user.username || 'Unknown',
                        points: user.total_points || 0,
                        language: user.top_language || 'N/A'
                    });
                });
                
                setLeaderboardData(formatted);
            } catch (error) {
                console.error('Error fetching leaderboard:', error);
            } finally {
                setLoading(false);
            }
        }
        
        fetchLeaderboard();
    }, [category]);

    return (
        <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                <div className="flex-center" style={{
                    width: 80, height: 80,
                    margin: '0 auto 1.5rem',
                    background: 'linear-gradient(135deg, var(--warning), var(--danger))',
                    borderRadius: '50%',
                    boxShadow: '0 0 30px rgba(245, 158, 11, 0.4)'
                }}>
                    <Trophy size={40} color="white" />
                </div>
                <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Hall of Fame</h2>
                <p style={{ color: 'var(--text-muted)' }}>The top code reviewers across all languages</p>
            </div>

            {/* Categories */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                {['Global', 'React', 'Python', 'JavaScript', 'Java', 'HTML'].map(cat => (
                    <button
                        key={cat}
                        onClick={() => setCategory(cat)}
                        className="glass-button"
                        style={{
                            background: category === cat ? 'rgba(255,255,255,0.1)' : '',
                            borderColor: category === cat ? 'var(--warning)' : 'var(--border-color)',
                            color: category === cat ? 'var(--warning)' : 'var(--text-main)',
                            padding: '0.75rem 1.5rem'
                        }}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Leaderboard List */}
            <div className="glass-panel" style={{ padding: '0.5rem', minHeight: '300px' }}>
                {loading ? (
                    <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                        Loading champions...
                    </div>
                ) : leaderboardData.length === 0 ? (
                    <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                        No users found. Be the first to earn points!
                    </div>
                ) : leaderboardData.map((user, index) => (
                    <div key={user.name} style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '1.25rem 1.5rem',
                        borderBottom: index < leaderboardData.length - 1 ? '1px solid var(--border-color)' : 'none',
                        background: index === 0 ? 'rgba(245, 158, 11, 0.05)' : 'transparent',
                        transition: 'background 0.2s ease'
                    }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-panel-hover)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = index === 0 ? 'rgba(245, 158, 11, 0.05)' : 'transparent'}
                    >
                        {/* Rank */}
                        <div style={{ width: '60px', fontWeight: 700, fontSize: '1.2rem', color: index < 3 ? 'var(--warning)' : 'var(--text-muted)' }}>
                            #{user.rank}
                        </div>

                        {/* Medals for top 3 */}
                        <div style={{ width: '40px' }}>
                            {index === 0 && <Medal size={24} color="#fbbf24" />}
                            {index === 1 && <Medal size={24} color="#94a3b8" />}
                            {index === 2 && <Medal size={24} color="#b45309" />}
                        </div>

                        {/* User Info */}
                        <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 600, fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                {user.name}
                                {index === 0 && <Flame size={16} color="var(--danger)" />}
                            </div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                Top Language: <span style={{ color: 'var(--primary)' }}>{user.language}</span>
                            </div>
                        </div>

                        {/* Points */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '1.2rem', color: 'var(--success)' }}>
                            <Star size={18} />
                            {user.points.toLocaleString()} pt
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
