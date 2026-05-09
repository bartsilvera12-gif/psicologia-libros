/* ─── Panel de Administración — Psicología Libros ─── */

const ADMIN_USER = "admin";
const ADMIN_PASS = "psicologia2025";
const SESSION_KEY = "pl_admin_session";

/* ── Utilidades ─────────────────────────────────── */
const fmt = (n) => new Intl.NumberFormat("es-PY").format(n);

/* ── Iconos SVG inline ──────────────────────────── */
const IcoBooks     = () => <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"/></svg>;
const IcoCats      = () => <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6"><path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z"/><path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z"/></svg>;
const IcoFaqs      = () => <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6"><path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"/></svg>;
const IcoDash      = () => <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z"/></svg>;
const IcoPlus      = () => <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15"/></svg>;
const IcoEdit      = () => <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125"/></svg>;
const IcoTrash     = () => <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/></svg>;
const IcoLogout    = () => <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"/></svg>;
const IcoX         = () => <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12"/></svg>;
const IcoRefresh   = () => <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"/></svg>;
const IcoStar      = () => <svg width="13" height="13" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/></svg>;
const IcoEye       = () => <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178Z"/><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/></svg>;
const IcoSearch    = () => <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"/></svg>;

/* ── Componentes UI ──────────────────────────────── */
const Spinner = () => (
  <div className="flex items-center justify-center py-16">
    <div className="w-8 h-8 border-2 border-pl-gold/30 border-t-pl-gold rounded-full animate-spin" />
  </div>
);

const Toast = ({ msg, type = "ok", onDone }) => {
  React.useEffect(() => { const t = setTimeout(onDone, 3000); return () => clearTimeout(t); }, []);
  return (
    <div className={`fixed bottom-6 right-6 z-[200] px-5 py-3 text-[13px] font-medium shadow-card-hv flex items-center gap-3 fade-in
      ${type === "ok" ? "bg-pl-coal text-pl-ivory" : "bg-pl-red text-white"}`}>
      {type === "ok" ? "✓" : "✕"} {msg}
    </div>
  );
};

const Modal = ({ title, onClose, children, wide = false }) =>
  ReactDOM.createPortal(
    (
      <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
        <div className={`modal fade-in${wide ? " modal-wide" : ""}`}>
          <div className="flex items-center justify-between px-6 py-4 shrink-0" style={{ background:"#111111", borderBottom:"2px solid #C9A24A" }}>
            <h3 className="font-display text-white text-[22px] tracking-tight">{title}</h3>
            <button onClick={onClose}
                    className="w-8 h-8 flex items-center justify-center transition-colors"
                    style={{ color:"rgba(255,255,255,0.4)" }}
                    onMouseEnter={e=>e.currentTarget.style.color="white"}
                    onMouseLeave={e=>e.currentTarget.style.color="rgba(255,255,255,0.4)"}>
              <IcoX />
            </button>
          </div>
          <div className="px-6 py-6">{children}</div>
        </div>
      </div>
    ),
    document.body
  );

const Field = ({ label, children, hint }) => (
  <div className="mb-4">
    <label className="block text-[10px] tracking-[0.2em] uppercase font-semibold mb-1.5" style={{ color:"#A4842F" }}>{label}</label>
    {children}
    {hint && <p className="text-[11px] mt-1.5 leading-relaxed" style={{ color:"#8a7a65" }}>{hint}</p>}
  </div>
);

const Input = (props) => (
  <input {...props} className={`w-full border border-[#DDD0B6] px-3 py-2.5 text-[13px] bg-white focus:border-pl-gold transition-colors ${props.className || ""}`} />
);

/* AdminCustomSelect — dropdown estilizado para el panel admin */
const AdminCustomSelect = ({ value, onChange, options = [], className = "", disabled = false, placeholder = "Seleccionar…" }) => {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);

  React.useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const selected = options.find(o => String(o.value) === String(value));

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen(o => !o)}
        className={`w-full flex items-center justify-between gap-2 border border-[#DDD0B6] px-3 py-2.5 text-[13px] bg-white transition-colors text-left focus:outline-none focus:border-pl-gold
          ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer hover:border-pl-gold"}`}>
        <span className="flex items-center gap-2 truncate min-w-0">
          {selected?.dot && <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: selected.dot }} />}
          <span className={`truncate ${selected ? "text-gray-900" : "text-gray-400"}`}>
            {selected?.label || placeholder}
          </span>
        </span>
        <svg width="11" height="11" viewBox="0 0 11 11" fill="none" className="shrink-0 text-gray-400"
             style={{ transition:"transform 0.18s", transform: open ? "rotate(180deg)" : "none" }}>
          <path d="M2 3.5l3.5 3.5 3.5-3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      {open && (
        <div className="absolute left-0 right-0 top-full bg-white border border-[#DDD0B6] border-t-0 shadow-card-hv overflow-y-auto" style={{ zIndex:500, maxHeight:256 }}>
          {options.map(opt => {
            const isSelected = String(opt.value) === String(value);
            return (
              <button
                key={String(opt.value)}
                type="button"
                onClick={() => { onChange(opt.value); setOpen(false); }}
                className={`w-full flex items-center justify-between px-3 py-2.5 text-[12px] text-left transition-colors
                  ${isSelected ? "bg-amber-50 text-gray-900 font-medium" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}>
                <span className="flex items-center gap-2">
                  {opt.dot && <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: opt.dot }} />}
                  <span className="truncate">{opt.label}</span>
                </span>
                {isSelected && (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="shrink-0 ml-2">
                    <path d="M2 6l3 3 5-5" stroke="#A4842F" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

const Textarea = ({ resizable = false, ...props }) => (
  <textarea {...props} rows={props.rows || 3} className={`w-full border border-[#DDD0B6] px-3 py-2.5 text-[13px] bg-white focus:border-pl-gold transition-colors leading-relaxed ${resizable ? "resize-y" : "resize-none"} ${props.className || ""}`} />
);

const Btn = ({ children, variant = "primary", size = "md", ...props }) => {
  const base = "inline-flex items-center gap-2 font-medium transition-colors cursor-pointer";
  const sizes = { sm: "px-3 py-1.5 text-[12px]", md: "px-4 py-2.5 text-[13px]", lg: "px-6 py-3 text-[14px]" };
  const variants = {
    primary:  "bg-pl-coal text-pl-ivory hover:bg-black",
    gold:     "bg-pl-gold text-white hover:bg-pl-gold-dk",
    danger:   "bg-pl-red text-white hover:bg-pl-red-dk",
    outline:  "border border-gray-200 text-gray-700 hover:border-gray-400 bg-white",
    ghost:    "text-gray-500 hover:text-gray-900",
  };
  return <button {...props} className={`${base} ${sizes[size]} ${variants[variant]} ${props.className || ""}`}>{children}</button>;
};

/* ── LOGIN ──────────────────────────────────────── */
const IcoEyeOff = () => <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"/></svg>;
const IcoEyeOn  = () => <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178Z"/><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/></svg>;

const AdminLogin = ({ onLogin }) => {
  const [user,    setUser]    = React.useState("");
  const [pass,    setPass]    = React.useState("");
  const [showPw,  setShowPw]  = React.useState(false);
  const [err,     setErr]     = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const submit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      if (user === ADMIN_USER && pass === ADMIN_PASS) {
        localStorage.setItem(SESSION_KEY, "1");
        onLogin();
      } else {
        setErr("Usuario o contraseña incorrectos");
        setLoading(false);
      }
    }, 400);
  };

  const clearErr = () => setErr("");

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F0E9DB]"
         style={{ backgroundImage: "radial-gradient(ellipse 70% 60% at 8% 50%, rgba(201,162,74,0.15), transparent)" }}>
      <div className="w-full max-w-[380px] fade-in">
        <div className="text-center mb-8">
          <img src="logosinfondo2.png" alt="" className="w-16 h-16 object-contain mx-auto mb-4" />
          <div className="font-display text-pl-coal text-[28px]">Panel Admin</div>
          <div className="text-[11px] tracking-[0.22em] uppercase text-pl-gold-dk mt-1">Psicología Libros</div>
        </div>
        <form onSubmit={submit} className="bg-white border border-[#E0D5C0] p-8 shadow-card">
          {err && <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-[12px]">{err}</div>}

          <div className="mb-4">
            <label className="block text-[11px] tracking-[0.18em] uppercase text-gray-500 font-medium mb-2">Usuario</label>
            <input type="text" value={user} onChange={e => { setUser(e.target.value); clearErr(); }}
                   className="w-full border border-gray-200 px-4 py-3 text-[14px] focus:border-pl-gold transition-colors"
                   placeholder="Usuario" autoFocus autoComplete="username" />
          </div>

          <div className="mb-6">
            <label className="block text-[11px] tracking-[0.18em] uppercase text-gray-500 font-medium mb-2">Contraseña</label>
            <div className="relative">
              <input type={showPw ? "text" : "password"} value={pass} onChange={e => { setPass(e.target.value); clearErr(); }}
                     className="w-full border border-gray-200 px-4 py-3 pr-12 text-[14px] focus:border-pl-gold transition-colors"
                     placeholder="••••••••••••" autoComplete="current-password" />
              <button type="button" onClick={() => setShowPw(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors p-1">
                {showPw ? <IcoEyeOff /> : <IcoEyeOn />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading}
                  className="w-full py-3 bg-pl-coal text-pl-ivory text-[13px] font-medium hover:bg-black transition-colors flex items-center justify-center gap-2">
            {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Ingresar"}
          </button>
        </form>
        <p className="text-center text-[11px] text-gray-400 mt-4">
          <a href="index.html" className="hover:text-pl-coal transition-colors">← Volver al sitio</a>
        </p>
      </div>
    </div>
  );
};

/* ── DASHBOARD ──────────────────────────────────── */
const StatCard = ({ label, value, sub, color = "gold", icon }) => {
  const styles = {
    gold:  { accent:"#C9A24A", bg:"#fffbf0", text:"#92700a" },
    red:   { accent:"#D71920", bg:"#fff5f5", text:"#991b1b" },
    coal:  { accent:"#111111", bg:"#f9fafb", text:"#374151" },
    green: { accent:"#2d7a45", bg:"#f0fdf4", text:"#166534" },
  };
  const s = styles[color] || styles.gold;
  return (
    <div className="bg-white p-5 fade-in" style={{ border:`1px solid #E0D5C0`, borderLeftWidth:3, borderLeftColor:s.accent }}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="text-[10px] tracking-[0.22em] uppercase font-medium mb-2" style={{ color: s.text }}>{label}</div>
          <div className="font-sans tabular-nums text-pl-coal text-[38px] font-semibold leading-none tracking-tight">{value}</div>
          {sub && <div className="text-[11px] mt-2" style={{ color: s.text, opacity:0.7 }}>{sub}</div>}
        </div>
        {icon && (
          <div className="w-9 h-9 flex items-center justify-center rounded-sm shrink-0" style={{ background: s.bg, color: s.accent }}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

const AdminDashboard = ({ books, categories }) => {
  const total      = books.length;
  const activos    = books.filter(b => b.is_active !== false).length;
  const inactivos  = total - activos;
  const destacados = books.filter(b => b.featured).length;
  const conPrecio  = books.filter(b => b.price && b.price !== "Consultar precio").length;

  const catStats = categories.map(cat => {
    const count = books.filter(b => b.category === cat.id && b.is_active !== false).length;
    return { ...cat, count };
  }).sort((a, b) => b.count - a.count);

  const maxCount = Math.max(...catStats.map(c => c.count), 1);

  const recientes = [...books].sort((a, b) => (b.id > a.id ? 1 : -1)).slice(0, 8);

  const palettes = { coal:"#1c1c1c", r:"#4a0d10", b:"#1d2a3a", i:"#c2b58f", g:"#2d3530", p:"#2a2030" };

  return (
    <div className="fade-in">
      <div className="mb-6">
        <div className="text-[10px] tracking-[0.28em] uppercase text-pl-gold-dk font-medium mb-1">Reportería</div>
        <h1 className="font-display text-pl-coal text-[32px] leading-tight">Dashboard</h1>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <StatCard label="Libros activos"   value={fmt(activos)}           sub={inactivos > 0 ? `${inactivos} inactivos` : "Todos activos"} color="gold"  icon={<IcoBooks />}  />
        <StatCard label="Categorías"       value={fmt(categories.length)} sub={`${catStats.filter(c=>c.count===0).length} vacías`}         color="coal"  icon={<IcoCats />}   />
        <StatCard label="Destacados"       value={fmt(destacados)}        sub="en carrusel"                                                color="red"   icon={<IcoStar />}   />
        <StatCard label="Con precio"       value={fmt(conPrecio)}         sub={`${total - conPrecio} a consultar`}                         color="green" icon={<IcoBooks />}  />
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Distribución por categoría */}
        <div className="bg-white border border-[#E0D5C0] p-6">
          <div className="text-[11px] tracking-[0.2em] uppercase text-gray-400 mb-5 font-medium">Libros por categoría</div>
          <div className="space-y-3">
            {catStats.map(cat => (
              <div key={cat.id}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[12px] text-gray-700">{cat.name}</span>
                  <span className="text-[12px] font-semibold text-pl-coal">{cat.count}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-sm overflow-hidden">
                  <div className="bar-fill" style={{ width: `${(cat.count / maxCount) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Libros recientes */}
        <div className="bg-white border border-[#E0D5C0] p-6">
          <div className="text-[11px] tracking-[0.2em] uppercase text-gray-400 mb-5 font-medium">Libros recientes</div>
          <div className="space-y-2">
            {recientes.map(b => (
              <div key={b.id} className="flex items-center gap-3 py-2 border-b border-[#EDE4D0] last:border-0">
                <div className="w-7 h-9 shrink-0 flex items-center justify-center text-[8px] text-pl-ivory font-medium leading-tight text-center"
                     style={{ background: palettes[b.cover?.palette] || "#1c1c1c" }}>
                  {b.cover?.short?.slice(0,4) || b.title?.slice(0,4)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[12px] text-pl-coal font-medium truncate">{b.title}</div>
                  <div className="text-[11px] text-gray-400 truncate">{b.author}</div>
                </div>
                {b.featured && <span className="text-pl-gold shrink-0"><IcoStar /></span>}
                <span className={`badge shrink-0 ${b.is_active !== false ? "badge-green" : "badge-gray"}`}>
                  {b.is_active !== false ? "activo" : "inactivo"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Resumen de estado */}
      <div className="bg-white border border-[#E0D5C0] p-6">
        <div className="text-[11px] tracking-[0.2em] uppercase text-gray-400 mb-5 font-medium">Distribución de estado</div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Disponible",      count: books.filter(b=>b.status==="disponible").length,      cls:"badge-green"  },
            { label: "Consultar",       count: books.filter(b=>b.status==="consultar").length,       cls:"badge-yellow" },
            { label: "Agotado",         count: books.filter(b=>b.status==="agotado").length,         cls:"badge-red"    },
            { label: "Por encargo",     count: books.filter(b=>b.status==="por_encargo").length,     cls:"badge-gray"   },
          ].map(s => (
            <div key={s.label} className="flex items-center gap-3 p-3 bg-[#FAF6EE]">
              <span className={`badge ${s.cls}`}>{s.label}</span>
              <span className="font-sans tabular-nums font-semibold text-pl-coal text-[22px] leading-none">{s.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ── LIBROS ─────────────────────────────────────── */
const STATUSES = ["disponible","consultar","agotado","por_encargo"];

const BookForm = ({ book, categories, onSave, onClose }) => {
  const def = book || { title:"", author:"", category_id:"", description:"", price:"", status:"consultar", featured:false, is_active:true, image_urls:[] };
  const [f, setF] = React.useState({
    title:         def.title,
    author:        def.author,
    category_id:   def.category || def.category_id || "",
    description:   def.description || "",
    price:         def.price === "Consultar precio" ? "" : (typeof window.formatPrecioGs === "function" ? window.formatPrecioGs(def.price) : (def.price || "")),
    status:        def.status || "consultar",
    featured:      def.featured || false,
    is_active:     def.is_active !== false,
    image_urls:    def.image_urls || (def.image_url ? [def.image_url] : []),
  });
  const [imgInput, setImgInput] = React.useState("");
  const [saving, setSaving] = React.useState(false);
  const [err, setErr]       = React.useState("");

  const addImgUrl = () => {
    const url = imgInput.trim();
    if (!url) return;
    upd("image_urls", [...f.image_urls, url]);
    setImgInput("");
  };
  const removeImgUrl = (idx) => upd("image_urls", f.image_urls.filter((_, i) => i !== idx));

  const upd = (k, v) => setF(p => ({ ...p, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    if (!f.title.trim() || !f.author.trim() || !f.category_id) { setErr("Completá título, autor y categoría"); return; }
    setSaving(true);
    try {
      const payload = {
        title:         f.title.trim(),
        author:        f.author.trim(),
        category_id:   f.category_id,
        description:   f.description.trim(),
        price:         f.price.trim()
          ? (typeof window.formatPrecioGs === "function" ? window.formatPrecioGs(f.price.trim()) : f.price.trim())
          : "Consultar precio",
        status:        f.status,
        cover_palette: book?.cover?.palette || book?.cover_palette || "coal",
        cover_short:   f.title.trim(),
        featured:      f.featured,
        is_active:     f.is_active,
        image_url: f.image_urls.length > 0 ? JSON.stringify(f.image_urls) : null,
      };
      if (book?.id) { await window.updatePLBook(book.id, payload); }
      else          { await window.createPLBook(payload); }
      onSave();
    } catch(e) { setErr(e.message); setSaving(false); }
  };

  return (
    <form onSubmit={submit}>
      {err && <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-[12px]">{err}</div>}
      <div className="grid grid-cols-2 gap-4">
        <Field label="Título" ><Input value={f.title}       onChange={e=>upd("title",e.target.value)}       placeholder="Título del libro" /></Field>
        <Field label="Autor"  ><Input value={f.author}      onChange={e=>upd("author",e.target.value)}      placeholder="Nombre del autor" /></Field>
      </div>
      <Field label="Categoría">
        <AdminCustomSelect
          value={f.category_id}
          onChange={v => upd("category_id", v)}
          placeholder="Seleccioná una categoría"
          options={[
            { value:"", label:"Seleccioná una categoría" },
            ...categories.map(c => ({ value:c.id, label:c.name }))
          ]}
        />
      </Field>
      <Field label="Sinopsis" hint="Texto que aparece en la página de detalle del libro. Podés escribir varios párrafos.">
        <Textarea value={f.description} onChange={e=>upd("description",e.target.value)}
                  rows={6} resizable={true} placeholder="Escribí una sinopsis del libro: de qué trata, a quién va dirigido, qué temas aborda…" />
      </Field>
      <Field label="Imágenes" hint="Podés agregar varias imágenes. La primera se usa como portada.">
        <div className="flex gap-2 items-center">
          <input
            value={imgInput}
            onChange={e => setImgInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addImgUrl(); } }}
            placeholder="Pegar URL de imagen y presionar +"
            className="flex-1 border border-[#DDD0B6] px-4 py-2.5 text-[13px] bg-white focus:border-pl-gold transition-colors"
          />
          <button
            type="button"
            onClick={addImgUrl}
            style={{ background: "#111111", borderRadius: 0, width: 42, height: 42, flexShrink: 0 }}
            className="flex items-center justify-center text-white text-[22px] font-light leading-none hover:bg-pl-gold-dk transition-colors shadow-sm"
            onMouseEnter={e=>e.currentTarget.style.background="#A4842F"}
            onMouseLeave={e=>e.currentTarget.style.background="#111111"}>
            +
          </button>
        </div>
        {f.image_urls.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {f.image_urls.map((url, i) => (
              <div key={i} className="flex items-center gap-2 bg-white border border-[#DDD0B6] pr-2 pl-1.5 py-1.5 max-w-full">
                <img src={url} alt="" className="w-8 h-10 object-cover shrink-0"
                     style={{ borderRadius: 0 }}
                     onError={e => { e.target.style.background="#f3f4f6"; e.target.src=""; }} />
                {i === 0 && (
                  <span className="text-[9px] tracking-[0.18em] uppercase font-semibold shrink-0" style={{ color:"#A4842F" }}>portada</span>
                )}
                <span className="text-[11px] text-gray-400 truncate max-w-[160px]">{url.split("/").pop()}</span>
                <button type="button" onClick={() => removeImgUrl(i)}
                        className="shrink-0 w-5 h-5 flex items-center justify-center text-gray-400 hover:text-pl-red transition-colors text-[14px]">
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Precio" hint="Dejar vacío = Consultar precio"><Input value={f.price} onChange={e=>upd("price",e.target.value)} placeholder="Ej: Gs. 150.000" /></Field>
        <Field label="Estado">
          <AdminCustomSelect
            value={f.status}
            onChange={v => upd("status", v)}
            options={STATUSES.map(s => ({ value:s, label:s.replace("_"," ") }))}
          />
        </Field>
      </div>
      <div className="flex items-center gap-6 mb-5">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input type="checkbox" checked={f.featured} onChange={e=>upd("featured",e.target.checked)} className="w-4 h-4 accent-[#C9A24A]" />
          <span className="text-[13px] text-gray-700">Destacado (carrusel)</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input type="checkbox" checked={f.is_active} onChange={e=>upd("is_active",e.target.checked)} className="w-4 h-4 accent-[#C9A24A]" />
          <span className="text-[13px] text-gray-700">Activo (visible)</span>
        </label>
      </div>
      <div className="flex justify-end gap-3 pt-4 border-t border-[#E0D0B0]">
        <Btn variant="outline" type="button" onClick={onClose}>Cancelar</Btn>
        <Btn variant="primary" type="submit" disabled={saving}>
          {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : (book ? "Guardar cambios" : "Agregar libro")}
        </Btn>
      </div>
    </form>
  );
};

const AdminBooks = ({ books, categories, onRefresh, onToast }) => {
  const [search,  setSearch]  = React.useState("");
  const [catF,    setCatF]    = React.useState("");
  const [modal,   setModal]   = React.useState(null); // null | "add" | {book}
  const [confirm, setConfirm] = React.useState(null);
  const [page,    setPage]    = React.useState(1);
  const PER = 20;

  const filtered = React.useMemo(() => {
    const q = search.toLowerCase();
    return books.filter(b => {
      if (catF && b.category !== catF) return false;
      if (!q) return true;
      return [b.title, b.author, b.description].some(s => (s||"").toLowerCase().includes(q));
    });
  }, [books, search, catF]);

  const pages = Math.ceil(filtered.length / PER);
  const slice = filtered.slice((page-1)*PER, page*PER);

  const handleDelete = async (b) => {
    try {
      await window.deletePLBook(b.id);
      if (typeof window.loadPLBooks === "function") await window.loadPLBooks();
      onRefresh();
      onToast("Libro eliminado");
    } catch (e) {
      onToast(e.message || "No se pudo eliminar el libro", "err");
    }
    setConfirm(null);
  };

  const palBg = { coal:"#1c1c1c", r:"#4a0d10", b:"#1d2a3a", i:"#c2b58f", g:"#2d3530", p:"#2a2030" };
  const catName = (id) => categories.find(c=>c.id===id)?.name || id;

  return (
    <div className="fade-in">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <div className="text-[10px] tracking-[0.28em] uppercase text-pl-gold-dk font-medium mb-1">Gestión</div>
          <h1 className="font-display text-pl-coal text-[32px] leading-tight">Libros</h1>
        </div>
        <Btn variant="primary" onClick={() => setModal("add")}><IcoPlus /> Agregar libro</Btn>
      </div>

      {/* Filtros */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="flex items-center gap-2 bg-white border border-[#E0D5C0] px-3 py-2">
          <IcoSearch />
          <input value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}} placeholder="Buscar título, autor…"
                 className="text-[13px] outline-none w-[220px]" />
        </div>
        <AdminCustomSelect
          value={catF}
          onChange={v => { setCatF(v); setPage(1); }}
          placeholder="Todas las categorías"
          options={[
            { value:"", label:"Todas las categorías" },
            ...categories.map(c => ({ value:c.id, label:c.name }))
          ]}
          className="w-[220px]"
        />
        <span className="text-[12px] text-gray-400"><span className="font-sans tabular-nums font-medium text-pl-coal/80">{filtered.length}</span> resultado{filtered.length!==1?"s":""}</span>
      </div>

      {/* Tabla */}
      <div className="bg-white border border-[#E0D5C0] overflow-x-auto">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-[#EDE4D0] bg-[#FAF6EE]">
              <th className="text-left px-4 py-3 text-[10px] tracking-[0.18em] uppercase text-gray-400 font-medium w-8">#</th>
              <th className="text-left px-4 py-3 text-[10px] tracking-[0.18em] uppercase text-gray-400 font-medium">Libro</th>
              <th className="text-left px-4 py-3 text-[10px] tracking-[0.18em] uppercase text-gray-400 font-medium">Categoría</th>
              <th className="text-left px-4 py-3 text-[10px] tracking-[0.18em] uppercase text-gray-400 font-medium">Estado</th>
              <th className="text-left px-4 py-3 text-[10px] tracking-[0.18em] uppercase text-gray-400 font-medium">Precio</th>
              <th className="text-left px-4 py-3 text-[10px] tracking-[0.18em] uppercase text-gray-400 font-medium w-24">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {slice.map(b => (
              <tr key={b.id} className="table-row border-b border-[#EDE4D0] last:border-0">
                <td className="px-4 py-3">
                  <div className="w-7 h-9 overflow-hidden shrink-0" style={{ background: palBg[b.cover?.palette] || "#1c1c1c" }}>
                    {(b.image_urls?.[0] || b.image_url)
                      ? <img src={b.image_urls?.[0] || b.image_url} alt="" className="w-full h-full object-cover" onError={e=>e.target.style.display="none"} />
                      : <div className="w-full h-full flex items-center justify-center text-[6px] text-pl-ivory leading-tight text-center p-0.5">
                          {(b.cover?.short||b.title).slice(0,6)}
                        </div>
                    }
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div>
                      <div className="text-pl-coal font-medium">{b.title}</div>
                      <div className="text-gray-400 text-[11px]">{b.author}</div>
                    </div>
                    {b.featured && <span className="text-pl-gold shrink-0"><IcoStar /></span>}
                    {b.is_active === false && <span className="badge badge-gray text-[10px]">inactivo</span>}
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-500">{catName(b.category)}</td>
                <td className="px-4 py-3">
                  <span className={`badge ${
                    b.status==="disponible" ? "badge-green" :
                    b.status==="agotado"    ? "badge-red"   :
                    b.status==="por_encargo"? "badge-gray"  : "badge-yellow"}`}>
                    {(b.status||"").replace("_"," ")}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-600 text-[12px] font-display tabular-nums">{typeof window.formatPrecioGs === "function" ? window.formatPrecioGs(b.price) : b.price}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <button onClick={()=>setModal(b)} className="p-1.5 text-gray-400 hover:text-pl-coal transition-colors" title="Editar"><IcoEdit /></button>
                    <button onClick={()=>setConfirm(b)} className="p-1.5 text-gray-400 hover:text-pl-red transition-colors" title="Eliminar del catálogo"><IcoTrash /></button>
                  </div>
                </td>
              </tr>
            ))}
            {slice.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-12 text-center text-gray-400 text-[13px]">Sin resultados</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {pages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          {Array.from({length:pages},(_,i)=>i+1).map(p=>(
            <button key={p} onClick={()=>setPage(p)}
                    className={`w-8 h-8 text-[12px] border transition-colors ${p===page ? "border-pl-coal bg-pl-coal text-white" : "border-gray-200 hover:border-gray-400"}`}>
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Modal agregar/editar */}
      {modal && (
        <Modal title={modal==="add" ? "Agregar libro" : "Editar libro"} onClose={()=>setModal(null)} wide={true}>
          <BookForm book={modal==="add" ? null : modal} categories={categories}
                    onSave={()=>{ setModal(null); onRefresh(); onToast(modal==="add"?"Libro agregado":"Cambios guardados"); }}
                    onClose={()=>setModal(null)} />
        </Modal>
      )}

      {/* Confirmar eliminación del catálogo (is_active = false) */}
      {confirm && (
        <Modal title="Eliminar libro" onClose={()=>setConfirm(null)}>
          <p className="text-[13px] text-gray-600 mb-6">¿Eliminar «<strong>{confirm.title}</strong>» de forma permanente? Esta acción borra el libro en la base de datos y ya no aparecerá en el panel ni en el sitio.</p>
          <div className="flex justify-end gap-3">
            <Btn variant="outline" onClick={()=>setConfirm(null)}>Cancelar</Btn>
            <Btn variant="danger" onClick={()=>handleDelete(confirm)}>Eliminar</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
};

/* ── CATEGORÍAS ─────────────────────────────────── */
const ICON_OPTIONS = ["brain","heart","waves","cloud","neurons","chat","seed","child","stethoscope","hourglass","link","leaf"];

const CatForm = ({ cat, onSave, onClose }) => {
  const [f, setF] = React.useState({
    id:          cat?.id          || "",
    name:        cat?.name        || "",
    description: cat?.desc        || cat?.description || "",
    icon_name:   cat?.icon_name   || "brain",
    sort_order:  cat?.sort_order  || 99,
  });
  const [saving, setSaving] = React.useState(false);
  const [err, setErr]       = React.useState("");
  const isEdit = !!cat;
  const upd = (k,v) => setF(p=>({...p,[k]:v}));

  const submit = async (e) => {
    e.preventDefault();
    if (!f.name.trim()) { setErr("El nombre es obligatorio"); return; }
    if (!isEdit && !f.id.trim()) { setErr("El ID es obligatorio"); return; }
    setSaving(true);
    try {
      if (isEdit) { await window.updatePLCategory(cat.id, { name:f.name, description:f.description, icon_name:f.icon_name, sort_order:Number(f.sort_order) }); }
      else        { await window.createPLCategory({ id:f.id.trim().toLowerCase(), name:f.name, description:f.description, icon_name:f.icon_name, sort_order:Number(f.sort_order) }); }
      onSave();
    } catch(e) { setErr(e.message); setSaving(false); }
  };

  return (
    <form onSubmit={submit}>
      {err && <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-[12px]">{err}</div>}
      {!isEdit && <Field label="ID (slug)" hint="Ej: psicologia-clinica — sin espacios, solo letras y guiones"><Input value={f.id} onChange={e=>upd("id",e.target.value)} placeholder="mi-categoria" /></Field>}
      <Field label="Nombre"><Input value={f.name} onChange={e=>upd("name",e.target.value)} placeholder="Nombre de la categoría" /></Field>
      <Field label="Descripción"><Textarea value={f.description} onChange={e=>upd("description",e.target.value)} placeholder="Descripción breve" /></Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Ícono">
          <AdminCustomSelect
            value={f.icon_name}
            onChange={v => upd("icon_name", v)}
            options={ICON_OPTIONS.map(i => ({ value:i, label:i }))}
          />
        </Field>
        <Field label="Orden"><Input type="number" value={f.sort_order} onChange={e=>upd("sort_order",e.target.value)} /></Field>
      </div>
      <div className="flex justify-end gap-3 pt-4 border-t border-[#E0D0B0]">
        <Btn variant="outline" type="button" onClick={onClose}>Cancelar</Btn>
        <Btn variant="primary" type="submit" disabled={saving}>
          {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : (isEdit?"Guardar":"Crear")}
        </Btn>
      </div>
    </form>
  );
};

const AdminCategories = ({ categories, books, onRefresh, onToast }) => {
  const [modal,   setModal]   = React.useState(null);
  const [confirm, setConfirm] = React.useState(null);

  const countBooks = (id) => books.filter(b=>b.category===id && b.is_active!==false).length;

  const handleDelete = async (c) => {
    try { await window.deletePLCategory(c.id); onRefresh(); onToast("Categoría eliminada"); }
    catch(e) { onToast(e.message,"err"); }
    setConfirm(null);
  };

  return (
    <div className="fade-in">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <div className="text-[10px] tracking-[0.28em] uppercase text-pl-gold-dk font-medium mb-1">Gestión</div>
          <h1 className="font-display text-pl-coal text-[32px] leading-tight">Categorías</h1>
        </div>
        <Btn variant="primary" onClick={()=>setModal("add")}><IcoPlus /> Nueva categoría</Btn>
      </div>

      <div className="bg-white border border-[#E0D5C0] overflow-x-auto">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-[#EDE4D0] bg-[#FAF6EE]">
              <th className="text-left px-5 py-3 text-[10px] tracking-[0.18em] uppercase text-gray-400 font-medium">ID</th>
              <th className="text-left px-5 py-3 text-[10px] tracking-[0.18em] uppercase text-gray-400 font-medium">Nombre</th>
              <th className="text-left px-5 py-3 text-[10px] tracking-[0.18em] uppercase text-gray-400 font-medium">Descripción</th>
              <th className="text-left px-5 py-3 text-[10px] tracking-[0.18em] uppercase text-gray-400 font-medium">Ícono</th>
              <th className="text-left px-5 py-3 text-[10px] tracking-[0.18em] uppercase text-gray-400 font-medium">Libros</th>
              <th className="text-left px-5 py-3 text-[10px] tracking-[0.18em] uppercase text-gray-400 font-medium w-24">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(c => (
              <tr key={c.id} className="table-row border-b border-[#EDE4D0] last:border-0">
                <td className="px-5 py-3 text-gray-400 font-mono text-[11px]">{c.id}</td>
                <td className="px-5 py-3 text-pl-coal font-medium">{c.name}</td>
                <td className="px-5 py-3 text-gray-500 max-w-[200px] truncate">{c.desc}</td>
                <td className="px-5 py-3 text-gray-400 font-mono text-[11px]">{c.icon_name || "—"}</td>
                <td className="px-5 py-3">
                  <span className="font-sans tabular-nums font-semibold text-[18px] text-pl-coal">{countBooks(c.id)}</span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-1">
                    <button onClick={()=>setModal(c)} className="p-1.5 text-gray-400 hover:text-pl-coal transition-colors"><IcoEdit /></button>
                    <button onClick={()=>setConfirm(c)} className="p-1.5 text-gray-400 hover:text-pl-red transition-colors"><IcoTrash /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <Modal title={modal==="add"?"Nueva categoría":"Editar categoría"} onClose={()=>setModal(null)}>
          <CatForm cat={modal==="add"?null:modal}
                   onSave={()=>{setModal(null);onRefresh();onToast(modal==="add"?"Categoría creada":"Cambios guardados");}}
                   onClose={()=>setModal(null)} />
        </Modal>
      )}
      {confirm && (
        <Modal title="Eliminar categoría" onClose={()=>setConfirm(null)}>
          <p className="text-[13px] text-gray-600 mb-2">¿Eliminar "<strong>{confirm.name}</strong>"?</p>
          <p className="text-[12px] text-pl-red mb-6">Esta acción es permanente. Los libros de esta categoría quedarán sin categoría.</p>
          <div className="flex justify-end gap-3">
            <Btn variant="outline" onClick={()=>setConfirm(null)}>Cancelar</Btn>
            <Btn variant="danger" onClick={()=>handleDelete(confirm)}>Eliminar</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
};

/* ── FAQS ───────────────────────────────────────── */
const FaqForm = ({ faq, onSave, onClose }) => {
  const [f, setF] = React.useState({ question: faq?.q||faq?.question||"", answer: faq?.a||faq?.answer||"", sort_order: faq?.sort_order||99 });
  const [saving, setSaving] = React.useState(false);
  const [err, setErr]       = React.useState("");
  const upd = (k,v) => setF(p=>({...p,[k]:v}));

  const submit = async (e) => {
    e.preventDefault();
    if (!f.question.trim()||!f.answer.trim()) { setErr("Pregunta y respuesta son obligatorias"); return; }
    setSaving(true);
    try {
      if (faq?.id) { await window.updatePLFaq(faq.id, { question:f.question, answer:f.answer, sort_order:Number(f.sort_order) }); }
      else         { await window.createPLFaq({ question:f.question, answer:f.answer, sort_order:Number(f.sort_order) }); }
      onSave();
    } catch(e) { setErr(e.message); setSaving(false); }
  };

  return (
    <form onSubmit={submit}>
      {err && <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-[12px]">{err}</div>}
      <Field label="Pregunta"><Input value={f.question} onChange={e=>upd("question",e.target.value)} placeholder="¿Cuál es la pregunta?" /></Field>
      <Field label="Respuesta"><Textarea value={f.answer} onChange={e=>upd("answer",e.target.value)} rows={4} placeholder="Respuesta completa…" /></Field>
      <Field label="Orden"><Input type="number" value={f.sort_order} onChange={e=>upd("sort_order",e.target.value)} /></Field>
      <div className="flex justify-end gap-3 pt-4 border-t border-[#E0D0B0]">
        <Btn variant="outline" type="button" onClick={onClose}>Cancelar</Btn>
        <Btn variant="primary" type="submit" disabled={saving}>
          {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : (faq?"Guardar":"Crear")}
        </Btn>
      </div>
    </form>
  );
};

const AdminFAQs = ({ faqs, onRefresh, onToast }) => {
  const [modal,   setModal]   = React.useState(null);
  const [confirm, setConfirm] = React.useState(null);

  const handleDelete = async (f) => {
    try { await window.deletePLFaq(f.id); onRefresh(); onToast("FAQ eliminada"); }
    catch(e) { onToast(e.message,"err"); }
    setConfirm(null);
  };

  return (
    <div className="fade-in">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <div className="text-[10px] tracking-[0.28em] uppercase text-pl-gold-dk font-medium mb-1">Gestión</div>
          <h1 className="font-display text-pl-coal text-[32px] leading-tight">Preguntas frecuentes</h1>
        </div>
        <Btn variant="primary" onClick={()=>setModal("add")}><IcoPlus /> Nueva FAQ</Btn>
      </div>

      {faqs.length === 0 ? (
        <div className="bg-white border border-[#E0D5C0] px-6 py-16 text-center">
          <div className="text-gray-300 text-[40px] mb-3">?</div>
          <div className="text-[13px] text-gray-400">No hay preguntas frecuentes cargadas</div>
          <button onClick={()=>setModal("add")} className="mt-4 text-[12px] text-pl-gold-dk hover:underline">Agregar la primera</button>
        </div>
      ) : (
        <div className="space-y-3">
          {faqs.map((f, i) => (
            <div key={f.id||i} className="bg-white border border-[#E0D5C0] hover:border-gray-300 transition-colors">
              <div className="flex items-start gap-4 px-6 py-5">
                {/* Número */}
                <div className="shrink-0 w-7 h-7 border border-pl-gold/40 flex items-center justify-center text-[11px] font-medium text-pl-gold-dk mt-0.5">
                  {i + 1}
                </div>
                {/* Contenido */}
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] font-semibold text-pl-coal mb-2 leading-snug">{f.q||f.question}</div>
                  <div className="text-[13px] text-gray-500 leading-relaxed">{f.a||f.answer}</div>
                </div>
                {/* Acciones */}
                <div className="flex items-center gap-1 shrink-0 pt-0.5">
                  <button onClick={()=>setModal(f)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] border border-gray-200 text-gray-500 hover:border-pl-coal hover:text-pl-coal transition-colors">
                    <IcoEdit /> Editar
                  </button>
                  <button onClick={()=>setConfirm(f)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] border border-gray-200 text-gray-400 hover:border-pl-red hover:text-pl-red transition-colors">
                    <IcoTrash /> Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <Modal title={modal==="add"?"Nueva FAQ":"Editar FAQ"} onClose={()=>setModal(null)}>
          <FaqForm faq={modal==="add"?null:modal}
                   onSave={()=>{setModal(null);onRefresh();onToast(modal==="add"?"FAQ creada":"Cambios guardados");}}
                   onClose={()=>setModal(null)} />
        </Modal>
      )}
      {confirm && (
        <Modal title="Eliminar FAQ" onClose={()=>setConfirm(null)}>
          <p className="text-[13px] text-gray-600 mb-6">¿Eliminar esta pregunta?</p>
          <div className="flex justify-end gap-3">
            <Btn variant="outline" onClick={()=>setConfirm(null)}>Cancelar</Btn>
            <Btn variant="danger" onClick={()=>handleDelete(confirm)}>Eliminar</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
};

/* ── VITRINA ────────────────────────────────────── */
const VITRINE_PAL_BG = { coal:"#1c1c1c", r:"#4a0d10", b:"#1d2a3a", i:"#efe6d4", g:"#2d3530", p:"#2a2030" };
const VITRINE_PAL_TXT= { coal:"#F8F4EA", r:"#F8F4EA", b:"#F8F4EA", i:"#2b2418", g:"#F8F4EA", p:"#F8F4EA" };

const AdminVitrine = ({ books, onRefresh, onToast }) => {
  const activeBooks = books.filter(b => b.is_active !== false);
  const initial = [1,2,3,4,5].map(i => books.find(b => b.vitrine_order === i) || null);
  const [slots, setSlots] = React.useState(initial);
  const [saving, setSaving] = React.useState(false);
  const [noCol, setNoCol]   = React.useState(false);

  React.useEffect(() => {
    const updated = [1,2,3,4,5].map(i => books.find(b => b.vitrine_order === i) || null);
    setSlots(updated);
  }, [books]);

  const setSlot = (i, bookId) => {
    const book = activeBooks.find(b => String(b.id) === String(bookId)) || null;
    setSlots(prev => { const n=[...prev]; n[i]=book; return n; });
  };

  const save = async () => {
    setSaving(true);
    try {
      // Limpiar vitrine_order de todos los libros que estaban en vitrina
      const prevVitrine = books.filter(b => b.vitrine_order != null);
      await Promise.all(prevVitrine.map(b => window.updatePLBook(b.id, { vitrine_order: null })));
      // Asignar nuevos
      await Promise.all(slots.map((b, i) => b ? window.updatePLBook(b.id, { vitrine_order: i+1 }) : Promise.resolve()));
      onRefresh();
      onToast("Vitrina guardada");
    } catch(e) {
      if (e.message.includes("vitrine_order") || e.message.includes("column")) {
        setNoCol(true);
        onToast("Falta crear la columna en Supabase (ver instrucciones)", "err");
      } else {
        onToast(e.message, "err");
      }
    }
    setSaving(false);
  };

  return (
    <div className="fade-in">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <div className="text-[10px] tracking-[0.28em] uppercase text-pl-gold-dk font-medium mb-1">Hero</div>
          <h1 className="font-display text-pl-coal text-[32px] leading-tight">Vitrina</h1>
        </div>
        <Btn variant="primary" onClick={save} disabled={saving}>
          {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/> : "Guardar vitrina"}
        </Btn>
      </div>

      {noCol && (
        <div className="mb-6 bg-amber-50 border border-amber-200 p-5">
          <div className="text-[12px] font-semibold text-amber-800 mb-2">Paso requerido — ejecutá este SQL en tu Supabase:</div>
          <code className="block bg-amber-100 text-amber-900 text-[12px] px-4 py-3 font-mono select-all">
            ALTER TABLE pl_books ADD COLUMN vitrine_order integer;
          </code>
          <div className="text-[11px] text-amber-700 mt-2">Supabase → SQL Editor → pegá el comando → Run</div>
        </div>
      )}

      <div className="grid grid-cols-5 gap-4 mb-6">
        {slots.map((book, i) => {
          const pal = book?.cover?.palette || "coal";
          const short = (book?.cover?.short || "").replace(/\\n/g,"\n");
          return (
            <div key={i} className="bg-white border border-[#E0D5C0] p-4">
              <div className="text-[10px] tracking-[0.2em] uppercase text-gray-400 mb-3 font-medium">Slot {i+1}{i===2?" (centro)":""}</div>
              <div className="flex justify-center mb-4">
                <div style={{ width:72, height:108, background: book ? (VITRINE_PAL_BG[pal]||"#1c1c1c") : "#f3f4f6", position:"relative", flexShrink:0 }}>
                  {book ? (
                    <>
                      <div style={{ position:"absolute", inset:8, border:"1px solid rgba(201,162,74,0.4)" }} />
                      <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", padding:"0 6px", textAlign:"center" }}>
                        <span style={{ fontFamily:"'EB Garamond',Georgia,serif", fontSize:10, lineHeight:1.3, color:VITRINE_PAL_TXT[pal] }}>{short||book.title}</span>
                      </div>
                    </>
                  ) : (
                    <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <span style={{ fontSize:22, color:"#d1d5db" }}>+</span>
                    </div>
                  )}
                </div>
              </div>
              <AdminCustomSelect
                value={book?.id ? String(book.id) : ""}
                onChange={v => setSlot(i, v)}
                placeholder="— Vacío —"
                options={[
                  { value:"", label:"— Vacío —" },
                  ...activeBooks.map(b => ({ value:String(b.id), label:b.title }))
                ]}
              />
            </div>
          );
        })}
      </div>
      <p className="text-[12px] text-gray-400">Los libros de la vitrina aparecen en el hero de la página de inicio. Al pasar el cursor se muestra el título completo y un botón para consultar.</p>
    </div>
  );
};

/* ── DESTACADOS ─────────────────────────────────── */
const AdminDestacados = ({ books, onRefresh, onToast }) => {
  const [saving, setSaving] = React.useState(null);
  const featured = books.filter(b => b.featured && b.is_active !== false);
  const palBg = { coal:"#1c1c1c", r:"#4a0d10", b:"#1d2a3a", i:"#efe6d4", g:"#2d3530", p:"#2a2030" };
  const palTxt= { coal:"#F8F4EA", r:"#F8F4EA", b:"#F8F4EA", i:"#2b2418", g:"#F8F4EA", p:"#F8F4EA" };

  const toggle = async (book) => {
    setSaving(book.id);
    try {
      await window.updatePLBook(book.id, { featured: !book.featured });
      onRefresh();
      onToast(book.featured ? "Quitado de destacados" : "Agregado a destacados");
    } catch(e) { onToast(e.message, "err"); }
    setSaving(null);
  };

  return (
    <div className="fade-in">
      <div className="mb-6">
        <div className="text-[10px] tracking-[0.28em] uppercase text-pl-gold-dk font-medium mb-1">Carrusel</div>
        <h1 className="font-display text-pl-coal text-[32px] leading-tight">Libros destacados</h1>
      </div>

      {featured.length > 0 && (
        <div className="bg-white border border-[#E0D5C0] p-5 mb-6">
          <div className="text-[11px] tracking-[0.2em] uppercase text-gray-400 mb-4 font-medium">Actualmente en el carrusel ({featured.length})</div>
          <div className="flex flex-wrap gap-3">
            {featured.map(b => {
              const pal = b.cover?.palette || "coal";
              return (
                <div key={b.id} className="flex items-center gap-2 bg-[#FAF6EE] border border-[#E0D5C0] pr-3 py-2 pl-2">
                  <div style={{ width:32, height:46, background:palBg[pal], position:"relative", flexShrink:0 }}>
                    <div style={{ position:"absolute", inset:4, border:"1px solid rgba(201,162,74,0.4)" }} />
                  </div>
                  <div>
                    <div className="text-[12px] font-medium text-pl-coal">{b.title}</div>
                    <div className="text-[11px] text-gray-400">{b.author}</div>
                  </div>
                  <button onClick={()=>toggle(b)} disabled={saving===b.id}
                          className="ml-2 text-gray-400 hover:text-pl-red transition-colors">
                    {saving===b.id ? <div className="w-3 h-3 border border-gray-300 border-t-gray-600 rounded-full animate-spin"/> : <IcoX />}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="bg-white border border-[#E0D5C0] overflow-x-auto">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-[#EDE4D0] bg-[#FAF6EE]">
              <th className="text-left px-4 py-3 text-[10px] tracking-[0.18em] uppercase text-gray-400 font-medium w-8"></th>
              <th className="text-left px-4 py-3 text-[10px] tracking-[0.18em] uppercase text-gray-400 font-medium">Libro</th>
              <th className="text-left px-4 py-3 text-[10px] tracking-[0.18em] uppercase text-gray-400 font-medium">Autor</th>
              <th className="text-left px-4 py-3 text-[10px] tracking-[0.18em] uppercase text-gray-400 font-medium">Categoría</th>
              <th className="text-center px-4 py-3 text-[10px] tracking-[0.18em] uppercase text-gray-400 font-medium w-24">Destacado</th>
            </tr>
          </thead>
          <tbody>
            {books.filter(b => b.is_active !== false).map(b => (
              <tr key={b.id} className="table-row border-b border-[#EDE4D0] last:border-0">
                <td className="px-4 py-2.5">
                  <div style={{ width:24, height:36, background:palBg[b.cover?.palette||"coal"], flexShrink:0 }} />
                </td>
                <td className="px-4 py-2.5 font-medium text-pl-coal">{b.title}</td>
                <td className="px-4 py-2.5 text-gray-400 text-[12px]">{b.author}</td>
                <td className="px-4 py-2.5 text-gray-400 text-[12px]">
                  {(window.CATEGORIES||[]).find(c=>c.id===b.category)?.name || b.category}
                </td>
                <td className="px-4 py-2.5 text-center">
                  <button onClick={()=>toggle(b)} disabled={saving===b.id}
                          className={`w-8 h-8 inline-flex items-center justify-center transition-colors ${b.featured ? "text-pl-gold" : "text-gray-300 hover:text-pl-gold"}`}
                          title={b.featured ? "Quitar de destacados" : "Agregar a destacados"}>
                    {saving===b.id
                      ? <div className="w-4 h-4 border-2 border-gray-200 border-t-pl-gold rounded-full animate-spin"/>
                      : <IcoStar />}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* ── APP PRINCIPAL ──────────────────────────────── */
const AdminApp = () => {
  const [authed,     setAuthed]     = React.useState(!!localStorage.getItem(SESSION_KEY));
  const [tab,        setTab]        = React.useState("dash");
  const [books,      setBooks]      = React.useState([]);
  const [categories, setCategories] = React.useState([]);
  const [faqs,       setFaqs]       = React.useState([]);
  const [loading,    setLoading]    = React.useState(true);
  const [toast,      setToast]      = React.useState(null);

  const loadAll = React.useCallback(async () => {
    setLoading(true);
    try {
      const [bs, cs, fs] = await Promise.all([
        window.plGetAdmin("pl_books",      "order=id.asc"),
        window.plGetAdmin("pl_categories", "order=sort_order.asc"),
        window.plGetAdmin("pl_faqs",       "order=sort_order.asc"),
      ]);
      setBooks(bs.map(window.mapBook));
      setCategories(cs.map(window.mapCategory));
      setFaqs(fs.map(r => ({ id:r.id, q:r.question, a:r.answer, sort_order:r.sort_order })));
    } catch(e) {
      showToast("Error al cargar datos: " + e.message, "err");
    }
    setLoading(false);
  }, []);

  React.useEffect(() => { if (authed) loadAll(); }, [authed]);

  const showToast = (msg, type="ok") => {
    setToast({ msg, type, key: Date.now() });
  };

  const logout = () => { localStorage.removeItem(SESSION_KEY); setAuthed(false); };

  if (!authed) return <AdminLogin onLogin={() => setAuthed(true)} />;

  const IcoVitrine = () => <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 7.125C2.25 6.504 2.754 6 3.375 6h6c.621 0 1.125.504 1.125 1.125v3.75c0 .621-.504 1.125-1.125 1.125h-6a1.125 1.125 0 0 1-1.125-1.125v-3.75ZM14.25 8.625c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v8.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 0 1-1.125-1.125v-8.25ZM3.75 16.125c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 0 1-1.125-1.125v-2.25Z"/></svg>;
  const IcoStar2 = () => <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6"><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"/></svg>;

  const NAV = [
    { id:"dash",       label:"Dashboard",   icon:<IcoDash />    },
    { id:"books",      label:"Libros",      icon:<IcoBooks />   },
    { id:"destacados", label:"Destacados",  icon:<IcoStar2 />   },
    { id:"vitrina",    label:"Vitrina",     icon:<IcoVitrine /> },
    { id:"cats",       label:"Categorías",  icon:<IcoCats />    },
    { id:"faqs",       label:"FAQs",        icon:<IcoFaqs />    },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-[230px] shrink-0 flex flex-col" style={{ background:"#111111" }}>
        {/* Logo */}
        <div className="px-5 py-5" style={{ borderBottom:"1px solid rgba(255,255,255,0.07)" }}>
          <div className="flex items-center gap-3">
            <img src="logosinfondo2.png" alt="" className="w-9 h-9 object-contain" />
            <div>
              <div className="font-display text-white text-[15px] leading-tight">Psicología<br/>Libros</div>
              <div className="text-[8px] tracking-[0.3em] uppercase mt-0.5" style={{ color:"#C9A24A" }}>Panel Admin</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {NAV.map(n => (
            <button key={n.id} onClick={()=>setTab(n.id)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-[13px] font-medium transition-all text-left rounded-sm"
                    style={tab===n.id
                      ? { background:"rgba(201,162,74,0.14)", color:"#C9A24A" }
                      : { color:"rgba(255,255,255,0.45)" }}
                    onMouseEnter={e => { if(tab!==n.id) e.currentTarget.style.background="rgba(255,255,255,0.05)"; e.currentTarget.style.color="rgba(255,255,255,0.85)"; }}
                    onMouseLeave={e => { if(tab!==n.id) { e.currentTarget.style.background=""; e.currentTarget.style.color="rgba(255,255,255,0.45)"; } }}>
              <span style={tab===n.id ? { color:"#C9A24A" } : { color:"rgba(255,255,255,0.25)" }}>{n.icon}</span>
              {n.label}
              {tab===n.id && <span className="ml-auto w-1 h-4 rounded-full" style={{ background:"#C9A24A" }} />}
            </button>
          ))}
        </nav>

        {/* Bottom actions */}
        <div className="px-3 py-4 space-y-0.5" style={{ borderTop:"1px solid rgba(255,255,255,0.07)" }}>
          <button onClick={loadAll}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-[12px] transition-all text-left rounded-sm"
                  style={{ color:"rgba(255,255,255,0.35)" }}
                  onMouseEnter={e=>{ e.currentTarget.style.background="rgba(255,255,255,0.05)"; e.currentTarget.style.color="rgba(255,255,255,0.7)"; }}
                  onMouseLeave={e=>{ e.currentTarget.style.background=""; e.currentTarget.style.color="rgba(255,255,255,0.35)"; }}>
            <IcoRefresh /> Actualizar datos
          </button>
          <a href="index.html" target="_blank"
             className="flex items-center gap-3 px-3 py-2.5 text-[12px] transition-all rounded-sm"
             style={{ color:"rgba(255,255,255,0.35)" }}
             onMouseEnter={e=>{ e.currentTarget.style.background="rgba(255,255,255,0.05)"; e.currentTarget.style.color="rgba(255,255,255,0.7)"; }}
             onMouseLeave={e=>{ e.currentTarget.style.background=""; e.currentTarget.style.color="rgba(255,255,255,0.35)"; }}>
            <IcoEye /> Ver sitio
          </a>
          <button onClick={logout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-[12px] transition-all text-left rounded-sm"
                  style={{ color:"rgba(239,68,68,0.5)" }}
                  onMouseEnter={e=>{ e.currentTarget.style.background="rgba(239,68,68,0.08)"; e.currentTarget.style.color="rgba(239,68,68,0.85)"; }}
                  onMouseLeave={e=>{ e.currentTarget.style.background=""; e.currentTarget.style.color="rgba(239,68,68,0.5)"; }}>
            <IcoLogout /> Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col min-h-0" style={{ background:"#EFE6D4" }}>
        {/* Topbar */}
        <div className="h-14 bg-white border-b border-[#E0D5C0] flex items-center justify-between px-8 shrink-0" style={{ boxShadow:"0 1px 0 rgba(17,17,17,0.04), 0 4px 16px -8px rgba(17,17,17,0.08)" }}>
          <div className="flex items-center gap-3">
            <span className="text-[10px] tracking-[0.25em] uppercase text-gray-400 font-medium">
              {NAV.find(n=>n.id===tab)?.label || "Panel"}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={loadAll} className="p-2 text-gray-400 hover:text-gray-700 transition-colors" title="Actualizar">
              <IcoRefresh />
            </button>
            <div className="w-px h-5 bg-[#E0D5C0]" />
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-pl-coal text-white text-[10px] font-bold flex items-center justify-center tracking-wide">A</div>
              <span className="text-[12px] text-gray-500 font-medium">admin</span>
            </div>
          </div>
        </div>
        <div className="flex-1 min-h-0 flex flex-col">
          <main className="flex-1 min-h-0 overflow-y-auto p-8">
            {loading ? <Spinner /> : (
              <>
                {tab==="dash"       && <AdminDashboard  books={books} categories={categories} />}
                {tab==="books"      && <AdminBooks       books={books} categories={categories} onRefresh={loadAll} onToast={showToast} />}
                {tab==="destacados" && <AdminDestacados  books={books} onRefresh={loadAll} onToast={showToast} />}
                {tab==="vitrina"    && <AdminVitrine     books={books} onRefresh={loadAll} onToast={showToast} />}
                {tab==="cats"       && <AdminCategories  categories={categories} books={books} onRefresh={loadAll} onToast={showToast} />}
                {tab==="faqs"       && <AdminFAQs        faqs={faqs} onRefresh={loadAll} onToast={showToast} />}
              </>
            )}
          </main>
        </div>
      </div>

      {toast && <Toast key={toast.key} msg={toast.msg} type={toast.type} onDone={()=>setToast(null)} />}
    </div>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<AdminApp />);
