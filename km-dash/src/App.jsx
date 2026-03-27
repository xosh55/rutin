import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "./supabase.js";

const FONTS_URL = "https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap";

const T = {
  bg: "#0a0a0f",
  card: "#12121a",
  surface: "#1a1a28",
  border: "#252536",
  text: "#f0f0f5",
  muted: "#8888a0",
  subtle: "#55556a",
  accent: "#6c5ce7",
  accent2: "#00cec9",
  success: "#00b894",
  warning: "#fdcb6e",
  danger: "#ff6b6b",
  pin: "#ff9ff3",
};

const STATUS = {
  active: { bg: "rgba(0,190,148,0.12)", c: "#00b894", l: "Aktiv" },
  paused: { bg: "rgba(253,203,110,0.12)", c: "#fdcb6e", l: "Pausad" },
  planning: { bg: "rgba(108,92,231,0.12)", c: "#6c5ce7", l: "Planering" },
  done: { bg: "rgba(136,136,160,0.12)", c: "#8888a0", l: "Klar" },
};

const PRIO = {
  high: { c: "#ff6b6b", l: "Hög", bg: "rgba(255,107,107,0.12)" },
  medium: { c: "#fdcb6e", l: "Medel", bg: "rgba(253,203,110,0.12)" },
  low: { c: "#8888a0", l: "Låg", bg: "rgba(136,136,160,0.12)" },
};

const ICON_LIST = [
  "briefcase", "code", "globe", "smartphone", "palette", "music",
  "camera", "coffee", "zap", "star", "heart", "target",
  "layers", "box", "monitor", "truck"
];

const COLOR_LIST = [
  "#6c5ce7", "#00cec9", "#00b894", "#fdcb6e", "#ff6b6b",
  "#e84393", "#0984e3", "#fd79a8", "#636e72", "#2d3436"
];

const iconPaths = {
  briefcase: "M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zM16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16",
  code: "M16 18l6-6-6-6M8 6l-6 6 6 6",
  globe: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM2 12h20",
  smartphone: "M17 2H7a2 2 0 00-2 2v16a2 2 0 002 2h10a2 2 0 002-2V4a2 2 0 00-2-2zM12 18h.01",
  palette: "M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.93 0 1.5-.67 1.5-1.5 0-.38-.15-.74-.42-1.02-.26-.26-.42-.62-.42-1 0-.83.67-1.5 1.5-1.5H16c3.31 0 6-2.69 6-6 0-5.5-4.5-9.98-10-9.98z",
  music: "M9 18V5l12-2v13",
  camera: "M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z",
  coffee: "M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z",
  zap: "M13 2L3 14h9l-1 10 10-12h-9l1-10z",
  star: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  heart: "M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z",
  target: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z",
  layers: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
  box: "M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z",
  monitor: "M20 3H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V5a2 2 0 00-2-2zM8 21h8M12 17v4",
  truck: "M1 3h15v13H1zM16 8h4l3 3v5h-7V8z",
  plus: "M12 5v14M5 12h14",
  trash: "M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2",
  edit: "M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z",
  check: "M20 6L9 17l-5-5",
  x: "M18 6L6 18M6 6l12 12",
  pin: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z",
  calendar: "M19 4H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2zM16 2v4M8 2v4M3 10h18",
  grid: "M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z",
  list: "M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01",
  file: "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z",
  grip: "M9 4h.01M9 9h.01M9 14h.01M15 4h.01M15 9h.01M15 14h.01",
};

function Ic(props) {
  var n = props.n;
  var s = props.s || 18;
  var c = props.c || T.muted;
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d={iconPaths[n] || iconPaths.box} />
    </svg>
  );
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

var KEY = "km-dash-v3";

function daysTo(dl) {
  if (!dl) return null;
  var a = new Date(dl); a.setHours(0,0,0,0);
  var b = new Date(); b.setHours(0,0,0,0);
  return Math.ceil((a - b) / 86400000);
}

function TaskRow(props) {
  var t = props.t;
  var onToggle = props.onToggle;
  var onPin = props.onPin;
  var showCtx = props.showCtx;
  var onGo = props.onGo;
  var days = daysTo(t.deadline);
  var over = days !== null && days < 0 && !t.done;
  var pr = PRIO[t.priority] || PRIO.medium;

  var deadlineLabel = "";
  if (days !== null) {
    if (over) deadlineLabel = "Försenad";
    else if (days === 0) deadlineLabel = "Idag";
    else if (days === 1) deadlineLabel = "Imorgon";
    else deadlineLabel = days + "d";
  }

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 8, padding: "7px 10px", borderRadius: 8,
      background: t.done ? "rgba(0,184,148,0.03)" : T.card,
      border: "1px solid " + (over ? "rgba(255,107,107,0.15)" : t.done ? "rgba(0,184,148,0.08)" : T.border)
    }}>
      <button onClick={onToggle} style={{
        width: 18, height: 18, borderRadius: 5,
        border: t.done ? "none" : "2px solid " + T.border,
        background: t.done ? T.success : "transparent",
        cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
      }}>
        {t.done && <Ic n="check" s={11} c="#fff" />}
      </button>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 12, fontWeight: 500, color: t.done ? T.muted : T.text,
          textDecoration: t.done ? "line-through" : "none",
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"
        }}>{t.text}</div>
        {showCtx && (
          <div style={{ fontSize: 9, color: T.subtle, cursor: "pointer" }} onClick={onGo}>
            {t.cName} → {t.pName}
          </div>
        )}
      </div>
      {t.deadline && (
        <span style={{
          fontSize: 9, fontWeight: 600, flexShrink: 0,
          color: over ? T.danger : days === 0 ? T.warning : days <= 2 ? T.accent2 : T.subtle
        }}>{deadlineLabel}</span>
      )}
      {t.priority && (
        <span style={{
          fontSize: 8, fontWeight: 700, padding: "1px 5px", borderRadius: 4,
          background: pr.bg, color: pr.c
        }}>{pr.l}</span>
      )}
      <button onClick={onPin} style={{
        background: "none", border: "none", cursor: "pointer", padding: 2,
        opacity: t.pinned ? 1 : 0.3
      }}>
        <Ic n="pin" s={10} c={t.pinned ? T.pin : T.muted} />
      </button>
    </div>
  );
}

function CoForm(props) {
  var init = props.init;
  var onSave = props.onSave;
  var onClose = props.onClose;
  const [name, setName] = useState(init ? init.name || "" : "");
  const [desc, setDesc] = useState(init ? init.desc || "" : "");
  const [color, setColor] = useState(init ? init.color || "#6c5ce7" : "#6c5ce7");
  const [icon, setIcon] = useState(init ? init.icon || "briefcase" : "briefcase");

  return (
    <div>
      <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 14 }}>{init ? "Redigera" : "Nytt företag"}</div>
      <input value={name} onChange={function(e) { setName(e.target.value); }} placeholder="Namn..." autoFocus style={{ width: "100%", padding: "9px 11px", borderRadius: 7, border: "1px solid " + T.border, background: T.surface, color: T.text, fontSize: 13, fontWeight: 600, outline: "none", marginBottom: 8 }} />
      <textarea value={desc} onChange={function(e) { setDesc(e.target.value); }} placeholder="Beskrivning..." rows={2} style={{ width: "100%", padding: "7px 11px", borderRadius: 7, border: "1px solid " + T.border, background: T.surface, color: T.text, fontSize: 11, outline: "none", resize: "none", marginBottom: 8 }} />
      <div style={{ fontSize: 9, color: T.muted, marginBottom: 3 }}>Färg</div>
      <div style={{ display: "flex", gap: 4, marginBottom: 8 }}>
        {COLOR_LIST.map(function(c) {
          return <div key={c} onClick={function() { setColor(c); }} style={{ width: 22, height: 22, borderRadius: 5, background: c, cursor: "pointer", border: color === c ? "2px solid #fff" : "2px solid transparent" }} />;
        })}
      </div>
      <div style={{ fontSize: 9, color: T.muted, marginBottom: 3 }}>Ikon</div>
      <div style={{ display: "flex", gap: 3, flexWrap: "wrap", marginBottom: 14 }}>
        {ICON_LIST.map(function(ic) {
          return (
            <div key={ic} onClick={function() { setIcon(ic); }} style={{ width: 26, height: 26, borderRadius: 5, background: icon === ic ? T.surface : "transparent", border: icon === ic ? "1px solid " + T.accent : "1px solid transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Ic n={ic} s={13} c={icon === ic ? T.accent : T.muted} />
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", gap: 6 }}>
        <button onClick={onClose} style={{ flex: 1, padding: 9, borderRadius: 7, border: "1px solid " + T.border, background: "transparent", color: T.muted, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Avbryt</button>
        <button onClick={function() { if (name.trim()) onSave({ name: name.trim(), desc: desc.trim(), color: color, icon: icon }); }} style={{ flex: 1, padding: 9, borderRadius: 7, border: "none", background: name.trim() ? "linear-gradient(135deg," + T.accent + "," + T.accent2 + ")" : T.surface, color: name.trim() ? "#fff" : T.subtle, fontSize: 12, fontWeight: 700, cursor: name.trim() ? "pointer" : "not-allowed", fontFamily: "inherit" }}>Spara</button>
      </div>
    </div>
  );
}

function PjForm(props) {
  var init = props.init;
  var onSave = props.onSave;
  var onClose = props.onClose;
  const [name, setName] = useState(init ? init.name || "" : "");
  const [desc, setDesc] = useState(init ? init.description || "" : "");
  const [status, setStatus] = useState(init ? init.status || "active" : "active");

  return (
    <div>
      <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 14 }}>{init ? "Redigera" : "Nytt projekt"}</div>
      <input value={name} onChange={function(e) { setName(e.target.value); }} placeholder="Projektnamn..." autoFocus style={{ width: "100%", padding: "9px 11px", borderRadius: 7, border: "1px solid " + T.border, background: T.surface, color: T.text, fontSize: 13, fontWeight: 600, outline: "none", marginBottom: 8 }} />
      <textarea value={desc} onChange={function(e) { setDesc(e.target.value); }} placeholder="Beskrivning..." rows={2} style={{ width: "100%", padding: "7px 11px", borderRadius: 7, border: "1px solid " + T.border, background: T.surface, color: T.text, fontSize: 11, outline: "none", resize: "none", marginBottom: 8 }} />
      <div style={{ fontSize: 9, color: T.muted, marginBottom: 3 }}>Status</div>
      <div style={{ display: "flex", gap: 4, marginBottom: 14 }}>
        {Object.entries(STATUS).map(function(entry) {
          var k = entry[0]; var v = entry[1];
          return (
            <button key={k} onClick={function() { setStatus(k); }} style={{ padding: "5px 10px", borderRadius: 5, border: status === k ? "1px solid " + v.c : "1px solid " + T.border, background: status === k ? v.bg : "transparent", color: status === k ? v.c : T.muted, fontSize: 10, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>{v.l}</button>
          );
        })}
      </div>
      <div style={{ display: "flex", gap: 6 }}>
        <button onClick={onClose} style={{ flex: 1, padding: 9, borderRadius: 7, border: "1px solid " + T.border, background: "transparent", color: T.muted, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Avbryt</button>
        <button onClick={function() { if (name.trim()) onSave({ name: name.trim(), description: desc.trim(), status: status }); }} style={{ flex: 1, padding: 9, borderRadius: 7, border: "none", background: name.trim() ? "linear-gradient(135deg," + T.accent + "," + T.accent2 + ")" : T.surface, color: name.trim() ? "#fff" : T.subtle, fontSize: 12, fontWeight: 700, cursor: name.trim() ? "pointer" : "not-allowed", fontFamily: "inherit" }}>Spara</button>
      </div>
    </div>
  );
}

function TkForm(props) {
  var onSave = props.onSave;
  var onClose = props.onClose;
  const [text, setText] = useState("");
  const [prio, setPrio] = useState("medium");
  const [deadline, setDeadline] = useState("");

  return (
    <div>
      <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 14 }}>Ny task</div>
      <input value={text} onChange={function(e) { setText(e.target.value); }} placeholder="Vad ska göras?" autoFocus onKeyDown={function(e) { if (e.key === "Enter" && text.trim()) onSave({ text: text.trim(), priority: prio, deadline: deadline || null }); }} style={{ width: "100%", padding: "9px 11px", borderRadius: 7, border: "1px solid " + T.border, background: T.surface, color: T.text, fontSize: 13, fontWeight: 600, outline: "none", marginBottom: 8 }} />
      <div style={{ fontSize: 9, color: T.muted, marginBottom: 3 }}>Deadline</div>
      <input type="date" value={deadline} onChange={function(e) { setDeadline(e.target.value); }} style={{ width: "100%", padding: "7px 11px", borderRadius: 7, border: "1px solid " + T.border, background: T.surface, color: T.text, fontSize: 11, outline: "none", marginBottom: 8, colorScheme: "dark" }} />
      <div style={{ fontSize: 9, color: T.muted, marginBottom: 3 }}>Prioritet</div>
      <div style={{ display: "flex", gap: 4, marginBottom: 14 }}>
        {Object.entries(PRIO).map(function(entry) {
          var k = entry[0]; var v = entry[1];
          return (
            <button key={k} onClick={function() { setPrio(k); }} style={{ padding: "5px 10px", borderRadius: 5, border: prio === k ? "1px solid " + v.c : "1px solid " + T.border, background: prio === k ? v.bg : "transparent", color: prio === k ? v.c : T.muted, fontSize: 10, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>{v.l}</button>
          );
        })}
      </div>
      <div style={{ display: "flex", gap: 6 }}>
        <button onClick={onClose} style={{ flex: 1, padding: 9, borderRadius: 7, border: "1px solid " + T.border, background: "transparent", color: T.muted, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Avbryt</button>
        <button onClick={function() { if (text.trim()) onSave({ text: text.trim(), priority: prio, deadline: deadline || null }); }} style={{ flex: 1, padding: 9, borderRadius: 7, border: "none", background: text.trim() ? "linear-gradient(135deg," + T.accent + "," + T.accent2 + ")" : T.surface, color: text.trim() ? "#fff" : T.subtle, fontSize: 12, fontWeight: 700, cursor: text.trim() ? "pointer" : "not-allowed", fontFamily: "inherit" }}>Lägg till</button>
      </div>
    </div>
  );
}

export default function App() {
  const [d, setD] = useState(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("home");
  const [selC, setSelC] = useState(null);
  const [selP, setSelP] = useState(null);
  const [modal, setModal] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [dragIdx, setDragIdx] = useState(null);
  var now = new Date();

  const skipRef = useRef(false);

  useEffect(function() {
    var lk = document.createElement("link");
    lk.rel = "stylesheet"; lk.href = FONTS_URL;
    document.head.appendChild(lk);
    (async function() {
      try {
        var res = await supabase.from('dashboard_data').select('data').eq('id', 'main').single();
        if (res.data && res.data.data) {
          setD(res.data.data);
        } else {
          setD({ co: [] });
          await supabase.from('dashboard_data').upsert({ id: 'main', data: { co: [] }, updated_at: new Date().toISOString() });
        }
      } catch(e) { setD({ co: [] }); }
      setLoading(false);
    })();
  }, []);

  useEffect(function() {
    var channel = supabase.channel('dash-sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'dashboard_data' }, function(payload) {
        if (payload.new && payload.new.data && !skipRef.current) {
          setD(payload.new.data);
        }
        skipRef.current = false;
      })
      .subscribe();
    return function() { supabase.removeChannel(channel); };
  }, []);

  var save = useCallback(async function(nd) {
    setD(nd);
    skipRef.current = true;
    try { await supabase.from('dashboard_data').upsert({ id: 'main', data: nd, updated_at: new Date().toISOString() }); } catch(e) { console.error(e); }
  }, []);

  var co = selC && d ? d.co.find(function(c) { return c.id === selC; }) : null;
  var pr = selP && co ? co.pj.find(function(p) { return p.id === selP; }) : null;

  var allTasks = (d ? d.co : []).flatMap(function(c) {
    return c.pj.flatMap(function(p) {
      return p.tk.map(function(t) {
        return Object.assign({}, t, { pName: p.name, cName: c.name, cId: c.id, pId: p.id, cColor: c.color });
      });
    });
  });

  var weekTasks = allTasks.filter(function(t) {
    if (!t.deadline || t.done) return false;
    var diff = daysTo(t.deadline);
    return diff !== null && diff >= 0 && diff <= 7;
  }).sort(function(a, b) { return new Date(a.deadline) - new Date(b.deadline); });

  var pinnedTasks = allTasks.filter(function(t) { return t.pinned && !t.done; });

  // CRUD
  function addCo(x) { save({ co: d.co.concat([Object.assign({}, x, { id: uid(), pj: [] })]) }); setModal(null); }
  function updCo(cid, x) { save({ co: d.co.map(function(c) { return c.id === cid ? Object.assign({}, c, x) : c; }) }); setModal(null); setEditItem(null); }
  function delCo(cid) { save({ co: d.co.filter(function(c) { return c.id !== cid; }) }); if (selC === cid) { setSelC(null); setSelP(null); setView("home"); } }
  function addPj(cid, x) { save({ co: d.co.map(function(c) { return c.id === cid ? Object.assign({}, c, { pj: c.pj.concat([Object.assign({}, x, { id: uid(), tk: [], notes: "", pinned: false })]) }) : c; }) }); setModal(null); }
  function updPj(cid, pid, x) { save({ co: d.co.map(function(c) { return c.id === cid ? Object.assign({}, c, { pj: c.pj.map(function(p) { return p.id === pid ? Object.assign({}, p, x) : p; }) }) : c; }) }); setModal(null); setEditItem(null); }
  function delPj(cid, pid) { save({ co: d.co.map(function(c) { return c.id === cid ? Object.assign({}, c, { pj: c.pj.filter(function(p) { return p.id !== pid; }) }) : c; }) }); if (selP === pid) { setSelP(null); setView("company"); } }
  function addTk(cid, pid, x) { save({ co: d.co.map(function(c) { return c.id === cid ? Object.assign({}, c, { pj: c.pj.map(function(p) { return p.id === pid ? Object.assign({}, p, { tk: p.tk.concat([Object.assign({}, x, { id: uid(), done: false, pinned: false })]) }) : p; }) }) : c; }) }); setModal(null); }
  function togTk(cid, pid, tid) { save({ co: d.co.map(function(c) { return c.id === cid ? Object.assign({}, c, { pj: c.pj.map(function(p) { return p.id === pid ? Object.assign({}, p, { tk: p.tk.map(function(t) { return t.id === tid ? Object.assign({}, t, { done: !t.done }) : t; }) }) : p; }) }) : c; }) }); }
  function pinTk(cid, pid, tid) { save({ co: d.co.map(function(c) { return c.id === cid ? Object.assign({}, c, { pj: c.pj.map(function(p) { return p.id === pid ? Object.assign({}, p, { tk: p.tk.map(function(t) { return t.id === tid ? Object.assign({}, t, { pinned: !t.pinned }) : t; }) }) : p; }) }) : c; }) }); }
  function delTk(cid, pid, tid) { save({ co: d.co.map(function(c) { return c.id === cid ? Object.assign({}, c, { pj: c.pj.map(function(p) { return p.id === pid ? Object.assign({}, p, { tk: p.tk.filter(function(t) { return t.id !== tid; }) }) : p; }) }) : c; }) }); }
  function pinPj(cid, pid) { save({ co: d.co.map(function(c) { return c.id === cid ? Object.assign({}, c, { pj: c.pj.map(function(p) { return p.id === pid ? Object.assign({}, p, { pinned: !p.pinned }) : p; }) }) : c; }) }); }
  function saveNotes(cid, pid, notes) { save({ co: d.co.map(function(c) { return c.id === cid ? Object.assign({}, c, { pj: c.pj.map(function(p) { return p.id === pid ? Object.assign({}, p, { notes: notes }) : p; }) }) : c; }) }); }
  function moveTk(cid, pid, from, to) {
    if (from === to) return;
    save({ co: d.co.map(function(c) {
      if (c.id !== cid) return c;
      return Object.assign({}, c, { pj: c.pj.map(function(p) {
        if (p.id !== pid) return p;
        var tk = p.tk.slice(); var item = tk.splice(from, 1)[0]; tk.splice(to, 0, item);
        return Object.assign({}, p, { tk: tk });
      }) });
    }) });
  }

  function goC(cid) { setSelC(cid); setSelP(null); setView("company"); }
  function goP(cid, pid) { setSelC(cid); setSelP(pid); setView("project"); }
  function goHome() { setView("home"); setSelC(null); setSelP(null); }

  if (loading || !d) {
    return (
      <div style={{ minHeight: "100vh", background: T.bg, display: "flex", alignItems: "center", justifyContent: "center", color: T.muted, fontFamily: "'Outfit',sans-serif" }}>Laddar...</div>
    );
  }

  var totalPj = d.co.reduce(function(s, c) { return s + c.pj.length; }, 0);
  var totalTk = allTasks.length;
  var doneTk = allTasks.filter(function(t) { return t.done; }).length;
  var overdue = allTasks.filter(function(t) { return t.deadline && !t.done && daysTo(t.deadline) < 0; }).length;

  return (
    <div style={{ minHeight: "100vh", background: T.bg, color: T.text, fontFamily: "'Outfit',sans-serif" }}>
      <style>{
        "* { box-sizing: border-box; margin: 0; padding: 0; } " +
        "::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-thumb { background: " + T.border + "; border-radius: 2px; } " +
        "input, textarea { font-family: 'Outfit', sans-serif; } " +
        "@keyframes fi { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } } " +
        "@keyframes si { from { opacity: 0; transform: translateX(-8px); } to { opacity: 1; transform: translateX(0); } } " +
        ".dov { border-color: " + T.accent + " !important; background: rgba(108,92,231,0.06) !important; }"
      }</style>

      {/* HEADER */}
      <header style={{ padding: "12px 20px", borderBottom: "1px solid " + T.border, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50, background: "rgba(10,10,15,0.95)", backdropFilter: "blur(20px)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={goHome}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: "linear-gradient(135deg," + T.accent + "," + T.accent2 + ")", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Ic n="grid" s={15} c="#fff" />
          </div>
          <span style={{ fontSize: 15, fontWeight: 800, letterSpacing: "-0.02em" }}>Dashboard</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {[
            { v: "home", n: "grid", l: "Hem" },
            { v: "week", n: "calendar", l: "Vecka" },
            { v: "all", n: "list", l: "Alla" },
          ].map(function(nav) {
            return (
              <button key={nav.v} onClick={function() { setView(nav.v); if (nav.v === "home") goHome(); }} style={{ display: "flex", alignItems: "center", gap: 4, padding: "5px 10px", borderRadius: 7, border: "none", background: view === nav.v ? T.surface : "transparent", color: view === nav.v ? T.text : T.subtle, fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                <Ic n={nav.n} s={13} c={view === nav.v ? T.accent : T.subtle} />{nav.l}
              </button>
            );
          })}
          {overdue > 0 && <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 8, background: "rgba(255,107,107,0.15)", color: T.danger, marginLeft: 4 }}>{overdue} försenade</span>}
        </div>
      </header>

      <div style={{ display: "flex", minHeight: "calc(100vh - 55px)" }}>
        {/* SIDEBAR */}
        <aside style={{ width: 220, borderRight: "1px solid " + T.border, padding: "10px 8px", overflowY: "auto", flexShrink: 0 }}>
          <button onClick={function() { setModal("co"); }} style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 9px", borderRadius: 7, border: "1px dashed " + T.border, background: "transparent", color: T.muted, fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", width: "100%", marginBottom: 6 }}>
            <Ic n="plus" s={13} c={T.muted} /> Nytt företag
          </button>
          {d.co.map(function(c, ci) {
            var sortedPj = c.pj.slice().sort(function(a, b) { return (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0); });
            return (
              <div key={c.id} style={{ animation: "si .12s ease-out " + (ci * 0.02) + "s both" }}>
                <button onClick={function() { goC(c.id); }} style={{ display: "flex", alignItems: "center", gap: 7, padding: "7px 9px", borderRadius: 7, border: "none", background: selC === c.id ? T.surface : "transparent", color: selC === c.id ? T.text : T.muted, fontSize: 11, fontWeight: selC === c.id ? 700 : 500, cursor: "pointer", fontFamily: "inherit", width: "100%", textAlign: "left" }}>
                  <div style={{ width: 22, height: 22, borderRadius: 5, background: c.color || T.accent, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Ic n={c.icon || "briefcase"} s={11} c="#fff" />
                  </div>
                  <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.name}</span>
                  <span style={{ fontSize: 9, color: T.subtle, fontFamily: "'JetBrains Mono',monospace" }}>{c.pj.length}</span>
                </button>
                {selC === c.id && (
                  <div style={{ paddingLeft: 14, marginTop: 1, display: "flex", flexDirection: "column", gap: 1 }}>
                    {sortedPj.map(function(p) {
                      var st = STATUS[p.status] || STATUS.active;
                      return (
                        <button key={p.id} onClick={function() { goP(c.id, p.id); }} style={{ display: "flex", alignItems: "center", gap: 5, padding: "4px 7px", borderRadius: 5, border: "none", background: selP === p.id ? "rgba(108,92,231,0.1)" : "transparent", color: selP === p.id ? T.text : T.muted, fontSize: 10, fontWeight: selP === p.id ? 600 : 400, cursor: "pointer", fontFamily: "inherit", width: "100%", textAlign: "left" }}>
                          {p.pinned && <Ic n="pin" s={8} c={T.pin} />}
                          <div style={{ width: 4, height: 4, borderRadius: "50%", background: st.c, flexShrink: 0 }} />
                          <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</span>
                        </button>
                      );
                    })}
                    <button onClick={function() { setSelC(c.id); setModal("pj"); }} style={{ padding: "3px 7px", borderRadius: 5, border: "none", background: "transparent", color: T.subtle, fontSize: 9, cursor: "pointer", fontFamily: "inherit", textAlign: "left" }}>+ Nytt projekt</button>
                  </div>
                )}
              </div>
            );
          })}
        </aside>

        {/* MAIN */}
        <main style={{ flex: 1, padding: "18px 22px", overflowY: "auto" }}>

          {/* HOME */}
          {view === "home" && !selC && (
            <div style={{ animation: "fi .2s ease-out" }}>
              <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 2 }}>Hej, Km</div>
              <div style={{ fontSize: 12, color: T.muted, marginBottom: 20 }}>{now.toLocaleDateString("sv-SE", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 20 }}>
                {[
                  { l: "Företag", v: d.co.length, c: T.accent },
                  { l: "Projekt", v: totalPj, c: T.accent2 },
                  { l: "Att göra", v: totalTk - doneTk, c: T.warning },
                  { l: "Klart", v: doneTk, c: T.success },
                ].map(function(s, i) {
                  return (
                    <div key={i} style={{ background: T.card, border: "1px solid " + T.border, borderRadius: 10, padding: "12px 14px" }}>
                      <div style={{ fontSize: 9, color: T.muted, marginBottom: 4 }}>{s.l}</div>
                      <div style={{ fontSize: 26, fontWeight: 800, color: s.c, fontFamily: "'JetBrains Mono',monospace", lineHeight: 1 }}>{s.v}</div>
                    </div>
                  );
                })}
              </div>
              {pinnedTasks.length > 0 && (
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 6, display: "flex", alignItems: "center", gap: 5 }}><Ic n="pin" s={13} c={T.pin} /> Nålade</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    {pinnedTasks.map(function(t) {
                      return <TaskRow key={t.id} t={t} onToggle={function() { togTk(t.cId, t.pId, t.id); }} onPin={function() { pinTk(t.cId, t.pId, t.id); }} showCtx onGo={function() { goP(t.cId, t.pId); }} />;
                    })}
                  </div>
                </div>
              )}
              {weekTasks.length > 0 && (
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 6, display: "flex", alignItems: "center", gap: 5 }}><Ic n="calendar" s={13} c={T.warning} /> Denna vecka</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    {weekTasks.slice(0, 6).map(function(t) {
                      return <TaskRow key={t.id} t={t} onToggle={function() { togTk(t.cId, t.pId, t.id); }} onPin={function() { pinTk(t.cId, t.pId, t.id); }} showCtx onGo={function() { goP(t.cId, t.pId); }} />;
                    })}
                  </div>
                </div>
              )}
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>Företag</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 8 }}>
                {d.co.map(function(c, i) {
                  var done = c.pj.reduce(function(s, p) { return s + p.tk.filter(function(t) { return t.done; }).length; }, 0);
                  var total = c.pj.reduce(function(s, p) { return s + p.tk.length; }, 0);
                  var pct = total > 0 ? Math.round(done / total * 100) : 0;
                  return (
                    <div key={c.id} onClick={function() { goC(c.id); }} style={{ background: T.card, border: "1px solid " + T.border, borderRadius: 10, padding: 14, cursor: "pointer", transition: "all .15s", animation: "fi .12s ease-out " + (i * 0.03) + "s both" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                        <div style={{ width: 28, height: 28, borderRadius: 7, background: c.color || T.accent, display: "flex", alignItems: "center", justifyContent: "center" }}><Ic n={c.icon || "briefcase"} s={14} c="#fff" /></div>
                        <div><div style={{ fontSize: 13, fontWeight: 700 }}>{c.name}</div><div style={{ fontSize: 9, color: T.muted }}>{c.pj.length} projekt</div></div>
                      </div>
                      {total > 0 && (
                        <div>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: T.muted, marginBottom: 3 }}><span>Framsteg</span><span style={{ fontFamily: "'JetBrains Mono',monospace" }}>{pct}%</span></div>
                          <div style={{ height: 3, borderRadius: 2, background: T.surface }}><div style={{ height: "100%", borderRadius: 2, background: "linear-gradient(90deg," + (c.color || T.accent) + "," + T.accent2 + ")", width: pct + "%", transition: "width .3s" }} /></div>
                        </div>
                      )}
                    </div>
                  );
                })}
                <div onClick={function() { setModal("co"); }} style={{ border: "1px dashed " + T.border, borderRadius: 10, padding: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 5, color: T.muted, fontSize: 12, fontWeight: 600, minHeight: 90 }}>
                  <Ic n="plus" s={14} c={T.muted} /> Lägg till
                </div>
              </div>
            </div>
          )}

          {/* WEEK */}
          {view === "week" && (
            <div style={{ animation: "fi .2s ease-out" }}>
              <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 2 }}>Denna vecka</div>
              <div style={{ fontSize: 12, color: T.muted, marginBottom: 16 }}>{weekTasks.length} tasks kommande 7 dagar</div>
              {weekTasks.length === 0 && <div style={{ textAlign: "center", padding: 32, color: T.subtle }}>Inga tasks med deadline denna vecka.</div>}
              {[0,1,2,3,4,5,6].map(function(off) {
                var dt = new Date(now); dt.setDate(dt.getDate() + off);
                var ds = dt.toISOString().split("T")[0];
                var dayTk = weekTasks.filter(function(t) { return t.deadline === ds; });
                if (!dayTk.length) return null;
                return (
                  <div key={off} style={{ marginBottom: 14 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: off === 0 ? T.accent : T.muted, marginBottom: 5 }}>{off === 0 ? "Idag" : off === 1 ? "Imorgon" : dt.toLocaleDateString("sv-SE", { weekday: "long", day: "numeric", month: "short" })}</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                      {dayTk.map(function(t) { return <TaskRow key={t.id} t={t} onToggle={function() { togTk(t.cId, t.pId, t.id); }} onPin={function() { pinTk(t.cId, t.pId, t.id); }} showCtx onGo={function() { goP(t.cId, t.pId); }} />; })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ALL TASKS */}
          {view === "all" && (
            <div style={{ animation: "fi .2s ease-out" }}>
              <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 2 }}>Alla tasks</div>
              <div style={{ fontSize: 12, color: T.muted, marginBottom: 16 }}>{totalTk} totalt · {doneTk} klara</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {allTasks.filter(function(t) { return !t.done; }).sort(function(a, b) { return (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0); }).map(function(t) {
                  return <TaskRow key={t.id} t={t} onToggle={function() { togTk(t.cId, t.pId, t.id); }} onPin={function() { pinTk(t.cId, t.pId, t.id); }} showCtx onGo={function() { goP(t.cId, t.pId); }} />;
                })}
              </div>
              {allTasks.some(function(t) { return t.done; }) && (
                <div style={{ marginTop: 14 }}>
                  <div style={{ fontSize: 10, color: T.subtle, marginBottom: 5 }}>Klara ({doneTk})</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    {allTasks.filter(function(t) { return t.done; }).map(function(t) {
                      return <TaskRow key={t.id} t={t} onToggle={function() { togTk(t.cId, t.pId, t.id); }} onPin={function() { pinTk(t.cId, t.pId, t.id); }} showCtx onGo={function() { goP(t.cId, t.pId); }} />;
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* COMPANY */}
          {view === "company" && co && (
            <div style={{ animation: "fi .2s ease-out" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
                <div style={{ width: 36, height: 36, borderRadius: 9, background: co.color || T.accent, display: "flex", alignItems: "center", justifyContent: "center" }}><Ic n={co.icon || "briefcase"} s={18} c="#fff" /></div>
                <div style={{ flex: 1 }}><div style={{ fontSize: 20, fontWeight: 800 }}>{co.name}</div>{co.desc && <div style={{ fontSize: 11, color: T.muted }}>{co.desc}</div>}</div>
                <button onClick={function() { setEditItem(co); setModal("editCo"); }} style={{ padding: "5px 8px", borderRadius: 6, border: "1px solid " + T.border, background: "transparent", cursor: "pointer" }}><Ic n="edit" s={13} c={T.muted} /></button>
                <button onClick={function() { delCo(co.id); }} style={{ padding: "5px 8px", borderRadius: 6, border: "1px solid rgba(255,107,107,0.2)", background: "transparent", cursor: "pointer" }}><Ic n="trash" s={13} c={T.danger} /></button>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                {co.pj.slice().sort(function(a, b) { return (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0); }).map(function(p, i) {
                  var st = STATUS[p.status] || STATUS.active;
                  var done = p.tk.filter(function(t) { return t.done; }).length;
                  var total = p.tk.length;
                  return (
                    <div key={p.id} onClick={function() { goP(co.id, p.id); }} style={{ background: T.card, border: "1px solid " + T.border, borderRadius: 9, padding: "12px 14px", cursor: "pointer", transition: "all .12s", animation: "fi .1s ease-out " + (i * 0.02) + "s both" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                            {p.pinned && <Ic n="pin" s={11} c={T.pin} />}
                            <span style={{ fontSize: 13, fontWeight: 700 }}>{p.name}</span>
                            <span style={{ fontSize: 8, fontWeight: 600, padding: "1px 5px", borderRadius: 4, background: st.bg, color: st.c }}>{st.l}</span>
                          </div>
                          {p.description && <div style={{ fontSize: 10, color: T.muted, marginTop: 2 }}>{p.description}</div>}
                        </div>
                        {total > 0 && <div style={{ fontSize: 16, fontWeight: 800, fontFamily: "'JetBrains Mono',monospace", color: done === total ? T.success : T.text }}>{done}/{total}</div>}
                        <button onClick={function(e) { e.stopPropagation(); pinPj(co.id, p.id); }} style={{ background: "none", border: "none", cursor: "pointer", padding: 3 }}><Ic n="pin" s={12} c={p.pinned ? T.pin : T.subtle} /></button>
                      </div>
                    </div>
                  );
                })}
              </div>
              <button onClick={function() { setModal("pj"); }} style={{ marginTop: 6, display: "flex", alignItems: "center", gap: 5, padding: "8px 12px", borderRadius: 7, border: "1px dashed " + T.border, background: "transparent", color: T.muted, fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", width: "100%" }}><Ic n="plus" s={12} c={T.muted} /> Nytt projekt</button>
            </div>
          )}

          {/* PROJECT */}
          {view === "project" && co && pr && (
            <div style={{ animation: "fi .2s ease-out" }}>
              <button onClick={function() { setSelP(null); setView("company"); }} style={{ display: "flex", alignItems: "center", gap: 3, background: "none", border: "none", color: T.accent, fontSize: 10, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", marginBottom: 10 }}>← {co.name}</button>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                {pr.pinned && <Ic n="pin" s={13} c={T.pin} />}
                <span style={{ fontSize: 18, fontWeight: 800 }}>{pr.name}</span>
                <span style={{ fontSize: 8, fontWeight: 600, padding: "2px 5px", borderRadius: 4, background: (STATUS[pr.status] || STATUS.active).bg, color: (STATUS[pr.status] || STATUS.active).c }}>{(STATUS[pr.status] || STATUS.active).l}</span>
                <div style={{ marginLeft: "auto", display: "flex", gap: 3 }}>
                  <button onClick={function() { pinPj(co.id, pr.id); }} style={{ padding: "4px 6px", borderRadius: 5, border: "1px solid " + T.border, background: "transparent", cursor: "pointer" }}><Ic n="pin" s={11} c={pr.pinned ? T.pin : T.subtle} /></button>
                  <button onClick={function() { setEditItem(pr); setModal("editPj"); }} style={{ padding: "4px 6px", borderRadius: 5, border: "1px solid " + T.border, background: "transparent", cursor: "pointer" }}><Ic n="edit" s={11} c={T.muted} /></button>
                  <button onClick={function() { delPj(co.id, pr.id); }} style={{ padding: "4px 6px", borderRadius: 5, border: "1px solid rgba(255,107,107,0.2)", background: "transparent", cursor: "pointer" }}><Ic n="trash" s={11} c={T.danger} /></button>
                </div>
              </div>
              {pr.description && <div style={{ fontSize: 11, color: T.muted, marginBottom: 12 }}>{pr.description}</div>}

              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 10, fontWeight: 600, color: T.subtle, marginBottom: 3, display: "flex", alignItems: "center", gap: 4 }}><Ic n="file" s={11} c={T.subtle} /> Anteckningar</div>
                <textarea value={pr.notes || ""} onChange={function(e) { saveNotes(co.id, pr.id, e.target.value); }} placeholder="Skriv anteckningar här..." rows={3} style={{ width: "100%", padding: "8px 10px", borderRadius: 7, border: "1px solid " + T.border, background: T.card, color: T.text, fontSize: 11, outline: "none", resize: "vertical", lineHeight: 1.6 }} />
              </div>

              <div style={{ fontSize: 10, fontWeight: 600, color: T.subtle, marginBottom: 4 }}>Tasks ({pr.tk.filter(function(t) { return !t.done; }).length} aktiva)</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {pr.tk.map(function(t, i) {
                  var days = daysTo(t.deadline);
                  var over = days !== null && days < 0 && !t.done;
                  var deadlineLabel = "";
                  if (days !== null) {
                    if (over) deadlineLabel = "Försenad";
                    else if (days === 0) deadlineLabel = "Idag";
                    else if (days === 1) deadlineLabel = "Imorgon";
                    else deadlineLabel = days + "d kvar";
                  }
                  var pri = PRIO[t.priority] || PRIO.medium;
                  return (
                    <div key={t.id} draggable
                      onDragStart={function() { setDragIdx(i); }}
                      onDragOver={function(e) { e.preventDefault(); e.currentTarget.classList.add("dov"); }}
                      onDragLeave={function(e) { e.currentTarget.classList.remove("dov"); }}
                      onDrop={function(e) { e.currentTarget.classList.remove("dov"); moveTk(co.id, pr.id, dragIdx, i); setDragIdx(null); }}
                      style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 10px", borderRadius: 7, background: t.done ? "rgba(0,184,148,0.03)" : T.card, border: "1px solid " + (over ? "rgba(255,107,107,0.15)" : t.done ? "rgba(0,184,148,0.08)" : T.border), cursor: "grab", transition: "all .1s" }}>
                      <Ic n="grip" s={10} c={T.subtle} />
                      <button onClick={function() { togTk(co.id, pr.id, t.id); }} style={{ width: 18, height: 18, borderRadius: 5, border: t.done ? "none" : "2px solid " + T.border, background: t.done ? T.success : "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        {t.done && <Ic n="check" s={11} c="#fff" />}
                      </button>
                      <div style={{ flex: 1 }}>
                        <span style={{ fontSize: 12, fontWeight: 500, color: t.done ? T.muted : T.text, textDecoration: t.done ? "line-through" : "none" }}>{t.text}</span>
                        {t.deadline && <span style={{ fontSize: 9, color: over ? T.danger : days === 0 ? T.warning : T.subtle, marginLeft: 6 }}>{deadlineLabel}</span>}
                      </div>
                      {t.priority && <span style={{ fontSize: 8, fontWeight: 700, padding: "1px 5px", borderRadius: 4, background: pri.bg, color: pri.c }}>{pri.l}</span>}
                      <button onClick={function() { pinTk(co.id, pr.id, t.id); }} style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}><Ic n="pin" s={10} c={t.pinned ? T.pin : T.subtle} /></button>
                      <button onClick={function() { delTk(co.id, pr.id, t.id); }} style={{ background: "none", border: "none", cursor: "pointer", padding: 2, opacity: 0.3 }}><Ic n="x" s={10} c={T.muted} /></button>
                    </div>
                  );
                })}
              </div>
              <button onClick={function() { setModal("tk"); }} style={{ marginTop: 4, display: "flex", alignItems: "center", gap: 5, padding: "7px 10px", borderRadius: 7, border: "1px dashed " + T.border, background: "transparent", color: T.muted, fontSize: 10, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", width: "100%" }}><Ic n="plus" s={11} c={T.muted} /> Ny task</button>
            </div>
          )}
        </main>
      </div>

      {/* MODAL */}
      {modal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }} onClick={function() { setModal(null); setEditItem(null); }}>
          <div style={{ background: T.card, border: "1px solid " + T.border, borderRadius: 14, padding: 22, width: "100%", maxWidth: 380, animation: "fi .1s ease-out" }} onClick={function(e) { e.stopPropagation(); }}>
            {(modal === "co" || modal === "editCo") && <CoForm init={editItem} onSave={modal === "editCo" ? function(x) { updCo(editItem.id, x); } : addCo} onClose={function() { setModal(null); setEditItem(null); }} />}
            {(modal === "pj" || modal === "editPj") && <PjForm init={editItem} onSave={modal === "editPj" ? function(x) { updPj(selC, editItem.id, x); } : function(x) { addPj(selC, x); }} onClose={function() { setModal(null); setEditItem(null); }} />}
            {modal === "tk" && <TkForm onSave={function(x) { addTk(selC, selP, x); }} onClose={function() { setModal(null); }} />}
          </div>
        </div>
      )}
    </div>
  );
}
