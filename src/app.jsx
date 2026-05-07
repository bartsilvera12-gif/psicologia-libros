const App = () => {
  const [ready,  setReady]  = React.useState(false);
  const [active, setActive] = React.useState("inicio");
  const [filter, setFilter] = React.useState("all");

  // Carga datos desde Supabase al montar
  React.useEffect(() => {
    window.__sbLoadPLData().finally(() => setReady(true));
  }, []);

  // IntersectionObserver para el nav activo
  React.useEffect(() => {
    if (!ready) return;
    const ids = ["inicio", "catalogo", "nosotros", "faq", "contacto"];
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); });
    }, { rootMargin: "-40% 0px -55% 0px", threshold: 0 });
    ids.forEach(id => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [ready]);

  const pickCategory = (id) => {
    setFilter(id);
    setTimeout(() => {
      document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  // Pantalla de carga con logo animado
  if (!ready) {
    return (
      <div className="min-h-screen paper-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-6" style={{ animation: "logoReveal 0.8s ease both" }}>
          <div style={{ animation: "logoFloat 4s ease-in-out infinite, glowPulse 3s ease-in-out infinite" }}>
            <img src="logo.jpeg" alt="Psicología Libros" style={{ width: 180, height: 180, objectFit: "contain" }} />
          </div>
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

  return (
    <div className="min-h-screen">
      <Header active={active} />
      <main>
        <Hero />
        <CategoryQuickNav filter={filter} onPick={pickCategory} />
        <FeaturedCarousel />
        <CatalogBySections filter={filter} setFilter={setFilter} />
        <About />
        <Benefits />
        <FAQSection />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
