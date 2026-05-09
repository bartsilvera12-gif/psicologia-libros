// Thin-line iconography (1.4 stroke), no fills — editorial feel
const Icon = ({ d, size = 22, stroke = 'currentColor', strokeWidth = 1.4, children, ...rest }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
       stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
       {...rest}>
    {d ? <path d={d} /> : children}
  </svg>
);

const IconWhatsapp = ({ size = 18, stroke = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke}
       strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 21l1.7-5.1A8.5 8.5 0 1 1 8 19.4L3 21z"/>
    <path d="M8.5 9.5c.4 1.6 1.5 3.1 3 4.2 1.2.9 2.4 1.4 3.5 1.5.6 0 1.1-.3 1.4-.8.2-.4.2-.8 0-1.1l-1.3-.7c-.3-.2-.7-.1-.9.1l-.5.5c-.7-.4-1.4-.9-1.9-1.5-.5-.5-.9-1.1-1.2-1.7l.5-.5c.2-.2.3-.6.1-.9l-.7-1.3c-.2-.3-.7-.4-1-.3-.5.2-.9.6-1 1.1z"/>
  </svg>
);

const IconSearch = ({ size = 18 }) => (
  <Icon size={size}>
    <circle cx="11" cy="11" r="6.5"/>
    <path d="m20 20-3.6-3.6"/>
  </Icon>
);

const IconArrow = ({ size = 16 }) => (
  <Icon size={size}>
    <path d="M5 12h14"/>
    <path d="m13 6 6 6-6 6"/>
  </Icon>
);

const IconMenu = ({ size = 22 }) => (
  <Icon size={size}>
    <path d="M4 7h16"/><path d="M4 12h16"/><path d="M4 17h16"/>
  </Icon>
);

const IconClose = ({ size = 22 }) => (
  <Icon size={size}>
    <path d="M6 6l12 12"/><path d="M18 6l-12 12"/>
  </Icon>
);

const IconChevron = ({ size = 18 }) => (
  <Icon size={size}>
    <path d="m6 9 6 6 6-6"/>
  </Icon>
);

const IconInstagram = ({ size = 18 }) => (
  <Icon size={size}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="4.5"/>
    <circle cx="12" cy="12" r="3.8"/>
    <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" stroke="none"/>
  </Icon>
);

const IconFacebook = ({ size = 18 }) => (
  <Icon size={size}>
    <path d="M14 8h2.5V5H14c-1.7 0-3 1.3-3 3v2H9v3h2v8h3v-8h2.3l.7-3H14V8.5c0-.3.2-.5.5-.5z"/>
  </Icon>
);

const IconMail = ({ size = 18 }) => (
  <Icon size={size}>
    <rect x="3" y="5" width="18" height="14" rx="2"/>
    <path d="m4 7 8 6 8-6"/>
  </Icon>
);

const IconPin = ({ size = 18 }) => (
  <Icon size={size}>
    <path d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12z"/>
    <circle cx="12" cy="9" r="2.5"/>
  </Icon>
);

// Category icons — thin line, distinct shapes
const IconBrain = ({ size = 28 }) => (
  <Icon size={size}>
    <path d="M9 5a3 3 0 0 0-3 3v.5A2.5 2.5 0 0 0 4 11a2.5 2.5 0 0 0 1.5 2.3A2.5 2.5 0 0 0 7 16a3 3 0 0 0 5 1.5"/>
    <path d="M15 5a3 3 0 0 1 3 3v.5A2.5 2.5 0 0 1 20 11a2.5 2.5 0 0 1-1.5 2.3A2.5 2.5 0 0 1 17 16a3 3 0 0 1-5 1.5"/>
    <path d="M12 6v13"/>
  </Icon>
);

const IconHeartLeaf = ({ size = 28 }) => (
  <Icon size={size}>
    <path d="M12 19s-6-3.6-7.5-7.4C3.4 8.7 5.5 6 8.2 6c1.6 0 2.9.9 3.8 2.2C12.9 6.9 14.2 6 15.8 6c2.7 0 4.8 2.7 3.7 5.6C18 15.4 12 19 12 19z"/>
    <path d="M12 14c0-1.5.5-3 1.5-4"/>
  </Icon>
);

const IconWaves = ({ size = 28 }) => (
  <Icon size={size}>
    <path d="M3 9c2 0 2 2 4 2s2-2 4-2 2 2 4 2 2-2 4-2"/>
    <path d="M3 14c2 0 2 2 4 2s2-2 4-2 2 2 4 2 2-2 4-2"/>
  </Icon>
);

const IconCloud = ({ size = 28 }) => (
  <Icon size={size}>
    <path d="M7 17h10a4 4 0 0 0 .5-7.95A5.5 5.5 0 0 0 7 10.5 4 4 0 0 0 7 17z"/>
    <path d="M10 14v3"/>
  </Icon>
);

const IconNeurons = ({ size = 28 }) => (
  <Icon size={size}>
    <circle cx="6" cy="6" r="2"/>
    <circle cx="18" cy="6" r="2"/>
    <circle cx="12" cy="13" r="2.5"/>
    <circle cx="6" cy="19" r="2"/>
    <circle cx="18" cy="19" r="2"/>
    <path d="M7.5 7.3 10 11.5M16.5 7.3 14 11.5M10 14.7 7.5 18M14 14.7l2.5 3.3"/>
  </Icon>
);

const IconChat = ({ size = 28 }) => (
  <Icon size={size}>
    <path d="M4 6h13a3 3 0 0 1 3 3v5a3 3 0 0 1-3 3h-3l-4 3v-3H4a3 3 0 0 1-3-3V9a3 3 0 0 1 3-3z"/>
    <path d="M8 11h6M8 13h4"/>
  </Icon>
);

const IconSeed = ({ size = 28 }) => (
  <Icon size={size}>
    <path d="M12 21V11"/>
    <path d="M12 11c-3 0-6-2-6-6 4 0 6 2 6 6z"/>
    <path d="M12 13c3 0 6-2 6-6-4 0-6 2-6 6z"/>
  </Icon>
);

const IconChild = ({ size = 28 }) => (
  <Icon size={size}>
    <circle cx="12" cy="6.5" r="2.5"/>
    <path d="M7 21v-5a5 5 0 0 1 10 0v5"/>
    <path d="M9 14h6"/>
  </Icon>
);

const IconStethoscope = ({ size = 28 }) => (
  <Icon size={size}>
    <path d="M6 4v6a4 4 0 0 0 8 0V4"/>
    <path d="M10 14v2a4 4 0 0 0 8 0v-1"/>
    <circle cx="18" cy="13" r="2"/>
  </Icon>
);

const IconHourglass = ({ size = 28 }) => (
  <Icon size={size}>
    <path d="M7 4h10M7 20h10"/>
    <path d="M7 4c0 4 5 5 5 8s-5 4-5 8"/>
    <path d="M17 4c0 4-5 5-5 8s5 4 5 8"/>
  </Icon>
);

const IconLink = ({ size = 28 }) => (
  <Icon size={size}>
    <path d="M9 12a4 4 0 0 1 4-4h2a4 4 0 0 1 0 8h-1"/>
    <path d="M15 12a4 4 0 0 1-4 4H9a4 4 0 0 1 0-8h1"/>
  </Icon>
);

const IconLeaf = ({ size = 28 }) => (
  <Icon size={size}>
    <path d="M5 19c0-8 6-14 14-14 0 8-6 14-14 14z"/>
    <path d="M5 19 12 12"/>
  </Icon>
);

// Benefit / utility icons
const IconBook = ({ size = 28 }) => (
  <Icon size={size}>
    <path d="M5 4h10a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3V4z"/>
    <path d="M5 17a3 3 0 0 1 3-3h10"/>
    <path d="M9 8h6M9 11h4"/>
  </Icon>
);

const IconHeadset = ({ size = 28 }) => (
  <Icon size={size}>
    <path d="M4 14v-2a8 8 0 0 1 16 0v2"/>
    <rect x="3" y="13" width="4" height="6" rx="1.5"/>
    <rect x="17" y="13" width="4" height="6" rx="1.5"/>
    <path d="M20 19c0 1.5-1.5 2.5-4 2.5"/>
  </Icon>
);

const IconBolt = ({ size = 28 }) => (
  <Icon size={size}>
    <path d="m13 3-7 11h5l-1 7 7-11h-5l1-7z"/>
  </Icon>
);

const IconCart = ({ size = 22 }) => (
  <Icon size={size}>
    <circle cx="9" cy="21" r="1.2"/>
    <circle cx="19" cy="21" r="1.2"/>
    <path d="M2 4h3l1.6 10.39A2 2 0 0 0 8.59 16h10.81a2 2 0 0 0 1.98-1.65L22 7H6"/>
  </Icon>
);

Object.assign(window, {
  Icon,
  IconWhatsapp, IconSearch, IconArrow, IconMenu, IconClose, IconChevron,
  IconInstagram, IconFacebook, IconMail, IconPin,
  IconBrain, IconHeartLeaf, IconWaves, IconCloud, IconNeurons, IconChat,
  IconSeed, IconChild, IconStethoscope, IconHourglass, IconLink, IconLeaf,
  IconBook, IconHeadset, IconBolt, IconCart
});
