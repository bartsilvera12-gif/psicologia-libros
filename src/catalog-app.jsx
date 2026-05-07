// === Panel dropdown de categorías ===
const CategoryPanel = ({ selected, onToggle, onClear, anchorRef, onClose }) => {
  const ref = React.useRef(null);

  React.useEffect(() => {
    const handler = (e) => {
      if (
        ref.current && !ref.current.contains(e.target) &&
        anchorRef.current && !anchorRef.current.contains(e.target)
      ) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div
      ref={ref}
      className="absolute top-[calc(100%+6px)] left-0 w-[320px] bg-pl-white border border-pl-coal/12 shadow-card-hv z-50"
      style={{ animation: "fadeSlideIn 0.18s ease both" }}
    >
      <div className="flex items-center justify-between px-5 py-3 border-b border-pl-coal/8">
        <span className="text-[11px] tracking-[0.22em] uppercase text-pl-gold-dk font-medium">Filtrar por categoría</span>
        {selected.length > 0 && (
          <button onClick={() => { onClear(); onClose(); }} className="text-[11px] text-pl-gray hover:text-pl-red transition-colors underline underline-offset-2">
            Quitar todos
          </button>
        )}
      </div>
      <div className="py-1.5 max-h-[340px] overflow-y-auto">
        {(window.CATEGORIES || []).map(cat => {
          const active = selected.includes(cat.id);
          const I = cat.Icon;
          return (
            <button
              key={cat.id}
              onClick={() => onToggle(cat.id)}
              className={`w-full text-left px-4 py-2.5 flex items-center gap-3 transition-colors group
                ${active ? "bg-pl-gold/8 hover:bg-pl-gold/12" : "hover:bg-pl-ivory"}`}
            >
              <span className={`shrink-0 w-7 h-7 border flex items-center justify-center transition-colors
                ${active ? "border-pl-gold bg-pl-gold text-white" : "border-pl-coal/15 text-pl-coal/40 group-hover:border-pl-gold/60 group-hover:text-pl-coal/70"}`}>
                {I ? <I size={13} /> : <span className="text-[10px]">{cat.name[0]}</span>}
              </span>
              <span className={`flex-1 text-[13px] transition-colors ${active ? "text-pl-coal font-medium" : "text-pl-gray"}`}>
                {cat.name}
              </span>
              {active && (
                <span className="shrink-0 w-4 h-4 bg-pl-gold flex items-center justify-center">
                  <span className="text-white" style={{ fontSize: 9 }}>✓</span>
                </span>
              )}
            </button>
          );
        })}
      </div>
      <div className="px-5 py-2.5 border-t border-pl-coal/8 flex items-center justify-between">
        <span className="text-[12px] text-pl-gray">
          {selected.length === 0 ? "Todas activas" : `${selected.length} seleccionada${selected.length > 1 ? "s" : ""}`}
        </span>
        <button onClick={onClose} className="text-[11px] tracking-[0.15em] uppercase text-pl-coal font-medium hover:text-pl-gold-dk transition-colors">
          Aplicar
        </button>
      </div>
    </div>
  );
};

// === Página de catálogo ===
const CatalogPage = () => {
  const [ready,     setReady]     = React.useState(false);
  const [selected,  setSelected]  = React.useState([]);
  const [query,     setQuery]     = React.useState("");
  const [panelOpen, setPanelOpen] = React.useState(false);
  const addBtnRef = React.useRef(null);

  React.useEffect(() => {
    window.__sbLoadPLData().finally(() => {
      const params = new URLSearchParams(window.location.search);
      const cat = params.get("cat");
      if (cat) setSelected(cat.split(",").filter(Boolean));
      setReady(true);
    });
  }, []);

  React.useEffect(() => {
    if (!ready) return;
    const url = new URL(window.location.href);
    if (selected.length === 0) url.searchParams.delete("cat");
    else url.searchParams.set("cat", selected.join(","));
    window.history.replaceState(null, "", url.toString());
  }, [selected, ready]);

  // Sin scroll-to-top al cambiar filtros
  const toggleCat = (id) =>
    setSelected(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);

  const clearAll = () => { setSelected([]); setQuery(""); setPanelOpen(false); };

  const filtered = React.useMemo(() => {
    if (!ready) return [];
    const q = query.trim().toLowerCase();
    return (window.BOOKS || []).filter(b => {
      if (selected.length > 0 && !selected.includes(b.category)) return false;
      if (!q) return true;
      return [b.title, b.author, b.description, catName(b.category)].some(s => s.toLowerCase().includes(q));
    });
  }, [ready, query, selected]);

  const showSections = selected.length === 0 && !query.trim();

  const sections = React.useMemo(() => {
    if (!showSections || !ready) return [];
    return (window.CATEGORIES || [])
      .map(cat => ({ ...cat, books: (window.BOOKS || []).filter(b => b.category === cat.id) }))
      .filter(s => s.books.length > 0);
  }, [showSections, ready]);

  if (!ready) {
    return (
      <div className="min-h-screen paper-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <img src="logosinfondo.png" alt="Psicología Libros" style={{ width: 140, height: 140, objectFit: "contain" }} />
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
        {/* ── Hero compacto ── */}
        <div className="hero-texture border-b border-pl-coal/8 py-8 lg:py-10">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 mb-5">
              <a href="index.html" className="inline-flex items-center gap-1.5 text-[11px] tracking-[0.18em] uppercase text-pl-gray hover:text-pl-red transition-colors">
                <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                  <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Inicio
              </a>
              <span className="text-pl-coal/30 text-[11px]">/</span>
              <span className="text-[11px] tracking-[0.18em] uppercase text-pl-coal">Catálogo</span>
              {catLabel && (
                <>
                  <span className="text-pl-coal/30 text-[11px]">/</span>
                  <span className="text-[11px] tracking-[0.18em] uppercase text-pl-red">{catLabel.name}</span>
                </>
              )}
            </div>

            {/* Layout 2 columnas */}
            <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 items-start">

              {/* Columna izquierda: título + búsqueda + chips */}
              <div className="lg:col-span-2">
                <div className="eyebrow mb-3">Catálogo completo</div>
                <h1 className="font-display text-pl-coal text-[36px] sm:text-[44px] leading-[1.05] tracking-tight mb-1">
                  {catLabel
                    ? <>{catLabel.name.split(" ")[0]} <em className="font-normal italic text-pl-red">{catLabel.name.split(" ").slice(1).join(" ")}</em></>
                    : <>Todos los <em className="font-normal italic text-pl-red">libros</em></>}
                </h1>
                <p className="text-pl-gray text-[14px] mb-6">
                  {catLabel ? catLabel.desc : "Más de 1.000 libros organizados por área temática."}
                </p>

                {/* Buscador */}
                <div className="flex items-center gap-3 bg-pl-white border border-pl-coal/15 px-4 py-3.5 shadow-card focus-within:border-pl-gold transition-colors">
                  <IconSearch size={17} />
                  <input
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="Buscar por título, autor o tema…"
                    className="flex-1 bg-transparent outline-none text-[14px] placeholder:text-pl-gray/50"
                  />
                  {query && (
                    <button onClick={() => setQuery("")} className="text-pl-gray hover:text-pl-coal shrink-0 transition-colors">
                      <IconClose size={15} />
                    </button>
                  )}
                </div>

                {/* Chips + botón agregar */}
                <div className="relative mt-2">
                  <div className="flex items-center flex-wrap gap-2 min-h-[38px]">
                    <button
                      ref={addBtnRef}
                      onClick={() => setPanelOpen(o => !o)}
                      className={`inline-flex items-center gap-2 px-3.5 py-2 border text-[11px] tracking-[0.12em] uppercase font-medium transition-colors
                        ${panelOpen
                          ? "border-pl-gold bg-pl-gold text-white"
                          : "border-pl-coal/20 bg-pl-white text-pl-coal hover:border-pl-gold hover:text-pl-gold-dk"
                        }`}
                    >
                      <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                        <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                      </svg>
                      Categoría
                      {selected.length > 0 && (
                        <span className={`inline-flex items-center justify-center w-4 h-4 rounded-full text-[9px] font-bold
                          ${panelOpen ? "bg-white text-pl-gold-dk" : "bg-pl-red text-white"}`}>
                          {selected.length}
                        </span>
                      )}
                    </button>

                    {selected.length > 0 && <span className="w-px h-4 bg-pl-coal/12 shrink-0" />}

                    {selected.map(id => {
                      const cat = (window.CATEGORIES || []).find(c => c.id === id);
                      const I = cat?.Icon;
                      return (
                        <span
                          key={id}
                          className="inline-flex items-center gap-1.5 pl-2.5 pr-1.5 py-1.5 bg-pl-coal text-pl-ivory text-[11px] font-medium"
                          style={{ animation: "fadeSlideIn 0.2s ease both" }}
                        >
                          {I && <I size={11} />}
                          {catName(id)}
                          <button
                            onClick={() => toggleCat(id)}
                            className="shrink-0 w-3.5 h-3.5 flex items-center justify-center hover:bg-white/15 transition-colors"
                            aria-label="Quitar"
                          >
                            <IconClose size={8} />
                          </button>
                        </span>
                      );
                    })}

                    {(selected.length > 0 || query) && (
                      <button onClick={clearAll} className="inline-flex items-center gap-1 px-2 py-1.5 text-[11px] text-pl-gray hover:text-pl-red transition-colors">
                        <IconClose size={10} /> Limpiar todo
                      </button>
                    )}
                  </div>

                  {panelOpen && (
                    <CategoryPanel
                      selected={selected}
                      onToggle={toggleCat}
                      onClear={clearAll}
                      anchorRef={addBtnRef}
                      onClose={() => setPanelOpen(false)}
                    />
                  )}
                </div>
              </div>

              {/* Columna derecha */}
              <div className="hidden lg:flex flex-col gap-4">

                {/* Stats */}
                <div className="bg-pl-white border border-pl-coal/8 p-5 shadow-card">
                  <div className="text-[10px] tracking-[0.22em] uppercase text-pl-gold-dk font-medium mb-4">Nuestro catálogo</div>
                  <div className="grid grid-cols-3 text-center divide-x divide-pl-coal/8">
                    <div className="px-2">
                      <div className="font-display text-pl-coal text-[26px] leading-none">+1k</div>
                      <div className="text-[10px] tracking-[0.15em] uppercase text-pl-gray mt-1.5">Títulos</div>
                    </div>
                    <div className="px-2">
                      <div className="font-display text-pl-coal text-[26px] leading-none">12</div>
                      <div className="text-[10px] tracking-[0.15em] uppercase text-pl-gray mt-1.5">Categorías</div>
                    </div>
                    <div className="px-2">
                      <div className="font-display text-pl-coal text-[26px] leading-none">PY</div>
                      <div className="text-[10px] tracking-[0.15em] uppercase text-pl-gray mt-1.5">Paraguay</div>
                    </div>
                  </div>
                </div>

                {/* Grid de categorías */}
                <div className="bg-pl-white border border-pl-coal/8 p-5 shadow-card">
                  <div className="text-[10px] tracking-[0.22em] uppercase text-pl-gold-dk font-medium mb-3">Explorar por área</div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {(window.CATEGORIES || []).map(cat => {
                      const I = cat.Icon;
                      const active = selected.includes(cat.id);
                      return (
                        <button
                          key={cat.id}
                          onClick={() => toggleCat(cat.id)}
                          className={`flex items-center gap-2 px-2.5 py-2 border text-left transition-all
                            ${active
                              ? "border-pl-coal bg-pl-coal text-pl-ivory"
                              : "border-pl-coal/10 text-pl-gray hover:border-pl-coal/30 hover:text-pl-coal hover:bg-pl-ivory/60"
                            }`}
                        >
                          {I && <span className={`shrink-0 ${active ? "text-pl-gold" : "text-pl-coal/25"}`}><I size={11} /></span>}
                          <span className="truncate text-[11px] leading-tight">{cat.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* CTA WhatsApp */}
                <a href={waLink("Hola, busco un libro de psicología en el catálogo.")}
                   target="_blank" rel="noreferrer"
                   className="flex items-center gap-3 px-4 py-3.5 bg-pl-coal text-pl-ivory border border-pl-coal hover:bg-black transition-colors">
                  <IconWhatsapp size={16} />
                  <div>
                    <div className="text-[12px] font-medium">¿No encontrás lo que buscás?</div>
                    <div className="text-[11px] text-pl-ivory/60">Consultanos por WhatsApp</div>
                  </div>
                </a>

              </div>

            </div>
          </div>
        </div>

        {/* ── Contenido ── */}
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10 lg:py-14">
          <div className="flex items-center justify-between mb-7 flex-wrap gap-3">
            <div className="text-[13px] text-pl-gray">
              <span className="text-pl-coal font-semibold text-[18px] font-display">
                {showSections ? (window.BOOKS || []).length : filtered.length}
              </span>
              {" "}libros
              {selected.length > 0 && ` en ${selected.length === 1 ? catName(selected[0]) : `${selected.length} categorías`}`}
            </div>
          </div>

          {showSections ? (
            <div className="space-y-16">
              {sections.map(sec => {
                const I = sec.Icon;
                return (
                  <div key={sec.id} id={`sec-${sec.id}`}>
                    <div className="flex items-end justify-between mb-7 pb-4 border-b border-pl-coal/8">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 border border-pl-gold/40 flex items-center justify-center text-pl-coal shrink-0">
                          {I && <I size={22} />}
                        </div>
                        <div>
                          <div className="eyebrow mb-0.5">{sec.name}</div>
                          <h2 className="font-display text-pl-coal text-[26px] lg:text-[30px] leading-tight tracking-tight">{sec.name}</h2>
                          <p className="text-pl-gray text-[12px] mt-0.5">{sec.desc}</p>
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
                      <div className="mt-5 text-center">
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
