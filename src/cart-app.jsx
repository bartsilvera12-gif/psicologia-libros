/* ─── Página Carrito — Psicología Libros ─── */

const CartPage = () => {
  const [, bump] = React.useReducer((x) => x + 1, 0);
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    const sync = () => bump();
    window.addEventListener("pl-cart-change", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("pl-cart-change", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  React.useEffect(() => {
    document.title = "Carrito | Psicología Libros";
    const load = async () => {
      try {
        await window.__sbLoadPLData?.();
      } catch (e) {}
      setReady(true);
      bump();
    };
    load();
  }, []);

  const lines = typeof window.PL_cartLines === "function" ? window.PL_cartLines() : [];
  const books = window.BOOKS || [];

  const resolved = lines.map((l) => ({
    ...l,
    book: books.find((b) => String(b.id) === l.id),
  }));

  let subtotal = 0;
  resolved.forEach(({ book, qty }) => {
    if (!book) return;
    const n = window.parsePrecioGs ? window.parsePrecioGs(book.price) : null;
    if (n != null) subtotal += n * qty;
  });
  const anyNumericPrice = resolved.some(
    (r) => r.book && window.parsePrecioGs?.(r.book.price) != null
  );

  const waHref =
    typeof window.waLink === "function" && typeof window.PL_cartWaMessage === "function"
      ? window.waLink(window.PL_cartWaMessage())
      : "#";

  return (
    <>
      <Header active="" homePath="index.html" />
      <ScrollTopBtn />

      <main>
        <div className="bg-pl-white border-b border-pl-coal/8">
          <div className="max-w-7xl mx-auto px-6 lg:px-10 py-3.5">
            <nav className="flex items-center gap-1.5 text-[11px] tracking-wide text-pl-gray flex-wrap">
              <a href="index.html" className="hover:text-pl-coal transition-colors">
                Inicio
              </a>
              <span className="text-pl-coal/25 select-none">›</span>
              <span className="text-pl-coal">Carrito</span>
            </nav>
          </div>
        </div>

        <section className="paper-bg py-14 lg:py-20 min-h-[50vh]">
          <div className="max-w-3xl mx-auto px-6 lg:px-10">
            <div className="eyebrow mb-3">Tu selección</div>
            <h1 className="font-display text-pl-coal text-[36px] sm:text-[44px] tracking-tight leading-tight mb-10">
              Carrito
            </h1>

            {!ready ? (
              <div className="flex items-center gap-3 text-pl-gray text-[14px]">
                <div className="w-8 h-8 border-2 border-pl-gold/30 border-t-pl-gold rounded-full animate-spin" />
                Cargando…
              </div>
            ) : resolved.length === 0 ? (
              <div className="border border-pl-coal/10 bg-pl-white/60 px-8 py-12 text-center">
                <p className="text-pl-gray text-[15px] leading-relaxed mb-8">
                  Tu carrito está vacío. Explorá el catálogo y agregá los títulos que te interesen.
                </p>
                <a
                  href="catalogo.html"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-pl-coal text-pl-ivory text-[13px] tracking-wide hover:bg-black transition-colors"
                >
                  Ir al catálogo <IconArrow size={14} />
                </a>
              </div>
            ) : (
              <div className="space-y-6">
                <ul className="space-y-4">
                  {resolved.map(({ id, qty, book }) => (
                    <li
                      key={id}
                      className="flex gap-4 sm:gap-6 p-4 sm:p-5 border border-pl-coal/10 bg-pl-white/80"
                    >
                      <div className="w-20 sm:w-24 shrink-0">
                        {book ? (
                          <a href={`libro.html?id=${book.id}`} className="block">
                            <BookCover book={book} />
                          </a>
                        ) : (
                          <div className="aspect-[3/4] bg-pl-coal/5 border border-pl-coal/10 flex items-center justify-center text-[10px] text-pl-gray text-center p-2">
                            Sin datos
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col">
                        {book ? (
                          <>
                            <a
                              href={`libro.html?id=${book.id}`}
                              className="font-display text-pl-coal text-[18px] sm:text-[20px] leading-snug hover:text-pl-red transition-colors"
                            >
                              {book.title}
                            </a>
                            <p className="text-pl-gray text-[13px] mt-1 italic">por {book.author}</p>
                          </>
                        ) : (
                          <p className="text-pl-coal text-[15px]">Producto ya no disponible (ref. {id})</p>
                        )}
                        <div className="mt-auto pt-4 flex flex-wrap items-end justify-between gap-4">
                          <div>
                            <div className="text-[10px] tracking-[0.2em] uppercase text-pl-gray/70">
                              Precio unitario
                            </div>
                            <div className="font-display tabular-nums text-pl-coal text-[17px]">
                              {book
                                ? typeof window.formatPrecioGs === "function"
                                  ? window.formatPrecioGs(book.price)
                                  : book.price
                                : "—"}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] uppercase tracking-wide text-pl-gray mr-1">Cant.</span>
                            <button
                              type="button"
                              aria-label="Menos una unidad"
                              className="w-9 h-9 border border-pl-coal/15 text-pl-coal hover:border-pl-gold transition-colors"
                              onClick={() => window.PL_cartUpdateQty?.(id, qty - 1)}
                            >
                              −
                            </button>
                            <span className="w-8 text-center tabular-nums text-[14px] font-medium">{qty}</span>
                            <button
                              type="button"
                              aria-label="Más una unidad"
                              className="w-9 h-9 border border-pl-coal/15 text-pl-coal hover:border-pl-gold transition-colors"
                              onClick={() => window.PL_cartUpdateQty?.(id, qty + 1)}
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <div className="mt-3 flex justify-between items-center gap-3 border-t border-pl-coal/8 pt-3">
                          <span className="text-[12px] text-pl-gray">
                            Subtotal línea
                            {book && window.parsePrecioGs && window.parsePrecioGs(book.price) == null && (
                              <span className="block text-[11px] text-pl-gold-dk mt-0.5">Precio a confirmar</span>
                            )}
                          </span>
                          <span className="font-display tabular-nums font-semibold text-pl-coal">
                            {book && window.parsePrecioGs && window.formatPrecioGs
                              ? (() => {
                                  const n = window.parsePrecioGs(book.price);
                                  return n != null
                                    ? window.formatPrecioGs(String(n * qty))
                                    : "—";
                                })()
                              : "—"}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => window.PL_cartRemove?.(id)}
                          className="mt-2 self-start text-[11px] tracking-wide uppercase text-pl-gray hover:text-pl-red transition-colors"
                        >
                          Quitar del carrito
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="border border-pl-coal/12 bg-pl-white px-6 py-6 space-y-4">
                  <div className="flex justify-between items-baseline gap-4">
                    <span className="text-[11px] tracking-[0.22em] uppercase text-pl-gray">
                      Subtotal estimado
                    </span>
                    <span className="font-display tabular-nums text-[26px] text-pl-coal font-semibold">
                      {anyNumericPrice && typeof window.formatPrecioGs === "function"
                        ? window.formatPrecioGs(String(subtotal))
                        : "—"}
                    </span>
                  </div>
                  {resolved.some(
                    (r) => r.book && window.parsePrecioGs && window.parsePrecioGs(r.book.price) == null
                  ) && (
                    <p className="text-[12px] text-pl-gray leading-relaxed">
                      Algunos títulos tienen precio a confirmar; el total final lo coordinamos por WhatsApp.
                    </p>
                  )}
                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <a
                      href={waHref}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-2.5 px-6 py-4 bg-pl-red text-white text-[14px] font-medium tracking-wide hover:bg-pl-red-dk transition-colors"
                    >
                      <IconWhatsapp size={18} />
                      Enviar pedido por WhatsApp
                    </a>
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm("¿Vaciar el carrito?")) window.PL_cartClear?.();
                      }}
                      className="px-6 py-4 border border-pl-coal/18 text-pl-coal text-[13px] tracking-wide hover:bg-pl-coal/5 transition-colors"
                    >
                      Vaciar carrito
                    </button>
                  </div>
                </div>

                <p className="text-[12px] text-pl-gray/80 text-center">
                  Los precios y la disponibilidad se confirman al momento del pedido.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<CartPage />);
