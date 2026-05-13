"""Import books from the user's XLS stock file into Supabase pl_books.

Filters Rubro=LIBROS, auto-categorizes by title keywords, and bulk-inserts
via the PostgREST endpoint (libreriapsicologia schema).
"""
import sys, json, re, urllib.request, xlrd

XLS = r"C:\Users\karen\Downloads\STOK LIBROS SISTEMA.xls"
URL = "https://api.neura.com.py"
SCHEMA = "libreriapsicologia"
SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaXNzIjoic3VwYWJhc2UiLCJpYXQiOjE3NzQxMDE0NjEsImV4cCI6MTkzMTc4MTQ2MX0.ZalpuMsNyVApzFSu3mOFjXUqnxqV9fVyhp3OQQGlAFI"

HEADERS = {
    "Content-Type": "application/json",
    "apikey": SERVICE_KEY,
    "Authorization": "Bearer " + SERVICE_KEY,
    "Accept-Profile": SCHEMA,
    "Content-Profile": SCHEMA,
    "Prefer": "return=representation",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
}

# Order matters: most specific patterns first.
CATEGORY_RULES = [
    ("infantil",     r"\b(infan|ni[ñn]o|ni[ñn]a|adolescen|pediatr|escolar|crianza|bebe|beb[eé])"),
    ("neuro",        r"\b(neuro|cerebr|cogniti|tdah|tdh|memoria|atenci[oó]n)"),
    ("psiquiatria",  r"\b(psiquiatr|dsm|cie[- ]?10|cie[- ]?11|farmac|psicofarm|medicamento)"),
    ("ansiedad",     r"\b(ansied|p[aá]nico|fobi|toc|obsesi)"),
    ("depresion",    r"\b(depresi|melanco|suicid|estado de [aá]nimo|bipol)"),
    ("trauma",       r"\b(trauma|duelo|p[eé]rdida|tept|ptsd|abuso|maltrato|violenc)"),
    ("vinculos",     r"\b(apego|pareja|familia|vincul|relaci|matrimon|divorcio|amor|sexual)"),
    ("mindfulness",  r"\b(mindful|meditaci|atenci[oó]n plena|yoga|bienestar|relajaci)"),
    ("psicoterapia", r"\b(terapia|psicoterap|dbt|tcc|act |gestalt|sist[eé]mic|cognitiv|conductu|esquema)"),
    ("desarrollo',  ", r""),  # placeholder; will be overwritten
    ("desarrollo",   r"\b(desarrollo|autoayuda|h[aá]bit|motivaci|crecimiento|sentido|prop[oó]sito|inteligencia emocional|liderazgo|coach)"),
    ("salud",        r"\b(salud mental|bienestar|estr[eé]s|burnout|adicci|alcoholi|drogas)"),
    ("clinica",      r"\b(cl[ií]nic|diagn[oó]stic|evaluaci[oó]n|caso|entrevista)"),
]
# Cleanup malformed entry
CATEGORY_RULES = [r for r in CATEGORY_RULES if r[1]]

PALETTES = ["coal", "red", "blue", "ivory", "green", "plum"]

def categorize(title: str) -> str:
    t = title.lower()
    for cat, pat in CATEGORY_RULES:
        if re.search(pat, t):
            return cat
    return "clinica"

def fmt_price(n: float) -> str:
    if not n or n <= 0:
        return "Consultar precio"
    miles = f"{int(n):,}".replace(",", ".")
    return f"Gs. {miles}"

def title_case_es(s: str) -> str:
    """Smart title-case for Spanish: keep small words lowercase except first."""
    small = {"de","del","la","las","el","los","y","o","u","en","a","al","con","sin","por","para","un","una","unos","unas","que","se","su","sus"}
    words = s.lower().split()
    out = []
    for i, w in enumerate(words):
        if i > 0 and w in small:
            out.append(w)
        else:
            out.append(w[:1].upper() + w[1:])
    return " ".join(out)

def short_cover(title: str) -> str:
    """Two-line short label for the typographic cover."""
    words = title.split()
    if len(words) <= 2:
        return "\n".join(words)
    # Split roughly in half
    half = len(words) // 2
    return " ".join(words[:half]) + "\n" + " ".join(words[half:])

def http(method, path, data=None):
    body = json.dumps(data).encode("utf-8") if data is not None else None
    req = urllib.request.Request(URL + path, data=body, method=method, headers=HEADERS)
    try:
        with urllib.request.urlopen(req) as r:
            txt = r.read().decode("utf-8")
            return r.status, (json.loads(txt) if txt else None)
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode("utf-8", "replace")

def load_books():
    wb = xlrd.open_workbook(XLS)
    s = wb.sheet_by_index(0)
    out = []
    for r in range(1, s.nrows):
        rubro = str(s.cell_value(r, 1)).strip().upper()
        if rubro != "LIBROS":
            continue
        raw_title = str(s.cell_value(r, 2)).strip()
        if not raw_title:
            continue
        try:
            price_n = float(s.cell_value(r, 5) or 0)
        except Exception:
            price_n = 0
        try:
            stock_n = float(s.cell_value(r, 6) or 0)
        except Exception:
            stock_n = 0
        title = title_case_es(raw_title)
        cat = categorize(raw_title)
        status = "disponible" if stock_n > 0 else "consultar"
        out.append({
            "title": title,
            "author": "Autor a consultar",
            "category_id": cat,
            "description": "Más información disponible por WhatsApp. Stock y detalles del título sujetos a confirmación.",
            "price": fmt_price(price_n),
            "status": status,
            "cover_palette": PALETTES[len(out) % len(PALETTES)],
            "cover_short": short_cover(title),
            "featured": False,
            "is_active": True,
        })
    return out

def main():
    books = load_books()
    print(f"Parsed {len(books)} books from XLS")
    # Print category distribution
    from collections import Counter
    print("Categories:", Counter(b["category_id"] for b in books).most_common())
    print("Status:", Counter(b["status"] for b in books).most_common())

    if "--dry" in sys.argv:
        print("Dry run — first 3 entries:")
        for b in books[:3]:
            print(b)
        return

    # 1) Delete demo books (id 1..12)
    print("\nDeleting demo books id<=12 ...")
    code, resp = http("DELETE", "/rest/v1/pl_books?id=lte.12")
    print("  status:", code)

    # 2) Bulk insert in chunks of 100
    print("\nInserting books ...")
    CHUNK = 100
    inserted = 0
    for i in range(0, len(books), CHUNK):
        chunk = books[i:i+CHUNK]
        code, resp = http("POST", "/rest/v1/pl_books", chunk)
        if code >= 300:
            print(f"  chunk {i}: ERROR {code}: {resp}")
            sys.exit(1)
        inserted += len(chunk)
        print(f"  inserted {inserted}/{len(books)}")
    print("Done.")

if __name__ == "__main__":
    main()
