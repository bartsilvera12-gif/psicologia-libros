/* ─── Página Carrito — Psicología Libros ─── */

const PAYMENT_METHODS = [
  { id: "efectivo",      label: "Efectivo"              },
  { id: "transferencia", label: "Transferencia bancaria" },
  { id: "tigo_money",    label: "Tigo Money"             },
  { id: "personal_pay",  label: "Personal Pay"           },
  { id: "wepa",          label: "WePA / PagoExpress"     },
];

/* Build WhatsApp message with cart + customer info */
function buildWaBody({ lines, books, customer }) {
  let body = "Hola, quiero hacer un pedido en Psicología Libros:\n\n";

  if (customer.name)    body += `Nombre: ${customer.name}\n`;
  if (customer.phone)   body += `Teléfono/WhatsApp: ${customer.phone}\n`;
  if (customer.address) body += `Dirección: ${customer.address}\n`;
  if (customer.payment) {
    const pm = PAYMENT_METHODS.find(p => p.id === customer.payment);
    if (pm) body += `Forma de pago: ${pm.label}\n`;
  }
  body += "\nPedido:\n";

  let subtotal = 0;
  const unknown = [];
  lines.forEach(({ id, qty }) => {
    const b = books.find((x) => String(x.id) === id);
    if (!b) { body += `- Referencia ${id} x ${qty}\n`; return; }
    const priceStr = typeof window.formatPrecioGs === "function"
      ? window.formatPrecioGs(b.price) : b.price;
    body += `- ${b.title} — ${qty} u. x ${priceStr}\n`;
    const n = window.parsePrecioGs ? window.parsePrecioGs(b.price) : null;
    if (n != null) subtotal += n * qty;
    else unknown.push(b.title);
  });

  body += "\n";
  if (subtotal > 0 && typeof window.formatPrecioGs === "function") {
    body += `Subtotal estimado: ${window.formatPrecioGs(String(subtotal))}\n`;
  }
  if (unknown.length) {
    body += `Precio a confirmar: ${unknown.join(", ")}\n`;
  }
  body += "\nGracias.";
  return body;
}

const inputCls =
  "w-full px-4 py-3 border border-pl-coal/15 bg-pl-white text-pl-coal text-[14px] " +
  "placeholder:text-pl-gray/40 focus:outline-none focus:border-pl-gold transition-colors";

const Field = ({ label, required, error, children }) => (
  <div>
    <label className="block text-[10px] tracking-[0.22em] uppercase text-pl-gray/80 mb-1.5">
      {label}{required && <span className="text-pl-red ml-0.5">*</span>}
    </label>
    {children}
    {error && <p className="text-pl-red text-[11px] mt-1">{error}</p>}
  </div>
);

/* ── Main component ── */
const CartPage = () => {
  const [, bump] = React.useReducer((x) => x + 1, 0);
  const [ready, setReady] = React.useState(false);

  const [name,    setName]    = React.useState("");
  const [phone,   setPhone]   = React.useState("");
  const [address, setAddress] = React.useState("");
  const [payment, setPayment] = React.useState("");
  const [errors,  setErrors]  = React.useState({});

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
      try { await window.__sbLoadPLData?.(); } catch (e) {}
      setReady(true);
      bump();
    };
    load();
  }, []);

  const lines   = typeof window.PL_cartLines === "function" ? window.PL_cartLines() : [];
  const books   = window.BOOKS || [];
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
  const anyNumericPrice  = resolved.some((r) => r.book && window.parsePrecioGs?.(r.book.price) != null);
  const hasPriceToConfirm = resolved.some((r) => r.book && window.parsePrecioGs && window.parsePrecioGs(r.book.price) == null);

  const handleOrder = () => {
    const e = {};
    if (!name.trim())  e.name    = "Ingresá tu nombre";
    if (!phone.trim()) e.phone   = "Ingresá tu teléfono";
    if (!payment)      e.payment = "Seleccioná una forma de pago";
    setErrors(e);
    if (Object.keys(e).length) return;

    const body = buildWaBody({
      lines, books,
      customer: { name: name.trim(), phone: phone.trim(), address: address.trim(), payment },
    });
    const href = typeof window.waLink === "function" ? window.waLink(body) : "#";
    window.open(href, "_blank", "noreferrer");
  };

  return (
    <>
      <Header active="" homePath="index.html" />
      <ScrollTopBtn />

      <main>
        {/* Breadcrumb */}
        <div className="bg-pl-white border-b border-pl-coal/8">
          <div className="max-w-7xl mx-auto px-6 lg:px-10 py-3.5">
            <nav className="flex items-center gap-1.5 text-[11px] tracking-wide text-pl-gray flex-wrap">
              <a href="index.html" className="hover:text-pl-coal transition-colors">Inicio</a>
              <span className="text-pl-coal/25 select-none">›</span>
              <span className="text-pl-coal">Carrito</span>
            </nav>
          </div>
        </div>

        <section className="paper-bg py-14 lg:py-20 min-h-[50vh]">
          <div className="max-w-6xl mx-auto px-6 lg:px-10">
            <div className="eyebrow mb-3">Tu selección</div>
            <h1 className="font-display text-pl-coal text-[36px] sm:text-[44px] tracking-tight leading-tight mb-10">
              Carrito
            </h1>

            {/* Loading */}
            {!ready ? (
              <div className="flex items-center gap-3 text-pl-gray text-[14px]">
                <div className="w-8 h-8 border-2 border-pl-gold/30 border-t-pl-gold rounded-full animate-spin" />
                Cargando…
              </div>

            ) : resolved.length === 0 ? (
              /* Empty */
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
              /* ── Two-column layout ── */
              <div className="grid lg:grid-cols-[1fr_420px] gap-10 items-start">

                {/* ══ LEFT: Customer data form ══ */}
                <div className="space-y-8">

                  {/* Personal data */}
                  <div className="border border-pl-coal/12 bg-pl-white px-6 py-7 space-y-5">
                    <div className="text-[10px] tracking-[0.25em] uppercase text-pl-gray border-b border-pl-coal/8 pb-4">
                      Datos de contacto
                    </div>

                    <Field label="Nombre completo" required error={errors.name}>
                      <input
                        type="text"
                        value={name}
                        onChange={e => { setName(e.target.value); setErrors(v => ({ ...v, name: undefined })); }}
                        placeholder="Ej. Ana García"
                        className={inputCls + (errors.name ? " !border-pl-red" : "")}
                      />
                    </Field>

                    <Field label="Teléfono / WhatsApp" required error={errors.phone}>
                      <input
                        type="tel"
                        value={phone}
                        onChange={e => { setPhone(e.target.value); setErrors(v => ({ ...v, phone: undefined })); }}
                        placeholder="Ej. +595 981 123 456"
                        className={inputCls + (errors.phone ? " !border-pl-red" : "")}
                      />
                    </Field>

                    <Field label="Dirección de entrega">
                      <input
                        type="text"
                        value={address}
                        onChange={e => setAddress(e.target.value)}
                        placeholder="Opcional — si querés envío a domicilio"
                        className={inputCls}
                      />
                    </Field>
                  </div>

                  {/* Payment methods */}
                  <div className="border border-pl-coal/12 bg-pl-white px-6 py-7 space-y-4">
                    <div className="text-[10px] tracking-[0.25em] uppercase text-pl-gray border-b border-pl-coal/8 pb-4">
                      Forma de pago<span className="text-pl-red ml-0.5">*</span>
                    </div>

                    <div className="space-y-2">
                      {PAYMENT_METHODS.map(pm => {
                        const active = payment === pm.id;
                        return (
                          <label
                            key={pm.id}
                            className={`flex items-center gap-4 px-5 py-3.5 border cursor-pointer transition-colors ${
                              active
                                ? "border-pl-gold bg-pl-gold/5"
                                : "border-pl-coal/12 bg-pl-white hover:border-pl-gold/40"
                            }`}
                          >
                            <input
                              type="radio"
                              name="payment"
                              value={pm.id}
                              checked={active}
                              onChange={() => { setPayment(pm.id); setErrors(v => ({ ...v, payment: undefined })); }}
                              className="sr-only"
                            />
                            {/* Custom radio dot */}
                            <span className={`shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                              active ? "border-pl-gold" : "border-pl-coal/25"
                            }`}>
                              {active && <span className="w-2 h-2 rounded-full bg-pl-gold" />}
                            </span>
                            <span className={`text-[13px] tracking-wide ${active ? "text-pl-coal font-medium" : "text-pl-gray"}`}>
                              {pm.label}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                    {errors.payment && <p className="text-pl-red text-[11px]">{errors.payment}</p>}
                  </div>
                </div>

                {/* ══ RIGHT: Items + summary + CTA ══ */}
                <div className="space-y-5 lg:sticky lg:top-6">

                  {/* Items list */}
                  <div className="border border-pl-coal/12 bg-pl-white">
                    <div className="px-6 py-4 border-b border-pl-coal/8 flex items-center justify-between">
                      <span className="text-[10px] tracking-[0.25em] uppercase text-pl-gray">
                        {lines.reduce((a, l) => a + l.qty, 0)} {lines.reduce((a, l) => a + l.qty, 0) === 1 ? "título" : "títulos"}
                      </span>
                      <button
                        type="button"
                        onClick={() => { if (window.confirm("¿Vaciar el carrito?")) window.PL_cartClear?.(); }}
                        className="text-[10px] tracking-wide uppercase text-pl-gray hover:text-pl-red transition-colors"
                      >
                        Vaciar carrito
                      </button>
                    </div>

                    <ul className="divide-y divide-pl-coal/8">
                      {resolved.map(({ id, qty, book }) => (
                        <li key={id} className="flex gap-4 p-4">
                          {/* Cover */}
                          <div className="w-14 shrink-0">
                            {book ? (
                              <a href={`libro.html?id=${book.id}`} className="block">
                                <BookCover book={book} />
                              </a>
                            ) : (
                              <div className="aspect-[3/4] bg-pl-coal/5 border border-pl-coal/10" />
                            )}
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            {book ? (
                              <>
                                <a
                                  href={`libro.html?id=${book.id}`}
                                  className="font-display text-pl-coal text-[15px] leading-snug hover:text-pl-red transition-colors line-clamp-2"
                                >
                                  {book.title}
                                </a>
                                <p className="text-pl-gray text-[11px] mt-0.5 italic">por {book.author}</p>
                              </>
                            ) : (
                              <p className="text-pl-coal text-[13px]">Ref. {id}</p>
                            )}

                            <div className="mt-2 flex items-center justify-between gap-2 flex-wrap">
                              {/* Price */}
                              <span className="font-display tabular-nums text-pl-coal text-[14px]">
                                {book
                                  ? typeof window.formatPrecioGs === "function"
                                    ? window.formatPrecioGs(book.price)
                                    : book.price
                                  : "—"}
                              </span>

                              {/* Qty */}
                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  aria-label="Menos"
                                  className="w-7 h-7 border border-pl-coal/15 text-pl-coal hover:border-pl-gold transition-colors text-[14px] leading-none"
                                  onClick={() => window.PL_cartUpdateQty?.(id, qty - 1)}
                                >−</button>
                                <span className="w-6 text-center tabular-nums text-[13px]">{qty}</span>
                                <button
                                  type="button"
                                  aria-label="Más"
                                  className="w-7 h-7 border border-pl-coal/15 text-pl-coal hover:border-pl-gold transition-colors text-[14px] leading-none"
                                  onClick={() => window.PL_cartUpdateQty?.(id, qty + 1)}
                                >+</button>
                              </div>
                            </div>

                            {/* Line subtotal */}
                            <div className="mt-2 flex items-center justify-between gap-2 border-t border-pl-coal/8 pt-2">
                              <button
                                type="button"
                                onClick={() => window.PL_cartRemove?.(id)}
                                className="text-[10px] tracking-wide uppercase text-pl-gray hover:text-pl-red transition-colors"
                              >
                                Quitar
                              </button>
                              <span className="font-display tabular-nums font-semibold text-pl-coal text-[13px]">
                                {book && window.parsePrecioGs && window.formatPrecioGs
                                  ? (() => {
                                      const n = window.parsePrecioGs(book.price);
                                      return n != null ? window.formatPrecioGs(String(n * qty)) : "—";
                                    })()
                                  : "—"}
                              </span>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Total + CTA */}
                  <div className="border border-pl-coal/12 bg-pl-white px-6 py-6 space-y-5">
                    <div className="flex justify-between items-baseline gap-4">
                      <span className="text-[11px] tracking-[0.22em] uppercase text-pl-gray">Total estimado</span>
                      <span className="font-display tabular-nums text-[28px] text-pl-coal font-semibold leading-none">
                        {anyNumericPrice && typeof window.formatPrecioGs === "function"
                          ? window.formatPrecioGs(String(subtotal))
                          : "—"}
                      </span>
                    </div>
                    {hasPriceToConfirm && (
                      <p className="text-[11px] text-pl-gray leading-relaxed">
                        Algunos títulos tienen precio a confirmar; lo coordinamos por WhatsApp.
                      </p>
                    )}
                    <button
                      type="button"
                      onClick={handleOrder}
                      className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-4 bg-pl-red text-white text-[14px] font-medium tracking-wide hover:bg-pl-red-dk transition-colors"
                    >
                      <IconWhatsapp size={18} />
                      Enviar pedido por WhatsApp
                    </button>
                    <p className="text-[11px] text-pl-gray/70 text-center leading-relaxed">
                      Te contactaremos para confirmar disponibilidad y coordinar el pago.
                    </p>
                  </div>
                </div>

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
