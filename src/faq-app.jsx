/* ─── Página de Preguntas Frecuentes ─── */

const FAQPageApp = () => {
  const [ready,   setReady]   = React.useState(false);
  const [faqs,    setFaqs]    = React.useState([]);
  const [query,   setQuery]   = React.useState("");
  const [openIdx, setOpenIdx] = React.useState(0);

  React.useEffect(() => {
    window.__sbLoadPLData().finally(() => {
      setFaqs(window.FAQS || []);
      setReady(true);
    });
  }, []);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return faqs;
    return faqs.filter(f =>
      (f.q || "").toLowerCase().includes(q) ||
      (f.a || "").toLowerCase().includes(q)
    );
  }, [faqs, query]);

  if (!ready) {
    return (
      <div className="min-h-screen paper-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-6" style={{ animation: "logoReveal 0.8s ease both" }}>
          <div style={{ animation: "logoFloat 4s ease-in-out infinite, glowPulse 3s ease-in-out infinite" }}>
            <img src="logosinfondo2.png" alt="Psicología Libros" style={{ width: 140, height: 140, objectFit: "contain" }} />
          </div>
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-pl-gold animate-bounce" style={{ animationDelay: "0ms" }} />
            <div className="w-1.5 h-1.5 rounded-full bg-pl-gold animate-bounce" style={{ animationDelay: "150ms" }} />
            <div className="w-1.5 h-1.5 rounded-full bg-pl-gold animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header active="faq" homePath="index.html" />

      <main>

        {/* ── Hero compacto — igual que catálogo ── */}
        <div className="hero-texture border-b border-pl-coal/8 py-8 lg:py-10 relative">

          {/* Decoraciones de fondo */}
          <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-pl-gold/10 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-pl-red/5 rounded-full blur-[100px]" />
            <div className="absolute inset-0 flex items-center">
              <span className="font-display italic text-[18vw] leading-none text-pl-gold/[0.06] whitespace-nowrap tracking-widest select-none pl-8">
                FAQ
              </span>
            </div>
            <div className="absolute top-0 left-0 w-7 h-7 border-t border-l border-pl-gold/30 mt-4 ml-6 hidden lg:block" />
            <div className="absolute top-0 right-0 w-7 h-7 border-t border-r border-pl-gold/30 mt-4 mr-6 hidden lg:block" />
            <div className="absolute bottom-0 left-0 w-7 h-7 border-b border-l border-pl-gold/30 mb-4 ml-6 hidden lg:block" />
            <div className="absolute bottom-0 right-0 w-7 h-7 border-b border-r border-pl-gold/30 mb-4 mr-6 hidden lg:block" />
          </div>

          <div className="max-w-7xl mx-auto px-6 lg:px-10 relative">

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 mb-5">
              <a href="index.html" className="inline-flex items-center gap-1.5 text-[11px] tracking-[0.18em] uppercase text-pl-gray hover:text-pl-red transition-colors">
                <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                  <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Inicio
              </a>
              <span className="text-pl-coal/30 text-[11px]">/</span>
              <span className="text-[11px] tracking-[0.18em] uppercase text-pl-coal">FAQ</span>
            </div>

            {/* Layout 2 columnas */}
            <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 items-start">

              {/* Columna izquierda */}
              <div className="lg:col-span-2">
                <div className="eyebrow mb-3">Preguntas frecuentes</div>
                <h1 className="font-display text-pl-coal text-[36px] sm:text-[44px] leading-[1.05] tracking-tight mb-1">
                  Resolvé tus <em className="font-normal italic text-pl-red">dudas</em>
                </h1>
                <p className="text-pl-gray text-[14px] mb-6">
                  Las respuestas a las consultas más comunes sobre nuestro catálogo, disponibilidad y envíos.
                </p>

                {/* Buscador */}
                <div className="flex items-center gap-3 bg-pl-white border border-pl-coal/15 px-4 py-3.5 shadow-card focus-within:border-pl-gold transition-colors">
                  <IconSearch size={17} />
                  <input
                    value={query}
                    onChange={e => { setQuery(e.target.value); setOpenIdx(-1); }}
                    placeholder="Buscar entre las preguntas…"
                    className="flex-1 bg-transparent outline-none text-[14px] placeholder:text-pl-gray/50"
                  />
                  {query && (
                    <button onClick={() => setQuery("")} className="text-pl-gray hover:text-pl-coal shrink-0 transition-colors">
                      <IconClose size={15} />
                    </button>
                  )}
                </div>
                {query && (
                  <p className="mt-2 text-[12px] text-pl-gray">
                    <span className="text-pl-coal font-medium">{filtered.length}</span> resultado{filtered.length !== 1 ? "s" : ""} para "{query}"
                  </p>
                )}
              </div>

              {/* Columna derecha */}
              <div className="hidden lg:flex flex-col gap-4">

                {/* Stats */}
                <div className="bg-pl-white border border-pl-coal/8 p-5 shadow-card">
                  <div className="text-[10px] tracking-[0.22em] uppercase text-pl-gold-dk font-medium mb-4">Información</div>
                  <div className="grid grid-cols-2 text-center divide-x divide-pl-coal/8">
                    <div className="px-2">
                      <div className="font-display text-pl-coal text-[28px] leading-none">{faqs.length}</div>
                      <div className="text-[10px] tracking-[0.15em] uppercase text-pl-gray mt-1.5">Respuestas</div>
                    </div>
                    <div className="px-2">
                      <div className="font-display text-pl-coal text-[28px] leading-none">WA</div>
                      <div className="text-[10px] tracking-[0.15em] uppercase text-pl-gray mt-1.5">Consulta</div>
                    </div>
                  </div>
                </div>

                {/* CTA WhatsApp */}
                <a href={waLink("Hola, tengo una consulta para Psicología Libros.")}
                   target="_blank" rel="noreferrer"
                   className="flex items-center gap-3 px-4 py-3.5 bg-pl-coal text-pl-ivory border border-pl-coal hover:bg-black transition-colors">
                  <IconWhatsapp size={16} />
                  <div>
                    <div className="text-[12px] font-medium">¿No encontrás tu respuesta?</div>
                    <div className="text-[11px] text-pl-ivory/60">Escribinos por WhatsApp</div>
                  </div>
                </a>

              </div>
            </div>
          </div>
        </div>

        {/* ── FAQ items ── */}
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10 lg:py-14">
          {filtered.length === 0 ? (
            <div className="max-w-md mx-auto text-center bg-pl-white border border-pl-coal/8 p-10 mt-4">
              <div className="mx-auto w-12 h-12 border border-pl-gold/40 flex items-center justify-center text-pl-gold-dk">
                <IconSearch size={20} />
              </div>
              <h3 className="font-display text-pl-coal text-[26px] mt-5">Sin resultados</h3>
              <p className="text-pl-gray text-[14px] mt-3">Probá con otra palabra o escribinos directamente.</p>
              <div className="mt-6 flex justify-center gap-3">
                <button onClick={() => setQuery("")} className="px-5 py-3 border border-pl-coal/20 text-[13px] hover:border-pl-coal transition-colors">
                  Limpiar
                </button>
                <a href={waLink("Hola, tengo una pregunta para Psicología Libros.")}
                   target="_blank" rel="noreferrer"
                   className="px-5 py-3 bg-pl-red text-white text-[13px] inline-flex items-center gap-2 hover:bg-pl-red-dk">
                  <IconWhatsapp size={14} /> Consultar
                </a>
              </div>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">

              {/* Sidebar índice */}
              <aside className="hidden lg:block">
                <div className="sticky top-[100px]">
                  <div className="eyebrow mb-4">En esta página</div>
                  <div className="space-y-0.5">
                    {filtered.map((f, i) => (
                      <button
                        key={i}
                        onClick={() => setOpenIdx(openIdx === i ? -1 : i)}
                        className={`w-full text-left px-4 py-3 text-[13px] leading-snug transition-all border-l-2 ${
                          openIdx === i
                            ? "border-pl-gold text-pl-coal font-medium bg-pl-gold/5"
                            : "border-transparent text-pl-gray hover:text-pl-coal hover:border-pl-gold/40"
                        }`}>
                        {f.q}
                      </button>
                    ))}
                  </div>
                  <div className="mt-8 p-5 bg-pl-coal text-pl-ivory">
                    <div className="eyebrow !text-pl-gold mb-2">¿Otra consulta?</div>
                    <p className="text-[12px] text-pl-ivory/70 mb-4 leading-relaxed">
                      Escribinos por WhatsApp y te respondemos al instante.
                    </p>
                    <a href={waLink("Hola, tengo una consulta para Psicología Libros.")}
                       target="_blank" rel="noreferrer"
                       className="inline-flex items-center gap-2 w-full justify-center px-4 py-2.5 bg-pl-red text-white text-[12px] hover:bg-pl-red-dk transition-colors">
                      <IconWhatsapp size={14} /> Consultar ahora
                    </a>
                  </div>
                </div>
              </aside>

              {/* Acordeón */}
              <div className="lg:col-span-2">
                <div className="border-t border-pl-coal/10">
                  {filtered.map((f, i) => (
                    <FAQItem
                      key={i}
                      item={f}
                      idx={i}
                      open={openIdx === i}
                      onToggle={() => setOpenIdx(openIdx === i ? -1 : i)}
                    />
                  ))}
                </div>
              </div>

            </div>
          )}
        </div>

        {/* ── CTA final ── */}
        <div className="border-t border-pl-coal/8 py-14 bg-pl-beige/40">
          <div className="max-w-3xl mx-auto px-6 lg:px-10 text-center">
            <h2 className="font-display text-pl-coal text-[32px] sm:text-[40px] leading-tight tracking-tight">
              ¿Buscás un libro en <em className="font-normal italic text-pl-red">particular</em>?
            </h2>
            <p className="mt-4 text-pl-gray text-[15px] leading-relaxed max-w-xl mx-auto">
              Escribinos y te ayudamos a encontrar el material que necesitás.
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-4">
              <a href={waLink("Hola, quiero consultar sobre el catálogo de Psicología Libros.")}
                 target="_blank" rel="noreferrer"
                 className="inline-flex items-center gap-3 px-8 py-4 bg-pl-red text-white text-[14px] tracking-wide hover:bg-pl-red-dk transition-colors">
                <IconWhatsapp size={17} /> Consultar por WhatsApp
              </a>
              <a href="catalogo.html"
                 className="inline-flex items-center gap-2 px-8 py-4 border border-pl-coal/20 text-pl-coal text-[14px] hover:border-pl-coal hover:bg-pl-coal hover:text-pl-ivory transition-all">
                Ver catálogo <IconArrow size={14} />
              </a>
            </div>
          </div>
        </div>

      </main>

      <Footer />
      <ScrollTopBtn />
    </div>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<FAQPageApp />);
