/* ─── Página de Preguntas Frecuentes ─── */

const FAQPageApp = () => {
  const [ready,   setReady]   = React.useState(false);
  const [faqs,    setFaqs]    = React.useState([]);
  const [openIdx, setOpenIdx] = React.useState(0);

  React.useEffect(() => {
    window.__sbLoadPLData().finally(() => {
      setFaqs(window.FAQS || []);
      setReady(true);
    });
  }, []);

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
        {/* ── Hero banner ── */}
        <section className="hero-texture border-b border-pl-coal/8 py-20 lg:py-28 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-pl-gold/10 rounded-full blur-[100px] -translate-y-1/2" />
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-pl-red/5 rounded-full blur-[80px]" />
          </div>
          <div className="max-w-5xl mx-auto px-6 lg:px-10 relative" style={{ animation: "fadeSlideIn 0.7s ease both" }}>
            <div className="flex items-center gap-3 mb-5">
              <span className="inline-block w-6 h-px bg-pl-gold" />
              <span className="eyebrow">Ayuda</span>
            </div>
            <h1 className="font-display text-pl-coal text-[48px] sm:text-[64px] lg:text-[80px] leading-[1.02] tracking-tight">
              Preguntas <em className="font-normal italic text-pl-red">frecuentes</em>
            </h1>
            <p className="mt-6 text-pl-gray text-[17px] leading-relaxed max-w-2xl">
              Resolvé las dudas más comunes sobre nuestro catálogo, disponibilidad, precios y formas de consulta. Si tu pregunta no está aquí, escribinos directamente.
            </p>
            <a href={waLink("Hola, tengo una consulta para Psicología Libros.")}
               target="_blank" rel="noreferrer"
               className="mt-8 inline-flex items-center gap-2.5 px-7 py-4 bg-pl-red text-white text-[14px] tracking-wide hover:bg-pl-red-dk transition-colors">
              <IconWhatsapp size={17} /> Hacer una consulta
            </a>
          </div>
        </section>

        {/* ── FAQ items ── */}
        <section className="py-20 lg:py-28">
          <div className="max-w-5xl mx-auto px-6 lg:px-10">
            {faqs.length === 0 ? (
              <div className="text-center py-16">
                <div className="font-display text-pl-coal text-[24px] mb-3">No hay preguntas cargadas aún</div>
                <p className="text-pl-gray text-[14px]">Podés agregar preguntas desde el panel de administración.</p>
              </div>
            ) : (
              <div className="grid lg:grid-cols-12 gap-12">
                {/* Sidebar */}
                <aside className="lg:col-span-4" style={{ animation: "fadeSlideIn 0.7s 0.1s ease both" }}>
                  <div className="sticky top-[100px]">
                    <div className="eyebrow mb-4">En esta página</div>
                    <div className="space-y-1">
                      {faqs.map((f, i) => (
                        <button
                          key={i}
                          onClick={() => setOpenIdx(i)}
                          className={`w-full text-left px-4 py-3 text-[13px] leading-snug transition-all border-l-2 ${
                            openIdx === i
                              ? "border-pl-gold text-pl-coal font-medium bg-pl-gold/5"
                              : "border-transparent text-pl-gray hover:text-pl-coal hover:border-pl-gold/40"
                          }`}>
                          {f.q}
                        </button>
                      ))}
                    </div>
                    <div className="mt-10 bg-pl-coal text-pl-ivory p-6">
                      <div className="eyebrow !text-pl-gold mb-3">¿No encontrás tu duda?</div>
                      <p className="text-[13px] text-pl-ivory/75 leading-relaxed mb-5">
                        Escribinos por WhatsApp y te respondemos en minutos.
                      </p>
                      <a href={waLink("Hola, tengo una consulta para Psicología Libros.")}
                         target="_blank" rel="noreferrer"
                         className="inline-flex items-center gap-2 w-full justify-center px-5 py-3 bg-pl-red text-white text-[13px] hover:bg-pl-red-dk transition-colors">
                        <IconWhatsapp size={15} /> Consultar
                      </a>
                    </div>
                  </div>
                </aside>

                {/* FAQ accordion */}
                <div className="lg:col-span-8" style={{ animation: "fadeSlideIn 0.7s 0.2s ease both" }}>
                  <div className="border-t border-pl-coal/10">
                    {faqs.map((f, i) => (
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
        </section>

        {/* ── CTA contacto ── */}
        <section className="py-20 bg-pl-beige/60 border-t border-pl-coal/8">
          <div className="max-w-3xl mx-auto px-6 lg:px-10 text-center">
            <div className="eyebrow justify-center flex items-center gap-3 mb-5">
              <span className="inline-block w-6 h-px bg-pl-gold" />
              <span>Contacto</span>
              <span className="inline-block w-6 h-px bg-pl-gold" />
            </div>
            <h2 className="font-display text-pl-coal text-[36px] sm:text-[48px] leading-[1.05] tracking-tight">
              ¿Buscás un libro en <em className="font-normal italic text-pl-red">particular</em>?
            </h2>
            <p className="mt-5 text-pl-gray text-[16px] leading-relaxed max-w-xl mx-auto">
              Escribinos y te ayudamos a encontrar el material que necesitás para tu interés, estudio o formación.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <a href={waLink("Hola, quiero consultar sobre el catálogo de Psicología Libros.")}
                 target="_blank" rel="noreferrer"
                 className="inline-flex items-center gap-3 px-8 py-4 bg-pl-red text-white text-[14px] tracking-wide hover:bg-pl-red-dk transition-colors">
                <IconWhatsapp size={18} /> Consultar por WhatsApp
              </a>
              <a href="catalogo.html"
                 className="inline-flex items-center gap-2 px-8 py-4 border border-pl-coal/20 text-pl-coal text-[14px] tracking-wide hover:border-pl-coal hover:bg-pl-coal hover:text-pl-ivory transition-all">
                Ver catálogo <IconArrow size={14} />
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <ScrollTopBtn />
    </div>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<FAQPageApp />);
