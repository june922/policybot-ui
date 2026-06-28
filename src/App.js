// ── PASTE THIS INTO: src/App.js ──
// Full PolicyBot redesign — LLM Notebook style, dark/light mode toggle

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, createContext, useContext } from 'react';
import Login from './pages/Login';
import Chat from './pages/Chat';
import Admin from './pages/Admin';

export const ThemeContext = createContext();

export function useTheme() {
  return useContext(ThemeContext);
}

export const themes = {
  dark: {
    bg:         '#0F1117',
    surface:    '#1A1D27',
    surface2:   '#22263A',
    border:     '#2E3350',
    text:       '#E8EAF0',
    textSub:    '#8B90A8',
    accent:     '#7C6FE0',
    accentHover:'#9A90E8',
    accentSoft: '#2A2650',
    userBubble: '#7C6FE0',
    botBubble:  '#1A1D27',
    inputBg:    '#22263A',
    sidebarBg:  '#13151F',
    headerBg:   '#13151F',
    scrollbar:  '#2E3350',
    danger:     '#EF4444',
    success:    '#22C55E',
    warning:    '#F59E0B',
    shadow:     'rgba(0,0,0,0.4)',
  },
  light: {
    bg:         '#F7F8FC',
    surface:    '#FFFFFF',
    surface2:   '#EEF0F8',
    border:     '#DDE1F0',
    text:       '#1A1D2E',
    textSub:    '#6B7099',
    accent:     '#5B4FCF',
    accentHover:'#7C6FE0',
    accentSoft: '#EAE8FB',
    userBubble: '#5B4FCF',
    botBubble:  '#FFFFFF',
    inputBg:    '#FFFFFF',
    sidebarBg:  '#F0F1F9',
    headerBg:   '#FFFFFF',
    scrollbar:  '#DDE1F0',
    danger:     '#EF4444',
    success:    '#22C55E',
    warning:    '#F59E0B',
    shadow:     'rgba(0,0,0,0.08)',
  }
};

function App() {
  const [mode,  setMode]  = useState(localStorage.getItem('theme') || 'dark');
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [role,  setRole]  = useState(localStorage.getItem('role'));

  const toggleMode = () => {
    const next = mode === 'dark' ? 'light' : 'dark';
    setMode(next);
    localStorage.setItem('theme', next);
  };

  const handleLogin = (t, r) => { setToken(t); setRole(r); };
  const handleLogout = () => { localStorage.clear(); localStorage.setItem('theme', mode); setToken(null); setRole(null); };

  const t = themes[mode];

  return (
    <ThemeContext.Provider value={{ mode, t, toggleMode }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            !token ? <Navigate to="/login" />
            : role === 'employee' ? <Navigate to="/chat" />
            : <Navigate to="/admin" />
          } />
          <Route path="/login" element={
            token
              ? (role === 'employee' ? <Navigate to="/chat" /> : <Navigate to="/admin" />)
              : <Login onLogin={handleLogin} />
          } />
          <Route path="/chat" element={
            !token ? <Navigate to="/login" />
            : role !== 'employee' ? <Navigate to="/admin" />
            : <Chat onLogout={handleLogout} />
          } />
          <Route path="/admin" element={
            !token ? <Navigate to="/login" />
            : role === 'employee' ? <Navigate to="/chat" />
            : <Admin onLogout={handleLogout} />
          } />
        </Routes>
      </BrowserRouter>
    </ThemeContext.Provider>
  );
}

export default App;