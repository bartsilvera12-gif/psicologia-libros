// === Header ===
// homePath: "" para index.html, "index.html" para catalog page
const Header = ({ active, homePath = "" }) => {
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen]         = React.useState(false);

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
    <header className={`fixed top-0 inset-x-0 z-50 header-blur transition-shadow ${scrolled ? "header-scrolled" : ""}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex items-center justify-between h-[78px]">
          {/* Logo mark */}
          <a href={logoHref} onClick={(e) => homePath ? null : click(e, "inicio")} className="flex items-center gap-2 group">
            <img src="logosinfondo.png" alt="Psicología Libros" className="w-11 h-11 object-contain"
                 style={{ maskImage: "radial-gradient(circle, black 44%, transparent 45%)", WebkitMaskImage: "radial-gradient(circle, black 44%, transparent 45%)" }} />
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
            {/* Catálogo al lado de Inicio */}
            <a href="catalogo.html"
               className={`text-[13px] tracking-wide transition-colors relative py-2 ${homePath === "" && window.location.pathname.includes("catalogo") ? "text-pl-red" : "text-pl-coal hover:text-pl-red"}`}>
              Catálogo
            </a>
            {/* Resto del nav */}
            {NAV.filter(n => n.id !== "inicio").map(n => (
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
              {NAV.filter(n => n.id !== "inicio").map(n => (
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
    src="logosinfondo.png"
    alt="Psicología Libros"
    width={size}
    height={size}
    style={{ width: size, height: size, objectFit: "contain", display: "block" }}
  />
);

// === Hero ===
const Hero = () => (
  <section id="inicio" className="hero-texture relative min-h-screen flex items-center pt-[78px] overflow-hidden">
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
            <img src="logosinfondo.png" alt="Psicología Libros"
                 style={{
                   width: 340, height: 340, objectFit: "contain", display: "block",
                   maskImage: "radial-gradient(circle, black 44%, transparent 45%)",
                   WebkitMaskImage: "radial-gradient(circle, black 44%, transparent 45%)"
                 }} />
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

            {/* Libros en abanico */}
            <div className="relative h-[220px] flex items-end justify-center">
              {/* Libro trasero izquierdo */}
              <div className="absolute" style={{ left: "10%", bottom: 0, transform: "rotate(-10deg)", zIndex: 1 }}>
                <div className="hero-book typo-cover i w-[100px] h-[150px] shadow-card">
                  <div className="frame" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 px-3 text-center">
                    <span className="text-[9px] tracking-[0.2em] uppercase" style={{color:"#5b4a22",opacity:0.55}}>P·L</span>
                    <span className="font-display text-[12px] leading-snug" style={{color:"#2b2418"}}>Trauma<br/>&amp; duelo</span>
                  </div>
                </div>
              </div>

              {/* Libro trasero derecho */}
              <div className="absolute" style={{ right: "10%", bottom: 0, transform: "rotate(10deg)", zIndex: 1 }}>
                <div className="hero-book typo-cover r w-[100px] h-[150px] shadow-card">
                  <div className="frame" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 px-3 text-center">
                    <span className="text-[9px] tracking-[0.2em] uppercase text-pl-gold opacity-55">P·L</span>
                    <span className="font-display text-[12px] leading-snug text-pl-ivory">Salud<br/>mental</span>
                  </div>
                </div>
              </div>

              {/* Libro central (frente) */}
              <div className="relative" style={{ zIndex: 3 }}>
                <div className="hero-book typo-cover w-[115px] h-[172px] shadow-card-hv" style={{ animation: "logoFloat 5s ease-in-out infinite" }}>
                  <div className="frame" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-3 text-center">
                    <span className="text-[9px] tracking-[0.22em] uppercase text-pl-gold opacity-60">P·L</span>
                    <span className="font-display text-[15px] leading-snug text-pl-ivory">La mente<br/>humana</span>
                  </div>
                </div>
              </div>

              {/* Libro detrás centro-izquierda */}
              <div className="absolute" style={{ left: "28%", bottom: 0, transform: "rotate(-4deg)", zIndex: 2 }}>
                <div className="hero-book typo-cover b w-[100px] h-[152px] shadow-card">
                  <div className="frame" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 px-3 text-center">
                    <span className="text-[9px] tracking-[0.2em] uppercase text-pl-gold opacity-55">P·L</span>
                    <span className="font-display text-[12px] leading-snug text-pl-ivory">Neuro-<br/>psicología</span>
                  </div>
                </div>
              </div>

              {/* Libro detrás centro-derecha */}
              <div className="absolute" style={{ right: "28%", bottom: 0, transform: "rotate(4deg)", zIndex: 2 }}>
                <div className="hero-book typo-cover g w-[100px] h-[152px] shadow-card">
                  <div className="frame" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 px-3 text-center">
                    <span className="text-[9px] tracking-[0.2em] uppercase text-pl-gold opacity-55">P·L</span>
                    <span className="font-display text-[12px] leading-snug text-pl-ivory">Mind-<br/>fulness</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-8 pt-6 border-t border-pl-coal/8 grid grid-cols-3 text-center">
              <div>
                <div className="font-display text-pl-coal text-[30px] tracking-tight leading-none">+1.000</div>
                <div className="text-[10px] tracking-[0.22em] uppercase text-pl-gray mt-1.5">Títulos</div>
              </div>
              <div className="border-x border-pl-coal/8">
                <div className="font-display text-pl-coal text-[30px] tracking-tight leading-none">12</div>
                <div className="text-[10px] tracking-[0.22em] uppercase text-pl-gray mt-1.5">Categorías</div>
              </div>
              <div>
                <div className="font-display text-pl-coal text-[30px] tracking-tight leading-none">100%</div>
                <div className="text-[10px] tracking-[0.22em] uppercase text-pl-gray mt-1.5">Especializado</div>
              </div>
            </div>
          </div>

          {/* Quote panel superpuesto */}
          <div className="absolute -bottom-5 -left-5 bg-pl-coal text-pl-ivory p-5 max-w-[190px] shadow-card-hv hidden lg:block"
               style={{ animation: "fadeSlideIn 1.1s 0.7s both" }}>
            <span className="font-display text-pl-gold text-[28px] leading-none">"</span>
            <p className="font-display italic text-[13px] leading-snug mt-0.5">Sabiduría en cada página</p>
            <div className="mt-3 text-[9px] tracking-[0.28em] uppercase text-pl-gold">Psicología Libros</div>
          </div>
        </div>

      </div>
    </div>
  </section>
);

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
            {/* Category select */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="relative">
                <select value={filter} onChange={e => setFilter(e.target.value)}
                        className="appearance-none pl-4 pr-10 py-3 border border-pl-coal/15 bg-pl-ivory/50 text-[14px] text-pl-coal cursor-pointer focus:border-pl-gold outline-none">
                  <option value="all">Todas las categorías</option>
                  {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-pl-coal">
                  <IconChevron size={14} />
                </span>
              </div>
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
          <a href={`mailto:${CONTACT.email}`}
             className="inline-flex items-center gap-2 px-8 py-5 border border-pl-ivory/20 text-pl-ivory text-[14px] hover:border-pl-gold hover:text-pl-gold transition-colors">
            <IconMail size={16} /> Enviar correo
          </a>
        </div>
        <div className="mt-12 grid sm:grid-cols-3 gap-8 max-w-2xl">
          <a href={CONTACT.instagram} target="_blank" rel="noreferrer" className="flex items-start gap-3 group">
            <span className="mt-0.5 text-pl-gold"><IconInstagram /></span>
            <div>
              <div className="text-[10px] tracking-[0.25em] uppercase text-pl-ivory/50">Instagram</div>
              <div className="text-[14px] text-pl-ivory group-hover:text-pl-gold transition-colors">@psicologialibros</div>
            </div>
          </a>
          <a href={CONTACT.facebook} target="_blank" rel="noreferrer" className="flex items-start gap-3 group">
            <span className="mt-0.5 text-pl-gold"><IconFacebook /></span>
            <div>
              <div className="text-[10px] tracking-[0.25em] uppercase text-pl-ivory/50">Facebook</div>
              <div className="text-[14px] text-pl-ivory group-hover:text-pl-gold transition-colors">/psicologialibros</div>
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

// === Footer ===
const Footer = () => (
  <footer className="bg-pl-coal text-pl-ivory/85 border-t border-pl-gold/20">
    <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
      <div className="grid md:grid-cols-12 gap-10">
        <div className="md:col-span-5">
          <div className="flex items-center gap-3">
            <img src="logosinfondo.png" alt="Psicología Libros" className="w-12 h-12 object-contain"
                 style={{ maskImage: "radial-gradient(circle, black 44%, transparent 45%)", WebkitMaskImage: "radial-gradient(circle, black 44%, transparent 45%)" }} />
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
                <a href={`#${n.id}`} className="hover:text-pl-gold transition-colors">{n.label}</a>
              </li>
            ))}
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
        <div className="text-[12px] text-pl-ivory/55">© {new Date().getFullYear()} Psicología Libros. Todos los derechos reservados.</div>
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
  About, Benefits, FAQSection, Contact, Footer,
});
