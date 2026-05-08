// === Header ===
// homePath: "" para index.html, "index.html" para catalog page
const Header = ({ active, homePath = "" }) => {
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen]         = React.useState(false);
  const [catOpen, setCatOpen]   = React.useState(false);
  const catTimer = React.useRef(null);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const click = (e, id) => {
    e.preventDefault();
    setOpen(false);
    if (homePath) {
      window.location.href = `${homePath}#${id}`;
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const logoHref = homePath ? homePath : "#inicio";

  return (
    <header className={`relative z-50 header-blur transition-shadow ${scrolled ? "header-scrolled" : ""}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex items-center justify-between h-[78px]">
          {/* Logo mark */}
          <a href={logoHref} onClick={(e) => homePath ? null : click(e, "inicio")} className="flex items-center gap-2 group">
            <img src="logosinfondo2.png" alt="Psicología Libros" className="w-11 h-11 object-contain" />
            <div className="leading-tight">
              <div className="font-display text-pl-coal text-[20px] tracking-tight">Psicología Libros</div>
              <div className="text-[10px] tracking-[0.28em] uppercase text-pl-gold-dk -mt-0.5">Librería especializada</div>
            </div>
          </a>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {/* Inicio siempre primero */}
            {NAV.filter(n => n.id === "inicio").map(n => (
              <a key={n.id} href={homePath ? homePath : "#inicio"}
                 onClick={(e) => homePath ? null : click(e, "inicio")}
                 className={`text-[13px] tracking-wide transition-colors relative py-2 ${active === n.id ? "text-pl-red" : "text-pl-coal hover:text-pl-red"}`}>
                {n.label}
                {active === n.id && <span className="absolute -bottom-0.5 left-0 right-0 h-px bg-pl-gold" />}
              </a>
            ))}
            {/* Catálogo — link directo */}
            <a href="catalogo.html"
               className={`text-[13px] tracking-wide transition-colors relative py-2 ${window.location.pathname.includes("catalogo") ? "text-pl-red" : "text-pl-coal hover:text-pl-red"}`}>
              Catálogo
              {window.location.pathname.includes("catalogo") && <span className="absolute -bottom-0.5 left-0 right-0 h-px bg-pl-gold" />}
            </a>
            {/* FAQ — link directo */}
            <a href="faq.html"
               className={`text-[13px] tracking-wide transition-colors relative py-2 ${window.location.pathname.includes("faq") ? "text-pl-red" : "text-pl-coal hover:text-pl-red"}`}>
              FAQ
              {window.location.pathname.includes("faq") && <span className="absolute -bottom-0.5 left-0 right-0 h-px bg-pl-gold" />}
            </a>

            {/* Categorías — con mega-dropdown */}
            <div className="relative"
                 onMouseEnter={() => { clearTimeout(catTimer.current); setCatOpen(true); }}
                 onMouseLeave={() => { catTimer.current = setTimeout(() => setCatOpen(false), 150); }}>
              <button className={`inline-flex items-center gap-1 text-[13px] tracking-wide transition-colors relative py-2 ${catOpen ? "text-pl-red" : "text-pl-coal hover:text-pl-red"}`}>
                Categorías
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ marginTop: 1, transition: "transform 0.2s", transform: catOpen ? "rotate(180deg)" : "rotate(0deg)" }}>
                  <path d="M2 3.5l3 3 3-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              {catOpen && (
                <div className="fixed left-0 right-0 bg-pl-white border-b border-pl-coal/10 shadow-card-hv z-40"
                     style={{ top: 78, animation: "fadeSlideIn 0.2s ease both" }}>
                  <div className="max-w-7xl mx-auto px-6 lg:px-10 py-6">
                    <div className="flex items-center justify-between mb-5">
                      <span className="text-[10px] tracking-[0.28em] uppercase text-pl-gold-dk font-medium">Explorar por categoría</span>
                      <a href="catalogo.html" className="inline-flex items-center gap-1.5 text-[11px] tracking-[0.15em] uppercase text-pl-coal hover:text-pl-red transition-colors font-medium">
                        Ver catálogo completo <IconArrow size={10} />
                      </a>
                    </div>
                    <div className="grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-1">
                      {(window.CATEGORIES || []).map(cat => {
                        const I = cat.Icon;
                        return (
                          <a key={cat.id}
                             href={`catalogo.html?cat=${cat.id}`}
                             className="flex items-center gap-2.5 px-3 py-3 hover:bg-pl-ivory transition-colors group">
                            <span className="shrink-0 w-7 h-7 border border-pl-coal/12 flex items-center justify-center text-pl-coal/40 group-hover:border-pl-gold/60 group-hover:text-pl-gold-dk transition-colors">
                              {I ? <I size={13} /> : <span className="text-[10px]">{cat.name[0]}</span>}
                            </span>
                            <span className="text-[12px] text-pl-gray group-hover:text-pl-coal transition-colors leading-tight">{cat.name}</span>
                          </a>
                        );
                      })}
                    </div>
                  </div>
                  <div className="h-px bg-pl-gold/30" />
                </div>
              )}
            </div>
            {/* Resto del nav (excluye inicio y faq — esos tienen links directos) */}
            {NAV.filter(n => n.id !== "inicio" && n.id !== "faq").map(n => (
              <a key={n.id} href={homePath ? `${homePath}#${n.id}` : `#${n.id}`}
                 onClick={(e) => homePath ? null : click(e, n.id)}
                 className={`text-[13px] tracking-wide transition-colors relative py-2 ${active === n.id ? "text-pl-red" : "text-pl-coal hover:text-pl-red"}`}>
                {n.label}
                {active === n.id && <span className="absolute -bottom-0.5 left-0 right-0 h-px bg-pl-gold" />}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a href={waLink("Hola, quiero consultar el catálogo de Psicología Libros.")}
               target="_blank" rel="noreferrer"
               className="hidden sm:inline-flex items-center gap-2 px-5 py-3 bg-pl-red text-white text-[13px] hover:bg-pl-red-dk transition-colors">
              <IconWhatsapp size={16} />
              <span>Consultar</span>
            </a>
            <button className="lg:hidden w-10 h-10 border border-pl-coal/15 text-pl-coal flex items-center justify-center"
                    aria-label={open ? "Cerrar menú" : "Abrir menú"}
                    onClick={() => setOpen(o => !o)}>
              {open ? <IconClose /> : <IconMenu />}
            </button>
          </div>
        </div>

        {open && (
          <div className="lg:hidden border-t border-pl-coal/10 py-4">
            <nav className="flex flex-col">
              {NAV.filter(n => n.id === "inicio").map(n => (
                <a key={n.id} href={homePath ? homePath : "#inicio"}
                   onClick={(e) => homePath ? null : click(e, "inicio")}
                   className="py-3 text-[15px] text-pl-coal border-b border-pl-coal/5">
                  {n.label}
                </a>
              ))}
              <a href="catalogo.html" className="py-3 text-[15px] text-pl-coal border-b border-pl-coal/5">
                Catálogo
              </a>
              <a href="faq.html" className="py-3 text-[15px] text-pl-coal border-b border-pl-coal/5">
                FAQ
              </a>
              <div className="border-b border-pl-coal/5">
                <div className="py-3 text-[15px] text-pl-coal">Categorías</div>
                <div className="pb-2 flex flex-col gap-0.5">
                  {(window.CATEGORIES || []).map(cat => (
                    <a key={cat.id} href={`catalogo.html?cat=${cat.id}`}
                       className="pl-4 py-2 text-[13px] text-pl-gray hover:text-pl-red transition-colors">
                      {cat.name}
                    </a>
                  ))}
                </div>
              </div>
              {NAV.filter(n => n.id !== "inicio" && n.id !== "faq").map(n => (
                <a key={n.id} href={homePath ? `${homePath}#${n.id}` : `#${n.id}`}
                   onClick={(e) => homePath ? null : click(e, n.id)}
                   className="py-3 text-[15px] text-pl-coal border-b border-pl-coal/5 last:border-0">
                  {n.label}
                </a>
              ))}
              <a href={waLink("Hola, quiero consultar el catálogo de Psicología Libros.")}
                 target="_blank" rel="noreferrer"
                 className="mt-3 inline-flex items-center justify-center gap-2 px-5 py-3 bg-pl-red text-white text-[13px]">
                <IconWhatsapp size={16} /> Consultar por WhatsApp
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

// === Logo imagen sin fondo ===
const LogoSVG = ({ size = 280 }) => (
  <img
    src="logosinfondo2.png"
    alt="Psicología Libros"
    width={size}
    height={size}
    style={{ width: size, height: size, objectFit: "contain", display: "block" }}
  />
);

// === Vitrina del hero ===
const VITRINE_FALLBACK = [
  { pal:"r",    short:"Trauma\n& Duelo",      title:"Trauma & Duelo",      author:"", cat:"trauma"      },
  { pal:"b",    short:"Neuro-\npsicología",   title:"Neuropsicología",     author:"", cat:"neuro"       },
  { pal:"coal", short:"La Mente\nHumana",     title:"La Mente Humana",     author:"", cat:"clinica"     },
  { pal:"g",    short:"Mind-\nfulness",       title:"Mindfulness",         author:"", cat:"mindfulness" },
  { pal:"p",    short:"Salud\nMental",        title:"Salud Mental",        author:"", cat:"salud"       },
];
const VIT_SLOTS = [
  { pos:"absolute", style:{ left:"10%",  bottom:0, transform:"rotate(-10deg)", zIndex:1 }, w:100, h:150 },
  { pos:"absolute", style:{ left:"28%",  bottom:0, transform:"rotate(-4deg)",  zIndex:2 }, w:100, h:152 },
  { pos:"relative", style:{ zIndex:3 },                                                    w:115, h:172, center:true },
  { pos:"absolute", style:{ right:"28%", bottom:0, transform:"rotate(4deg)",   zIndex:2 }, w:100, h:152 },
  { pos:"absolute", style:{ right:"10%", bottom:0, transform:"rotate(10deg)",  zIndex:1 }, w:100, h:150 },
];
const VIT_BG  = { coal:"#111111", r:"#7a0d12", b:"#0e2640", i:"#efe6d4", g:"#122b1a", p:"#2b0e4a" };
const VIT_TXT = { coal:"#F8F4EA", r:"#F8F4EA", b:"#F8F4EA", i:"#2b2418", g:"#F8F4EA", p:"#F8F4EA" };
const VIT_LBL = { coal:"rgba(201,162,74,0.65)", r:"rgba(229,180,100,0.6)", b:"rgba(160,190,230,0.5)", i:"rgba(91,74,34,0.55)", g:"rgba(120,190,120,0.45)", p:"rgba(190,140,220,0.5)" };
const VIT_ACC = { coal:"#C9A24A", r:"#e8a060", b:"#7aaedc", i:"#9a7a30", g:"#6bbf6b", p:"#b080d8" };

const VitrineBook = ({ book, fb, slot, isCenter }) => {
  const [hov, setHov] = React.useState(false);
  const pal   = book?.cover?.palette || fb.pal;
  const short = (book?.cover?.short || fb.short).replace(/\\n/g,"\n");
  const title = book?.title || fb.title;
  const author= book?.author || fb.author;

  const baseTransform = slot.style.transform || "";

  const wrapStyle = {
    position: slot.pos === "relative" ? "relative" : "absolute",
    ...slot.style,
    transition: "transform 0.32s cubic-bezier(0.34,1.56,0.64,1), filter 0.3s ease, z-index 0s",
    animation: (slot.pos === "relative" && isCenter && !hov) ? "logoFloat 5s ease-in-out infinite" : "none",
    ...(hov ? {
      transform: baseTransform ? `${baseTransform} scale(1.22) translateY(-18px)` : "scale(1.22) translateY(-18px)",
      zIndex: 20,
      filter: "drop-shadow(0 24px 48px rgba(0,0,0,0.5))",
    } : {
      transform: baseTransform || undefined,
    }),
    cursor: "pointer",
  };

  const handleClick = () => {
    if (book) {
      window.location.href = `libro.html?id=${book.id}`;
    } else {
      // Busca el primer libro real de esa categoría
      const match = (window.BOOKS || []).find(b => b.category === fb.cat && b.is_active !== false);
      window.location.href = match ? `libro.html?id=${match.id}` : "catalogo.html";
    }
  };

  return (
    <div style={wrapStyle}
         onMouseEnter={() => setHov(true)}
         onMouseLeave={() => setHov(false)}
         onClick={handleClick}>
      <div className={`hero-book ${isCenter ? "shadow-card-hv" : "shadow-card"}`}
           style={{ width:slot.w, height:slot.h, background:VIT_BG[pal]||"#111111", position:"relative" }}>
        {/* Inner border */}
        <div style={{ position:"absolute", inset:10, border:`1px solid ${VIT_LBL[pal]||"rgba(201,162,74,0.45)"}` }} />
        {/* Corner accents */}
        <div style={{ position:"absolute", top:6, left:6, width:10, height:10, borderTop:`1px solid ${VIT_ACC[pal]||"#C9A24A"}`, borderLeft:`1px solid ${VIT_ACC[pal]||"#C9A24A"}`, opacity:0.7 }} />
        <div style={{ position:"absolute", bottom:6, right:6, width:10, height:10, borderBottom:`1px solid ${VIT_ACC[pal]||"#C9A24A"}`, borderRight:`1px solid ${VIT_ACC[pal]||"#C9A24A"}`, opacity:0.7 }} />
        {/* Texto portada */}
        <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:5, padding:"0 12px", textAlign:"center",
                      opacity: hov ? 0 : 1, transition:"opacity 0.18s" }}>
          <span style={{ fontSize:8, letterSpacing:"0.28em", textTransform:"uppercase", color:VIT_ACC[pal]||"#C9A24A", opacity:0.85 }}>P·L</span>
          <div style={{ width:18, height:1, background:VIT_LBL[pal]||"rgba(201,162,74,0.4)" }} />
          <span className="font-display" style={{ fontSize:isCenter?15:12, lineHeight:1.3, color:VIT_TXT[pal] }}>
            {short.split("\n").map((l,i,a) => <React.Fragment key={i}>{l}{i<a.length-1&&<br/>}</React.Fragment>)}
          </span>
        </div>
        {/* Overlay hover — aparece sobre el libro ya escalado */}
        <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.88)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:7, padding:"12px 10px", textAlign:"center",
                      opacity: hov ? 1 : 0, transition:"opacity 0.18s", pointerEvents: hov ? "auto" : "none" }}>
          <span style={{ fontSize:8, letterSpacing:"0.25em", textTransform:"uppercase", color:VIT_ACC[pal]||"#C9A24A" }}>Psicología Libros</span>
          <span className="font-display" style={{ fontSize:isCenter?13:11, lineHeight:1.3, color:"#F8F4EA" }}>
            {title.split(" ").slice(0,6).join(" ")}
          </span>
          {author && <span style={{ fontSize:9, color:"rgba(255,255,255,0.55)" }}>por {author}</span>}
          {book && (
            <span style={{ marginTop:5, padding:"4px 12px", background:VIT_ACC[pal]||"#C9A24A", color:"#fff", fontSize:8, letterSpacing:"0.18em", textTransform:"uppercase", display:"block" }}>
              Ver libro →
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

const HeroVitrine = () => {
  const vitrine = React.useMemo(() => {
    const books = (window.BOOKS || []).filter(b => b.vitrine_order != null && b.is_active !== false);
    const slots = [null,null,null,null,null];
    books.forEach(b => { if (b.vitrine_order >= 1 && b.vitrine_order <= 5) slots[b.vitrine_order-1] = b; });
    return slots;
  }, []);

  return (
    <div className="relative h-[220px] flex items-end justify-center">
      {VIT_SLOTS.map((slot, i) => (
        <VitrineBook key={i} book={vitrine[i]} fb={VITRINE_FALLBACK[i]} slot={slot} isCenter={!!slot.center} />
      ))}
    </div>
  );
};

// === Hero ===
const Hero = () => (
  <section id="inicio" className="hero-texture relative min-h-screen flex items-center overflow-hidden">
    {/* ── Fondo decorativo ── */}
    <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
      {/* Blobs de color */}
      <div className="absolute top-1/4 left-0 w-[600px] h-[600px] bg-pl-gold/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-pl-red/6 rounded-full blur-[120px]" />
      <div className="absolute top-1/2 right-0 w-[350px] h-[350px] bg-pl-gold/8 rounded-full blur-[80px]" />

      {/* Watermark — texto detrás */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
        <span className="font-display italic text-[13vw] leading-none text-pl-gold/[0.07] whitespace-nowrap tracking-widest select-none">
          Psicología
        </span>
        <span className="font-display text-[8vw] leading-none text-pl-coal/[0.04] whitespace-nowrap tracking-[0.5em] uppercase select-none">
          Libros
        </span>
      </div>

      {/* Líneas horizontales decorativas */}
      <div className="absolute top-[38%] left-0 right-0 h-px bg-pl-gold/12" />
      <div className="absolute top-[62%] left-0 right-0 h-px bg-pl-gold/8" />

      {/* Marca de registro — esquina superior izquierda */}
      <div className="absolute top-[88px] left-10 hidden lg:block">
        <div className="w-8 h-8 border-t border-l border-pl-gold/35" />
      </div>
      {/* Esquina superior derecha */}
      <div className="absolute top-[88px] right-10 hidden lg:block">
        <div className="w-8 h-8 border-t border-r border-pl-gold/35" />
      </div>
      {/* Esquina inferior izquierda */}
      <div className="absolute bottom-8 left-10 hidden lg:block">
        <div className="w-8 h-8 border-b border-l border-pl-gold/35" />
      </div>
      {/* Esquina inferior derecha */}
      <div className="absolute bottom-8 right-10 hidden lg:block">
        <div className="w-8 h-8 border-b border-r border-pl-gold/35" />
      </div>

      {/* Línea vertical decorativa centro */}
      <div className="absolute top-[12%] bottom-[12%] left-1/2 w-px bg-gradient-to-b from-transparent via-pl-gold/15 to-transparent hidden lg:block" />
    </div>

    <div className="max-w-7xl mx-auto px-6 lg:px-10 w-full py-16 lg:py-20">
      <div className="grid lg:grid-cols-2 gap-10 lg:gap-20 items-center">

        {/* ── Columna izquierda: Logo ── */}
        <div className="flex flex-col items-center lg:items-start"
             style={{ animation: "logoReveal 0.95s cubic-bezier(0.2,0.8,0.2,1) both" }}>

          <div style={{ animation: "logoFloat 6s ease-in-out infinite, glowPulse 4s ease-in-out infinite" }}>
            <img src="logosinfondo2.png" alt="Psicología Libros"
                 style={{ width: 340, height: 340, objectFit: "contain", display: "block" }} />
          </div>

          <div className="mt-8 flex flex-wrap justify-center lg:justify-start gap-4"
               style={{ animation: "fadeSlideIn 0.8s 0.55s both" }}>
            <a href="catalogo.html"
               className="inline-flex items-center gap-2 px-8 py-4 bg-pl-coal text-pl-ivory text-[14px] tracking-wide hover:bg-black transition-colors">
              Ver catálogo <IconArrow size={15} />
            </a>
            <a href={waLink("Hola, quiero consultar el catálogo de Psicología Libros.")}
               target="_blank" rel="noreferrer"
               className="inline-flex items-center gap-2 px-8 py-4 bg-pl-red text-white text-[14px] tracking-wide hover:bg-pl-red-dk transition-colors">
              <IconWhatsapp size={16} /> WhatsApp
            </a>
          </div>
        </div>

        {/* ── Columna derecha: vitrina de libros ── */}
        <div className="relative" style={{ animation: "fadeSlideIn 0.9s 0.35s both" }}>
          <div className="bg-pl-white p-8 shadow-card-hv border border-pl-coal/6 relative">
            {/* Gold corner accent */}
            <div className="absolute top-0 right-0 w-20 h-px bg-pl-gold" />
            <div className="absolute top-0 right-0 w-px h-20 bg-pl-gold" />
            <div className="absolute bottom-0 left-0 w-12 h-px bg-pl-gold/40" />

            {/* Eyebrow */}
            <div className="eyebrow mb-6">Catálogo especializado</div>

            {/* Libros en abanico — tomados de los destacados */}
            <HeroVitrine />

            {/* Stats — EB Garamond (coherente con el resto del sitio) */}
            <div className="relative z-10 mt-8 pt-6 border-t border-pl-coal/8 grid grid-cols-3 text-center gap-1">
              <div className="min-w-0 px-1">
                <div className="font-display tabular-nums font-semibold text-pl-coal text-[26px] sm:text-[28px] tracking-tight leading-none">+1.000</div>
                <div className="font-display text-[10px] tracking-[0.22em] uppercase text-pl-gray mt-1.5">Títulos</div>
              </div>
              <div className="border-x border-pl-coal/8 min-w-0 px-1">
                <div className="font-display tabular-nums font-semibold text-pl-coal text-[26px] sm:text-[28px] tracking-tight leading-none">12</div>
                <div className="font-display text-[10px] tracking-[0.22em] uppercase text-pl-gray mt-1.5">Categorías</div>
              </div>
              <div className="min-w-0 px-1">
                <div className="font-display tabular-nums font-semibold text-pl-coal text-[26px] sm:text-[28px] tracking-tight leading-none">100%</div>
                <div className="font-display text-[10px] tracking-[0.22em] uppercase text-pl-gray mt-1.5">Especializado</div>
              </div>
            </div>
          </div>

          {/* Cita — fuera del bloque blanco (a la izquierda de la columna) para no tapar +1.000 */}
          <div
            className="absolute -bottom-3 left-0 max-w-[158px] -translate-x-[calc(100%+1.25rem)] bg-pl-coal text-pl-ivory px-3.5 py-3 shadow-card hidden lg:block z-[1]"
            style={{ animation: "fadeSlideIn 1.1s 0.7s both" }}
          >
            <span className="font-display text-pl-gold text-[20px] leading-none block opacity-90">"</span>
            <p className="font-display italic text-[12px] leading-snug mt-0.5 text-pl-ivory/95">Sabiduría en cada página</p>
            <div className="mt-2 font-display text-[8px] tracking-[0.24em] uppercase text-pl-gold font-medium">Psicología Libros</div>
          </div>
        </div>

      </div>
    </div>
  </section>
);

// === Custom Select — reemplaza <select> nativo ===
const CustomSelect = ({ value, onChange, options = [], className = "" }) => {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);

  React.useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const selected = options.find(o => o.value === value);

  return (
    <div ref={ref} className={`relative ${className}`} style={{ minWidth: 210 }}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-2 pl-4 pr-3 py-3 border border-pl-coal/15 bg-pl-ivory/50 text-[14px] text-pl-coal hover:border-pl-gold transition-colors focus:outline-none focus:border-pl-gold">
        <span className="flex items-center gap-2 truncate min-w-0">
          {selected?.Icon && (() => { const I = selected.Icon; return <span className="shrink-0 text-pl-gold-dk"><I size={13} /></span>; })()}
          <span className={`truncate ${!selected || selected.value === value ? "text-pl-coal" : "text-pl-gray/70"}`}>
            {selected?.label || "Seleccionar…"}
          </span>
        </span>
        <span className="shrink-0 text-pl-coal/50" style={{ transition:"transform 0.2s", transform: open ? "rotate(180deg)" : "none", display:"flex" }}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full bg-white border border-pl-coal/12 border-t-0 shadow-card-hv overflow-y-auto" style={{ zIndex:200, maxHeight:280 }}>
          {options.map(opt => {
            const I = opt.Icon;
            const isSelected = value === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => { onChange(opt.value); setOpen(false); }}
                className={`w-full flex items-center justify-between px-4 py-2.5 text-[13px] text-left transition-colors
                  ${isSelected ? "bg-pl-ivory text-pl-coal font-medium" : "text-pl-gray hover:bg-pl-ivory/60 hover:text-pl-coal"}`}>
                <span className="flex items-center gap-2.5">
                  {I && (
                    <span className={`shrink-0 w-5 h-5 flex items-center justify-center ${isSelected ? "text-pl-gold-dk" : "text-pl-coal/30"}`}>
                      <I size={12} />
                    </span>
                  )}
                  {opt.label}
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

// === Category Quick Nav ===
// linkMode=true → pills van a catalogo.html?cat=XXX (usado en index)
// linkMode=false → pills llaman a onPick (usado en catalogo.html)
const CategoryQuickNav = ({ filter = "all", onPick, linkMode = false }) => (
  <div id="categorias" className="sticky top-[78px] z-40 bg-pl-ivory/96 backdrop-blur-sm border-b border-pl-coal/10 shadow-sm">
    <div className="max-w-7xl mx-auto px-4 lg:px-10">
      <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide py-3">
        {linkMode ? (
          <a href="catalogo.html"
             className={`shrink-0 px-4 py-2 text-[11px] tracking-[0.2em] uppercase transition-all duration-200 ${filter === "all" ? "cat-pill-active" : "text-pl-gray hover:text-pl-coal"}`}>
            Todas
          </a>
        ) : (
          <button onClick={() => onPick("all")}
            className={`shrink-0 px-4 py-2 text-[11px] tracking-[0.2em] uppercase transition-all duration-200 ${filter === "all" ? "cat-pill-active" : "text-pl-gray hover:text-pl-coal"}`}>
            Todas
          </button>
        )}
        {CATEGORIES.map(cat => linkMode ? (
          <a key={cat.id} href={`catalogo.html?cat=${cat.id}`}
             className={`shrink-0 px-4 py-2 text-[11px] tracking-[0.2em] uppercase transition-all duration-200 whitespace-nowrap ${filter === cat.id ? "cat-pill-active" : "text-pl-gray hover:text-pl-coal"}`}>
            {cat.name}
          </a>
        ) : (
          <button key={cat.id} onClick={() => onPick(cat.id)}
            className={`shrink-0 px-4 py-2 text-[11px] tracking-[0.2em] uppercase transition-all duration-200 whitespace-nowrap ${filter === cat.id ? "cat-pill-active" : "text-pl-gray hover:text-pl-coal"}`}>
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  </div>
);

// === Featured Carousel (4 books, auto-rotates) ===
const FeaturedCarousel = () => {
  const featured = BOOKS.filter(b => b.featured);
  const perPage  = 4;
  const pages    = Math.max(1, Math.ceil(featured.length / perPage));
  const [page, setPage]           = React.useState(0);
  const [visible, setVisible]     = React.useState(true);

  const goTo = React.useCallback((idx) => {
    setVisible(false);
    setTimeout(() => {
      setPage(idx);
      setVisible(true);
    }, 380);
  }, []);

  React.useEffect(() => {
    const t = setInterval(() => goTo((page + 1) % pages), 4800);
    return () => clearInterval(t);
  }, [page, pages, goTo]);

  const current = featured.slice(page * perPage, page * perPage + perPage);

  return (
    <section className="py-20 lg:py-28 bg-pl-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex items-end justify-between mb-12">
          <SectionTitle
            eyebrow="Selección"
            title={<>Libros <em className="font-normal italic text-pl-red">destacados</em></>}
          />
          {/* Dot indicators + arrows */}
          <div className="flex items-center gap-3 shrink-0">
            <button onClick={() => goTo((page - 1 + pages) % pages)}
                    className="w-9 h-9 border border-pl-coal/20 flex items-center justify-center hover:border-pl-gold hover:text-pl-gold transition-colors"
                    aria-label="Anterior">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <div className="flex items-center gap-1.5">
              {Array.from({ length: pages }).map((_, i) => (
                <button key={i} onClick={() => goTo(i)}
                        className={`transition-all duration-300 rounded-none ${i === page ? "w-7 h-2 bg-pl-red" : "w-2 h-2 bg-pl-coal/20 hover:bg-pl-gold"}`}
                        aria-label={`Página ${i + 1}`} />
              ))}
            </div>
            <button onClick={() => goTo((page + 1) % pages)}
                    className="w-9 h-9 border border-pl-coal/20 flex items-center justify-center hover:border-pl-gold hover:text-pl-gold transition-colors"
                    aria-label="Siguiente">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M5 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>

        <div style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateX(0)" : "translateX(20px)",
          transition: "opacity 0.4s ease, transform 0.4s cubic-bezier(0.2,0.7,0.2,1)"
        }}>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {current.map(b => <BookCard key={b.id} book={b} />)}
          </div>
        </div>
      </div>
    </section>
  );
};

// === Catalog organized by sections ===
const CatalogBySections = ({ filter, setFilter }) => {
  const [query, setQuery] = React.useState("");

  // When no filter + no query → show category sections; otherwise → grid
  const showSections = filter === "all" && !query.trim();

  const allFiltered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return BOOKS.filter(b => {
      if (filter !== "all" && b.category !== filter) return false;
      if (!q) return true;
      return [b.title, b.author, b.description, catName(b.category)]
        .some(s => s.toLowerCase().includes(q));
    });
  }, [query, filter]);

  const sections = React.useMemo(() => {
    if (!showSections) return [];
    return CATEGORIES
      .map(cat => ({ ...cat, books: BOOKS.filter(b => b.category === cat.id) }))
      .filter(s => s.books.length > 0);
  }, [showSections]);

  const clear = () => { setQuery(""); setFilter("all"); };

  const currentCatName = filter !== "all" ? catName(filter) : null;

  return (
    <section id="catalogo" className="py-20 lg:py-28 bg-pl-beige/30">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-10">
          <SectionTitle
            eyebrow="Catálogo completo"
            title={currentCatName
              ? <>{currentCatName.split(" ")[0]} <em className="font-normal italic text-pl-red">{currentCatName.split(" ").slice(1).join(" ") || "libros"}</em></>
              : <>Catálogo <em className="font-normal italic text-pl-red">especializado</em></>}
            lead={showSections ? "Explorá nuestro catálogo organizado por área temática." : undefined}
          />
          <div className="text-[12px] tracking-[0.22em] uppercase text-pl-gray shrink-0">
            <span className="text-pl-coal font-medium">{showSections ? BOOKS.length : allFiltered.length}</span> libros
          </div>
        </div>

        {/* Search + filter bar */}
        <div className="bg-pl-white border border-pl-coal/8 p-5 shadow-card mb-12">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex-1 flex items-center gap-3 border border-pl-coal/15 px-4 py-3 bg-pl-ivory/50 focus-within:border-pl-gold transition-colors w-full">
              <IconSearch />
              <input value={query} onChange={e => setQuery(e.target.value)}
                     placeholder="Buscar por título, autor o tema…"
                     className="flex-1 bg-transparent outline-none text-[14px] placeholder:text-pl-gray/70"
                     aria-label="Buscar libros" />
              {query && (
                <button onClick={() => setQuery("")} className="text-pl-gray hover:text-pl-coal" aria-label="Limpiar">
                  <IconClose size={16} />
                </button>
              )}
            </div>
            {/* Category select — custom dropdown */}
            <div className="flex items-center gap-3 shrink-0">
              <CustomSelect
                value={filter}
                onChange={setFilter}
                options={[
                  { value:"all", label:"Todas las categorías" },
                  ...(CATEGORIES||[]).map(c => ({ value:c.id, label:c.name, Icon:c.Icon }))
                ]}
              />
              {(filter !== "all" || query) && (
                <button onClick={clear}
                        className="px-4 py-3 text-[12px] tracking-wide text-pl-gray hover:text-pl-red border border-transparent hover:border-pl-red/20 transition-colors whitespace-nowrap">
                  Limpiar
                </button>
              )}
            </div>
          </div>
          {/* Active filter chips */}
          {(filter !== "all" || query) && (
            <div className="mt-4 pt-4 border-t border-pl-coal/8 flex flex-wrap items-center gap-2">
              <span className="text-[11px] tracking-[0.22em] uppercase text-pl-gray">Filtros:</span>
              {filter !== "all" && (
                <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-pl-gold/10 border border-pl-gold/30 text-pl-gold-dk text-[12px]">
                  {catName(filter)}
                  <button onClick={() => setFilter("all")} aria-label="Quitar"><IconClose size={13} /></button>
                </span>
              )}
              {query && (
                <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-pl-coal/5 border border-pl-coal/15 text-pl-coal text-[12px]">
                  "{query}"
                  <button onClick={() => setQuery("")} aria-label="Quitar"><IconClose size={13} /></button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Category sections (default view) */}
        {showSections ? (
          <div className="space-y-20">
            {sections.map(sec => {
              const I = sec.Icon;
              return (
                <div key={sec.id} id={`sec-${sec.id}`}>
                  {/* Section header */}
                  <div className="flex items-end justify-between mb-8 pb-5 border-b border-pl-coal/8">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 border border-pl-gold/40 flex items-center justify-center text-pl-coal shrink-0">
                        {I && <I size={24} />}
                      </div>
                      <div>
                        <div className="eyebrow mb-1">{sec.name}</div>
                        <h3 className="font-display text-pl-coal text-[28px] lg:text-[32px] leading-tight tracking-tight">
                          {sec.name}
                        </h3>
                        <p className="text-pl-gray text-[13px] mt-0.5">{sec.desc}</p>
                      </div>
                    </div>
                    <button onClick={() => setFilter(sec.id)}
                            className="shrink-0 inline-flex items-center gap-2 text-[11px] tracking-[0.22em] uppercase text-pl-gold-dk hover:text-pl-red transition-colors ml-4">
                      Ver todos <IconArrow size={12} />
                    </button>
                  </div>
                  {/* Books row — show up to 4 */}
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {sec.books.slice(0, 4).map(b => <BookCard key={b.id} book={b} />)}
                  </div>
                  {sec.books.length > 4 && (
                    <div className="mt-6 text-center">
                      <button onClick={() => setFilter(sec.id)}
                              className="inline-flex items-center gap-2 px-6 py-3 border border-pl-coal/15 text-[13px] text-pl-coal hover:border-pl-gold hover:text-pl-gold-dk transition-colors">
                        Ver los {sec.books.length} libros de {sec.name} <IconArrow size={13} />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : allFiltered.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {allFiltered.map(b => <BookCard key={b.id} book={b} />)}
          </div>
        ) : (
          <div className="mt-10 max-w-md mx-auto text-center bg-pl-white border border-pl-coal/8 p-10">
            <div className="mx-auto w-12 h-12 border border-pl-gold/40 flex items-center justify-center text-pl-gold-dk">
              <IconSearch size={20} />
            </div>
            <h3 className="font-display text-pl-coal text-[26px] mt-5">Sin resultados</h3>
            <p className="text-pl-gray text-[14px] mt-3">
              Probá con otra palabra o consultanos por WhatsApp.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <button onClick={clear} className="px-5 py-3 border border-pl-coal/20 text-[13px] hover:border-pl-coal transition-colors">
                Limpiar filtros
              </button>
              <a href={waLink("Hola, estoy buscando un libro y no aparece en el catálogo.")}
                 target="_blank" rel="noreferrer"
                 className="px-5 py-3 bg-pl-red text-white text-[13px] inline-flex items-center gap-2 hover:bg-pl-red-dk">
                <IconWhatsapp size={14} /> Consultar
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

// === About ===
const About = () => (
  <section id="nosotros" className="py-24 lg:py-32 bg-pl-beige/50 relative overflow-hidden">
    <div className="absolute top-0 left-0 w-32 h-px bg-pl-gold/50" />
    <div className="max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
      <div className="lg:col-span-7">
        <Eyebrow>¿Quiénes somos?</Eyebrow>
        <h2 className="font-display text-pl-coal mt-6 text-[36px] sm:text-5xl lg:text-[54px] leading-[1.08] tracking-tight">
          En <span className="text-pl-red">Psicología Libros</span> creemos que cada página puede abrir una nueva forma de comprender la <em className="font-normal italic">mente humana</em>.
        </h2>
        <div className="my-7 gold-rule-short" />
        <div className="space-y-5 text-pl-gray text-[16px] leading-relaxed max-w-2xl">
          <p>Somos una librería especializada en libros de psicología, salud mental y desarrollo humano. Nuestro objetivo es acercar materiales de valor a estudiantes, profesionales y lectores interesados en profundizar en el conocimiento, la reflexión y el bienestar emocional.</p>
          <p>Seleccionamos libros que aportan claridad, formación y acompañamiento, con una mirada seria, responsable y comprometida con el aprendizaje.</p>
        </div>
      </div>

      <div className="lg:col-span-5 relative">
        <div className="bg-pl-white p-8 shadow-card relative">
          <div className="space-y-3">
            {[["coal","i","r"],["b","g","coal"],["i","p","b"]].map((row, ri) => (
              <div key={ri} className="grid grid-cols-3 gap-3">
                {row.map((p, ci) => (
                  <div key={ci} className={`typo-cover ${p === "coal" ? "" : p} aspect-[2/3]`}>
                    <div className="frame" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-[10px] tracking-[0.3em] uppercase opacity-70" style={p==="i"?{color:"#5b4a22"}:{color:"#C9A24A"}}>P · L</span>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className="mt-8 pt-6 border-t border-pl-gold/30 flex items-center justify-between">
            <div className="font-display italic text-pl-coal text-[20px]">Sabiduría en cada página</div>
            <GoldDot />
          </div>
        </div>
        <div className="absolute -bottom-4 -right-4 w-24 h-24 border-b border-r border-pl-gold pointer-events-none" />
      </div>
    </div>
  </section>
);

// === Benefits ===
const Benefits = () => (
  <section className="py-24 lg:py-32">
    <div className="max-w-7xl mx-auto px-6 lg:px-10">
      <SectionTitle
        eyebrow="Por qué elegirnos"
        title={<>Una librería pensada para quienes buscan <em className="font-normal italic text-pl-red">conocimiento con propósito</em></>}
        center
      />
      <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {BENEFITS.map((b, i) => <BenefitCard key={i} b={b} />)}
      </div>
    </div>
  </section>
);

// === FAQ ===
const FAQSection = () => {
  const [open, setOpen] = React.useState(0);
  return (
    <section id="faq" className="py-24 lg:py-32 bg-pl-beige/40">
      <div className="max-w-5xl mx-auto px-6 lg:px-10 grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-4">
          <Eyebrow>FAQ</Eyebrow>
          <h2 className="font-display text-pl-coal mt-5 text-[36px] sm:text-5xl leading-[1.08] tracking-tight">
            Preguntas <em className="font-normal italic text-pl-red">frecuentes</em>
          </h2>
          <p className="mt-5 text-pl-gray text-[15px] leading-relaxed">
            Resolvé las dudas más comunes. Si tu pregunta no está aquí, escribinos por WhatsApp.
          </p>
          <a href={waLink("Hola, tengo una consulta para Psicología Libros.")} target="_blank" rel="noreferrer"
             className="mt-7 inline-flex items-center gap-2 text-[13px] text-pl-red hover:text-pl-red-dk">
            <IconWhatsapp size={15} /> Hacer una consulta
          </a>
        </div>
        <div className="lg:col-span-8">
          {FAQS.map((f, i) => (
            <FAQItem key={i} item={f} idx={i} open={open === i} onToggle={() => setOpen(open === i ? -1 : i)} />
          ))}
        </div>
      </div>
    </section>
  );
};

// === Contact ===
const Contact = () => (
  <section id="contacto" className="py-24 lg:py-32 bg-pl-coal text-pl-ivory relative overflow-hidden">
    <div className="absolute top-0 left-0 right-0 h-px bg-pl-gold/40" />
    <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-pl-red/10 blur-3xl" />
    <div className="max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-12 gap-12 relative">
      <div className="lg:col-span-7">
        <div className="eyebrow !text-pl-gold flex items-center gap-3">
          <span className="inline-block w-6 h-px bg-pl-gold" /><span>Contacto</span>
        </div>
        <h2 className="font-display mt-6 text-[40px] sm:text-6xl lg:text-[68px] leading-[1.02] tracking-tight">
          ¿Buscás un libro <em className="font-normal italic text-pl-gold">en particular</em>?
        </h2>
        <p className="mt-7 text-pl-ivory/75 text-[17px] leading-relaxed max-w-xl">
          Escribinos y te ayudamos a encontrar el material adecuado para tu interés, estudio o formación.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <a href={waLink("Hola, quiero consultar el catálogo de Psicología Libros.")} target="_blank" rel="noreferrer"
             className="inline-flex items-center gap-3 px-8 py-5 bg-pl-red text-white text-[15px] tracking-wide hover:bg-pl-red-dk transition-colors">
            <IconWhatsapp size={20} /> Consultar por WhatsApp
          </a>
        </div>
        <div className="mt-12 grid sm:grid-cols-3 gap-8 max-w-2xl">
          <a href={CONTACT.instagram} target="_blank" rel="noreferrer" className="flex items-start gap-3 group">
            <span className="mt-0.5 text-pl-gold"><IconInstagram /></span>
            <div>
              <div className="text-[10px] tracking-[0.25em] uppercase text-pl-ivory/50">Instagram</div>
              <div className="text-[14px] text-pl-ivory group-hover:text-pl-gold transition-colors">@psicologialibrosyuncafe</div>
            </div>
          </a>
          <a href={CONTACT.facebook} target="_blank" rel="noreferrer" className="flex items-start gap-3 group">
            <span className="mt-0.5 text-pl-gold"><IconFacebook /></span>
            <div>
              <div className="text-[10px] tracking-[0.25em] uppercase text-pl-ivory/50">Facebook</div>
              <div className="text-[14px] text-pl-ivory group-hover:text-pl-gold transition-colors">Psicología Libros &amp; Un Café</div>
            </div>
          </a>
          <div className="flex items-start gap-3">
            <span className="mt-0.5 text-pl-gold"><IconPin /></span>
            <div>
              <div className="text-[10px] tracking-[0.25em] uppercase text-pl-ivory/50">Ubicación</div>
              <div className="text-[14px] text-pl-ivory">{CONTACT.city}</div>
            </div>
          </div>
        </div>
      </div>
      <aside className="lg:col-span-5">
        <div className="bg-pl-ivory text-pl-coal p-8 shadow-card-hv border-t-2 border-pl-gold">
          <div className="eyebrow">Atención personalizada</div>
          <h3 className="font-display text-[28px] leading-tight mt-4">Te acompañamos en tu búsqueda</h3>
          <div className="my-5 gold-rule-short" />
          <ul className="space-y-4">
            {[
              ["Atención personalizada",    "Un equipo que conoce el catálogo en profundidad."],
              ["Consulta de disponibilidad","Te confirmamos stock y tiempos por WhatsApp."],
              ["Pedidos específicos",        "Buscamos títulos puntuales que necesitás."],
              ["Catálogo especializado",     "Más de 1.000 títulos en psicología y salud mental."],
            ].map(([t, d]) => (
              <li key={t} className="flex items-start gap-3">
                <span className="mt-1.5 inline-block w-2 h-2 border border-pl-gold rotate-45 shrink-0" />
                <div>
                  <div className="text-[14px] font-medium text-pl-coal">{t}</div>
                  <div className="text-[13px] text-pl-gray mt-0.5">{d}</div>
                </div>
              </li>
            ))}
          </ul>
          <a href={waLink("Hola, quiero consultar el catálogo de Psicología Libros.")} target="_blank" rel="noreferrer"
             className="mt-7 w-full inline-flex items-center justify-center gap-2 px-5 py-4 bg-pl-coal text-pl-ivory text-[13px] hover:bg-black transition-colors">
            <IconWhatsapp size={16} /> Iniciar conversación
          </a>
        </div>
      </aside>
    </div>
  </section>
);

// === Botón scroll al inicio ===
const ScrollTopBtn = () => {
  const [visible, setVisible] = React.useState(false);
  React.useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  if (!visible) return null;
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-7 right-7 z-50 w-11 h-11 bg-pl-coal text-pl-ivory flex items-center justify-center shadow-card-hv hover:bg-pl-gold-dk transition-colors"
      style={{ animation: "fadeSlideIn 0.2s ease both" }}
      aria-label="Volver al inicio"
    >
      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5"/>
      </svg>
    </button>
  );
};

// === Footer ===
const Footer = () => (
  <footer className="bg-pl-coal text-pl-ivory/85 border-t border-pl-gold/20">
    <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
      <div className="grid md:grid-cols-12 gap-10">
        <div className="md:col-span-5">
          <div className="flex items-center gap-3">
            <img src="logosinfondo2.png" alt="Psicología Libros" className="w-12 h-12 object-contain" />
            <div>
              <div className="font-display text-pl-ivory text-[22px] tracking-tight">Psicología Libros</div>
              <div className="text-[10px] tracking-[0.28em] uppercase text-pl-gold">Librería especializada</div>
            </div>
          </div>
          <p className="mt-6 font-display italic text-pl-gold text-[22px]">Sabiduría en cada página.</p>
          <p className="mt-4 text-[13px] text-pl-ivory/60 max-w-md leading-relaxed">
            Catálogo curado de libros sobre psicología, salud mental, desarrollo humano y bienestar emocional.
          </p>
        </div>
        <div className="md:col-span-3">
          <div className="text-[11px] tracking-[0.22em] uppercase text-pl-gold mb-5">Navegación</div>
          <ul className="space-y-3 text-[14px]">
            {NAV.map(n => (
              <li key={n.id}>
                <a href={n.id === "faq" ? "faq.html" : `#${n.id}`}
                   className="hover:text-pl-gold transition-colors">{n.label}</a>
              </li>
            ))}
            <li>
              <a href="catalogo.html" className="hover:text-pl-gold transition-colors">Catálogo</a>
            </li>
          </ul>
        </div>
        <div className="md:col-span-4">
          <div className="text-[11px] tracking-[0.22em] uppercase text-pl-gold mb-5">Contacto</div>
          <ul className="space-y-3 text-[14px]">
            <li><a href={waLink("Hola, quiero consultar el catálogo.")} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-pl-gold"><IconWhatsapp size={15} /> WhatsApp</a></li>
            <li><a href={CONTACT.instagram} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-pl-gold"><IconInstagram size={15} /> Instagram</a></li>
            <li><a href={CONTACT.facebook} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-pl-gold"><IconFacebook size={15} /> Facebook</a></li>
            <li><a href={`mailto:${CONTACT.email}`} className="inline-flex items-center gap-2 hover:text-pl-gold"><IconMail size={15} /> {CONTACT.email}</a></li>
          </ul>
        </div>
      </div>
      <div className="mt-14 pt-8 border-t border-pl-ivory/10 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
        <div className="text-[12px] text-pl-ivory/55 flex items-center gap-4 flex-wrap">
          <span>© {new Date().getFullYear()} Psicología Libros. Todos los derechos reservados.</span>
          <span className="text-pl-ivory/30">·</span>
          <span>Desarrollado por <a href="https://neura.com.py" target="_blank" rel="noreferrer" className="text-pl-gold/70 hover:text-pl-gold transition-colors">Neura</a></span>
        </div>
        <div className="text-[11px] text-pl-ivory/50 max-w-2xl leading-relaxed">
          El contenido de los libros es informativo y formativo. No reemplaza la atención de un profesional de la salud mental.
        </div>
      </div>
    </div>
  </footer>
);

Object.assign(window, {
  Header, LogoSVG, Hero,
  CategoryQuickNav, FeaturedCarousel, CatalogBySections,
  About, Benefits, FAQSection, Contact, Footer, ScrollTopBtn,
});
