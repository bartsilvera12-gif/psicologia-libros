/* ─── Página Carrito — Psicología Libros ─── */

const PAYMENT_METHODS = [
  { id: "efectivo",       label: "Efectivo",               icon: "💵" },
  { id: "transferencia",  label: "Transferencia bancaria",  icon: "🏦" },
  { id: "tigo_money",     label: "Tigo Money",              icon: "📱" },
  { id: "personal_pay",   label: "Personal Pay",            icon: "📲" },
  { id: "wepa",           label: "WePA / PagoExpress",      icon: "💳" },
];

/* Build WhatsApp message with cart + customer info */
function buildWaBody({ lines, books, customer }) {
  let body = "Hola, quiero hacer un pedido en Psicología Libros:\n\n";

  /* Customer data */
  if (customer.name)    body += `👤 Nombre: ${customer.name}\n`;
  if (customer.phone)   body += `📞 Teléfono/WhatsApp: ${customer.phone}\n`;
  if (customer.address) body += `📍 Dirección: ${customer.address}\n`;
  if (customer.payment) {
    const pm = PAYMENT_METHODS.find(p => p.id === customer.payment);
    if (pm) body += `💳 Forma de pago: ${pm.label}\n`;
  }
  body += "\n";

  /* Items */
  body += "📚 *Pedido:*\n";
  let subtotal = 0;
  const unknown = [];

  lines.forEach(({ id, qty }) => {
    const b = books.find((x) => String(x.id) === id);
    if (!b) { body += `• Referencia ${id} × ${qty}\n`; return; }
    const priceStr = typeof window.formatPrecioGs === "function"
      ? window.formatPrecioGs(b.price) : b.price;
    body += `• ${b.title} — ${qty} u. × ${priceStr}\n`;
    const n = window.parsePrecioGs ? window.parsePrecioGs(b.price) : null;
    if (n != null) subtotal += n * qty;
    else unknown.push(b.title);
  });

  body += "\n";
  if (subtotal > 0 && typeof window.formatPrecioGs === "function") {
    body += `💰 Subtotal estimado: ${window.formatPrecioGs(String(subtotal))}\n`;
  }
  if (unknown.length) {
    body += `\nPrecio a confirmar: ${unknown.join(", ")}\n`;
  }
  body += "\nGracias.";
  return body;
}

/* ── Input component ── */
const Field = ({ label, required, children }) => (
  <div>
    <label className="block text-[10px] tracking-[0.22em] uppercase text-pl-gray/80 mb-1.5">
      {label}{required && <span className="text-pl-red ml-0.5">*</span>}
    </label>
    {children}
  </div>
);

const inputCls =
  "w-full px-4 py-3 border border-pl-coal/15 bg-pl-white text-pl-coal text-[14px] " +
  "placeholder:text-pl-gray/40 focus:outline-none focus:border-pl-gold transition-colors";

/* ── Main component ── */
const CartPage = () => {
  const [, bump] = React.useReducer((x) => x + 1, 0);
  const [ready, setReady] = React.useState(false);

  /* Customer form */
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

  const lines  = typeof window.PL_cartLines === "function" ? window.PL_cartLines() : [];
  const books  = window.BOOKS || [];

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
  const hasPriceToConfirm = resolved.some(
    (r) => r.book && window.parsePrecioGs && window.parsePrecioGs(r.book.price) == null
  );

  /* Validation + WhatsApp send */
  const handleOrder = () => {
    const e = {};
    if (!name.trim())    e.name    = "Ingresá tu nombre";
    if (!phone.trim())   e.phone   = "Ingresá tu teléfono";
    if (!payment)        e.payment = "Seleccioná una forma de pago";
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
          <div className="max-w-5xl mx-auto px-6 lg:px-10">
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

            /* Empty cart */
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

            /* Cart with items */
            ) : (
              <div className="grid lg:grid-cols-[1fr_380px] gap-10 items-start">

                {/* ── LEFT: items ── */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-4 mb-6">
                    <p className="text-[13px] text-pl-gray">
                      {lines.reduce((a, l) => a + l.qty, 0)} {lines.reduce((a, l) => a + l.qty, 0) === 1 ? "título" : "títulos"} en tu carrito
                    </p>
                    <button
                      type="button"
                      onClick={() => { if (window.confirm("¿Vaciar el carrito?")) window.PL_cartClear?.(); }}
                      className="text-[11px] tracking-wide uppercase text-pl-gray hover:text-pl-red transition-colors"
                    >
                      Vaciar carrito
                    </button>
                  </div>

                  <ul className="space-y-3">
                    {resolved.map(({ id, qty, book }) => (
                      <li key={id} className="flex gap-4 sm:gap-5 p-4 sm:p-5 border border-pl-coal/10 bg-pl-white/80">
                        {/* Cover */}
                        <div className="w-16 sm:w-20 shrink-0">
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

                        {/* Info */}
                        <div className="flex-1 min-w-0 flex flex-col">
                          {book ? (
                            <>
                              <a
                                href={`libro.html?id=${book.id}`}
                                className="font-display text-pl-coal text-[17px] sm:text-[19px] leading-snug hover:text-pl-red transition-colors"
                              >
                                {book.title}
                              </a>
                              <p className="text-pl-gray text-[12px] mt-0.5 italic">por {book.author}</p>
                            </>
                          ) : (
                            <p className="text-pl-coal text-[14px]">Producto ya no disponible (ref. {id})</p>
                          )}

                          <div className="mt-auto pt-3 flex flex-wrap items-end justify-between gap-3">
                            {/* Price */}
                            <div>
                              <div className="text-[9px] tracking-[0.2em] uppercase text-pl-gray/70">Precio unitario</div>
                              <div className="font-display tabular-nums text-pl-coal text-[16px]">
                                {book
                                  ? typeof window.formatPrecioGs === "function"
                                    ? window.formatPrecioGs(book.price)
                                    : book.price
                                  : "—"}
                              </div>
                            </div>

                            {/* Qty controls */}
                            <div className="flex items-center gap-2">
                              <span className="text-[9px] uppercase tracking-wide text-pl-gray mr-1">Cant.</span>
                              <button
                                type="button"
                                aria-label="Menos una unidad"
                                className="w-8 h-8 border border-pl-coal/15 text-pl-coal hover:border-pl-gold transition-colors text-[15px]"
                                onClick={() => window.PL_cartUpdateQty?.(id, qty - 1)}
                              >−</button>
                              <span className="w-7 text-center tabular-nums text-[13px] font-medium">{qty}</span>
                              <button
                                type="button"
                                aria-label="Más una unidad"
                                className="w-8 h-8 border border-pl-coal/15 text-pl-coal hover:border-pl-gold transition-colors text-[15px]"
                                onClick={() => window.PL_cartUpdateQty?.(id, qty + 1)}
                              >+</button>
                            </div>
                          </div>

                          {/* Line subtotal */}
                          <div className="mt-2.5 flex justify-between items-center gap-3 border-t border-pl-coal/8 pt-2.5">
                            <span className="text-[11px] text-pl-gray">
                              Subtotal
                              {book && window.parsePrecioGs && window.parsePrecioGs(book.price) == null && (
                                <span className="block text-[10px] text-pl-gold-dk mt-0.5">Precio a confirmar</span>
                              )}
                            </span>
                            <span className="font-display tabular-nums font-semibold text-pl-coal text-[14px]">
                              {book && window.parsePrecioGs && window.formatPrecioGs
                                ? (() => {
                                    const n = window.parsePrecioGs(book.price);
                                    return n != null ? window.formatPrecioGs(String(n * qty)) : "—";
                                  })()
                                : "—"}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => window.PL_cartRemove?.(id)}
                            className="mt-2 self-start text-[10px] tracking-wide uppercase text-pl-gray hover:text-pl-red transition-colors"
                          >
                            Quitar
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <p className="text-[11px] text-pl-gray/70 text-center pt-2">
                    Los precios y la disponibilidad se confirman al momento del pedido.
                  </p>
                </div>

                {/* ── RIGHT: summary + checkout form ── */}
                <div className="space-y-6 lg:sticky lg:top-6">

                  {/* Order summary */}
                  <div className="border border-pl-coal/12 bg-pl-white px-6 py-6">
                    <div className="text-[10px] tracking-[0.25em] uppercase text-pl-gray mb-4">Resumen del pedido</div>
                    <div className="space-y-2 mb-4">
                      {resolved.map(({ id, qty, book }) => (
                        <div key={id} className="flex justify-between gap-3 text-[12px]">
                          <span className="text-pl-coal truncate flex-1">
                            {book ? book.title : `Ref. ${id}`}
                            <span className="text-pl-gray ml-1">× {qty}</span>
                          </span>
                          <span className="tabular-nums text-pl-coal shrink-0">
                            {book && window.parsePrecioGs && window.formatPrecioGs
                              ? (() => { const n = window.parsePrecioGs(book.price); return n != null ? window.formatPrecioGs(String(n * qty)) : "—"; })()
                              : "—"}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-pl-coal/10 pt-4 flex justify-between items-baseline gap-4">
                      <span className="text-[11px] tracking-[0.22em] uppercase text-pl-gray">Total estimado</span>
                      <span className="font-display tabular-nums text-[28px] text-pl-coal font-semibold leading-none">
                        {anyNumericPrice && typeof window.formatPrecioGs === "function"
                          ? window.formatPrecioGs(String(subtotal))
                          : "—"}
                      </span>
                    </div>
                    {hasPriceToConfirm && (
                      <p className="text-[11px] text-pl-gray leading-relaxed mt-3">
                        Algunos títulos tienen precio a confirmar; lo coordinamos por WhatsApp.
                      </p>
                    )}
                  </div>

                  {/* Checkout form */}
                  <div className="border border-pl-coal/12 bg-pl-white px-6 py-6 space-y-5">
                    <div className="text-[10px] tracking-[0.25em] uppercase text-pl-gray">Tus datos</div>

                    <Field label="Nombre completo" required>
                      <input
                        type="text"
                        value={name}
                        onChange={e => { setName(e.target.value); setErrors(v => ({ ...v, name: undefined })); }}
                        placeholder="Ej. Ana García"
                        className={inputCls + (errors.name ? " border-pl-red" : "")}
                      />
                      {errors.name && <p className="text-pl-red text-[11px] mt-1">{errors.name}</p>}
                    </Field>

                    <Field label="Teléfono / WhatsApp" required>
                      <input
                        type="tel"
                        value={phone}
                        onChange={e => { setPhone(e.target.value); setErrors(v => ({ ...v, phone: undefined })); }}
                        placeholder="Ej. +595 981 123 456"
                        className={inputCls + (errors.phone ? " border-pl-red" : "")}
                      />
                      {errors.phone && <p className="text-pl-red text-[11px] mt-1">{errors.phone}</p>}
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

                    {/* Payment methods */}
                    <div>
                      <div className="text-[10px] tracking-[0.22em] uppercase text-pl-gray/80 mb-2.5">
                        Forma de pago<span className="text-pl-red ml-0.5">*</span>
                      </div>
                      <div className="space-y-2">
                        {PAYMENT_METHODS.map(pm => (
                          <label
                            key={pm.id}
                            className={`flex items-center gap-3 px-4 py-3 border cursor-pointer transition-colors ${
                              payment === pm.id
                                ? "border-pl-gold bg-pl-gold/5 text-pl-coal"
                                : "border-pl-coal/12 bg-pl-white text-pl-coal hover:border-pl-gold/50"
                            }`}
                          >
                            <input
                              type="radio"
                              name="payment"
                              value={pm.id}
                              checked={payment === pm.id}
                              onChange={() => { setPayment(pm.id); setErrors(v => ({ ...v, payment: undefined })); }}
                              className="sr-only"
                            />
                            <span className="text-[16px]">{pm.icon}</span>
                            <span className="text-[13px] font-medium flex-1">{pm.label}</span>
                            {payment === pm.id && (
                              <span className="w-4 h-4 border-2 border-pl-gold rounded-full bg-pl-gold shrink-0" />
                            )}
                            {payment !== pm.id && (
                              <span className="w-4 h-4 border border-pl-coal/20 rounded-full shrink-0" />
                            )}
                          </label>
                        ))}
                      </div>
                      {errors.payment && <p className="text-pl-red text-[11px] mt-1.5">{errors.payment}</p>}
                    </div>

                    {/* CTA */}
                    <button
                      type="button"
                      onClick={handleOrder}
                      className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-4 bg-pl-red text-white text-[14px] font-medium tracking-wide hover:bg-pl-red-dk transition-colors"
                    >
                      <IconWhatsapp size={18} />
                      Enviar pedido por WhatsApp
                    </button>

                    <p className="text-[11px] text-pl-gray/70 text-center leading-relaxed">
                      Te contactaremos por WhatsApp para confirmar disponibilidad y coordinar el pago.
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
