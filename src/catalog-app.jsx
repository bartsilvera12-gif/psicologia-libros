// === Multi-select dropdown de categorías ===
const CategoryMultiSelect = ({ selected, onToggle, onClear }) => {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);

  React.useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const label = selected.length === 0
    ? "Todas las categorías"
    : selected.length === 1
      ? (window.CATEGORIES || []).find(c => c.id === selected[0])?.name || selected[0]
      : `${selected.length} categorías seleccionadas`;

  return (
    <div className="relative shrink-0" ref={ref}>
      {/* Trigger */}
      <button
        onClick={() => setOpen(o => !o)}
        className={`flex items-center gap-3 min-w-[230px] px-5 py-4 bg-pl-white border text-[14px] text-pl-coal shadow-card hover:border-pl-gold focus:outline-none transition-colors ${open ? "border-pl-gold" : "border-pl-coal/15"}`}
      >
        <span className="flex-1 text-left truncate">{label}</span>
        {selected.length > 0 && (
          <span className="shrink-0 inline-flex items-center justify-center w-5 h-5 rounded-full bg-pl-red text-white text-[10px] font-bold">
            {selected.length}
          </span>
        )}
        <span className={`shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}>
          <IconChevron size={14} />
        </span>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute top-[calc(100%+4px)] left-0 min-w-[260px] bg-pl-white border border-pl-coal/15 shadow-card-hv z-50 py-2"
             style={{ animation: "fadeSlideIn 0.18s ease both" }}>
          {/* Todas */}
          <button
            onClick={() => { onClear(); setOpen(false); }}
            className={`w-full text-left px-4 py-3 text-[13px] flex items-center gap-3 hover:bg-pl-ivory transition-colors ${selected.length === 0 ? "text-pl-coal font-medium" : "text-pl-gray"}`}
          >
            <span className={`w-4 h-4 border-2 flex items-center justify-center shrink-0 transition-colors ${selected.length === 0 ? "border-pl-coal bg-pl-coal" : "border-pl-coal/25"}`}>
              {selected.length === 0 && <span className="text-white" style={{fontSize:9, lineHeight:1}}>✓</span>}
            </span>
            Todas las categorías
          </button>
          <div className="h-px bg-pl-coal/8 mx-4 my-1" />
          {(window.CATEGORIES || []).map(cat => {
            const active = selected.includes(cat.id);
            return (
              <button
                key={cat.id}
                onClick={() => onToggle(cat.id)}
                className={`w-full text-left px-4 py-3 text-[13px] flex items-center gap-3 hover:bg-pl-ivory transition-colors ${active ? "text-pl-coal" : "text-pl-gray"}`}
              >
                <span className={`w-4 h-4 border-2 flex items-center justify-center shrink-0 transition-colors ${active ? "border-pl-gold bg-pl-gold" : "border-pl-coal/25"}`}>
                  {active && <span className="text-white" style={{fontSize:9, lineHeight:1}}>✓</span>}
                </span>
                {cat.name}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

// === Página de catálogo ===
const CatalogPage = () => {
  const [ready,    setReady]    = React.useState(false);
  // selected: array de ids de categorías. [] = todas
  const [selected, setSelected] = React.useState([]);
  const [query,    setQuery]    = React.useState("");

  React.useEffect(() => {
    window.__sbLoadPLData().finally(() => {
      const params = new URLSearchParams(window.location.search);
      const cat = params.get("cat");
      if (cat) setSelected(cat.split(",").filter(Boolean));
      setReady(true);
    });
  }, []);

  // Sincroniza URL con los filtros activos
  React.useEffect(() => {
    if (!ready) return;
    const url = new URL(window.location.href);
    if (selected.length === 0) {
      url.searchParams.delete("cat");
    } else {
      url.searchParams.set("cat", selected.join(","));
    }
    window.history.replaceState(null, "", url.toString());
  }, [selected, ready]);

  const toggleCat = (id) => {
    setSelected(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
    setQuery("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearAll = () => { setSelected([]); setQuery(""); };

  // Filtrado con soporte multi-categoría
  const filtered = React.useMemo(() => {
    if (!ready) return [];
    const q = query.trim().toLowerCase();
    return (window.BOOKS || []).filter(b => {
      if (selected.length > 0 && !selected.includes(b.category)) return false;
      if (!q) return true;
      return [b.title, b.author, b.description, catName(b.category)]
        .some(s => s.toLowerCase().includes(q));
    });
  }, [ready, query, selected]);

  const showSections = selected.length === 0 && !query.trim();

  const sections = React.useMemo(() => {
    if (!showSections || !ready) return [];
    return (window.CATEGORIES || [])
      .map(cat => ({ ...cat, books: (window.BOOKS || []).filter(b => b.category === cat.id) }))
      .filter(s => s.books.length > 0);
  }, [showSections, ready]);

  // Loading
  if (!ready) {
    return (
      <div className="min-h-screen paper-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <img src="logo.jpeg" alt="Psicología Libros" style={{ width: 140, height: 140, objectFit: "contain" }} />
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-pl-gold animate-bounce" style={{ animationDelay: "0ms" }} />
            <div className="w-1.5 h-1.5 rounded-full bg-pl-gold animate-bounce" style={{ animationDelay: "150ms" }} />
            <div className="w-1.5 h-1.5 rounded-full bg-pl-gold animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
          <span className="text-[11px] tracking-[0.3em] uppercase text-pl-gray">Cargando catálogo…</span>
        </div>
      </div>
    );
  }

  const catLabel = selected.length === 1
    ? (window.CATEGORIES || []).find(c => c.id === selected[0])
    : null;

  return (
    <div className="min-h-screen">
      <Header active="" homePath="index.html" />

      <main className="pt-[78px]">
        {/* Hero del catálogo */}
        <div className="paper-bg border-b border-pl-coal/8 py-12 lg:py-16">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 mb-6">
              <a href="index.html" className="inline-flex items-center gap-1.5 text-[12px] tracking-[0.18em] uppercase text-pl-gray hover:text-pl-red transition-colors">
                <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                  <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Inicio
              </a>
              <span className="text-pl-coal/30 text-[12px]">/</span>
              <span className="text-[12px] tracking-[0.18em] uppercase text-pl-coal">Catálogo</span>
              {catLabel && (
                <>
                  <span className="text-pl-coal/30 text-[12px]">/</span>
                  <span className="text-[12px] tracking-[0.18em] uppercase text-pl-red">{catLabel.name}</span>
                </>
              )}
            </div>

            {/* Título */}
            <div className="max-w-2xl mb-8">
              <div className="eyebrow mb-4">Catálogo completo</div>
              <h1 className="font-display text-pl-coal text-[42px] sm:text-5xl lg:text-[56px] leading-[1.05] tracking-tight">
                {catLabel
                  ? <>{catLabel.name.split(" ")[0]} <em className="font-normal italic text-pl-red">{catLabel.name.split(" ").slice(1).join(" ")}</em></>
                  : <>Todos los <em className="font-normal italic text-pl-red">libros</em></>}
              </h1>
              <p className="mt-4 text-pl-gray text-[16px] leading-relaxed">
                {catLabel ? catLabel.desc : "Más de 1.000 libros organizados por área temática."}
              </p>
            </div>

            {/* Buscador + selector multi-categoría + limpiar */}
            <div className="flex flex-col sm:flex-row gap-3 max-w-3xl">
              {/* Search */}
              <div className="flex-1 flex items-center gap-3 bg-pl-white border border-pl-coal/15 px-5 py-4 shadow-card focus-within:border-pl-gold transition-colors">
                <IconSearch size={18} />
                <input
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Buscar por título, autor o tema…"
                  className="flex-1 bg-transparent outline-none text-[15px] placeholder:text-pl-gray/60"
                />
                {query && (
                  <button onClick={() => setQuery("")} className="text-pl-gray hover:text-pl-coal shrink-0">
                    <IconClose size={16} />
                  </button>
                )}
              </div>

              {/* Multi-select */}
              <CategoryMultiSelect
                selected={selected}
                onToggle={toggleCat}
                onClear={clearAll}
              />

              {/* Limpiar filtros */}
              {(selected.length > 0 || query) && (
                <button
                  onClick={clearAll}
                  className="shrink-0 flex items-center gap-2 px-5 py-4 border border-pl-coal/15 bg-pl-white text-[13px] text-pl-gray hover:text-pl-red hover:border-pl-red/30 shadow-card transition-colors whitespace-nowrap"
                >
                  <IconClose size={13} /> Limpiar
                </button>
              )}
            </div>

            {/* Chips de categorías activas */}
            {selected.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {selected.map(id => (
                  <span key={id} className="inline-flex items-center gap-2 px-3 py-1.5 bg-pl-gold/10 border border-pl-gold/40 text-pl-gold-dk text-[12px]">
                    {catName(id)}
                    <button onClick={() => toggleCat(id)} className="hover:text-pl-red transition-colors" aria-label="Quitar">
                      <IconClose size={11} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Contenido */}
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-14 lg:py-20">
          {/* Contador */}
          <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
            <div className="text-[13px] text-pl-gray">
              <span className="text-pl-coal font-semibold text-[18px] font-display">
                {showSections ? (window.BOOKS || []).length : filtered.length}
              </span>
              {" "}libros
              {selected.length > 0 && ` en ${selected.length === 1 ? catName(selected[0]) : `${selected.length} categorías`}`}
            </div>
          </div>

          {/* Secciones (vista por defecto) */}
          {showSections ? (
            <div className="space-y-20">
              {sections.map(sec => {
                const I = sec.Icon;
                return (
                  <div key={sec.id} id={`sec-${sec.id}`}>
                    <div className="flex items-end justify-between mb-8 pb-5 border-b border-pl-coal/8">
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 border border-pl-gold/40 flex items-center justify-center text-pl-coal shrink-0">
                          {I && <I size={24} />}
                        </div>
                        <div>
                          <div className="eyebrow mb-1">{sec.name}</div>
                          <h2 className="font-display text-pl-coal text-[28px] lg:text-[32px] leading-tight tracking-tight">{sec.name}</h2>
                          <p className="text-pl-gray text-[13px] mt-0.5">{sec.desc}</p>
                        </div>
                      </div>
                      <button onClick={() => toggleCat(sec.id)}
                              className="shrink-0 inline-flex items-center gap-2 text-[11px] tracking-[0.22em] uppercase text-pl-gold-dk hover:text-pl-red transition-colors ml-4">
                        Ver todos ({sec.books.length}) <IconArrow size={12} />
                      </button>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                      {sec.books.slice(0, 4).map(b => <BookCard key={b.id} book={b} />)}
                    </div>
                    {sec.books.length > 4 && (
                      <div className="mt-6 text-center">
                        <button onClick={() => toggleCat(sec.id)}
                                className="inline-flex items-center gap-2 px-6 py-3 border border-pl-coal/15 text-[13px] text-pl-coal hover:border-pl-gold hover:text-pl-gold-dk transition-colors">
                          Ver los {sec.books.length} libros de {sec.name} <IconArrow size={13} />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

          ) : filtered.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map(b => <BookCard key={b.id} book={b} />)}
            </div>

          ) : (
            <div className="max-w-md mx-auto text-center bg-pl-white border border-pl-coal/8 p-10 mt-4">
              <div className="mx-auto w-12 h-12 border border-pl-gold/40 flex items-center justify-center text-pl-gold-dk">
                <IconSearch size={20} />
              </div>
              <h3 className="font-display text-pl-coal text-[26px] mt-5">Sin resultados</h3>
              <p className="text-pl-gray text-[14px] mt-3">Probá con otra palabra o consultanos directamente.</p>
              <div className="mt-6 flex justify-center gap-3">
                <button onClick={clearAll} className="px-5 py-3 border border-pl-coal/20 text-[13px] hover:border-pl-coal transition-colors">
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
      </main>

      <Footer />
    </div>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<CatalogPage />);
