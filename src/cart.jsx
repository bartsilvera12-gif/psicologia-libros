/* ─── Carrito (localStorage) — Psicología Libros ─── */

const PL_CART_KEY = "pl_cart";

function plLoadRawCart() {
  try {
    const s = localStorage.getItem(PL_CART_KEY);
    const j = s ? JSON.parse(s) : [];
    return Array.isArray(j) ? j : [];
  } catch (e) {
    return [];
  }
}

function plNotifyCartChange() {
  try {
    window.dispatchEvent(new CustomEvent("pl-cart-change"));
  } catch (e) {}
}

function plSaveRawCart(lines) {
  localStorage.setItem(PL_CART_KEY, JSON.stringify(lines));
  plNotifyCartChange();
}

function plNormalizeLine(line) {
  const id = String(line.id ?? line.bookId ?? "").trim();
  const qty = Math.max(1, parseInt(line.qty, 10) || 1);
  return { id, qty };
}

function plCartLines() {
  return plLoadRawCart().map(plNormalizeLine).filter((l) => l.id);
}

function plCartCount() {
  return plCartLines().reduce((a, l) => a + l.qty, 0);
}

function plCartAdd(book) {
  if (!book || book.id == null) return;
  if (book.is_active === false) return;
  const id = String(book.id);
  const lines = plCartLines();
  const i = lines.findIndex((l) => l.id === id);
  if (i >= 0) lines[i] = { ...lines[i], qty: lines[i].qty + 1 };
  else lines.push({ id, qty: 1 });
  plSaveRawCart(lines);
  try {
    window.dispatchEvent(
      new CustomEvent("pl-cart-added", { detail: { title: book.title || "" } })
    );
  } catch (e) {}
}

function plCartRemove(bookId) {
  const sid = String(bookId);
  plSaveRawCart(plCartLines().filter((l) => l.id !== sid));
}

function plCartUpdateQty(bookId, qty) {
  const sid = String(bookId);
  const q = Math.max(0, parseInt(qty, 10) || 0);
  if (q === 0) return plCartRemove(sid);
  plSaveRawCart(
    plCartLines().map((l) => (l.id === sid ? { ...l, qty: q } : l))
  );
}

function plCartClear() {
  plSaveRawCart([]);
}

function plCartWaMessage() {
  const lines = plCartLines();
  const books = window.BOOKS || [];
  let body = "Hola, quiero hacer un pedido en Psicología Libros:\n\n";
  let subtotal = 0;
  const unknown = [];

  lines.forEach(({ id, qty }) => {
    const b = books.find((x) => String(x.id) === id);
    if (!b) {
      body += `• Referencia ${id} × ${qty}\n`;
      return;
    }
    const priceStr =
      typeof window.formatPrecioGs === "function"
        ? window.formatPrecioGs(b.price)
        : b.price;
    body += `• ${b.title} — ${qty} u. × ${priceStr}\n`;
    const n = window.parsePrecioGs ? window.parsePrecioGs(b.price) : null;
    if (n != null) subtotal += n * qty;
    else unknown.push(b.title);
  });

  body += "\n";
  if (subtotal > 0 && typeof window.formatPrecioGs === "function") {
    body += `Subtotal estimado: ${window.formatPrecioGs(String(subtotal))}\n`;
  }
  if (unknown.length) {
    body += `\nPrecio a confirmar: ${unknown.join(", ")}\n`;
  }
  body += "\nGracias.";
  return body;
}

Object.assign(window, {
  PL_cartLines: plCartLines,
  PL_cartCount: plCartCount,
  PL_cartAdd: plCartAdd,
  PL_cartRemove: plCartRemove,
  PL_cartUpdateQty: plCartUpdateQty,
  PL_cartClear: plCartClear,
  PL_cartWaMessage: plCartWaMessage,
});
