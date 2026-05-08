// === Datos locales — fallback si Supabase no responde ===
// Los datos reales vienen de pl_books / pl_categories / pl_faqs en Supabase.

// === Configurable contact ===
const WHATSAPP_NUMBER = "595981234567"; // configurable
const WA_BASE = `https://wa.me/${WHATSAPP_NUMBER}`;
const waLink = (msg) => `${WA_BASE}?text=${encodeURIComponent(msg)}`;

const CONTACT = {
  whatsapp: WHATSAPP_NUMBER,
  email: "contacto@psicologialibros.com",
  instagram: "https://instagram.com/psicologialibrosyuncafe",
  facebook: "https://facebook.com/PsicologiaLibrosYUnCafe",
  city: "Asunción, Paraguay",
};

// === Categories ===
const CATEGORIES = [
  { id: "clinica",     name: "Psicología clínica",      desc: "Bases teóricas y prácticas para la evaluación e intervención.", Icon: window.IconBrain },
  { id: "salud",       name: "Salud mental",            desc: "Lecturas para comprender el bienestar y la atención profesional.", Icon: window.IconHeartLeaf },
  { id: "ansiedad",    name: "Trastornos de ansiedad",  desc: "Marcos para abordar la ansiedad desde la evidencia.", Icon: window.IconWaves },
  { id: "depresion",   name: "Depresión",               desc: "Material académico y clínico sobre estados depresivos.", Icon: window.IconCloud },
  { id: "neuro",       name: "Neuropsicología",         desc: "Cerebro, cognición y conducta en obras de referencia.", Icon: window.IconNeurons },
  { id: "psicoterapia",name: "Psicoterapia",            desc: "Enfoques y modelos de intervención contemporáneos.", Icon: window.IconChat },
  { id: "desarrollo",  name: "Desarrollo personal",     desc: "Lecturas formativas para el crecimiento humano.", Icon: window.IconSeed },
  { id: "infantil",    name: "Psicología infantil",     desc: "Desarrollo, vínculo y aprendizaje en la infancia.", Icon: window.IconChild },
  { id: "psiquiatria", name: "Psiquiatría",             desc: "Manuales y obras de referencia clínica.", Icon: window.IconStethoscope },
  { id: "trauma",      name: "Trauma y duelo",          desc: "Procesos de elaboración, pérdida y resiliencia.", Icon: window.IconHourglass },
  { id: "vinculos",    name: "Relaciones y vínculos",   desc: "Apego, pareja y dinámicas familiares.", Icon: window.IconLink },
  { id: "mindfulness", name: "Mindfulness y bienestar", desc: "Atención plena, regulación emocional y prácticas.", Icon: window.IconLeaf },
];

const catName = (id) => (CATEGORIES.find(c => c.id === id) || {}).name || id;

// === Books — 12 entries, mix of featured ===
// covers use a typographic placeholder palette ('coal' | 'red' | 'blue' | 'ivory' | 'green' | 'plum')
const BOOKS = [
  {
    id: 1,
    title: "Introducción a la Psicología Clínica",
    author: "M. Aldana Vera",
    category: "clinica",
    description: "Recorrido por los fundamentos teóricos, métodos de evaluación y principios de intervención en la práctica clínica contemporánea.",
    price: "Gs. 215.000",
    status: "disponible",
    cover: { palette: "coal", short: "Psicología\nClínica" },
    featured: true,
  },
  {
    id: 2,
    title: "Fundamentos de Salud Mental",
    author: "C. Riveros · L. Acosta",
    category: "salud",
    description: "Una mirada integrada sobre la salud mental, sus determinantes y los modelos de atención centrados en la persona.",
    price: "Gs. 198.000",
    status: "disponible",
    cover: { palette: "ivory", short: "Salud\nMental" },
    featured: true,
  },
  {
    id: 3,
    title: "Ansiedad: Comprensión y Abordaje",
    author: "D. Estigarribia",
    category: "ansiedad",
    description: "Explora los procesos cognitivos y emocionales asociados a los cuadros de ansiedad y su tratamiento basado en evidencia.",
    price: "Gs. 175.000",
    status: "disponible",
    cover: { palette: "blue", short: "Ansiedad" },
    featured: false,
  },
  {
    id: 4,
    title: "Neuropsicología Aplicada",
    author: "R. Benítez Galeano",
    category: "neuro",
    description: "Bases neuropsicológicas, evaluación funcional y rehabilitación cognitiva en distintas etapas del ciclo vital.",
    price: "Gs. 285.000",
    status: "disponible",
    cover: { palette: "coal", short: "Neuro-\npsicología" },
    featured: true,
  },
  {
    id: 5,
    title: "Psicoterapia Contemporánea",
    author: "S. Vázquez Núñez",
    category: "psicoterapia",
    description: "Una panorámica de los principales enfoques psicoterapéuticos actuales, con especial atención a la integración clínica.",
    price: "Consultar precio",
    status: "consultar",
    cover: { palette: "red", short: "Psicoterapia" },
    featured: true,
  },
  {
    id: 6,
    title: "Trauma, Duelo y Resiliencia",
    author: "P. Almada Ferreira",
    category: "trauma",
    description: "Procesos de elaboración del trauma, acompañamiento del duelo y desarrollo de recursos para la resiliencia.",
    price: "Gs. 230.000",
    status: "disponible",
    cover: { palette: "plum", short: "Trauma\n& Duelo" },
    featured: true,
  },
  {
    id: 7,
    title: "Psicología Infantil y Desarrollo",
    author: "G. Ortiz Mendoza",
    category: "infantil",
    description: "Hitos del desarrollo, dinámicas vinculares y herramientas de observación para el trabajo con la infancia.",
    price: "Gs. 205.000",
    status: "disponible",
    cover: { palette: "ivory", short: "Infancia\n& Desarrollo" },
    featured: false,
  },
  {
    id: 8,
    title: "Mindfulness y Bienestar Emocional",
    author: "L. Cardozo",
    category: "mindfulness",
    description: "Atención plena, regulación emocional y prácticas contemplativas con base científica para el bienestar cotidiano.",
    price: "Gs. 165.000",
    status: "disponible",
    cover: { palette: "green", short: "Mindfulness" },
    featured: true,
  },
  {
    id: 9,
    title: "Manual de Psiquiatría Clínica",
    author: "F. Mereles Duarte",
    category: "psiquiatria",
    description: "Obra de referencia para el estudio de los principales cuadros psiquiátricos y sus criterios diagnósticos.",
    price: "Gs. 340.000",
    status: "consultar",
    cover: { palette: "coal", short: "Psiquiatría" },
    featured: false,
  },
  {
    id: 10,
    title: "Depresión: Lecturas Clínicas",
    author: "N. Sosa Villalba",
    category: "depresion",
    description: "Aproximaciones contemporáneas al estudio y abordaje de los trastornos del estado de ánimo.",
    price: "Gs. 195.000",
    status: "disponible",
    cover: { palette: "blue", short: "Depresión" },
    featured: false,
  },
  {
    id: 11,
    title: "Vínculos, Apego y Pareja",
    author: "I. Romero Cáceres",
    category: "vinculos",
    description: "Teoría del apego aplicada a la comprensión de los vínculos adultos y la dinámica de pareja.",
    price: "Gs. 220.000",
    status: "disponible",
    cover: { palette: "red", short: "Vínculos" },
    featured: false,
  },
  {
    id: 12,
    title: "Desarrollo Humano: Una Mirada Integrada",
    author: "T. Aguilera",
    category: "desarrollo",
    description: "Lecturas formativas sobre el crecimiento personal, el sentido y los procesos del desarrollo a lo largo de la vida.",
    price: "Gs. 180.000",
    status: "disponible",
    cover: { palette: "green", short: "Desarrollo\nHumano" },
    featured: false,
  },
];

// === Benefits ===
const BENEFITS = [
  { Icon: window.IconBook,   title: "Catálogo especializado", desc: "Libros seleccionados sobre psicología, salud mental y desarrollo humano." },
  { Icon: window.IconHeadset,title: "Atención personalizada", desc: "Te ayudamos a encontrar el libro adecuado según tu interés, formación o necesidad." },
  { Icon: window.IconSeed,   title: "Lecturas para formación", desc: "Material ideal para estudiantes, profesionales y lectores comprometidos con el aprendizaje." },
  { Icon: window.IconBolt,   title: "Consulta rápida",         desc: "Podés consultar disponibilidad y precios directamente por WhatsApp." },
];

// === FAQ ===
const FAQS = [
  { q: "¿Cómo puedo consultar por un libro?",
    a: "Podés hacerlo desde el botón de WhatsApp en cada libro o desde la sección de contacto." },
  { q: "¿Los libros están disponibles para entrega inmediata?",
    a: "La disponibilidad puede variar según el título. Cada consulta será confirmada por WhatsApp." },
  { q: "¿Puedo pedir un libro específico que no aparece en el catálogo?",
    a: "Sí, podés escribirnos indicando el título o autor que estás buscando y haremos lo posible por gestionarlo." },
  { q: "¿Tienen libros para estudiantes de psicología?",
    a: "Sí, contamos con materiales útiles para estudiantes, profesionales y personas interesadas en salud mental." },
  { q: "¿Realizan envíos?",
    a: "Esta opción puede configurarse según la forma de trabajo de la librería. Consultanos por WhatsApp para confirmar disponibilidad." },
  { q: "¿Los precios están actualizados?",
    a: "Los precios pueden estar visibles o consultarse directamente por WhatsApp, según disponibilidad." },
];

// === Nav links ===
const NAV = [
  { id: "inicio",   label: "Inicio" },
  { id: "nosotros", label: "Nosotros" },
  { id: "faq",      label: "FAQ" },
  { id: "contacto", label: "Contacto" },
];

Object.assign(window, {
  WHATSAPP_NUMBER, waLink, CONTACT,
  CATEGORIES, catName, BOOKS, BENEFITS, FAQS, NAV,
});
