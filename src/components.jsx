// === Reusable primitives ===

const GoldRule = ({ className = "" }) => <div className={`gold-rule ${className}`} />;
const GoldDot = () => <span className="inline-block w-1.5 h-1.5 rounded-full bg-pl-gold align-middle" />;

const Eyebrow = ({ children, className = "" }) => (
  <div className={`eyebrow flex items-center gap-3 ${className}`}>
    <span className="inline-block w-6 h-px bg-pl-gold" />
    <span>{children}</span>
  </div>
);

const SectionTitle = ({ eyebrow, title, lead, center, className = "" }) => (
  <div className={`${center ? "text-center mx-auto max-w-3xl" : "max-w-3xl"} ${className}`}>
    {eyebrow && <Eyebrow className={center ? "justify-center" : ""}>{eyebrow}</Eyebrow>}
    <h2 className="font-display text-pl-coal text-[42px] sm:text-5xl lg:text-[56px] leading-[1.05] mt-5 tracking-tight">
      {title}
    </h2>
    {lead && (
      <p className="mt-5 text-pl-gray text-[17px] leading-relaxed max-w-2xl">
        {lead}
      </p>
    )}
  </div>
);

// Buttons
const BtnPrimary = ({ href, onClick, children, className = "", icon = true, ...rest }) => {
  const Tag = href ? "a" : "button";
  return (
    <Tag
      href={href}
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-pl-red text-white text-[14px] font-medium tracking-wide hover:bg-pl-red-dk transition-colors duration-300 group ${className}`}
      {...rest}
    >
      {icon && <IconWhatsapp size={17} stroke="currentColor" />}
      <span>{children}</span>
    </Tag>
  );
};

const BtnGhost = ({ href, onClick, children, className = "", ...rest }) => {
  const Tag = href ? "a" : "button";
  return (
    <Tag
      href={href}
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 px-6 py-3.5 border border-pl-coal/15 text-pl-coal text-[14px] font-medium tracking-wide hover:border-pl-coal hover:bg-pl-coal hover:text-pl-ivory transition-all duration-300 ${className}`}
      {...rest}
    >
      <span>{children}</span>
      <IconArrow size={15} />
    </Tag>
  );
};

// === Book cover (typographic placeholder, editorial) ===
const BookCover = ({ book, large = false }) => {
  const coverUrl = (book.image_urls && book.image_urls.length > 0) ? book.image_urls[0] : book.image_url;
  if (coverUrl) {
    return (
      <div className={`book-cover w-full ${large ? "aspect-[2/3]" : "aspect-[3/4]"} overflow-hidden bg-pl-coal/5`}>
        <img src={coverUrl} alt={book.title}
             className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
      </div>
    );
  }
  const palettes = {
    coal:  "typo-cover",
    red:   "typo-cover r",
    blue:  "typo-cover b",
    ivory: "typo-cover i",
    green: "typo-cover g",
    plum:  "typo-cover p",
  };
  const cls = palettes[book.cover.palette] || "typo-cover";
  const isLight = book.cover.palette === "ivory";
  return (
    <div className={`${cls} book-cover w-full ${large ? "aspect-[2/3]" : "aspect-[3/4]"}`}>
      <div className="frame" />
      <div className="absolute top-5 left-0 right-0 px-[18px] flex flex-col items-center gap-1.5 overflow-hidden">
        <div className={`w-6 h-px ${isLight ? "bg-pl-gold-dk" : "bg-pl-gold"}`} />
        <div className={`text-[9px] tracking-[0.08em] sm:tracking-[0.22em] uppercase whitespace-nowrap ${isLight ? "text-pl-gold-dk" : "text-pl-gold"}`}>
          Psicología · Libros
        </div>
      </div>
      <div className="absolute inset-0 flex items-center justify-center px-6">
        <div className="font-display text-center leading-[1.05] tracking-tight whitespace-pre-line text-[clamp(20px,3.4vw,34px)]">
          {(book.cover.short || "").replace(/\\n/g, "\n")}
        </div>
      </div>
      <div className="absolute bottom-5 left-0 right-0 px-[18px] flex flex-col items-center gap-1.5 overflow-hidden">
        <div className={`text-[9px] tracking-[0.08em] sm:tracking-[0.2em] uppercase opacity-80 whitespace-nowrap overflow-hidden text-ellipsis max-w-full ${isLight ? "text-[#5b4a22]" : ""}`}>
          {book.author}
        </div>
        <div className={`w-3 h-px ${isLight ? "bg-pl-gold-dk" : "bg-pl-gold"}`} />
      </div>
    </div>
  );
};

// === Status pill ===
const StatusPill = ({ status }) => {
  const map = {
    disponible:  { label: "Disponible",  color: "#3d7a4a" },
    consultar:   { label: "Consultar",   color: "#A4842F" },
    agotado:     { label: "Agotado",     color: "#8B1A1A" },
    por_encargo: { label: "Por encargo", color: "#4A4A4A" },
  };
  const s = map[status] || map.consultar;
  return (
    <span className="inline-flex items-center gap-2 text-[10px] tracking-[0.22em] uppercase font-medium"
          style={{ color: s.color }}>
      <span style={{ display:"inline-block", width:16, height:1, background: s.color, opacity:0.6 }} />
      {s.label}
    </span>
  );
};

// === Book card ===
const BookCard = ({ book }) => {
  const msg        = `Hola, me interesa el libro "${book.title}" de Psicología Libros. ¿Me podés dar más información?`;
  const detailHref = `libro.html?id=${book.id}`;
  return (
    <article className="group min-w-0 w-full bg-pl-white border border-pl-coal/8 lift shadow-card hover:shadow-card-hv hover:border-pl-gold/40 flex flex-col overflow-hidden">
      {/* Portada */}
      <a href={detailHref} className="block">
        <BookCover book={book} />
      </a>

      <div className="p-2.5 sm:p-4 flex flex-col flex-1">
        {/* Category + status */}
        <div className="flex items-center justify-between gap-1">
          <span className="eyebrow !text-[9px] sm:!text-[10px] truncate">{catName(book.category)}</span>
          <StatusPill status={book.status} />
        </div>

        {/* Title */}
        <a href={detailHref} className="group/title mt-2 sm:mt-3 block">
          <h3 className="font-display text-pl-coal text-[15px] sm:text-[18px] lg:text-[20px] leading-[1.15] tracking-tight group-hover/title:text-pl-red transition-colors line-clamp-3">
            {book.title}
          </h3>
        </a>
        <p className="text-pl-gray text-[11px] sm:text-[12px] mt-1 italic truncate">por {book.author}</p>

        <div className="mt-2 sm:mt-3 gold-rule-short" />
        <div className="flex-1" />

        {/* Price */}
        <div className="mt-3 sm:mt-4">
          <div className="text-[8px] sm:text-[9px] tracking-[0.18em] uppercase text-pl-gray/60">Precio</div>
          <div className="font-display tabular-nums font-semibold text-pl-coal text-[15px] sm:text-[18px] lg:text-[19px] mt-0.5 leading-tight">
            {typeof window.formatPrecioGs === "function" ? window.formatPrecioGs(book.price) : book.price}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-2 sm:mt-3 grid grid-cols-2 gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => window.PL_cartAdd?.(book)}
            className="inline-flex items-center justify-center px-1.5 sm:px-3 py-2 sm:py-2.5 border border-pl-coal/20 text-pl-coal text-[9px] sm:text-[11px] tracking-wide hover:border-pl-gold hover:text-pl-red transition-colors"
          >
            + Carrito
          </button>
          <a
            href={waLink(msg)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-1 sm:gap-1.5 px-1.5 sm:px-3 py-2 sm:py-2.5 bg-pl-red text-white text-[9px] sm:text-[11px] tracking-wide hover:bg-pl-red-dk transition-colors"
          >
            <IconWhatsapp size={11} /> Consultar
          </a>
        </div>
      </div>
    </article>
  );
};

// === Category card ===
const CategoryCard = ({ cat, onClick }) => {
  const I = cat.Icon;
  return (
    <button
      onClick={onClick}
      className="group text-left bg-pl-white border border-pl-coal/8 p-6 lift shadow-card hover:shadow-card-hv hover:border-pl-gold/50 relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-12 h-px bg-pl-gold opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="flex items-center justify-between">
        <div className="text-pl-coal group-hover:text-pl-red transition-colors">
          <I size={32} />
        </div>
        <div className="w-8 h-px bg-pl-gold/50" />
      </div>
      <h3 className="font-display text-pl-coal text-[22px] leading-tight mt-5 tracking-tight">
        {cat.name}
      </h3>
      <p className="text-pl-gray text-[13px] mt-2 leading-relaxed">
        {cat.desc}
      </p>
      <div className="mt-5 flex items-center gap-2 text-[11px] tracking-[0.22em] uppercase text-pl-gold-dk">
        Explorar <IconArrow size={13} />
      </div>
    </button>
  );
};

// === Benefit card ===
const BenefitCard = ({ b }) => {
  const I = b.Icon;
  return (
    <div className="bg-pl-white border border-pl-coal/8 p-7 lift shadow-card hover:shadow-card-hv">
      <div className="w-12 h-12 border border-pl-gold/40 flex items-center justify-center text-pl-coal">
        <I size={26} />
      </div>
      <h3 className="font-display text-pl-coal text-[22px] mt-5 leading-tight">{b.title}</h3>
      <div className="my-3 gold-rule-short" />
      <p className="text-pl-gray text-[14px] leading-relaxed">{b.desc}</p>
    </div>
  );
};

// === FAQ item ===
const FAQItem = ({ item, open, onToggle, idx }) => {
  return (
    <div className="border-b border-pl-coal/10">
      <button
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={`faq-panel-${idx}`}
        className="w-full text-left flex items-center justify-between gap-6 py-6 group"
      >
        <span className="font-display text-pl-coal text-[20px] sm:text-[22px] leading-snug pr-4">
          {item.q}
        </span>
        <span className={`shrink-0 w-9 h-9 border border-pl-coal/20 flex items-center justify-center transition-all duration-300 ${open ? "bg-pl-coal text-pl-ivory border-pl-coal rotate-180" : "text-pl-coal group-hover:border-pl-gold"}`}>
          <IconChevron size={16} />
        </span>
      </button>
      <div id={`faq-panel-${idx}`} className={`faq-content ${open ? "open" : ""}`}>
        <div>
          <p className="text-pl-gray text-[15px] leading-relaxed pb-7 pr-12 max-w-3xl">
            {item.a}
          </p>
        </div>
      </div>
    </div>
  );
};

Object.assign(window, {
  GoldRule, GoldDot, Eyebrow, SectionTitle,
  BtnPrimary, BtnGhost,
  BookCover, StatusPill, BookCard,
  CategoryCard, BenefitCard, FAQItem,
});
