// === Modal selector de WhatsApp (evento `pl-wa-open`) ===
const WaChooserModal = () => {
  const [state, setState] = React.useState({ open: false, msg: "" });

  React.useEffect(() => {
    const handler = (e) => setState({ open: true, msg: e.detail?.msg || "" });
    window.addEventListener("pl-wa-open", handler);
    return () => window.removeEventListener("pl-wa-open", handler);
  }, []);

  const close = () => setState(s => ({ ...s, open: false }));

  if (!state.open) return null;

  const go = (number) => {
    window.open(`https://wa.me/${number}?text=${encodeURIComponent(state.msg)}`, "_blank", "noreferrer");
    close();
  };

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center p-4"
      style={{ background: "rgba(17,17,17,0.55)", backdropFilter: "blur(4px)" }}
      onClick={close}
    >
      <div
        className="bg-pl-white w-full max-w-[340px] shadow-card-hv border border-pl-coal/10 overflow-hidden"
        style={{ animation: "fadeSlideIn 0.28s cubic-bezier(0.2,0.8,0.2,1) both" }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-pl-coal/8 flex items-start justify-between gap-4">
          <div>
            <div className="eyebrow mb-1">Contacto</div>
            <div className="font-display text-pl-coal text-[22px] leading-tight">Seleccione un número de contacto</div>
          </div>
          <button onClick={close} className="shrink-0 w-8 h-8 flex items-center justify-center text-pl-gray hover:text-pl-coal transition-colors mt-0.5">
            <IconClose size={18} />
          </button>
        </div>

        {/* Options */}
        <div className="p-4 space-y-2.5">
          <button
            onClick={() => go(window.WA_PRIMARY)}
            className="w-full flex items-center gap-4 px-5 py-4 bg-pl-coal text-pl-ivory hover:bg-black transition-colors group"
          >
            <div className="shrink-0 w-9 h-9 border border-pl-ivory/20 flex items-center justify-center">
              <IconWhatsapp size={18} />
            </div>
            <div className="text-left min-w-0">
              <div className="text-[10px] tracking-[0.2em] uppercase text-pl-gold mb-0.5">Principal</div>
              <div className="text-[14px] font-medium tracking-wide">+595 983 946 410</div>
            </div>
          </button>

          <button
            onClick={() => go(window.WA_SECONDARY)}
            className="w-full flex items-center gap-4 px-5 py-4 border border-pl-coal/15 text-pl-coal hover:border-pl-gold hover:bg-pl-gold/5 transition-colors group"
          >
            <div className="shrink-0 w-9 h-9 border border-pl-coal/20 flex items-center justify-center text-pl-coal group-hover:border-pl-gold transition-colors">
              <IconWhatsapp size={18} />
            </div>
            <div className="text-left min-w-0">
              <div className="text-[10px] tracking-[0.2em] uppercase text-pl-gold-dk mb-0.5">Secundario</div>
              <div className="text-[14px] font-medium tracking-wide">+595 986 773 619</div>
            </div>
          </button>
        </div>

        <div className="px-6 pb-5 text-center">
          <button onClick={close} className="text-[11px] tracking-wide text-pl-gray hover:text-pl-coal transition-colors uppercase">
            Cancelar
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

// Auto-mount modal una sola vez
(function mountWaChooser() {
  if (document.getElementById("pl-wa-chooser-root")) return;
  const div = document.createElement("div");
  div.id = "pl-wa-chooser-root";
  document.body.appendChild(div);
  ReactDOM.createRoot(div).render(<WaChooserModal />);
})();

// === Toast al agregar al carrito (evento `pl-cart-added` desde cart.jsx) ===
const CartAddToast = () => {
  const [show, setShow]     = React.useState(false);
  const [leaving, setLeave] = React.useState(false);
  const [title, setTitle]   = React.useState("");
  const [toastKey, setKey]  = React.useState(0);
  const hideTimer           = React.useRef(null);
  const leaveTimer          = React.useRef(null);

  React.useEffect(() => {
    if (!document.getElementById("pl-toast-kf")) {
      const s = document.createElement("style");
      s.id = "pl-toast-kf";
      s.textContent = `
        @keyframes toastIn {
          0%   { opacity:0; transform:translateX(calc(100% + 48px)) scale(0.94); }
          60%  { opacity:1; transform:translateX(-10px) scale(1.01); }
          80%  { transform:translateX(4px) scale(0.995); }
          100% { opacity:1; transform:translateX(0) scale(1); }
        }
        @keyframes toastOut {
          0%   { opacity:1; transform:translateX(0) scale(1); }
          100% { opacity:0; transform:translateX(calc(100% + 48px)) scale(0.94); }
        }
        @keyframes toastProgress {
          from { width:100%; }
          to   { width:0%; }
        }
      `;
      document.head.appendChild(s);
    }

    const onAdded = (e) => {
      const t = e.detail?.title || "";
      setTitle(t.length > 55 ? t.slice(0, 52) + "…" : t);
      setKey(k => k + 1);
      setLeave(false);
      setShow(true);
      clearTimeout(hideTimer.current);
      clearTimeout(leaveTimer.current);
      // start exit animation at 1.5s, fully unmount at 1.9s
      hideTimer.current  = setTimeout(() => setLeave(true),          1500);
      leaveTimer.current = setTimeout(() => { setShow(false); setLeave(false); }, 1900);
    };
    window.addEventListener("pl-cart-added", onAdded);
    return () => {
      window.removeEventListener("pl-cart-added", onAdded);
      clearTimeout(hideTimer.current);
      clearTimeout(leaveTimer.current);
    };
  }, []);

  if (!show || !title) return null;

  return (
    <div
      key={toastKey}
      role="status"
      aria-live="polite"
      className="fixed bottom-5 right-4 sm:right-6 z-[200] w-[min(86vw,300px)] bg-pl-white border border-pl-coal/10 shadow-card-hv pointer-events-none overflow-hidden"
      style={{
        animation: leaving
          ? "toastOut 0.38s cubic-bezier(0.4,0,1,1) both"
          : "toastIn 0.52s cubic-bezier(0.2,0.8,0.2,1) both",
      }}
    >
      {/* Gold left accent */}
      <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-pl-gold" />

      <div className="flex items-start gap-3 pl-5 pr-4 py-3.5">
        <div className="shrink-0 w-8 h-8 bg-pl-coal flex items-center justify-center text-pl-ivory mt-0.5">
          <IconCart size={15} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[9px] tracking-[0.2em] uppercase text-pl-gold-dk font-medium mb-1">
            Agregado al carrito
          </div>
          <div className="text-pl-coal text-[12px] leading-snug font-medium line-clamp-2">
            {title}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-[2px] bg-pl-coal/6">
        <div
          className="h-full bg-pl-gold"
          style={{ animation: "toastProgress 1.5s linear both" }}
        />
      </div>
    </div>
  );
};

// === Header ===
// homePath: "" para index.html, "index.html" para catalog page
const Header = ({ active, homePath = "" }) => {
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen]         = React.useState(false);
  const [catOpen, setCatOpen]   = React.useState(false);
  const [cartN, setCartN]       = React.useState(() =>
    typeof window.PL_cartCount === "function" ? window.PL_cartCount() : 0
  );
  const catTimer = React.useRef(null);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  React.useEffect(() => {
    const sync = () =>
      setCartN(typeof window.PL_cartCount === "function" ? window.PL_cartCount() : 0);
    window.addEventListener("pl-cart-change", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("pl-cart-change", sync);
      window.removeEventListener("storage", sync);
    };
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
    <>
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

          <div className="flex items-center gap-2 sm:gap-3">
            <a href="carrito.html"
               className={`relative inline-flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 border shrink-0 transition-colors ${
                 window.location.pathname.includes("carrito")
                   ? "border-pl-gold text-pl-red bg-pl-white"
                   : "border-pl-coal/15 text-pl-coal hover:border-pl-gold/50 hover:text-pl-red"
               }`}
               aria-label={`Carrito${cartN ? `, ${cartN} artículos` : ""}`}>
              <IconCart size={20} />
              {cartN > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-pl-red text-white text-[10px] font-semibold leading-[18px] text-center tabular-nums">
                  {cartN > 99 ? "99+" : cartN}
                </span>
              )}
            </a>
            <button
               type="button"
               onClick={() => waOpen("Hola, quiero consultar el catálogo de Psicología Libros.")}
               className="hidden sm:inline-flex items-center gap-2 px-5 py-3 bg-pl-red text-white text-[13px] hover:bg-pl-red-dk transition-colors">
              <IconWhatsapp size={16} />
              <span>Consultar</span>
            </button>
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
              <a href="carrito.html" className="py-3 text-[15px] text-pl-coal border-b border-pl-coal/5 flex items-center justify-between">
                <span>Carrito</span>
                {cartN > 0 && (
                  <span className="text-[11px] tabular-nums px-2 py-0.5 rounded-full bg-pl-red text-white font-medium">{cartN}</span>
                )}
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
              <button
                 type="button"
                 onClick={() => waOpen("Hola, quiero consultar el catálogo de Psicología Libros.")}
                 className="mt-3 inline-flex items-center justify-center gap-2 px-5 py-3 bg-pl-red text-white text-[13px]">
                <IconWhatsapp size={16} /> Consultar por WhatsApp
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
    <CartAddToast />
    </>
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
  { pos:"absolute", style:{ left:"10%",  bottom:0, transform:"rotate(-10deg)", zIndex:1 }, w:100, h:150, depth:3 },
  { pos:"absolute", style:{ left:"28%",  bottom:0, transform:"rotate(-4deg)",  zIndex:2 }, w:100, h:152, depth:2,
    mobileStyle:{ left:"8%",  bottom:0, transform:"rotate(-10deg)", zIndex:2 }, mw:88, mh:132 },
  { pos:"relative", style:{ zIndex:4 },                                                    w:115, h:172, center:true, depth:0,
    mobileStyle:{ zIndex:4 }, mw:110, mh:165 },
  { pos:"absolute", style:{ right:"28%", bottom:0, transform:"rotate(4deg)",   zIndex:2 }, w:100, h:152, depth:2,
    mobileStyle:{ right:"8%", bottom:0, transform:"rotate(10deg)",  zIndex:2 }, mw:88, mh:132 },
  { pos:"absolute", style:{ right:"10%", bottom:0, transform:"rotate(10deg)",  zIndex:1 }, w:100, h:150, depth:3 },
];
const VIT_BG  = { coal:"#111111", r:"#7a0d12", b:"#0e2640", i:"#efe6d4", g:"#122b1a", p:"#2b0e4a" };
const VIT_TXT = { coal:"#F8F4EA", r:"#F8F4EA", b:"#F8F4EA", i:"#2b2418", g:"#F8F4EA", p:"#F8F4EA" };
const VIT_LBL = { coal:"rgba(201,162,74,0.65)", r:"rgba(229,180,100,0.6)", b:"rgba(160,190,230,0.5)", i:"rgba(91,74,34,0.55)", g:"rgba(120,190,120,0.45)", p:"rgba(190,140,220,0.5)" };
const VIT_ACC = { coal:"#C9A24A", r:"#e8a060", b:"#7aaedc", i:"#9a7a30", g:"#6bbf6b", p:"#b080d8" };

const VitrineBook = ({ book, fb, slot, isCenter }) => {
  const [hov, setHov] = React.useState(false);
  const [imgErr, setImgErr] = React.useState(false);
  const pal    = book?.cover?.palette || fb.pal;
  const short  = (book?.cover?.short || fb.short).replace(/\\n/g,"\n");
  const title  = book?.title || fb.title;
  const author = book?.author || fb.author;
  const imgUrl = book ? ((book.image_urls && book.image_urls[0]) || book.image_url || null) : null;
  const depth  = slot.depth ?? 0;
  /* Use mobile dimensions/position when viewport < 640px */
  const isMobile = typeof window !== "undefined" && window.innerWidth < 640;
  const activeStyle = (isMobile && slot.mobileStyle) ? slot.mobileStyle : slot.style;
  const w = (isMobile && slot.mw) ? slot.mw : slot.w;
  const h = (isMobile && slot.mh) ? slot.mh : slot.h;

  const baseTransform = activeStyle.transform || "";
  const dimOpacity = depth === 0 ? 0 : depth === 1 ? 0.08 : depth === 2 ? 0.22 : 0.38;
  const baseShadow = depth === 0
    ? "drop-shadow(0 20px 40px rgba(0,0,0,0.55))"
    : depth === 2
      ? "drop-shadow(0 12px 24px rgba(0,0,0,0.38))"
      : "drop-shadow(0 8px 16px rgba(0,0,0,0.28))";

  const wrapStyle = {
    position: slot.pos === "relative" ? "relative" : "absolute",
    ...activeStyle,
    transition: "transform 0.32s cubic-bezier(0.34,1.56,0.64,1), filter 0.3s ease, z-index 0s",
    animation: (slot.pos === "relative" && isCenter && !hov) ? "logoFloat 5s ease-in-out infinite" : "none",
    filter: hov ? "drop-shadow(0 28px 52px rgba(0,0,0,0.65))" : baseShadow,
    ...(hov ? {
      transform: baseTransform ? `${baseTransform} scale(1.18) translateY(-16px)` : "scale(1.18) translateY(-16px)",
      zIndex: 20,
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
           style={{ width:w, height:h, background:VIT_BG[pal]||"#111111", position:"relative" }}>
        {/* Real cover image */}
        {imgUrl && !imgErr && (
          <img
            src={imgUrl}
            alt={title}
            onError={() => setImgErr(true)}
            style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover", display:"block" }}
          />
        )}
        {/* Depth dim overlay — darker for far books */}
        {dimOpacity > 0 && (
          <div style={{ position:"absolute", inset:0, background:`rgba(0,0,0,${dimOpacity})`, zIndex:1, pointerEvents:"none" }} />
        )}
        {/* Inner border */}
        <div style={{ position:"absolute", inset:10, border:`1px solid ${VIT_LBL[pal]||"rgba(201,162,74,0.45)"}`, pointerEvents:"none", zIndex:2 }} />
        {/* Corner accents */}
        <div style={{ position:"absolute", top:6, left:6, width:10, height:10, borderTop:`1px solid ${VIT_ACC[pal]||"#C9A24A"}`, borderLeft:`1px solid ${VIT_ACC[pal]||"#C9A24A"}`, opacity:0.7, pointerEvents:"none" }} />
        <div style={{ position:"absolute", bottom:6, right:6, width:10, height:10, borderBottom:`1px solid ${VIT_ACC[pal]||"#C9A24A"}`, borderRight:`1px solid ${VIT_ACC[pal]||"#C9A24A"}`, opacity:0.7, pointerEvents:"none" }} />
        {/* Texto portada — solo cuando no hay imagen real */}
        {(!imgUrl || imgErr) && (
          <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:5, padding:"0 12px", textAlign:"center",
                        opacity: hov ? 0 : 1, transition:"opacity 0.18s" }}>
            <span style={{ fontSize:8, letterSpacing:"0.28em", textTransform:"uppercase", color:VIT_ACC[pal]||"#C9A24A", opacity:0.85 }}>P·L</span>
            <div style={{ width:18, height:1, background:VIT_LBL[pal]||"rgba(201,162,74,0.4)" }} />
            <span className="font-display" style={{ fontSize:isCenter?15:12, lineHeight:1.3, color:VIT_TXT[pal] }}>
              {short.split("\n").map((l,i,a) => <React.Fragment key={i}>{l}{i<a.length-1&&<br/>}</React.Fragment>)}
            </span>
          </div>
        )}
        {/* Overlay hover */}
        <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.88)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:6, padding:"10px 8px", textAlign:"center",
                      opacity: hov ? 1 : 0, transition:"opacity 0.18s", pointerEvents: hov ? "auto" : "none", zIndex:5, overflow:"hidden" }}>
          <span style={{ fontSize:7, letterSpacing:"0.25em", textTransform:"uppercase", color:VIT_ACC[pal]||"#C9A24A", flexShrink:0 }}>Psicología Libros</span>
          <span className="font-display" style={{ fontSize:isCenter?12:10, lineHeight:1.25, color:"#F8F4EA", overflow:"hidden", display:"-webkit-box", WebkitLineClamp:5, WebkitBoxOrient:"vertical" }}>
            {title}
          </span>
          {book && (
            <span style={{ marginTop:4, padding:"4px 10px", background:VIT_ACC[pal]||"#C9A24A", color:"#fff", fontSize:7, letterSpacing:"0.18em", textTransform:"uppercase", display:"block", flexShrink:0 }}>
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
    <div className="relative h-[160px] sm:h-[200px] lg:h-[220px] flex items-end justify-center">
      {VIT_SLOTS.map((slot, i) => (
        /* Hide outermost books (i=0 and i=4) on mobile — show only 3 */
        <div key={i} className={i === 0 || i === 4 ? "hidden sm:contents" : "contents"}>
          <VitrineBook book={vitrine[i]} fb={VITRINE_FALLBACK[i]} slot={slot} isCenter={!!slot.center} />
        </div>
      ))}
    </div>
  );
};

// === Hero ===
const Hero = () => (
  <section id="inicio" className="hero-texture relative lg:min-h-screen flex items-center overflow-hidden">
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

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 w-full py-8 sm:py-14 lg:py-20">
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-20 items-center">

        {/* ── Columna izquierda: Logo ── */}
        <div className="flex flex-col items-center"
             style={{ animation: "logoReveal 0.95s cubic-bezier(0.2,0.8,0.2,1) both" }}>

          <div style={{ animation: "logoFloat 6s ease-in-out infinite, glowPulse 4s ease-in-out infinite" }}>
            <img src="logosinfondo2.png" alt="Psicología Libros"
                 className="w-[200px] h-[200px] sm:w-[280px] sm:h-[280px] lg:w-[340px] lg:h-[340px] object-contain block" />
          </div>

          <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3 w-full sm:w-auto"
               style={{ animation: "fadeSlideIn 0.8s 0.55s both" }}>
            <a href="catalogo.html"
               className="inline-flex items-center justify-center gap-2 px-6 py-3.5 sm:px-8 sm:py-4 bg-pl-coal text-pl-ivory text-[13px] sm:text-[14px] tracking-wide hover:bg-black transition-colors">
              Ver catálogo <IconArrow size={15} />
            </a>
            <button type="button"
               onClick={() => waOpen("Hola, quiero consultar el catálogo de Psicología Libros.")}
               className="inline-flex items-center justify-center gap-2 px-6 py-3.5 sm:px-8 sm:py-4 bg-pl-red text-white text-[13px] sm:text-[14px] tracking-wide hover:bg-pl-red-dk transition-colors">
              <IconWhatsapp size={16} /> WhatsApp
            </button>
          </div>
        </div>

        {/* ── Columna derecha: vitrina de libros ── */}
        <div className="relative" style={{ animation: "fadeSlideIn 0.9s 0.35s both" }}>
          <div className="bg-pl-white p-4 sm:p-6 lg:p-8 shadow-card-hv border border-pl-coal/6 relative overflow-hidden">
            {/* Gold corner accent */}
            <div className="absolute top-0 right-0 w-20 h-px bg-pl-gold" />
            <div className="absolute top-0 right-0 w-px h-20 bg-pl-gold" />
            <div className="absolute bottom-0 left-0 w-12 h-px bg-pl-gold/40" />

            {/* Eyebrow */}
            <div className="eyebrow mb-4 sm:mb-6">Catálogo especializado</div>

            {/* Libros en abanico */}
            <HeroVitrine />

            {/* Stats */}
            <div className="relative z-10 mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-pl-coal/8 grid grid-cols-3 text-center gap-1">
              <div className="min-w-0 px-1">
                <div className="font-display tabular-nums font-normal text-pl-coal text-[22px] sm:text-[26px] lg:text-[28px] tracking-tight leading-none">+1.000</div>
                <div className="font-display text-[9px] sm:text-[10px] tracking-[0.18em] sm:tracking-[0.22em] uppercase text-pl-gray mt-1.5">Títulos</div>
              </div>
              <div className="border-x border-pl-coal/8 min-w-0 px-1">
                <div className="font-display tabular-nums font-normal text-pl-coal text-[22px] sm:text-[26px] lg:text-[28px] tracking-tight leading-none">12</div>
                <div className="font-display text-[9px] sm:text-[10px] tracking-[0.18em] sm:tracking-[0.22em] uppercase text-pl-gray mt-1.5">Categorías</div>
              </div>
              <div className="min-w-0 px-1">
                <div className="font-display tabular-nums font-normal text-pl-coal text-[22px] sm:text-[26px] lg:text-[28px] tracking-tight leading-none">100%</div>
                <div className="font-display text-[9px] sm:text-[10px] tracking-[0.18em] sm:tracking-[0.22em] uppercase text-pl-gray mt-1.5">Especializado</div>
              </div>
            </div>
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

// === Carrusel de rejilla: slide horizontal ("slide") o fade ("fade"); variant "novedades" = fila tipo El Lector ===
const BooksSlideCarousel = ({
  eyebrow,
  titleNode,
  books,
  perPage,
  verTodosHref,
  autoRotate = true,
  rotateMs = 5200,
  sectionClassName = "bg-pl-white",
  pageTransition = "slide",
  variant = "default",
  showDots = true,
}) => {
  const chunks = React.useMemo(() => {
    const list = Array.isArray(books) ? books : [];
    if (!list.length) return [];
    const out = [];
    for (let i = 0; i < list.length; i += perPage) out.push(list.slice(i, i + perPage));
    return out;
  }, [books, perPage]);

  const pageCount = chunks.length;
  const [page, setPage] = React.useState(0);
  const [fadeVisible, setFadeVisible] = React.useState(true);
  const fadeMs = 380;

  React.useEffect(() => {
    setPage(0);
    setFadeVisible(true);
  }, [pageCount]);

  const goToPage = React.useCallback(
    (idx) => {
      const target = ((idx % pageCount) + pageCount) % pageCount;
      if (pageTransition === "fade") {
        setFadeVisible(false);
        window.setTimeout(() => {
          setPage(target);
          setFadeVisible(true);
        }, fadeMs);
      } else {
        setPage(target);
      }
    },
    [pageCount, pageTransition]
  );

  React.useEffect(() => {
    if (!autoRotate || pageCount <= 1) return;
    const t = window.setInterval(() => {
      if (pageTransition === "fade") {
        setFadeVisible(false);
        window.setTimeout(() => {
          setPage((p) => (p + 1) % pageCount);
          setFadeVisible(true);
        }, fadeMs);
      } else {
        setPage((p) => (p + 1) % pageCount);
      }
    }, rotateMs);
    return () => window.clearInterval(t);
  }, [autoRotate, pageCount, rotateMs, pageTransition]);

  if (!pageCount) return null;

  const isNovedades = variant === "novedades";
  const gridClass = isNovedades
    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6 [&>*]:min-w-0"
    : "grid sm:grid-cols-2 lg:grid-cols-4 gap-6";

  const carouselArrowClass = isNovedades
    ? "flex absolute top-1/2 z-20 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 items-center justify-center text-pl-coal/45 hover:text-pl-coal transition-colors"
    : "flex absolute top-1/2 z-20 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 items-center justify-center " +
      "bg-pl-white/95 border border-pl-coal/15 text-pl-coal shadow-sm hover:border-pl-gold hover:text-pl-gold transition-colors";

  const arrowIconSize = isNovedades ? 22 : 14;

  const currentChunk = chunks[page] || [];

  return (
    <section className={`overflow-x-hidden py-16 lg:py-24 ${sectionClassName}`}>
      <div className="mx-auto min-w-0 w-full max-w-7xl px-4 sm:px-6 lg:px-10">
        {isNovedades ? (
          <div className="mb-10 text-center lg:mb-12">
            {eyebrow ? (
              <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-pl-gold-dk">{eyebrow}</p>
            ) : null}
            <h2 className="mt-2 font-sans text-[clamp(28px,4.2vw,42px)] font-bold leading-[1.12] tracking-tight text-pl-coal">
              {titleNode}
            </h2>
            {verTodosHref ? (
              <a
                href={verTodosHref}
                className="mt-5 inline-block text-[12px] tracking-[0.2em] uppercase text-pl-gold-dk hover:text-pl-red transition-colors"
              >
                Ver todos
              </a>
            ) : null}
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
            <SectionTitle eyebrow={eyebrow} title={titleNode} />
            {verTodosHref ? (
              <a
                href={verTodosHref}
                className="shrink-0 text-[12px] tracking-[0.2em] uppercase text-pl-gold hover:text-pl-red transition-colors sm:pb-1"
              >
                Ver todos
              </a>
            ) : null}
          </div>
        )}

        <div className="relative min-w-0 w-full">
          {pageCount > 1 ? (
            <>
              <button
                type="button"
                onClick={() => goToPage(page - 1)}
                className={`${carouselArrowClass} ${isNovedades ? "left-0 lg:-left-1" : "left-0 lg:-left-2"}`}
                aria-label="Anterior"
              >
                <svg width={arrowIconSize} height={arrowIconSize} viewBox="0 0 14 14" fill="none" aria-hidden>
                  <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button
                type="button"
                onClick={() => goToPage(page + 1)}
                className={`${carouselArrowClass} ${isNovedades ? "right-0 lg:-right-1" : "right-0 lg:-right-2"}`}
                aria-label="Siguiente"
              >
                <svg width={arrowIconSize} height={arrowIconSize} viewBox="0 0 14 14" fill="none" aria-hidden>
                  <path d="M5 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </>
          ) : null}

          <div className={`min-w-0 overflow-hidden ${isNovedades ? "px-2 sm:px-9 lg:px-12" : "px-8 sm:px-10 lg:px-12"}`}>
            {pageTransition === "fade" ? (
              <div
                style={{
                  opacity: fadeVisible ? 1 : 0,
                  transform: fadeVisible ? "translateX(0)" : "translateX(20px)",
                  transition: "opacity 0.4s ease, transform 0.4s cubic-bezier(0.2,0.7,0.2,1)",
                }}
              >
                <div className={gridClass}>
                  {currentChunk.map((b) => (
                    <BookCard key={b.id} book={b} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="w-full min-w-0 overflow-hidden">
                <div
                  className="flex transition-transform duration-[600ms] ease-[cubic-bezier(0.33,1,0.68,1)] will-change-transform"
                  style={{
                    width: `${pageCount * 100}%`,
                    transform: `translate3d(-${pageCount > 0 ? (page * 100) / pageCount : 0}%,0,0)`,
                  }}
                >
                  {chunks.map((chunk, i) => (
                    <div
                      key={i}
                      className="box-border shrink-0"
                      style={{ width: `${pageCount > 0 ? 100 / pageCount : 100}%` }}
                    >
                      <div className={`${gridClass} w-full max-w-full`}>
                        {chunk.map((b) => (
                          <BookCard key={b.id} book={b} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {showDots && pageCount > 1 ? (
            <div className="flex justify-center gap-1.5 mt-10">
              {Array.from({ length: pageCount }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => goToPage(i)}
                  className={`transition-all duration-300 rounded-none ${
                    i === page ? "w-7 h-2 bg-pl-red" : "w-2 h-2 bg-pl-coal/20 hover:bg-pl-gold"
                  }`}
                  aria-label={`Página ${i + 1}`}
                />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
};

// === Destacados — slider estilo El Lector (imagen | texto + CTA, flechas en los bordes, puntos abajo) ===
const FeaturedHeroSlider = ({ books }) => {
  const n = books.length;
  const [idx, setIdx] = React.useState(0);

  React.useEffect(() => {
    setIdx(0);
  }, [n]);

  React.useEffect(() => {
    if (n <= 1) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % n), 6500);
    return () => clearInterval(t);
  }, [n]);

  const go = (delta) => setIdx((i) => ((i + delta) % n + n) % n);

  return (
    <section className="relative overflow-hidden border-y border-pl-gold/15 bg-gradient-to-b from-[#2c2419] via-pl-coal to-[#0a0908] py-16 lg:py-24">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -top-20 right-1/4 h-80 w-80 rounded-full bg-pl-gold/12 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-pl-red/18 blur-3xl" />
        <div className="absolute top-1/3 left-1/4 h-64 w-64 rounded-full bg-pl-gold-dk/10 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: "radial-gradient(circle at 25% 35%, rgba(248,244,234,0.9) 0.5px, transparent 0.6px)",
            backgroundSize: "24px 24px",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-10">
        <div className="mb-10 flex flex-col justify-between gap-4 sm:mb-14 sm:flex-row sm:items-end">
          <div>
            <span className="text-[11px] font-medium uppercase tracking-[0.28em] text-pl-gold/85">Selección</span>
            <h2 className="font-display mt-2 text-[32px] tracking-tight text-pl-ivory sm:text-4xl lg:text-[44px]">
              Libros <em className="font-normal italic text-pl-gold">destacados</em>
            </h2>
          </div>
          <a
            href="catalogo.html"
            className="shrink-0 text-[12px] uppercase tracking-[0.2em] text-pl-gold/90 transition-colors hover:text-pl-ivory"
          >
            Ver todos
          </a>
        </div>

        <div className="relative">
          {n > 1 ? (
            <>
              <button
                type="button"
                onClick={() => go(-1)}
                className="absolute left-0 top-1/2 z-20 flex h-12 w-12 -translate-x-1 -translate-y-1/2 items-center justify-center text-pl-ivory/35 transition-colors hover:text-pl-gold lg:h-14 lg:w-14 lg:-translate-x-4"
                aria-label="Anterior"
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden>
                  <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                className="absolute right-0 top-1/2 z-20 flex h-12 w-12 translate-x-1 -translate-y-1/2 items-center justify-center text-pl-ivory/35 transition-colors hover:text-pl-gold lg:h-14 lg:w-14 lg:translate-x-4"
                aria-label="Siguiente"
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden>
                  <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </>
          ) : null}

          <div className="mx-10 min-w-0 overflow-hidden sm:mx-14 lg:mx-20">
            <div
              className="flex will-change-transform transition-transform duration-[700ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
              style={{
                width: `${n * 100}%`,
                transform: `translate3d(-${n > 0 ? (idx * 100) / n : 0}%,0,0)`,
              }}
            >
              {books.map((b) => (
                <div
                  key={b.id}
                  className="grid shrink-0 grid-cols-1 items-center gap-6 sm:gap-10 lg:grid-cols-2 lg:gap-16"
                  style={{ width: `${n > 0 ? 100 / n : 100}%` }}
                >
                  {/* Cover — first on mobile, left on desktop */}
                  <div className="order-1 flex justify-center lg:order-1 lg:justify-end">
                    <a
                      href={`libro.html?id=${b.id}`}
                      className="group/el-cover block w-full max-w-[160px] sm:max-w-[240px] lg:max-w-[300px]"
                      style={{ perspective: "880px" }}
                    >
                      <div
                        className="shadow-2xl shadow-black/45 transition-transform duration-500 group-hover/el-cover:scale-[1.02]"
                        style={{ transform: "rotateY(-7deg) rotateX(3deg)" }}
                      >
                        <BookCover book={b} large />
                      </div>
                    </a>
                  </div>
                  {/* Text — second on mobile, right on desktop */}
                  <div className="order-2 px-1 text-center lg:order-2 lg:text-left">
                    <p className="text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.22em] sm:tracking-[0.28em] text-pl-ivory/75 line-clamp-1">
                      {(b.author || "").toUpperCase()}
                    </p>
                    <h3 className="mt-2 sm:mt-3 font-sans text-[20px] sm:text-[28px] lg:text-[clamp(32px,5.2vw,54px)] font-bold leading-[1.1] tracking-tight text-pl-ivory">
                      {b.title}
                    </h3>
                    <p className="mt-3 sm:mt-5 font-display text-[20px] sm:text-[clamp(22px,3.6vw,36px)] font-semibold tabular-nums tracking-tight text-pl-gold">
                      {typeof window.formatPrecioGs === "function" ? window.formatPrecioGs(b.price) : b.price}
                    </p>
                    <a
                      href={`libro.html?id=${b.id}`}
                      className="mt-5 sm:mt-8 inline-flex items-center gap-2 rounded-full border border-pl-coal/10 bg-pl-white px-6 sm:px-8 py-3 sm:py-3.5 text-[13px] sm:text-[14px] font-semibold tracking-wide text-pl-coal shadow-md shadow-pl-coal/5 transition-colors hover:border-pl-gold/40 hover:bg-pl-ivory"
                    >
                      Ver libro
                      <span className="inline-flex text-pl-red" aria-hidden>
                        <IconArrow size={16} />
                      </span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {n > 1 ? (
            <div className="mt-12 flex justify-center gap-2">
              {books.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Diapositiva ${i + 1}`}
                  aria-current={i === idx ? "true" : undefined}
                  onClick={() => setIdx(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === idx ? "w-8 bg-pl-red" : "w-2 bg-pl-ivory/30 hover:bg-pl-ivory/50"
                  }`}
                />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
};

const FeaturedCarousel = () => {
  const featured = React.useMemo(
    () => BOOKS.filter((b) => b.featured && b.is_active !== false),
    []
  );
  if (!featured.length) return null;
  return <FeaturedHeroSlider books={featured} />;
};

const CatalogPreviewCarousel = () => {
  const catalog = React.useMemo(
    () => BOOKS.filter((b) => !b.featured && b.is_active !== false),
    []
  );
  /* 1 book per slide on mobile (<640px), 4 on sm+ */
  const [perSlide, setPerSlide] = React.useState(() => window.innerWidth < 640 ? 1 : 4);
  React.useEffect(() => {
    const onResize = () => setPerSlide(window.innerWidth < 640 ? 1 : 4);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  if (!catalog.length) return null;
  return (
    <BooksSlideCarousel
      eyebrow=""
      titleNode={<>Más del <em className="font-display font-normal italic text-pl-red">catálogo</em></>}
      books={catalog}
      perPage={perSlide}
      verTodosHref="catalogo.html"
      autoRotate={catalog.length > perSlide}
      rotateMs={5200}
      sectionClassName="bg-pl-white"
      pageTransition="slide"
      variant="novedades"
      showDots={catalog.length > perSlide}
    />
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
              <button type="button"
                 onClick={() => waOpen("Hola, estoy buscando un libro y no aparece en el catálogo.")}
                 className="px-5 py-3 bg-pl-red text-white text-[13px] inline-flex items-center gap-2 hover:bg-pl-red-dk">
                <IconWhatsapp size={14} /> Consultar
              </button>
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
          <div className="relative overflow-hidden aspect-[3/4] border border-pl-coal/[0.07]">
            <img
              src="images/nosotros-libreria.jpg"
              alt="Estanterías de libros en una librería"
              className="h-full w-full object-cover object-center"
              loading="lazy"
              decoding="async"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-pl-coal/25 via-pl-coal/[0.02] to-transparent" aria-hidden />
            <div className="pointer-events-none absolute inset-4 border border-pl-gold/35 md:inset-5" aria-hidden />
          </div>
          <div className="mt-8 pt-6 border-t border-pl-gold/30 flex items-center justify-between gap-4">
            <div className="font-display italic text-pl-coal text-[18px] sm:text-[20px] leading-snug">Sabiduría en cada página</div>
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
          <button type="button"
             onClick={() => waOpen("Hola, tengo una consulta para Psicología Libros.")}
             className="mt-7 inline-flex items-center gap-2 text-[13px] text-pl-red hover:text-pl-red-dk">
            <IconWhatsapp size={15} /> Hacer una consulta
          </button>
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
          <button type="button"
             onClick={() => waOpen("Hola, quiero consultar el catálogo de Psicología Libros.")}
             className="inline-flex items-center gap-3 px-8 py-5 bg-pl-red text-white text-[15px] tracking-wide hover:bg-pl-red-dk transition-colors">
            <IconWhatsapp size={20} /> Consultar por WhatsApp
          </button>
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
          <button type="button"
             onClick={() => waOpen("Hola, quiero consultar el catálogo de Psicología Libros.")}
             className="mt-7 w-full inline-flex items-center justify-center gap-2 px-5 py-4 bg-pl-coal text-pl-ivory text-[13px] hover:bg-black transition-colors">
            <IconWhatsapp size={16} /> Iniciar conversación
          </button>
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
            <li><button type="button" onClick={() => waOpen("Hola, quiero consultar el catálogo.")} className="inline-flex items-center gap-2 hover:text-pl-gold transition-colors"><IconWhatsapp size={15} /> WhatsApp</button></li>
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
  CategoryQuickNav, FeaturedCarousel, CatalogPreviewCarousel, CatalogBySections,
  About, Benefits, FAQSection, Contact, Footer, ScrollTopBtn,
});
