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
      className="absolute top-[calc(100%+8px)] left-0 w-[340px] bg-pl-white border border-pl-coal/12 shadow-card-hv z-50"
      style={{ animation: "fadeSlideIn 0.18s ease both" }}
    >
      {/* Header del panel */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-pl-coal/8">
        <span className="text-[11px] tracking-[0.22em] uppercase text-pl-gold-dk font-medium">Filtrar por categoría</span>
        {selected.length > 0 && (
          <button onClick={() => { onClear(); onClose(); }} className="text-[11px] text-pl-gray hover:text-pl-red transition-colors underline underline-offset-2">
            Quitar todos
          </button>
        )}
      </div>

      {/* Lista */}
      <div className="py-2 max-h-[380px] overflow-y-auto">
        {(window.CATEGORIES || []).map(cat => {
          const active = selected.includes(cat.id);
          const I = cat.Icon;
          return (
            <button
              key={cat.id}
              onClick={() => onToggle(cat.id)}
              className={`w-full text-left px-5 py-3 flex items-center gap-3.5 transition-colors group
                ${active ? "bg-pl-gold/8 hover:bg-pl-gold/12" : "hover:bg-pl-ivory"}`}
            >
              {/* Icono categoría */}
              <span className={`shrink-0 w-8 h-8 border flex items-center justify-center transition-colors
                ${active ? "border-pl-gold bg-pl-gold text-white" : "border-pl-coal/15 text-pl-coal/40 group-hover:border-pl-gold/60 group-hover:text-pl-coal/70"}`}>
                {I ? <I size={15} /> : <span className="text-[10px]">{cat.name[0]}</span>}
              </span>

              {/* Nombre */}
              <span className={`flex-1 text-[13px] leading-tight transition-colors ${active ? "text-pl-coal font-medium" : "text-pl-gray"}`}>
                {cat.name}
              </span>

              {/* Check */}
              {active && (
                <span className="shrink-0 w-4 h-4 bg-pl-gold flex items-center justify-center">
                  <span className="text-white" style={{ fontSize: 9 }}>✓</span>
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-pl-coal/8 flex items-center justify-between">
        <span className="text-[12px] text-pl-gray">
          {selected.length === 0
            ? "Todas las categorías activas"
            : `${selected.length} categoría${selected.length > 1 ? "s" : ""} seleccionada${selected.length > 1 ? "s" : ""}`}
        </span>
        <button
          onClick={onClose}
          className="text-[11px] tracking-[0.15em] uppercase text-pl-coal font-medium hover:text-pl-gold-dk transition-colors"
        >
          Aplicar
        </button>
      </div>
    </div>
  );
};

// === Página de catálogo ===
const CatalogPage = () => {
  const [ready,    setReady]    = React.useState(false);
  const [selected, setSelected] = React.useState([]);
  const [query,    setQuery]    = React.useState("");
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
    if (selected.length === 0) {
      url.searchParams.delete("cat");
    } else {
      url.searchParams.set("cat", selected.join(","));
    }
    window.history.replaceState(null, "", url.toString());
  }, [selected, ready]);

  const toggleCat = (id) => {
    setSelected(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearAll = () => { setSelected([]); setQuery(""); setPanelOpen(false); };

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
            <div className="max-w-2xl mb-10">
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

            {/* ── Barra de búsqueda + filtros ── */}
            <div className="max-w-4xl">

              {/* Fila 1: búsqueda */}
              <div className="flex items-center gap-3 bg-pl-white border border-pl-coal/15 px-5 py-4 shadow-card focus-within:border-pl-gold transition-colors">
                <IconSearch size={18} className="shrink-0 text-pl-coal/40" />
                <input
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Buscar por título, autor o tema…"
                  className="flex-1 bg-transparent outline-none text-[15px] placeholder:text-pl-gray/50"
                />
                {query && (
                  <button onClick={() => setQuery("")} className="text-pl-gray hover:text-pl-coal shrink-0 transition-colors">
                    <IconClose size={16} />
                  </button>
                )}
              </div>

              {/* Fila 2: chips acumulados + botón agregar */}
              <div className="relative mt-2.5">
                <div className="flex items-center flex-wrap gap-2 min-h-[44px]">

                  {/* Botón "Agregar categoría" */}
                  <button
                    ref={addBtnRef}
                    onClick={() => setPanelOpen(o => !o)}
                    className={`inline-flex items-center gap-2 px-4 py-2.5 border text-[12px] tracking-[0.12em] uppercase font-medium transition-colors
                      ${panelOpen
                        ? "border-pl-gold bg-pl-gold text-white"
                        : "border-pl-coal/20 bg-pl-white text-pl-coal hover:border-pl-gold hover:text-pl-gold-dk"
                      }`}
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                    </svg>
                    Categoría
                    {selected.length > 0 && (
                      <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold
                        ${panelOpen ? "bg-white text-pl-gold-dk" : "bg-pl-red text-white"}`}>
                        {selected.length}
                      </span>
                    )}
                  </button>

                  {/* Divisor si hay chips */}
                  {selected.length > 0 && (
                    <span className="w-px h-5 bg-pl-coal/12 shrink-0" />
                  )}

                  {/* Chips de categorías activas */}
                  {selected.map(id => {
                    const cat = (window.CATEGORIES || []).find(c => c.id === id);
                    const I = cat?.Icon;
                    return (
                      <span
                        key={id}
                        className="inline-flex items-center gap-2 pl-2.5 pr-2 py-2 bg-pl-coal text-pl-ivory text-[12px] font-medium border border-pl-coal"
                        style={{ animation: "fadeSlideIn 0.2s ease both" }}
                      >
                        {I && <I size={12} />}
                        {catName(id)}
                        <button
                          onClick={() => toggleCat(id)}
                          className="shrink-0 w-4 h-4 flex items-center justify-center hover:bg-white/15 rounded-sm transition-colors"
                          aria-label="Quitar"
                        >
                          <IconClose size={9} />
                        </button>
                      </span>
                    );
                  })}

                  {/* Limpiar todo */}
                  {(selected.length > 0 || query) && (
                    <button
                      onClick={clearAll}
                      className="inline-flex items-center gap-1.5 px-3 py-2 text-[12px] text-pl-gray hover:text-pl-red transition-colors"
                    >
                      <IconClose size={11} />
                      Limpiar todo
                    </button>
                  )}
                </div>

                {/* Panel de categorías */}
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
                      <button onClick={() => { toggleCat(sec.id); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                              className="shrink-0 inline-flex items-center gap-2 text-[11px] tracking-[0.22em] uppercase text-pl-gold-dk hover:text-pl-red transition-colors ml-4">
                        Ver todos ({sec.books.length}) <IconArrow size={12} />
                      </button>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                      {sec.books.slice(0, 4).map(b => <BookCard key={b.id} book={b} />)}
                    </div>
                    {sec.books.length > 4 && (
                      <div className="mt-6 text-center">
                        <button onClick={() => { toggleCat(sec.id); window.scrollTo({ top: 0, behavior: "smooth" }); }}
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
