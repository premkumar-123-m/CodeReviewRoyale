import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ReviewRoom from './pages/ReviewRoom';
import Leaderboard from './pages/Leaderboard';
import SubmitChallenge from './pages/SubmitChallenge';
import Register from './pages/Register';
import Profile from './pages/Profile';
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="review/:id" element={<ReviewRoom />} />
          <Route path="leaderboard" element={<Leaderboard />} />
          <Route path="submit" element={<SubmitChallenge />} />
          <Route path="register" element={<Register />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
