/* ─── Página de detalle de libro — Psicología Libros ─── */

/* ── Ícono libro inline ─────────────────────────────── */
const IcoLibro = ({ size = 14 }) => (
  <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"/>
  </svg>
);
const IcoChat = ({ size = 14 }) => (
  <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"/>
  </svg>
);
const IcoPin = ({ size = 14 }) => (
  <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"/>
  </svg>
);

/* ── Portada: carrusel si hay varias imágenes ───────── */
const bookCoverImageUrls = (book) => {
  const u = [];
  if (book.image_urls && book.image_urls.length) u.push(...book.image_urls);
  else if (book.image_url) u.push(book.image_url);
  return u.map(String).filter(Boolean);
};

const BookCoverGallery = ({ book }) => {
  const urls = React.useMemo(() => bookCoverImageUrls(book), [book]);
  const [idx, setIdx] = React.useState(0);

  React.useEffect(() => { setIdx(0); }, [book.id]);

  if (urls.length <= 1) {
    return (
      <div className="relative">
        <div className="absolute -bottom-3 -right-3 inset-0 bg-pl-coal/8" style={{ zIndex: 0 }} />
        <div className="relative" style={{ zIndex: 1 }}>
          <BookCover book={book} large={true} />
        </div>
      </div>
    );
  }

  const n = urls.length;
  const prev = () => setIdx((i) => (i - 1 + n) % n);
  const next = () => setIdx((i) => (i + 1) % n);

  return (
    <div className="space-y-4">
      <div className="relative group">
        <div className="absolute -bottom-3 -right-3 inset-0 bg-pl-coal/8" style={{ zIndex: 0 }} />
        <div className="relative z-[1] aspect-[2/3] overflow-hidden bg-pl-coal/5 book-cover">
          <img
            src={urls[idx]}
            alt={book.title ? `${book.title} — imagen ${idx + 1} de ${n}` : "Portada"}
            className="w-full h-full object-cover transition-opacity duration-300"
          />
        </div>
        <button
          type="button"
          onClick={prev}
          className="absolute left-2 top-1/2 z-[2] -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-pl-white/95 border border-pl-coal/15 text-pl-coal shadow-sm hover:border-pl-gold hover:text-pl-gold transition-colors"
          aria-label="Imagen anterior"
        >
          <svg width="16" height="16" viewBox="0 0 14 14" fill="none" aria-hidden>
            <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <button
          type="button"
          onClick={next}
          className="absolute right-2 top-1/2 z-[2] -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-pl-white/95 border border-pl-coal/15 text-pl-coal shadow-sm hover:border-pl-gold hover:text-pl-gold transition-colors"
          aria-label="Imagen siguiente"
        >
          <svg width="16" height="16" viewBox="0 0 14 14" fill="none" aria-hidden>
            <path d="M5 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
      <div className="flex gap-2 justify-center flex-wrap">
        {urls.map((url, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setIdx(i)}
            className={`w-12 h-[4.5rem] sm:w-14 sm:h-20 overflow-hidden border-2 transition-colors shrink-0 ${
              i === idx ? "border-pl-gold ring-1 ring-pl-gold/40" : "border-pl-coal/10 hover:border-pl-coal/25 opacity-80 hover:opacity-100"
            }`}
            aria-label={`Ver imagen ${i + 1} de ${n}`}
          >
            <img src={url} alt="" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
};

/* ── Componente principal ───────────────────────────── */
const BookDetailPage = () => {
  const [book,     setBook]     = React.useState(null);
  const [related,  setRelated]  = React.useState([]);
  const [loading,  setLoading]  = React.useState(true);
  const [notFound, setNotFound] = React.useState(false);

  React.useEffect(() => {
    const load = async () => {
      try { await window.__sbLoadPLData?.(); } catch(e) {}

      const params  = new URLSearchParams(window.location.search);
      const id      = params.get("id");
      const books   = window.BOOKS || [];
      const found   = id ? books.find(b => String(b.id) === String(id)) : null;

      if (found) {
        setBook(found);
        // Update page title
        document.title = `${found.title} | Psicología Libros`;
        // Related: same category, different book, active
        setRelated(
          books.filter(b => b.category === found.category && String(b.id) !== String(id) && b.is_active !== false)
               .slice(0, 4)
        );
      } else {
        setNotFound(true);
      }
      setLoading(false);
    };
    load();
  }, []);

  /* ── Loading ─────────────────────────────────────── */
  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <div className="w-10 h-10 border-2 border-pl-gold/30 border-t-pl-gold rounded-full animate-spin" />
      <span className="text-[12px] tracking-[0.25em] uppercase text-pl-gray">Cargando…</span>
    </div>
  );

  /* ── Not found ───────────────────────────────────── */
  if (notFound) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-6 text-center paper-bg">
      <div className="font-display text-[96px] leading-none text-pl-gold/25 select-none">404</div>
      <h1 className="font-display text-pl-coal text-[32px] tracking-tight">Libro no encontrado</h1>
      <p className="text-pl-gray text-[15px] max-w-sm leading-relaxed">El libro que buscás no está disponible o el enlace es incorrecto.</p>
      <a href="catalogo.html"
         className="inline-flex items-center gap-2 px-8 py-4 bg-pl-coal text-pl-ivory text-[13px] tracking-wide hover:bg-black transition-colors">
        Ver catálogo completo <IconArrow size={14} />
      </a>
    </div>
  );

  /* ── Datos del libro ─────────────────────────────── */
  const catLabel = (window.catName ? window.catName(book.category) : book.category) || "";
  const msg      = `Hola, me interesa el libro "${book.title}" de ${book.author ? book.author + " — " : ""}Psicología Libros. ¿Me podés dar más información?`;
  const waHref   = window.waLink ? window.waLink(msg) : `https://wa.me/595981234567?text=${encodeURIComponent(msg)}`;

  /* ── Render ──────────────────────────────────────── */
  return (
    <>
      <Header active="" homePath="index.html" />
      <ScrollTopBtn />

      <main>

        {/* ── Breadcrumb ── */}
        <div className="bg-pl-white border-b border-pl-coal/8">
          <div className="max-w-7xl mx-auto px-6 lg:px-10 py-3.5">
            <nav className="flex items-center gap-1.5 text-[11px] tracking-wide text-pl-gray flex-wrap">
              <a href="index.html"   className="hover:text-pl-coal transition-colors">Inicio</a>
              <span className="text-pl-coal/25 select-none">›</span>
              <a href="catalogo.html" className="hover:text-pl-coal transition-colors">Catálogo</a>
              <span className="text-pl-coal/25 select-none">›</span>
              <a href={`catalogo.html?cat=${book.category}`} className="hover:text-pl-coal transition-colors">{catLabel}</a>
              <span className="text-pl-coal/25 select-none">›</span>
              <span className="text-pl-coal truncate max-w-[220px]">{book.title}</span>
            </nav>
          </div>
        </div>

        {/* ── Detalle principal ── */}
        <section className="paper-bg py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <div className="grid lg:grid-cols-[360px_1fr] gap-12 lg:gap-20 items-start">

              {/* ── Columna izquierda: portada ── */}
              <div className="anim-cover lg:sticky lg:top-10">
                {/* Portada grande */}
                <div className="relative">
                  <BookCoverGallery book={book} />
                </div>

                {/* Link categoría */}
                <div className="mt-8 flex items-center gap-2">
                  <a href={`catalogo.html?cat=${book.category}`}
                     className="inline-flex items-center gap-1.5 text-[11px] tracking-[0.2em] uppercase text-pl-gold-dk hover:text-pl-red transition-colors group">
                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                      <path d="M8 2L3 6.5l5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Ver todos en {catLabel}
                  </a>
                </div>

                {/* Share / info small */}
                <div className="mt-5 flex flex-wrap gap-2">
                  {[
                    { icon: <IcoLibro size={11} />, label: book.soporte?.trim() || "Libro impreso" },
                    { icon: <IcoPin   size={11} />, label: "Asunción, Paraguay" },
                  ].map((tag, i) => (
                    <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-pl-coal/10 text-[10px] tracking-wide text-pl-gray/80">
                      {tag.icon} {tag.label}
                    </span>
                  ))}
                </div>
              </div>

              {/* ── Columna derecha: info ── */}
              <div className="anim-info">
                {/* Categoría eyebrow */}
                <div className="eyebrow mb-4">{catLabel}</div>

                {/* Título */}
                <h1 className="font-display text-pl-coal leading-[1.02] tracking-tight"
                    style={{ fontSize:"clamp(36px,4.5vw,58px)" }}>
                  {book.title}
                </h1>

                {/* Autor */}
                <p className="mt-3 font-display italic text-pl-gray text-[20px] leading-tight">
                  por {book.author}
                </p>

                {/* Separador dorado */}
                <div className="my-7 flex items-center gap-4">
                  <div className="flex-1 h-px bg-pl-gold/35" />
                  <div className="w-1.5 h-1.5 rounded-full bg-pl-gold/70" />
                  <div className="flex-1 h-px bg-pl-gold/15" />
                </div>

                {/* Ficha técnica (editorial, soporte, páginas, autorxs, idioma, tema) */}
                {(() => {
                  const specs = [
                    ["Editorial", book.editorial],
                    ["Soporte", book.soporte],
                    ["Páginas", book.paginas],
                    ["Idioma", book.idioma],
                    ["Tema", book.tema],
                  ].filter(([, v]) => v != null && String(v).trim() !== "");
                  if (!specs.length) return null;
                  return (
                    <div className="mb-9 border border-pl-coal/10 bg-pl-white/50 px-4 sm:px-5">
                      {specs.map(([label, val], i) => (
                        <div
                          key={label}
                          className={`flex justify-between gap-6 py-3 text-[14px] leading-snug ${i > 0 ? "border-t border-dotted border-pl-coal/20" : ""}`}
                        >
                          <span className="text-pl-coal font-medium shrink-0">{label}</span>
                          <span className="text-pl-gray text-right">{String(val).trim()}</span>
                        </div>
                      ))}
                    </div>
                  );
                })()}

                {/* Sinopsis */}
                {book.description ? (
                  <div className="mb-9">
                    <div className="text-[10px] tracking-[0.28em] uppercase text-pl-gray/55 font-medium mb-3">Sinopsis</div>
                    <p className="text-pl-coal/75 text-[16px] leading-[1.8]">{book.description}</p>
                  </div>
                ) : (
                  <div className="mb-9 text-pl-gray/55 text-[15px] italic leading-relaxed">
                    Consultanos por WhatsApp para más información sobre este título.
                  </div>
                )}

                {/* Precio + estado — integrado, sin caja blanca */}
                <div className="mb-7 pt-6 border-t border-pl-coal/8">
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex items-baseline gap-4">
                      <div>
                        <div className="text-[10px] tracking-[0.25em] uppercase text-pl-gray/55 mb-1">Precio</div>
                        <div className="font-display tabular-nums font-semibold text-pl-coal text-[34px] leading-none tracking-tight">
                          {typeof window.formatPrecioGs === "function" ? window.formatPrecioGs(book.price) : book.price}
                        </div>
                      </div>
                    </div>
                    <StatusPill status={book.status} />
                  </div>
                  <div className="mt-5 gold-rule-short" />
                </div>

                {/* CTAs */}
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <a href={waHref} target="_blank" rel="noreferrer"
                       className="flex-1 inline-flex items-center justify-center gap-3 px-8 py-4 bg-pl-red text-white text-[15px] font-medium tracking-wide hover:bg-pl-red-dk transition-colors">
                      <IconWhatsapp size={20} />
                      Consultar por WhatsApp
                    </a>
                    <button type="button"
                            onClick={() => window.PL_cartAdd?.(book)}
                            className="flex-1 inline-flex items-center justify-center gap-2 px-8 py-4 border border-pl-coal/22 text-pl-coal text-[15px] font-medium tracking-wide hover:border-pl-gold hover:text-pl-red transition-colors">
                      Agregar al carrito
                    </button>
                  </div>
                  <a href="catalogo.html"
                     className="inline-flex items-center justify-center gap-2 px-7 py-3.5 border border-transparent text-pl-coal/80 text-[13px] tracking-wide hover:text-pl-red transition-colors">
                    Ver catálogo completo
                  </a>
                </div>

                {/* Info pills */}
                <div className="mt-6 flex flex-wrap gap-2">
                  {[
                    { icon: <IcoLibro size={11} />, text: "Librería especializada" },
                    { icon: <IcoChat  size={11} />, text: "Consulta por WhatsApp" },
                    { icon: <IcoPin   size={11} />, text: "Asunción, Paraguay" },
                  ].map((item, i) => (
                    <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-pl-coal/8 text-[10px] tracking-wide text-pl-gray/70">
                      <span className="text-pl-gold-dk">{item.icon}</span>
                      {item.text}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Libros relacionados ── */}
        {related.length > 0 && (
          <section className="py-16 lg:py-20 bg-pl-white border-t border-pl-coal/8">
            <div className="max-w-7xl mx-auto px-6 lg:px-10">
              <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
                <div>
                  <div className="eyebrow mb-3">{catLabel}</div>
                  <h2 className="font-display text-pl-coal tracking-tight leading-tight"
                      style={{ fontSize:"clamp(28px,3.5vw,42px)" }}>
                    Más libros de esta <em className="font-normal italic text-pl-red">categoría</em>
                  </h2>
                </div>
                <a href={`catalogo.html?cat=${book.category}`}
                   className="inline-flex items-center gap-2 text-[11px] tracking-[0.22em] uppercase text-pl-gold-dk hover:text-pl-red transition-colors shrink-0">
                  Ver todos <IconArrow size={12} />
                </a>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {related.map(b => <BookCard key={b.id} book={b} />)}
              </div>
            </div>
          </section>
        )}

        {/* ── CTA final ── */}
        <section className="py-16 bg-pl-coal text-pl-ivory relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-pl-gold/40" />
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-pl-red/10 blur-3xl pointer-events-none" />
          <div className="max-w-3xl mx-auto px-6 lg:px-10 text-center relative">
            <div className="eyebrow !text-pl-gold justify-center flex items-center gap-3 mb-6">
              <span className="inline-block w-6 h-px bg-pl-gold" />Psicología Libros<span className="inline-block w-6 h-px bg-pl-gold" />
            </div>
            <h2 className="font-display text-[36px] sm:text-[48px] leading-tight tracking-tight mb-5">
              ¿Buscás otro <em className="font-normal italic text-pl-gold">título</em>?
            </h2>
            <p className="text-pl-ivory/70 text-[16px] leading-relaxed mb-10">
              Explorá nuestro catálogo completo de libros especializados en psicología, salud mental y desarrollo humano.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="catalogo.html"
                 className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-pl-white text-pl-coal text-[14px] font-medium tracking-wide hover:bg-pl-ivory transition-colors">
                Ver catálogo completo <IconArrow size={15} />
              </a>
              <a href={window.waLink ? window.waLink("Hola, quisiera consultar sobre el catálogo de Psicología Libros.") : "#"}
                 target="_blank" rel="noreferrer"
                 className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-pl-red text-white text-[14px] font-medium tracking-wide hover:bg-pl-red-dk transition-colors">
                <IconWhatsapp size={17} /> Escribinos
              </a>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
};

/* ── Mount ────────────────────────────────────────── */
ReactDOM.createRoot(document.getElementById("root")).render(<BookDetailPage />);
