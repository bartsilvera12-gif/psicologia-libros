/* ─── Supabase — PSICOLOGÍA LIBROS ─── */

const PL_SUPABASE_URL = "https://api.neura.com.py";
const PL_ANON_KEY     = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzc0MTAxNDYxLCJleHAiOjE5MzE3ODE0NjF9.7_wAph8IolPMXtgfpezSwS5XR62IdD__qhqCywLDp3Q";
const PL_SERVICE_KEY  = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaXNzIjoic3VwYWJhc2UiLCJpYXQiOjE3NzQxMDE0NjEsImV4cCI6MTkzMTc4MTQ2MX0.ZalpuMsNyVApzFSu3mOFjXUqnxqV9fVyhp3OQQGlAFI";

/* ── Headers ─────────────────────────────────────────────── */
const plHeaders = (admin = false) => ({
  "Content-Type":  "application/json",
  "apikey":        admin ? PL_SERVICE_KEY : PL_ANON_KEY,
  "Authorization": "Bearer " + (admin ? PL_SERVICE_KEY : PL_ANON_KEY),
  "Prefer":        "return=representation"
});

/* ── Helpers REST ────────────────────────────────────────── */
const plGet = async (table, query = "") => {
  const res = await fetch(`${PL_SUPABASE_URL}/rest/v1/${table}?${query}`, { headers: plHeaders() });
  if (!res.ok) throw new Error(`GET ${table}: ${res.status}`);
  return res.json();
};

const plPost = async (table, data) => {
  const res = await fetch(`${PL_SUPABASE_URL}/rest/v1/${table}`, {
    method: "POST", headers: plHeaders(true), body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error(`POST ${table}: ${res.status}`);
  return res.json();
};

const plPatch = async (table, filter, data) => {
  const res = await fetch(`${PL_SUPABASE_URL}/rest/v1/${table}?${filter}`, {
    method: "PATCH", headers: plHeaders(true), body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error(`PATCH ${table}: ${res.status}`);
  return res.json();
};

const plDelete = async (table, filter) => {
  const res = await fetch(`${PL_SUPABASE_URL}/rest/v1/${table}?${filter}`, {
    method: "DELETE", headers: plHeaders(true)
  });
  if (!res.ok) throw new Error(`DELETE ${table}: ${res.status}`);
};

/* ── Parsear image_url (puede ser URL simple o JSON array) ── */
const parseImageUrls = (val) => {
  if (!val) return [];
  try {
    const parsed = JSON.parse(val);
    if (Array.isArray(parsed)) return parsed.filter(Boolean);
  } catch(e) {}
  return val ? [val] : [];
};

/* ── Mapear fila de pl_books → formato interno de la app ── */
const mapBook = (row) => {
  const urls = parseImageUrls(row.image_url);
  return {
    id:          row.id,
    title:       row.title,
    author:      row.author,
    category:    row.category_id,
    description: row.description || "",
    price:       row.price
      ? (typeof window !== "undefined" && window.formatPrecioGs
          ? window.formatPrecioGs(row.price)
          : row.price)
      : "Consultar precio",
    status:      row.status || "consultar",
    cover: {
      palette: row.cover_palette || "coal",
      short:   row.cover_short   || row.title,
    },
    featured:      row.featured      || false,
    vitrine_order: row.vitrine_order  ?? null,
    is_active:     row.is_active !== false,
    editorial:     row.editorial || "",
    soporte:       row.soporte   || "",
    paginas:       row.paginas   || "",
    idioma:        row.idioma    || "",
    tema:          row.tema      || "",
    image_urls: urls,
    image_url:  urls[0] || null,
  };
};

/* ── Mapear fila de pl_categories → formato interno ──────── */
const ICON_MAP = {
  brain:       () => window.IconBrain,
  heart:       () => window.IconHeartLeaf,
  waves:       () => window.IconWaves,
  cloud:       () => window.IconCloud,
  neurons:     () => window.IconNeurons,
  chat:        () => window.IconChat,
  seed:        () => window.IconSeed,
  child:       () => window.IconChild,
  stethoscope: () => window.IconStethoscope,
  hourglass:   () => window.IconHourglass,
  link:        () => window.IconLink,
  leaf:        () => window.IconLeaf,
};

const mapCategory = (row) => ({
  id:   row.id,
  name: row.name,
  desc: row.description || "",
  Icon: ICON_MAP[row.icon_name] ? ICON_MAP[row.icon_name]() : window.IconBrain,
});

/* ── Cargar libros desde pl_books ───────────────────────── */
const loadPLBooks = async () => {
  try {
    const rows = await plGet("pl_books", "is_active=eq.true&order=created_at.asc");
    window.BOOKS = rows.map(mapBook);
    return window.BOOKS;
  } catch (e) {
    console.warn("Supabase: usando libros locales.", e);
    return window.BOOKS;
  }
};

/* ── Cargar categorías desde pl_categories ──────────────── */
const loadPLCategories = async () => {
  try {
    const rows = await plGet("pl_categories", "order=sort_order.asc");
    window.CATEGORIES = rows.map(mapCategory);
    return window.CATEGORIES;
  } catch (e) {
    console.warn("Supabase: usando categorías locales.", e);
    return window.CATEGORIES;
  }
};

/* ── Cargar FAQs desde pl_faqs ──────────────────────────── */
const loadPLFaqs = async () => {
  try {
    const rows = await plGet("pl_faqs", "order=sort_order.asc");
    window.FAQS = rows.map((r) => ({ q: r.question, a: r.answer }));
    return window.FAQS;
  } catch (e) {
    console.warn("Supabase: usando FAQs locales.", e);
    return window.FAQS;
  }
};

/* ── CRUD Libros (admin) ─────────────────────────────────── */
const createPLBook = async ({
  title, author, category_id, description, price, status, cover_palette, cover_short, featured, image_url,
  editorial, soporte, paginas, idioma, tema,
}) => {
  const [row] = await plPost("pl_books", {
    title, author, category_id,
    description: description || "",
    price:        price        || "Consultar precio",
    status:       status       || "disponible",
    cover_palette: cover_palette || "coal",
    cover_short:   cover_short   || title,
    featured:      featured      || false,
    is_active:     true,
    image_url:     image_url     || null,
    editorial: editorial?.trim() || null,
    soporte:   soporte?.trim()   || null,
    paginas:   paginas?.trim()   || null,
    idioma:    idioma?.trim()    || null,
    tema:      tema?.trim()      || null,
  });
  return row;
};

const updatePLBook = async (id, fields) => {
  const body = { updated_at: new Date().toISOString(), ...fields };
  return plPatch("pl_books", `id=eq.${id}`, body);
};

const deletePLBook = async (id) => plDelete("pl_books", `id=eq.${id}`);

/* ── CRUD Categorías (admin) ─────────────────────────────── */
const createPLCategory = async ({ id, name, description, icon_name, sort_order }) => {
  const [row] = await plPost("pl_categories", { id, name, description: description || "", icon_name: icon_name || "brain", sort_order: sort_order || 99 });
  return row;
};

const updatePLCategory = async (id, fields) => plPatch("pl_categories", `id=eq.${id}`, fields);

const deletePLCategory = async (id) => plDelete("pl_categories", `id=eq.${id}`);

/* ── CRUD FAQs (admin) ───────────────────────────────────── */
const createPLFaq = async ({ question, answer, sort_order }) => {
  const [row] = await plPost("pl_faqs", { question, answer, sort_order: sort_order || 99 });
  return row;
};

const updatePLFaq = async (id, { question, answer, sort_order }) =>
  plPatch("pl_faqs", `id=eq.${id}`, { question, answer, sort_order });

const deletePLFaq = async (id) => plDelete("pl_faqs", `id=eq.${id}`);

/* ── Init: carga todo al arrancar ────────────────────────── */
window.__sbLoadPLData = async () => {
  await Promise.all([
    loadPLCategories(),
    loadPLBooks(),
    loadPLFaqs(),
  ]);
};

const plGetAdmin = async (table, query = "") => {
  const res = await fetch(`${PL_SUPABASE_URL}/rest/v1/${table}?${query}`, { headers: plHeaders(true) });
  if (!res.ok) throw new Error(`GET ${table}: ${res.status}`);
  return res.json();
};

Object.assign(window, {
  PL_SUPABASE_URL, PL_SERVICE_KEY,
  plHeaders,
  plGet, plPost, plPatch, plDelete, plGetAdmin,
  loadPLBooks, loadPLCategories, loadPLFaqs,
  createPLBook, updatePLBook, deletePLBook,
  createPLCategory, updatePLCategory, deletePLCategory,
  createPLFaq, updatePLFaq, deletePLFaq,
  mapBook, mapCategory,
});
