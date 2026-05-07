// === Página de catálogo — catalog-app.jsx ===

const CatalogPage = () => {
  const [ready,  setReady]  = React.useState(false);
  const [filter, setFilter] = React.useState("all");
  const [query,  setQuery]  = React.useState("");

  // Carga Supabase y lee el parámetro ?cat= de la URL
  React.useEffect(() => {
    window.__sbLoadPLData().finally(() => {
      const params = new URLSearchParams(window.location.search);
      const cat = params.get("cat");
      if (cat) setFilter(cat);
      setReady(true);
    });
  }, []);

  // Cuando cambia el filtro, actualiza la URL sin recargar
  React.useEffect(() => {
    if (!ready) return;
    const url = new URL(window.location.href);
    if (filter === "all") {
      url.searchParams.delete("cat");
    } else {
      url.searchParams.set("cat", filter);
    }
    window.history.replaceState(null, "", url.toString());
  }, [filter, ready]);

  const onPick = (id) => {
    setFilter(id);
    setQuery("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Libros filtrados
  const filtered = React.useMemo(() => {
    if (!ready) return [];
    const q = query.trim().toLowerCase();
    return (window.BOOKS || []).filter(b => {
      if (filter !== "all" && b.category !== filter) return false;
      if (!q) return true;
      return [b.title, b.author, b.description, catName(b.category)]
        .some(s => s.toLowerCase().includes(q));
    });
  }, [ready, query, filter]);

  const showSections = filter === "all" && !query.trim();

  const sections = React.useMemo(() => {
    if (!showSections || !ready) return [];
    return (window.CATEGORIES || [])
      .map(cat => ({ ...cat, books: (window.BOOKS || []).filter(b => b.category === cat.id) }))
      .filter(s => s.books.length > 0);
  }, [showSections, ready]);

  const clear = () => { setQuery(""); setFilter("all"); };

  // Pantalla de carga
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

  const currentCat = filter !== "all" ? (window.CATEGORIES || []).find(c => c.id === filter) : null;

  return (
    <div className="min-h-screen">
      {/* Header con link de vuelta al inicio */}
      <Header active="" homePath="index.html" />

      <main className="pt-[78px]">

        {/* Hero del catálogo */}
        <div className="paper-bg border-b border-pl-coal/8 py-12 lg:py-16">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <div className="flex items-center gap-2 mb-6">
              <a href="index.html"
                 className="inline-flex items-center gap-1.5 text-[12px] tracking-[0.18em] uppercase text-pl-gray hover:text-pl-red transition-colors">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Inicio
              </a>
              <span className="text-pl-coal/30 text-[12px]">/</span>
              <span className="text-[12px] tracking-[0.18em] uppercase text-pl-coal">Catálogo</span>
              {currentCat && (
                <>
                  <span className="text-pl-coal/30 text-[12px]">/</span>
                  <span className="text-[12px] tracking-[0.18em] uppercase text-pl-red">{currentCat.name}</span>
                </>
              )}
            </div>

            <div className="max-w-2xl">
              <div className="eyebrow mb-4">Catálogo completo</div>
              <h1 className="font-display text-pl-coal text-[42px] sm:text-5xl lg:text-[56px] leading-[1.05] tracking-tight">
                {currentCat
                  ? <>{currentCat.name.split(" ")[0]} <em className="font-normal italic text-pl-red">{currentCat.name.split(" ").slice(1).join(" ")}</em></>
                  : <>Todos los <em className="font-normal italic text-pl-red">libros</em></>}
              </h1>
              <p className="mt-4 text-pl-gray text-[16px] leading-relaxed">
                {currentCat ? currentCat.desc : "Más de 1.000 libros organizados por área temática."}
              </p>
            </div>

            {/* Buscador principal */}
            <div className="mt-8 max-w-2xl">
              <div className="flex items-center gap-3 bg-pl-white border border-pl-coal/15 px-5 py-4 shadow-card focus-within:border-pl-gold transition-colors">
                <IconSearch size={20} />
                <input
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Buscar por título, autor o tema…"
                  className="flex-1 bg-transparent outline-none text-[15px] placeholder:text-pl-gray/60"
                  autoFocus={false}
                />
                {query && (
                  <button onClick={() => setQuery("")} className="text-pl-gray hover:text-pl-coal">
                    <IconClose size={17} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Strip de categorías */}
        <CategoryQuickNav filter={filter} onPick={onPick} linkMode={false} />

        {/* Contenido */}
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-14 lg:py-20">

          {/* Contador + limpiar filtros */}
          <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
            <div className="text-[13px] text-pl-gray">
              <span className="text-pl-coal font-semibold text-[18px] font-display">
                {showSections ? (window.BOOKS || []).length : filtered.length}
              </span>
              {" "}libros{filter !== "all" ? ` en ${currentCat?.name}` : " en el catálogo"}
            </div>
            {(filter !== "all" || query) && (
              <button onClick={clear}
                      className="text-[12px] tracking-[0.18em] uppercase text-pl-gray hover:text-pl-red transition-colors flex items-center gap-2">
                <IconClose size={12} /> Limpiar filtros
              </button>
            )}
          </div>

          {/* Secciones por categoría */}
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
                          <h2 className="font-display text-pl-coal text-[28px] lg:text-[32px] leading-tight tracking-tight">
                            {sec.name}
                          </h2>
                          <p className="text-pl-gray text-[13px] mt-0.5">{sec.desc}</p>
                        </div>
                      </div>
                      <button onClick={() => onPick(sec.id)}
                              className="shrink-0 inline-flex items-center gap-2 text-[11px] tracking-[0.22em] uppercase text-pl-gold-dk hover:text-pl-red transition-colors ml-4">
                        Ver todos ({sec.books.length}) <IconArrow size={12} />
                      </button>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                      {sec.books.slice(0, 4).map(b => <BookCard key={b.id} book={b} />)}
                    </div>
                    {sec.books.length > 4 && (
                      <div className="mt-6 text-center">
                        <button onClick={() => onPick(sec.id)}
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
              <p className="text-pl-gray text-[14px] mt-3">
                Probá con otra palabra o consultanos directamente.
              </p>
              <div className="mt-6 flex justify-center gap-3">
                <button onClick={clear}
                        className="px-5 py-3 border border-pl-coal/20 text-[13px] hover:border-pl-coal transition-colors">
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
