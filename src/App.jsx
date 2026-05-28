import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ReviewRoom from './pages/ReviewRoom';
import Leaderboard from './pages/Leaderboard';
import SubmitChallenge from './pages/SubmitChallenge';
import Register from './pages/Register';
import Login from './pages/Login';
import Profile from './pages/Profile';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="review/:id" element={<ReviewRoom />} />
            <Route path="leaderboard" element={<Leaderboard />} />
            <Route path="submit" element={<SubmitChallenge />} />
            <Route path="register" element={<Register />} />
            <Route path="login" element={<Login />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Routes>
      </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
