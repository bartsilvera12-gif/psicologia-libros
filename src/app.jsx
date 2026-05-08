const App = () => {
  const [ready,  setReady]  = React.useState(false);
  const [active, setActive] = React.useState("inicio");

  React.useEffect(() => {
    window.__sbLoadPLData().finally(() => setReady(true));
  }, []);

  React.useEffect(() => {
    if (!ready) return;
    const ids = ["inicio", "nosotros", "contacto"];
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); });
    }, { rootMargin: "-40% 0px -55% 0px", threshold: 0 });
    ids.forEach(id => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [ready]);

  if (!ready) {
    return (
      <div className="min-h-screen paper-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-6" style={{ animation: "logoReveal 0.8s ease both" }}>
          <div style={{ animation: "logoFloat 4s ease-in-out infinite, glowPulse 3s ease-in-out infinite" }}>
            <img src="logosinfondo2.png" alt="Psicología Libros" style={{ width: 200, height: 200, objectFit: "contain" }} />
          </div>
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-pl-gold animate-bounce" style={{ animationDelay: "0ms" }} />
            <div className="w-1.5 h-1.5 rounded-full bg-pl-gold animate-bounce" style={{ animationDelay: "150ms" }} />
            <div className="w-1.5 h-1.5 rounded-full bg-pl-gold animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
          <span className="text-[11px] tracking-[0.3em] uppercase text-pl-gray">Cargando…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full max-w-[100vw] overflow-x-hidden">
      <Header active={active} />
      <main>
        <Hero />
        <FeaturedCarousel />
        <CatalogPreviewCarousel />
        <About />
        <Benefits />
        <Contact />
      </main>
      <Footer />
      <ScrollTopBtn />
    </div>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
