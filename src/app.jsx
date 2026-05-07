const App = () => {
  const [active, setActive] = React.useState("inicio");
  const [filter, setFilter] = React.useState("all");

  React.useEffect(() => {
    const ids = ["inicio", "catalogo", "nosotros", "faq", "contacto"];
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); });
    }, { rootMargin: "-40% 0px -55% 0px", threshold: 0 });
    ids.forEach(id => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  const pickCategory = (id) => {
    setFilter(id);
    setTimeout(() => {
      document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

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
