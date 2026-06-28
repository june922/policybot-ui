// ── PASTE THIS INTO: src/pages/Chat.jsx ──
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../App";

function PolicyBotLogo({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <rect width="48" height="48" rx="12" fill="#7C6FE0"/>
      <rect x="10" y="8" width="28" height="22" rx="4" stroke="white" strokeWidth="2" fill="white" fillOpacity="0.1"/>
      <circle cx="18" cy="19" r="3" fill="white"/>
      <circle cx="24" cy="19" r="3" fill="white"/>
      <circle cx="30" cy="19" r="3" fill="white"/>
      <path d="M20 30 L24 36 L28 30" fill="white" opacity="0.9"/>
    </svg>
  );
}

function TypingDots({ color }) {
  return (
    <span style={{ display:"flex", gap:4, alignItems:"center", padding:"4px 0" }}>
      {[0,1,2].map(i => (
        <span key={i} style={{
          width:7, height:7, borderRadius:"50%", background:color,
          animation:`bounce 1.2s ease-in-out ${i*0.2}s infinite`,
          display:"inline-block"
        }}/>
      ))}
      <style>{`
        @keyframes bounce {
          0%,60%,100% { transform:translateY(0); opacity:0.4; }
          30% { transform:translateY(-5px); opacity:1; }
        }
      `}</style>
    </span>
  );
}

const SUGGESTIONS = [
  "How many days of annual leave do I get?",
  "What is the IT acceptable use policy?",
  "What purchases need Finance Manager approval?",
  "What happens if I am late to work?",
];

export default function Chat({ onLogout }) {
  const [messages, setMessages] = useState([]);
  const [input,    setInput]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const [showSugg, setShowSugg] = useState(true);
  const bottomRef = useRef(null);
  const inputRef  = useRef(null);
  const navigate  = useNavigate();
  const { t, mode, toggleMode } = useTheme();

  const fullName = localStorage.getItem("full_name") || "Employee";
  const initials = fullName.split(" ").map(n => n[0]).join("").slice(0,2).toUpperCase();
  const token    = localStorage.getItem("token");

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior:"smooth" });
  }, [messages, loading]);

  const sendMessage = async (text) => {
    const query = (text || input).trim();
    if (!query || loading) return;
    setInput(""); setShowSugg(false);
    setMessages(prev => [...prev, { from:"user", text:query }]);
    setLoading(true);
    try {
      const res = await axios.post("http://127.0.0.1:8000/chat",
        { query }, { headers:{ Authorization:`Bearer ${token}` } });
      setMessages(prev => [...prev, { from:"bot", text:res.data.answer, matched:res.data.matched }]);
    } catch {
      setMessages(prev => [...prev, {
        from:"bot",
        text:"PolicyBot is temporarily unavailable. Please try again shortly or contact HR directly.",
        matched:false
      }]);
    } finally { setLoading(false); inputRef.current?.focus(); }
  };

  const logout = () => { onLogout(); navigate("/login"); };

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100vh",
      background:t.bg, fontFamily:"'Inter','Segoe UI',sans-serif", color:t.text }}>

      {/* Header */}
      <div style={{
        background:t.headerBg, borderBottom:`1px solid ${t.border}`,
        padding:"0 20px", height:56, display:"flex", alignItems:"center",
        justifyContent:"space-between", flexShrink:0
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <PolicyBotLogo size={30} />
          <div>
            <div style={{ fontWeight:700, fontSize:15, color:t.text }}>PolicyBot</div>
            <div style={{ fontSize:11, color:t.textSub }}>Elfy Solutions Limited</div>
          </div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <button onClick={toggleMode} style={{
            background:t.surface2, border:`1px solid ${t.border}`,
            color:t.textSub, borderRadius:6, padding:"5px 10px", fontSize:12, cursor:"pointer"
          }}>
            {mode==='dark'?'☀️':'🌙'}
          </button>
          <div style={{
            width:32, height:32, borderRadius:"50%", background:t.accent,
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:12, fontWeight:700, color:"#fff"
          }}>{initials}</div>
          <span style={{ fontSize:13, color:t.textSub }}>{fullName}</span>
          <button onClick={logout} style={{
            background:"none", border:`1px solid ${t.border}`, color:t.textSub,
            borderRadius:6, padding:"5px 12px", fontSize:12, cursor:"pointer"
          }}>Sign out</button>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex:1, overflowY:"auto", padding:"24px 0" }}>
        <div style={{ maxWidth:720, margin:"0 auto", padding:"0 20px" }}>

          {/* Welcome */}
          {messages.length === 0 && (
            <div style={{ textAlign:"center", padding:"60px 0 40px" }}>
              <PolicyBotLogo size={56} />
              <h2 style={{ fontSize:22, fontWeight:700, marginTop:16, marginBottom:8, color:t.text }}>
                How can I help you today?
              </h2>
              <p style={{ fontSize:14, color:t.textSub, maxWidth:400, margin:"0 auto" }}>
                Ask me anything about Elfy Solutions Limited company policies.
                I'll find the answer instantly.
              </p>
            </div>
          )}

          {/* Suggestion chips */}
          {showSugg && (
            <div style={{ display:"flex", flexWrap:"wrap", gap:8, justifyContent:"center", marginBottom:32 }}>
              {SUGGESTIONS.map((s, i) => (
                <button key={i} onClick={() => sendMessage(s)} style={{
                  background:t.surface, border:`1px solid ${t.border}`,
                  color:t.textSub, borderRadius:20, padding:"8px 16px",
                  fontSize:13, cursor:"pointer", transition:"all 0.15s",
                }}>
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Message thread */}
          {messages.map((msg, i) => (
            <div key={i} style={{
              display:"flex", gap:12, marginBottom:24,
              flexDirection: msg.from==="user" ? "row-reverse" : "row",
              alignItems:"flex-start"
            }}>
              {/* Avatar */}
              <div style={{
                width:32, height:32, borderRadius:"50%", flexShrink:0,
                background: msg.from==="user" ? t.accent : t.surface2,
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize: msg.from==="user" ? 12 : 18,
                fontWeight:700, color: msg.from==="user" ? "#fff" : t.textSub,
                border:`1px solid ${t.border}`
              }}>
                {msg.from==="user" ? initials : <PolicyBotLogo size={20} />}
              </div>

              {/* Bubble */}
              <div style={{
                maxWidth:"78%", padding:"12px 16px", borderRadius:12,
                background: msg.from==="user" ? t.userBubble : t.botBubble,
                color: msg.from==="user" ? "#fff" : t.text,
                border: msg.from==="user" ? "none" : `1px solid ${t.border}`,
                fontSize:14, lineHeight:1.7,
                boxShadow:`0 2px 8px ${t.shadow}`,
                borderTopRightRadius: msg.from==="user" ? 2 : 12,
                borderTopLeftRadius:  msg.from==="bot"  ? 2 : 12,
              }}>
                {msg.text}
                {msg.from==="bot" && msg.matched===false && (
                  <div style={{ marginTop:8, fontSize:12, color:t.warning,
                    padding:"6px 10px", background:`${t.warning}15`,
                    borderRadius:6, border:`1px solid ${t.warning}30` }}>
                    💡 Tip: Upload more policy documents in the admin panel for better answers.
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {loading && (
            <div style={{ display:"flex", gap:12, marginBottom:24, alignItems:"flex-start" }}>
              <div style={{
                width:32, height:32, borderRadius:"50%", flexShrink:0,
                background:t.surface2, display:"flex", alignItems:"center",
                justifyContent:"center", border:`1px solid ${t.border}`
              }}>
                <PolicyBotLogo size={20} />
              </div>
              <div style={{
                padding:"12px 16px", borderRadius:12, borderTopLeftRadius:2,
                background:t.botBubble, border:`1px solid ${t.border}`,
                boxShadow:`0 2px 8px ${t.shadow}`
              }}>
                <TypingDots color={t.accent} />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input area */}
      <div style={{
        borderTop:`1px solid ${t.border}`, background:t.headerBg, padding:"16px 20px"
      }}>
        <div style={{ maxWidth:720, margin:"0 auto", display:"flex", gap:10, alignItems:"flex-end" }}>
          <div style={{ flex:1, position:"relative" }}>
            <textarea
              ref={inputRef}
              rows={1}
              placeholder="Ask a policy question..."
              value={input}
              onChange={e => { setInput(e.target.value); e.target.style.height="auto"; e.target.style.height=e.target.scrollHeight+"px"; }}
              onKeyDown={e => { if(e.key==="Enter" && !e.shiftKey){ e.preventDefault(); sendMessage(); }}}
              disabled={loading}
              style={{
                width:"100%", padding:"11px 14px", borderRadius:10,
                border:`1.5px solid ${t.border}`, background:t.inputBg,
                color:t.text, fontSize:14, outline:"none", resize:"none",
                maxHeight:160, overflow:"auto", lineHeight:1.5,
                fontFamily:"inherit", boxSizing:"border-box",
                transition:"border 0.2s"
              }}
            />
          </div>
          <button
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
            style={{
              width:42, height:42, borderRadius:10, border:"none",
              background: (loading || !input.trim()) ? t.surface2 : t.accent,
              color: (loading || !input.trim()) ? t.textSub : "#fff",
              fontSize:18, cursor: (loading || !input.trim()) ? "not-allowed" : "pointer",
              flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center",
              transition:"all 0.2s"
            }}
          >↑</button>
        </div>
        <p style={{ textAlign:"center", fontSize:11, color:t.textSub, marginTop:8 }}>
          PolicyBot may make mistakes. Verify important policy details with HR.
        </p>
      </div>
    </div>
  );
}