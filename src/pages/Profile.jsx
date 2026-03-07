import { useState } from 'react';
import { User, Trophy, Star, History, Code2, Award, Zap, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const MOCK_PROFILE = {
    username: 'CodeNinja_99',
    joinDate: 'Joined March 2024',
    totalPoints: 8450,
    rank: 'Senior Reviewer',
    topLanguage: 'React',
    reviewsCompleted: 142,
    bugsFound: 38,
    optimizationsSuggested: 65,
    recentActivity: [
        { id: 1, action: 'Found Bug', challenge: 'Optimize React Re-renders', points: '+50', time: '2 hours ago', type: 'bug' },
        { id: 2, action: 'Suggested Optimization', challenge: 'Fix Memory Leak in WebSocket Client', points: '+30', time: '1 day ago', type: 'optimization' },
        { id: 3, action: 'Completed Review', challenge: 'Refactor Authentication Flow', points: '+150', time: '3 days ago', type: 'review' }
    ]
};

export default function Profile() {
    const [activeTab, setActiveTab] = useState('overview');

    return (
        <div className="animate-fade-in" style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>

            {/* Header Section */}
            <div className="glass-panel" style={{
                padding: '3rem 2rem',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                gap: '2rem'
            }}>
                {/* Background Glow */}
                <div style={{
                    position: 'absolute',
                    top: '-50px',
                    left: '-50px',
                    width: '300px',
                    height: '300px',
                    background: 'var(--primary)',
                    filter: 'blur(120px)',
                    opacity: 0.15,
                    zIndex: 0
                }} />

                {/* Avatar Area */}
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <div className="flex-center" style={{
                        width: 120, height: 120,
                        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(236, 72, 153, 0.2))',
                        borderRadius: '50%',
                        border: '2px solid rgba(255,255,255,0.1)'
                    }}>
                        <User size={60} color="var(--primary)" />
                    </div>
                    <div className="flex-center" style={{
                        position: 'absolute',
                        bottom: -10,
                        right: -10,
                        background: 'linear-gradient(135deg, var(--warning), var(--danger))',
                        width: 40, height: 40,
                        borderRadius: '50%',
                        border: '3px solid var(--bg-main)'
                    }}>
                        <Award size={20} color="white" />
                    </div>
                </div>

                {/* User Info */}
                <div style={{ zIndex: 1, flex: 1 }}>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '0.25rem', letterSpacing: '-0.02em' }}>{MOCK_PROFILE.username}</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '1rem' }}>
                        {MOCK_PROFILE.rank} • {MOCK_PROFILE.joinDate}
                    </p>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <div style={{
                            background: 'rgba(16, 185, 129, 0.1)',
                            border: '1px solid rgba(16, 185, 129, 0.2)',
                            color: 'var(--success)',
                            padding: '0.5rem 1rem',
                            borderRadius: 'var(--radius-full)',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}>
                            <Star size={16} /> {MOCK_PROFILE.totalPoints.toLocaleString()} Points
                        </div>
                        <div style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            color: 'var(--text-main)',
                            padding: '0.5rem 1rem',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '0.9rem'
                        }}>
                            Top Language: <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{MOCK_PROFILE.topLanguage}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div className="flex-center" style={{ width: 50, height: 50, borderRadius: '50%', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)' }}>
                        <Code2 size={24} />
                    </div>
                    <div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{MOCK_PROFILE.reviewsCompleted}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Reviews Completed</div>
                    </div>
                </div>

                <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div className="flex-center" style={{ width: 50, height: 50, borderRadius: '50%', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)' }}>
                        <Zap size={24} />
                    </div>
                    <div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{MOCK_PROFILE.bugsFound}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Bugs Squashed</div>
                    </div>
                </div>

                <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div className="flex-center" style={{ width: 50, height: 50, borderRadius: '50%', background: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)' }}>
                        <Trophy size={24} />
                    </div>
                    <div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{MOCK_PROFILE.optimizationsSuggested}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Optimizations</div>
                    </div>
                </div>
            </div>

            {/* Tabs & Content */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                    <button
                        onClick={() => setActiveTab('overview')}
                        style={{
                            background: 'transparent', border: 'none', color: activeTab === 'overview' ? 'var(--primary)' : 'var(--text-muted)',
                            fontWeight: activeTab === 'overview' ? 600 : 400, fontSize: '1.1rem', padding: '0.5rem 1rem', cursor: 'pointer',
                            borderBottom: activeTab === 'overview' ? '2px solid var(--primary)' : '2px solid transparent',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        Activity History
                    </button>
                    {/* Add more tabs like Achievements, Badges, etc. in the future */}
                </div>

                {activeTab === 'overview' && (
                    <div className="glass-panel" style={{ padding: '0' }}>
                        {MOCK_PROFILE.recentActivity.map((activity, index) => (
                            <div key={activity.id} style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                padding: '1.5rem', borderBottom: index !== MOCK_PROFILE.recentActivity.length - 1 ? '1px solid var(--border-color)' : 'none',
                                transition: 'background 0.2s ease'
                            }}
                                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-panel-hover)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                    <div className="flex-center" style={{
                                        width: 40, height: 40, borderRadius: '50%',
                                        background: activity.type === 'bug' ? 'rgba(239,68,68,0.1)' : activity.type === 'optimization' ? 'rgba(245,158,11,0.1)' : 'rgba(99,102,241,0.1)',
                                        color: activity.type === 'bug' ? 'var(--danger)' : activity.type === 'optimization' ? 'var(--warning)' : 'var(--primary)',
                                    }}>
                                        <History size={20} />
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '0.25rem' }}>
                                            {activity.action}
                                        </div>
                                        <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            in <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>{activity.challenge}</Link>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ color: 'var(--success)', fontWeight: 700, fontSize: '1.1rem' }}>{activity.points} pt</div>
                                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{activity.time}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

        </div>
    );
}
