// ── PASTE THIS INTO: src/pages/Login.jsx ──
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../App";

const BRAND      = "#5B4FCF";
const BRAND_DARK = "#4338CA";

function PolicyBotLogo({ size = 36, light = false }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <rect width="48" height="48" rx="12" fill={light ? "rgba(255,255,255,0.15)" : BRAND}/>
      <rect x="10" y="8" width="28" height="22" rx="4"
        stroke="white" strokeWidth="2" fill="white" fillOpacity="0.12"/>
      <circle cx="18" cy="19" r="3" fill="white"/>
      <circle cx="24" cy="19" r="3" fill="white"/>
      <circle cx="30" cy="19" r="3" fill="white"/>
      <path d="M20 30 L24 36 L28 30" fill="white" fillOpacity="0.9"/>
      <rect x="15" y="39" width="18" height="2.5" rx="1.25" fill="white" fillOpacity="0.35"/>
    </svg>
  );
}

const FEATURES = [
  { title:"Instant Policy Answers",   desc:"Ask any company policy question in plain English and get an accurate answer in seconds — no more searching through documents.", icon:"💬" },
  { title:"AI-Powered Intelligence",  desc:"Powered by open-source Hugging Face models that understand context and retrieve the most relevant policy content.", icon:"🤖" },
  { title:"Admin Document Control",   desc:"HR administrators can upload, update, and manage policy documents. Changes are reflected immediately in the chatbot.", icon:"📄" },
  { title:"Query Log & Analytics",    desc:"Track all employee queries, identify common policy gaps, and improve your documentation over time.", icon:"📊" },
];

export default function Login({ onLogin }) {
  const [username,     setUsername]     = useState("");
  const [password,     setPassword]     = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error,        setError]        = useState("");
  const [loading,      setLoading]      = useState(false);
  const navigate = useNavigate();
  const { t, mode, toggleMode } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) { setError("Please enter both username and password."); return; }
    setLoading(true); setError("");
    try {
      const form = new URLSearchParams();
      form.append("username", username);
      form.append("password", password);
      const res = await axios.post("http://127.0.0.1:8000/login", form);
      localStorage.setItem("token",     res.data.access_token);
      localStorage.setItem("role",      res.data.role);
      localStorage.setItem("full_name", res.data.full_name);
      onLogin(res.data.access_token, res.data.role);
      if (res.data.role === "employee") navigate("/chat");
      else navigate("/admin");
    } catch {
      setError("Incorrect username or password. Please try again.");
    } finally { setLoading(false); }
  };

  const isDark = mode === "dark";

  return (
    <div style={{ minHeight:"100vh", display:"flex", fontFamily:"'Inter','Segoe UI',sans-serif",
      background: isDark ? "#0F1117" : "#F7F8FC", position:"relative" }}>
      <style>{`
        @keyframes fadeIn { from{opacity:0;transform:translateY(-3px)}to{opacity:1;transform:none} }
        @keyframes spin   { to{transform:rotate(360deg)} }
        @keyframes pulse  { 0%,100%{opacity:1}50%{opacity:0.4} }
        input::placeholder{ color:${isDark?"#5C6480":"#A0A8C8"} !important; }
        .pb-input:focus{ border-color:${BRAND} !important; box-shadow:0 0 0 3px rgba(91,79,207,0.15) !important; background:${isDark?"#1A1D27":"#fff"} !important; }
        .pb-btn:hover:not(:disabled){ transform:translateY(-1px); box-shadow:0 10px 28px -6px rgba(91,79,207,0.55) !important; }
        @media(min-width:1024px){ .brand-panel{ display:flex !important; } }
        @media(max-width:1023px){ .mobile-logo{ display:block !important; } }
      `}</style>

      {/* Theme toggle */}
      <button onClick={toggleMode} style={{
        position:"fixed", top:16, right:16, zIndex:50, width:36, height:36, borderRadius:8,
        display:"flex", alignItems:"center", justifyContent:"center",
        background: isDark?"#1A1D27":"#fff", border:`1px solid ${isDark?"#2E3350":"#E2E6F0"}`,
        color: isDark?"#8B93B8":"#6B7099", cursor:"pointer", fontSize:15
      }}>{isDark?"☀️":"🌙"}</button>

      {/* ── LEFT brand panel ── */}
      <div className="brand-panel" style={{
        display:"none", width:"50%", position:"relative", overflow:"hidden",
        background:`linear-gradient(135deg, ${BRAND} 0%, ${BRAND_DARK} 55%, #2D1B8E 100%)`
      }}>
        <div style={{ position:"absolute", inset:0, opacity:0.06,
          backgroundImage:"linear-gradient(rgba(255,255,255,.7) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.7) 1px,transparent 1px)",
          backgroundSize:"40px 40px" }}/>
        <div style={{ position:"absolute", top:-120, left:-120, width:460, height:460, borderRadius:"50%", background:"rgba(255,255,255,0.08)", filter:"blur(60px)" }}/>
        <div style={{ position:"absolute", bottom:-140, right:-80, width:520, height:520, borderRadius:"50%", background:"rgba(167,139,250,0.15)", filter:"blur(70px)" }}/>

        <div style={{ position:"relative", zIndex:10, display:"flex", flexDirection:"column",
          justifyContent:"space-between", padding:"48px 56px", width:"100%" }}>

          {/* Logo */}
          <div style={{ display:"flex", alignItems:"center", gap:14 }}>
            <PolicyBotLogo size={52} light />
            <div>
              <div style={{ fontSize:22, fontWeight:800, color:"#fff", letterSpacing:"-0.5px" }}>PolicyBot</div>
              <div style={{ fontSize:11, color:"rgba(255,255,255,0.5)", letterSpacing:"0.15em", textTransform:"uppercase", marginTop:2 }}>
                AI Policy Assistant
              </div>
            </div>
          </div>

          {/* Hero */}
          <div style={{ maxWidth:420 }}>
            <h2 style={{ fontSize:36, fontWeight:800, color:"#fff", lineHeight:1.2, letterSpacing:"-0.8px", marginBottom:16 }}>
              Every policy answer, instantly.
            </h2>
            <p style={{ fontSize:15, color:"rgba(255,255,255,0.65)", lineHeight:1.7, marginBottom:40 }}>
              Ask PolicyBot anything about company policies. No more searching through PDFs or waiting for HR to respond.
            </p>
            <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
              {FEATURES.map((f, i) => (
                <div key={i} style={{ display:"flex", gap:16, alignItems:"flex-start" }}>
                  <div style={{ width:40, height:40, borderRadius:10,
                    background:"rgba(255,255,255,0.1)", border:"1px solid rgba(255,255,255,0.15)",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    flexShrink:0, fontSize:18 }}>{f.icon}</div>
                  <div>
                    <div style={{ fontWeight:700, fontSize:14, color:"#fff", marginBottom:3 }}>{f.title}</div>
                    <div style={{ fontSize:13, color:"rgba(255,255,255,0.55)", lineHeight:1.6 }}>{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:"rgba(255,255,255,0.4)" }}>
            <span>© {new Date().getFullYear()} PolicyBot · Elfy Solutions Limited</span>
            <span style={{ display:"flex", alignItems:"center", gap:6 }}>
              <span style={{ width:6, height:6, borderRadius:"50%", background:"#4ADE80",
                display:"inline-block", animation:"pulse 2s infinite" }}/>
              System operational
            </span>
          </div>
        </div>
      </div>

      {/* ── RIGHT form ── */}
      <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:"40px 24px" }}>
        <div style={{ width:"100%", maxWidth:420 }}>

          {/* Mobile logo */}
          <div className="mobile-logo" style={{ textAlign:"center", marginBottom:32, display:"none" }}>
            <div style={{ display:"inline-flex", alignItems:"center", gap:10, marginBottom:6 }}>
              <PolicyBotLogo size={40} />
              <span style={{ fontSize:24, fontWeight:800, color:BRAND }}>PolicyBot</span>
            </div>
            <p style={{ fontSize:13, color: isDark?"#5C6480":"#8B93B8" }}>Elfy Solutions Limited</p>
          </div>

          {/* Card */}
          <div style={{
            background: isDark?"#1A1D27":"#fff",
            border:`1px solid ${isDark?"#2E3350":"#E2E6F0"}`,
            borderRadius:20, padding:"40px 36px",
            boxShadow: isDark?"0 8px 32px -8px rgba(0,0,0,0.5)":"0 8px 32px -8px rgba(91,79,207,0.12)"
          }}>
            <div style={{ marginBottom:28 }}>
              <h2 style={{ fontSize:26, fontWeight:800, color:isDark?"#E8EAF0":"#1A1D2E",
                letterSpacing:"-0.5px", marginBottom:6 }}>Welcome back</h2>
              <p style={{ fontSize:14, color:isDark?"#9BA3C2":"#4A5080" }}>
                Sign in to access your policy assistant.
              </p>
            </div>

            {error && (
              <div style={{ marginBottom:20, padding:"12px 16px", borderRadius:10,
                background: isDark?"rgba(239,68,68,0.1)":"#FEF2F2",
                border:"1px solid rgba(239,68,68,0.3)",
                display:"flex", alignItems:"flex-start", gap:10,
                animation:"fadeIn 0.2s ease-out" }}>
                <span style={{ width:18, height:18, borderRadius:"50%", background:"#EF4444",
                  color:"#fff", fontSize:11, fontWeight:800, display:"flex",
                  alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:1 }}>!</span>
                <p style={{ fontSize:13, color:isDark?"#F87171":"#B91C1C", lineHeight:1.5, margin:0 }}>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Username */}
              <div style={{ marginBottom:16 }}>
                <label style={{ fontSize:12, fontWeight:600, color:isDark?"#9BA3C2":"#4A5080",
                  display:"block", marginBottom:6, letterSpacing:"0.05em" }}>USERNAME</label>
                <div style={{ position:"relative" }}>
                  <span style={{ position:"absolute", left:13, top:"50%", transform:"translateY(-50%)", fontSize:15, color:isDark?"#5C6480":"#A0A8C8" }}>👤</span>
                  <input type="text" className="pb-input"
                    placeholder="Enter your username"
                    value={username}
                    onChange={e => { setUsername(e.target.value); setError(""); }}
                    style={{ width:"100%", height:44, paddingLeft:42, paddingRight:14,
                      borderRadius:10, border:`1.5px solid ${isDark?"#2E3350":"#D1D9EE"}`,
                      background:isDark?"#22263A":"#F7F8FC", color:isDark?"#E8EAF0":"#1A1D2E",
                      fontSize:14, outline:"none", boxSizing:"border-box", transition:"all 0.2s" }}/>
                </div>
              </div>

              {/* Password */}
              <div style={{ marginBottom:24 }}>
                <label style={{ fontSize:12, fontWeight:600, color:isDark?"#9BA3C2":"#4A5080",
                  display:"block", marginBottom:6, letterSpacing:"0.05em" }}>PASSWORD</label>
                <div style={{ position:"relative" }}>
                  <span style={{ position:"absolute", left:13, top:"50%", transform:"translateY(-50%)", fontSize:15, color:isDark?"#5C6480":"#A0A8C8" }}>🔒</span>
                  <input type={showPassword?"text":"password"} className="pb-input"
                    placeholder="Enter your password"
                    value={password}
                    onChange={e => { setPassword(e.target.value); setError(""); }}
                    onKeyDown={e => e.key==="Enter" && handleSubmit(e)}
                    style={{ width:"100%", height:44, paddingLeft:42, paddingRight:44,
                      borderRadius:10, border:`1.5px solid ${isDark?"#2E3350":"#D1D9EE"}`,
                      background:isDark?"#22263A":"#F7F8FC", color:isDark?"#E8EAF0":"#1A1D2E",
                      fontSize:14, outline:"none", boxSizing:"border-box", transition:"all 0.2s" }}/>
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)",
                      background:"none", border:"none", cursor:"pointer",
                      color:isDark?"#5C6480":"#A0A8C8", fontSize:15, padding:4 }}>
                    {showPassword?"🙈":"👁️"}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading} className="pb-btn"
                style={{ width:"100%", height:44, borderRadius:10, border:"none",
                  background:BRAND, color:"#fff", fontSize:14, fontWeight:700,
                  cursor:loading?"not-allowed":"pointer", opacity:loading?0.7:1,
                  display:"flex", alignItems:"center", justifyContent:"center", gap:8,
                  boxShadow:"0 6px 20px -4px rgba(91,79,207,0.45)",
                  transition:"all 0.2s" }}>
                {loading ? (
                  <><span style={{ width:16, height:16, border:"2px solid rgba(255,255,255,0.35)",
                    borderTopColor:"#fff", borderRadius:"50%",
                    animation:"spin 0.7s linear infinite", display:"inline-block" }}/>Signing in…</>
                ) : <>Sign in →</>}
              </button>
            </form>

            <div style={{ marginTop:28, paddingTop:20, borderTop:`1px solid ${isDark?"#2E3350":"#E2E6F0"}`,
              display:"flex", alignItems:"center", justifyContent:"center", gap:8,
              fontSize:12, color:isDark?"#5C6480":"#A0A8C8" }}>
              <PolicyBotLogo size={16} />
              Secured by PolicyBot · Elfy Solutions Limited
            </div>
          </div>

          <p style={{ textAlign:"center", fontSize:12, color:isDark?"#5C6480":"#A0A8C8", marginTop:20 }}>
            Need access? Contact your IT Administrator.
          </p>
        </div>
      </div>
    </div>
  );
}