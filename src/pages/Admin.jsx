// ── PASTE THIS INTO: src/pages/Admin.jsx ──
import { useState, useEffect } from "react";
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

const NAV = [
  { id:"dashboard", icon:"⬛", label:"Dashboard" },
  { id:"documents", icon:"📄", label:"Policy Documents" },
  { id:"logs",      icon:"📋", label:"Query Logs" },
  { id:"users",     icon:"👥", label:"Users" },
];

export default function Admin({ onLogout }) {
  const [tab,      setTab]      = useState("dashboard");
  const [docs,     setDocs]     = useState([]);
  const [logs,     setLogs]     = useState([]);
  const [users,    setUsers]    = useState([]);
  const [file,     setFile]     = useState(null);
  const [docTitle, setDocTitle] = useState("");
  const [dept,     setDept]     = useState("");
  const [msg,      setMsg]      = useState("");
  const [uploading,setUploading]= useState(false);
  const navigate  = useNavigate();
  const { t, mode, toggleMode } = useTheme();
  const token    = localStorage.getItem("token");
  const fullName = localStorage.getItem("full_name") || "Admin";
  const initials = fullName.split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase();
  const headers  = { Authorization:`Bearer ${token}` };

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      const [d,l,u] = await Promise.all([
        axios.get("http://127.0.0.1:8000/documents", { headers }),
        axios.get("http://127.0.0.1:8000/logs",      { headers }),
        axios.get("http://127.0.0.1:8000/users",     { headers }),
      ]);
      setDocs(d.data); setLogs(l.data); setUsers(u.data);
    } catch {}
  };

  const uploadDoc = async () => {
    if (!file || !docTitle || !dept) { setMsg("⚠️ Fill all fields and choose a file."); return; }
    setUploading(true); setMsg("");
    const form = new FormData();
    form.append("file", file);
    form.append("doc_title", docTitle);
    form.append("department", dept);
    try {
      await axios.post("http://127.0.0.1:8000/documents/upload", form, { headers });
      setMsg("✅ Document uploaded and indexed successfully!");
      setFile(null); setDocTitle(""); setDept(""); fetchAll();
    } catch { setMsg("❌ Upload failed. Please try again."); }
    finally { setUploading(false); }
  };

  const deactivateDoc = async (id) => {
    await axios.delete(`http://127.0.0.1:8000/documents/${id}`, { headers });
    fetchAll();
  };

  const logout = () => { onLogout(); navigate("/login"); };

  // ── Shared styles ──
  const card = {
    background:t.surface, border:`1px solid ${t.border}`,
    borderRadius:12, padding:24, boxShadow:`0 2px 12px ${t.shadow}`
  };
  const th = {
    padding:"10px 16px", textAlign:"left", fontSize:11,
    fontWeight:700, color:t.textSub, textTransform:"uppercase",
    letterSpacing:"0.6px", borderBottom:`1px solid ${t.border}`,
    background:t.surface2
  };
  const td = {
    padding:"12px 16px", fontSize:13, color:t.text,
    borderBottom:`1px solid ${t.border}`
  };

  return (
    <div style={{ display:"flex", height:"100vh", background:t.bg,
      fontFamily:"'Inter','Segoe UI',sans-serif", color:t.text, overflow:"hidden" }}>

      {/* ── Sidebar ── */}
      <div style={{
        width:220, background:t.sidebarBg, borderRight:`1px solid ${t.border}`,
        display:"flex", flexDirection:"column", flexShrink:0
      }}>
        {/* Logo */}
        <div style={{ padding:"20px 16px 16px", borderBottom:`1px solid ${t.border}`,
          display:"flex", alignItems:"center", gap:10 }}>
          <PolicyBotLogo size={32} />
          <div>
            <div style={{ fontWeight:700, fontSize:14, color:t.text }}>PolicyBot</div>
            <div style={{ fontSize:11, color:t.textSub }}>Admin Panel</div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ padding:"12px 8px", flex:1 }}>
          {NAV.map(n => (
            <button key={n.id} onClick={() => setTab(n.id)} style={{
              display:"flex", alignItems:"center", gap:10, width:"100%",
              padding:"9px 12px", borderRadius:8, border:"none", cursor:"pointer",
              background: tab===n.id ? t.accentSoft : "none",
              color: tab===n.id ? t.accent : t.textSub,
              fontWeight: tab===n.id ? 600 : 400, fontSize:13,
              marginBottom:2, textAlign:"left", transition:"all 0.15s"
            }}>
              <span style={{ fontSize:15 }}>{n.icon}</span>
              {n.label}
            </button>
          ))}
        </nav>

        {/* Bottom */}
        <div style={{ padding:"12px 8px", borderTop:`1px solid ${t.border}` }}>
          <button onClick={toggleMode} style={{
            display:"flex", alignItems:"center", gap:10, width:"100%",
            padding:"9px 12px", borderRadius:8, border:"none", cursor:"pointer",
            background:"none", color:t.textSub, fontSize:13, marginBottom:4
          }}>
            <span>{mode==='dark'?'☀️':'🌙'}</span>
            {mode==='dark'?'Light Mode':'Dark Mode'}
          </button>
          <button onClick={logout} style={{
            display:"flex", alignItems:"center", gap:10, width:"100%",
            padding:"9px 12px", borderRadius:8, border:"none", cursor:"pointer",
            background:"none", color:t.textSub, fontSize:13
          }}>
            <span>🚪</span> Sign out
          </button>
        </div>
      </div>

      {/* ── Main ── */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>

        {/* Topbar */}
        <div style={{
          height:56, background:t.headerBg, borderBottom:`1px solid ${t.border}`,
          display:"flex", alignItems:"center", justifyContent:"space-between",
          padding:"0 24px", flexShrink:0
        }}>
          <h2 style={{ fontSize:16, fontWeight:700, color:t.text }}>
            {NAV.find(n=>n.id===tab)?.label}
          </h2>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{
              width:30, height:30, borderRadius:"50%", background:t.accent,
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:12, fontWeight:700, color:"#fff"
            }}>{initials}</div>
            <span style={{ fontSize:13, color:t.textSub }}>{fullName}</span>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex:1, overflowY:"auto", padding:24 }}>

          {/* ── DASHBOARD ── */}
          {tab==="dashboard" && (
            <div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:24 }}>
                {[
                  { label:"Total Policies",  value:docs.length,                           color:t.accent,   icon:"📄" },
                  { label:"Total Queries",   value:logs.length,                           color:"#22C55E",  icon:"💬" },
                  { label:"Total Users",     value:users.length,                          color:"#F59E0B",  icon:"👥" },
                  { label:"Matched Queries", value:logs.filter(l=>l.matched).length,      color:"#0EA5E9",  icon:"✅" },
                ].map((s,i) => (
                  <div key={i} style={{...card, display:"flex", flexDirection:"column", gap:8}}>
                    <div style={{ fontSize:22 }}>{s.icon}</div>
                    <div style={{ fontSize:28, fontWeight:700, color:s.color }}>{s.value}</div>
                    <div style={{ fontSize:12, color:t.textSub }}>{s.label}</div>
                  </div>
                ))}
              </div>
              <div style={card}>
                <h3 style={{ fontSize:14, fontWeight:700, marginBottom:16, color:t.text }}>
                  Recent Queries
                </h3>
                {logs.length === 0 && (
                  <p style={{ color:t.textSub, fontSize:13 }}>No queries yet. Employees can start asking questions after logging in.</p>
                )}
                {logs.slice(0,8).map((l,i) => (
                  <div key={i} style={{
                    display:"flex", justifyContent:"space-between", alignItems:"center",
                    padding:"10px 0", borderBottom:`1px solid ${t.border}`, fontSize:13
                  }}>
                    <span style={{ color:t.text, flex:1, marginRight:16 }}>{l.query_text}</span>
                    <span style={{
                      fontSize:11, fontWeight:600, padding:"2px 10px", borderRadius:20,
                      background: l.matched ? `${t.success}20` : `${t.danger}20`,
                      color: l.matched ? t.success : t.danger
                    }}>
                      {l.matched ? "Matched" : "No Match"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── DOCUMENTS ── */}
          {tab==="documents" && (
            <div>
              <div style={{...card, marginBottom:20}}>
                <h3 style={{ fontSize:14, fontWeight:700, marginBottom:16, color:t.text }}>
                  Upload New Policy Document
                </h3>
                <div style={{ display:"flex", gap:12, marginBottom:12, flexWrap:"wrap" }}>
                  <input placeholder="Document title" value={docTitle}
                    onChange={e=>setDocTitle(e.target.value)} style={{
                      flex:1, minWidth:200, padding:"9px 12px", borderRadius:8,
                      border:`1px solid ${t.border}`, background:t.inputBg,
                      color:t.text, fontSize:13, outline:"none"
                    }}/>
                  <input placeholder="Department" value={dept}
                    onChange={e=>setDept(e.target.value)} style={{
                      flex:1, minWidth:160, padding:"9px 12px", borderRadius:8,
                      border:`1px solid ${t.border}`, background:t.inputBg,
                      color:t.text, fontSize:13, outline:"none"
                    }}/>
                </div>
                <div style={{ display:"flex", gap:12, alignItems:"center", flexWrap:"wrap" }}>
                  <label style={{
                    padding:"9px 16px", borderRadius:8, border:`1px dashed ${t.border}`,
                    background:t.surface2, color:t.textSub, fontSize:13, cursor:"pointer"
                  }}>
                    {file ? `📎 ${file.name}` : "📎 Choose PDF or DOCX file"}
                    <input type="file" accept=".pdf,.docx" style={{ display:"none" }}
                      onChange={e=>setFile(e.target.files[0])} />
                  </label>
                  <button onClick={uploadDoc} disabled={uploading} style={{
                    padding:"9px 20px", borderRadius:8, border:"none",
                    background: uploading ? t.surface2 : t.accent,
                    color: uploading ? t.textSub : "#fff",
                    fontSize:13, fontWeight:600, cursor: uploading?"not-allowed":"pointer"
                  }}>
                    {uploading ? "Uploading..." : "Upload & Index"}
                  </button>
                  {msg && <span style={{ fontSize:13, color: msg.startsWith("✅") ? t.success : t.danger }}>{msg}</span>}
                </div>
              </div>

              <div style={card}>
                <h3 style={{ fontSize:14, fontWeight:700, marginBottom:16, color:t.text }}>
                  Active Policy Documents ({docs.length})
                </h3>
                {docs.length === 0 && (
                  <p style={{ color:t.textSub, fontSize:13 }}>No documents uploaded yet. Upload your first policy document above.</p>
                )}
                {docs.length > 0 && (
                  <table style={{ width:"100%", borderCollapse:"collapse" }}>
                    <thead>
                      <tr>
                        {["Title","Department","Version","Uploaded","Action"].map(h=>(
                          <th key={h} style={th}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {docs.map(d=>(
                        <tr key={d.doc_id}>
                          <td style={td}>{d.doc_title}</td>
                          <td style={td}>{d.department}</td>
                          <td style={td}>{d.version}</td>
                          <td style={td}>{new Date(d.uploaded_at).toLocaleDateString()}</td>
                          <td style={td}>
                            <button onClick={()=>deactivateDoc(d.doc_id)} style={{
                              padding:"4px 12px", borderRadius:6, border:"none",
                              background:`${t.danger}20`, color:t.danger,
                              fontSize:12, cursor:"pointer", fontWeight:600
                            }}>Deactivate</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {/* ── LOGS ── */}
          {tab==="logs" && (
            <div style={card}>
              <h3 style={{ fontSize:14, fontWeight:700, marginBottom:16, color:t.text }}>
                Query Logs ({logs.length})
              </h3>
              {logs.length === 0 && (
                <p style={{ color:t.textSub, fontSize:13 }}>No queries logged yet.</p>
              )}
              {logs.length > 0 && (
                <table style={{ width:"100%", borderCollapse:"collapse" }}>
                  <thead>
                    <tr>
                      {["Query","Response","Status","Date"].map(h=>(
                        <th key={h} style={th}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map(l=>(
                      <tr key={l.log_id}>
                        <td style={{...td, maxWidth:220}}>{l.query_text}</td>
                        <td style={{...td, maxWidth:280, color:t.textSub}}>
                          {l.response_text ? l.response_text.slice(0,100)+"..." : "—"}
                        </td>
                        <td style={td}>
                          <span style={{
                            fontSize:11, fontWeight:600, padding:"2px 10px", borderRadius:20,
                            background: l.matched ? `${t.success}20` : `${t.danger}20`,
                            color: l.matched ? t.success : t.danger
                          }}>
                            {l.matched ? "Matched" : "No Match"}
                          </span>
                        </td>
                        <td style={{...td, color:t.textSub}}>{new Date(l.queried_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* ── USERS ── */}
          {tab==="users" && (
            <div style={card}>
              <h3 style={{ fontSize:14, fontWeight:700, marginBottom:16, color:t.text }}>
                Registered Users ({users.length})
              </h3>
              <table style={{ width:"100%", borderCollapse:"collapse" }}>
                <thead>
                  <tr>
                    {["Full Name","Username","Role","Department","Status"].map(h=>(
                      <th key={h} style={th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.map(u=>(
                    <tr key={u.user_id}>
                      <td style={td}>
                        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                          <div style={{
                            width:28, height:28, borderRadius:"50%", background:t.accentSoft,
                            display:"flex", alignItems:"center", justifyContent:"center",
                            fontSize:11, fontWeight:700, color:t.accent, flexShrink:0
                          }}>
                            {u.full_name.split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase()}
                          </div>
                          {u.full_name}
                        </div>
                      </td>
                      <td style={{...td, color:t.textSub}}>{u.username}</td>
                      <td style={td}>
                        <span style={{
                          fontSize:11, padding:"2px 10px", borderRadius:20, fontWeight:600,
                          background: u.role==="hr_admin"||u.role==="it_admin" ? `${t.accent}20` : `${t.success}20`,
                          color: u.role==="hr_admin"||u.role==="it_admin" ? t.accent : t.success
                        }}>
                          {u.role}
                        </span>
                      </td>
                      <td style={{...td, color:t.textSub}}>{u.department}</td>
                      <td style={td}>
                        <span style={{
                          fontSize:11, fontWeight:600, padding:"2px 10px", borderRadius:20,
                          background: u.is_active ? `${t.success}20` : `${t.danger}20`,
                          color: u.is_active ? t.success : t.danger
                        }}>
                          {u.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}