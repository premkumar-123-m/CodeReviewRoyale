import { Outlet, Link, useLocation } from 'react-router-dom';
import { Terminal, Trophy, User, Code2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import '../index.css';

export default function Layout() {
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen">
      {/* Navigation Bar */}
      <nav className="glass-panel" style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTop: 'none',
        borderLeft: 'none',
        borderRight: 'none',
        borderRadius: 0
      }}>
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="flex-center" style={{ gap: '0.75rem' }}>
            <div style={{
              background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
              padding: '0.5rem',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Terminal size={20} color="white" />
            </div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.025em' }}>
              CodeReview<span style={{ color: 'var(--primary)' }}>Royale</span>
            </h1>
          </div>
        </Link>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/">
            <button className={`glass-button ${isActive('/') ? 'primary' : ''}`}>
              <Code2 size={16} /> Challenges
            </button>
          </Link>
          <Link to="/leaderboard">
            <button className={`glass-button ${isActive('/leaderboard') ? 'primary' : ''}`}>
              <Trophy size={16} /> Leaderboard
            </button>
          </Link>

          <div style={{ width: '1px', background: 'var(--border-color)', margin: '0 0.5rem' }} />

          {user ? (
            <Link to="/profile">
              <button className={`glass-button ${isActive('/profile') ? 'primary' : ''}`}>
                <User size={16} /> My Profile
              </button>
            </Link>
          ) : (
            <>
              <Link to="/login">
                <button className={`glass-button ${isActive('/login') ? 'primary' : ''}`}>
                  Log In
                </button>
              </Link>
              <Link to="/register">
                <button className={`glass-button ${isActive('/register') ? 'primary' : ''}`}>
                  Register
                </button>
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Main Content Area */}
      <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', animation: 'fadeIn 0.5s ease' }}>
        <Outlet />
      </main>
    </div>
  );
}
