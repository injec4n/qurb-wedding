export type CoverCategory = 'luxury' | 'floral' | 'islamic' | 'minimal' | 'modern';

export interface CoverItem {
  id: string;
  name: string; // Arabic name
  category: CoverCategory;
  style: string; // CSS background property value
  patternSvg: string; // SVG pattern string that overlays the background
}

export const covers: CoverItem[] = [
  // ===== LUXURY (3) =====
  {
    id: 'luxury-gold-night',
    name: 'ليلة ذهبية',
    category: 'luxury',
    style: 'linear-gradient(135deg, #0D0D1A 0%, #1A1A2E 40%, #2D1F3D 70%, #0D0D1A 100%)',
    patternSvg: `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><defs><pattern id="p-lux1" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse"><path d="M40 0L80 40L40 80L0 40Z" fill="none" stroke="#D4A853" stroke-width="0.5" opacity="0.15"/><path d="M40 15L65 40L40 65L15 40Z" fill="none" stroke="#E8C874" stroke-width="0.3" opacity="0.1"/><circle cx="40" cy="40" r="4" fill="#D4A853" opacity="0.08"/></pattern></defs><rect width="100%" height="100%" fill="url(#p-lux1)"/></svg>`,
  },
  {
    id: 'luxury-royal-velvet',
    name: 'مخمل ملكي',
    category: 'luxury',
    style: 'linear-gradient(160deg, #1A0A2E 0%, #2D1540 30%, #3D1F50 60%, #1A0A2E 100%)',
    patternSvg: `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><defs><pattern id="p-lux2" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse"><rect x="25" y="25" width="10" height="10" transform="rotate(45 30 30)" fill="none" stroke="#D4A853" stroke-width="0.6" opacity="0.12"/><circle cx="30" cy="30" r="3" fill="#E8C874" opacity="0.06"/><line x1="0" y1="30" x2="20" y2="30" stroke="#D4A853" stroke-width="0.3" opacity="0.08"/><line x1="40" y1="30" x2="60" y2="30" stroke="#D4A853" stroke-width="0.3" opacity="0.08"/></pattern></defs><rect width="100%" height="100%" fill="url(#p-lux2)"/></svg>`,
  },
  {
    id: 'luxury-gold-damascus',
    name: 'دمشق ذهبي',
    category: 'luxury',
    style: 'radial-gradient(ellipse at 30% 20%, #2D2418 0%, #1A1408 50%, #0D0A04 100%)',
    patternSvg: `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><defs><pattern id="p-lux3" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse"><path d="M50 10 Q80 30 80 50 Q80 70 50 90 Q20 70 20 50 Q20 30 50 10Z" fill="none" stroke="#D4A853" stroke-width="0.4" opacity="0.12"/><path d="M50 25 Q65 35 65 50 Q65 65 50 75 Q35 65 35 50 Q35 35 50 25Z" fill="none" stroke="#E8C874" stroke-width="0.3" opacity="0.08"/><circle cx="50" cy="50" r="5" fill="none" stroke="#D4A853" stroke-width="0.3" opacity="0.1"/></pattern></defs><rect width="100%" height="100%" fill="url(#p-lux3)"/></svg>`,
  },

  // ===== FLORAL (3) =====
  {
    id: 'floral-rose-garden',
    name: 'حديقة الورود',
    category: 'floral',
    style: 'linear-gradient(135deg, #2D1F22 0%, #4A2530 40%, #3D2028 70%, #2D1F22 100%)',
    patternSvg: `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><defs><pattern id="p-fl1" x="0" y="0" width="90" height="90" patternUnits="userSpaceOnUse"><circle cx="45" cy="45" r="18" fill="none" stroke="#B76E79" stroke-width="0.4" opacity="0.12"/><circle cx="45" cy="45" r="8" fill="none" stroke="#D4A0A7" stroke-width="0.3" opacity="0.1"/><path d="M45 27 Q50 35 45 45 Q40 35 45 27Z" fill="none" stroke="#B76E79" stroke-width="0.3" opacity="0.1"/><path d="M45 63 Q50 55 45 45 Q40 55 45 63Z" fill="none" stroke="#B76E79" stroke-width="0.3" opacity="0.1"/><path d="M27 45 Q35 50 45 45 Q35 40 27 45Z" fill="none" stroke="#B76E79" stroke-width="0.3" opacity="0.1"/><path d="M63 45 Q55 50 45 45 Q55 40 63 45Z" fill="none" stroke="#B76E79" stroke-width="0.3" opacity="0.1"/><circle cx="20" cy="20" r="4" fill="none" stroke="#D4A0A7" stroke-width="0.2" opacity="0.08"/><circle cx="70" cy="70" r="4" fill="none" stroke="#D4A0A7" stroke-width="0.2" opacity="0.08"/></pattern></defs><rect width="100%" height="100%" fill="url(#p-fl1)"/></svg>`,
  },
  {
    id: 'floral-blush-bloom',
    name: 'تفتح وردي',
    category: 'floral',
    style: 'linear-gradient(180deg, #3D2530 0%, #5A3040 40%, #4A2838 70%, #3D2530 100%)',
    patternSvg: `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><defs><pattern id="p-fl2" x="0" y="0" width="70" height="70" patternUnits="userSpaceOnUse"><circle cx="35" cy="35" r="12" fill="none" stroke="#D4A0A7" stroke-width="0.5" opacity="0.1"/><circle cx="35" cy="35" r="6" fill="none" stroke="#B76E79" stroke-width="0.3" opacity="0.08"/><path d="M35 23 Q38 28 35 35 Q32 28 35 23Z" fill="#B76E79" opacity="0.05"/><path d="M35 47 Q38 42 35 35 Q32 42 35 47Z" fill="#B76E79" opacity="0.05"/><path d="M23 35 Q28 38 35 35 Q28 32 23 35Z" fill="#B76E79" opacity="0.05"/><path d="M47 35 Q42 38 35 35 Q42 32 47 35Z" fill="#B76E79" opacity="0.05"/></pattern></defs><rect width="100%" height="100%" fill="url(#p-fl2)"/></svg>`,
  },
  {
    id: 'floral-petals-dance',
    name: 'رقصة البتلات',
    category: 'floral',
    style: 'radial-gradient(ellipse at 50% 50%, #4A2838 0%, #2D1A22 60%, #1A1015 100%)',
    patternSvg: `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><defs><pattern id="p-fl3" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse"><ellipse cx="60" cy="40" rx="10" ry="15" fill="none" stroke="#D4A0A7" stroke-width="0.4" opacity="0.1" transform="rotate(-30 60 40)"/><ellipse cx="60" cy="80" rx="10" ry="15" fill="none" stroke="#D4A0A7" stroke-width="0.4" opacity="0.1" transform="rotate(30 60 80)"/><circle cx="30" cy="60" r="5" fill="none" stroke="#B76E79" stroke-width="0.3" opacity="0.08"/><circle cx="90" cy="60" r="5" fill="none" stroke="#B76E79" stroke-width="0.3" opacity="0.08"/></pattern></defs><rect width="100%" height="100%" fill="url(#p-fl3)"/></svg>`,
  },

  // ===== ISLAMIC (3) =====
  {
    id: 'islamic-emerald-faith',
    name: 'إيمان زمردي',
    category: 'islamic',
    style: 'linear-gradient(135deg, #0D3B0F 0%, #1B5E20 40%, #2E7D32 60%, #0D3B0F 100%)',
    patternSvg: `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><defs><pattern id="p-isl1" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse"><path d="M60 10 Q90 30 90 60 Q90 90 60 110 Q30 90 30 60 Q30 30 60 10Z" fill="none" stroke="#4CAF50" stroke-width="0.5" opacity="0.12"/><path d="M60 25 Q78 38 78 60 Q78 82 60 95 Q42 82 42 60 Q42 38 60 25Z" fill="none" stroke="#81C784" stroke-width="0.3" opacity="0.08"/><circle cx="60" cy="60" r="8" fill="none" stroke="#4CAF50" stroke-width="0.3" opacity="0.1"/><path d="M60 10 Q80 40 110 60" fill="none" stroke="#4CAF50" stroke-width="0.2" opacity="0.06"/><path d="M60 110 Q40 80 10 60" fill="none" stroke="#4CAF50" stroke-width="0.2" opacity="0.06"/><path d="M10 60 Q40 40 60 10" fill="none" stroke="#4CAF50" stroke-width="0.2" opacity="0.06"/><path d="M110 60 Q80 80 60 110" fill="none" stroke="#4CAF50" stroke-width="0.2" opacity="0.06"/></pattern></defs><rect width="100%" height="100%" fill="url(#p-isl1)"/></svg>`,
  },
  {
    id: 'islamic-crescent-night',
    name: 'ليلة الهلال',
    category: 'islamic',
    style: 'linear-gradient(160deg, #0A1A0D 0%, #153320 30%, #1B5E20 60%, #0A1A0D 100%)',
    patternSvg: `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><defs><pattern id="p-isl2" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse"><path d="M40 20 A20 20 0 1 1 40 80 A15 15 0 1 0 40 20Z" fill="none" stroke="#4CAF50" stroke-width="0.5" opacity="0.12"/><circle cx="52" cy="35" r="2" fill="#81C784" opacity="0.06"/><path d="M80 60 A15 15 0 1 1 80 90 A10 10 0 1 0 80 60Z" fill="none" stroke="#4CAF50" stroke-width="0.3" opacity="0.08"/></pattern></defs><rect width="100%" height="100%" fill="url(#p-isl2)"/></svg>`,
  },
  {
    id: 'islamic-mosque-dome',
    name: 'قبة المسجد',
    category: 'islamic',
    style: 'radial-gradient(ellipse at 50% 20%, #2E7D32 0%, #1B5E20 40%, #0D3B0F 80%)',
    patternSvg: `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><defs><pattern id="p-isl3" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse"><path d="M50 10 Q80 10 80 40 Q80 60 50 70 Q20 60 20 40 Q20 10 50 10Z" fill="none" stroke="#81C784" stroke-width="0.4" opacity="0.1"/><line x1="50" y1="70" x2="50" y2="90" stroke="#4CAF50" stroke-width="0.3" opacity="0.08"/><path d="M45 90 L55 90 L52 95 L48 95Z" fill="none" stroke="#4CAF50" stroke-width="0.3" opacity="0.08"/><path d="M30 95 L70 95" stroke="#4CAF50" stroke-width="0.3" opacity="0.06"/><path d="M25 98 L75 98" stroke="#4CAF50" stroke-width="0.2" opacity="0.04"/></pattern></defs><rect width="100%" height="100%" fill="url(#p-isl3)"/></svg>`,
  },

  // ===== MINIMAL (3) =====
  {
    id: 'minimal-silver-mist',
    name: 'ضباب فضي',
    category: 'minimal',
    style: 'linear-gradient(135deg, #1A1A1A 0%, #2A2A2A 50%, #1A1A1A 100%)',
    patternSvg: `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><defs><pattern id="p-min1" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse"><line x1="0" y1="20" x2="40" y2="20" stroke="#555555" stroke-width="0.3" opacity="0.08"/><line x1="20" y1="0" x2="20" y2="40" stroke="#555555" stroke-width="0.3" opacity="0.05"/></pattern></defs><rect width="100%" height="100%" fill="url(#p-min1)"/></svg>`,
  },
  {
    id: 'minimal-soft-pearl',
    name: 'لؤلؤة ناعمة',
    category: 'minimal',
    style: 'linear-gradient(180deg, #F5F0EB 0%, #FFFFFF 50%, #F5F0EB 100%)',
    patternSvg: `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><defs><pattern id="p-min2" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse"><line x1="0" y1="30" x2="60" y2="30" stroke="#8B7355" stroke-width="0.2" opacity="0.06"/><circle cx="30" cy="30" r="1" fill="#8B7355" opacity="0.04"/></pattern></defs><rect width="100%" height="100%" fill="url(#p-min2)"/></svg>`,
  },
  {
    id: 'minimal-charcoal',
    name: 'فحم هادئ',
    category: 'minimal',
    style: 'linear-gradient(145deg, #222222 0%, #333333 40%, #2A2A2A 70%, #222222 100%)',
    patternSvg: `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><defs><pattern id="p-min3" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse"><line x1="0" y1="50" x2="50" y2="0" stroke="#444444" stroke-width="0.2" opacity="0.06"/></pattern></defs><rect width="100%" height="100%" fill="url(#p-min3)"/></svg>`,
  },

  // ===== MODERN (3) =====
  {
    id: 'modern-midnight-geometric',
    name: 'منتصف الليل الهندسي',
    category: 'modern',
    style: 'linear-gradient(135deg, #0A0A0A 0%, #1A1A2E 30%, #16213E 60%, #0A0A0A 100%)',
    patternSvg: `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><defs><pattern id="p-mod1" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse"><path d="M0 0 L30 0 L30 30 L0 30Z" fill="none" stroke="#C0C0C0" stroke-width="0.3" opacity="0.08"/><path d="M30 30 L60 30 L60 60 L30 60Z" fill="none" stroke="#C0C0C0" stroke-width="0.3" opacity="0.06"/><line x1="0" y1="0" x2="30" y2="30" stroke="#C0C0C0" stroke-width="0.2" opacity="0.05"/><line x1="30" y1="30" x2="60" y2="60" stroke="#C0C0C0" stroke-width="0.2" opacity="0.05"/></pattern></defs><rect width="100%" height="100%" fill="url(#p-mod1)"/></svg>`,
  },
  {
    id: 'modern-silver-steel',
    name: 'فضة صلب',
    category: 'modern',
    style: 'linear-gradient(180deg, #1A1A1A 0%, #2D2D2D 30%, #383838 50%, #2D2D2D 70%, #1A1A1A 100%)',
    patternSvg: `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><defs><pattern id="p-mod2" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse"><rect x="0" y="0" width="40" height="40" fill="none" stroke="#C0C0C0" stroke-width="0.3" opacity="0.06"/><rect x="40" y="40" width="40" height="40" fill="none" stroke="#C0C0C0" stroke-width="0.3" opacity="0.04"/><circle cx="40" cy="40" r="3" fill="none" stroke="#FFFFFF" stroke-width="0.2" opacity="0.06"/></pattern></defs><rect width="100%" height="100%" fill="url(#p-mod2)"/></svg>`,
  },
  {
    id: 'modern-neon-luxe',
    name: 'نيون فاخر',
    category: 'modern',
    style: 'linear-gradient(135deg, #0D0D1A 0%, #1A1A2E 40%, #0F2027 70%, #0D0D1A 100%)',
    patternSvg: `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><defs><pattern id="p-mod3" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse"><path d="M0 50 L50 0" stroke="#C0C0C0" stroke-width="0.3" opacity="0.06"/><path d="M50 0 L100 50" stroke="#C0C0C0" stroke-width="0.3" opacity="0.06"/><path d="M0 50 L50 100" stroke="#C0C0C0" stroke-width="0.3" opacity="0.06"/><path d="M50 100 L100 50" stroke="#C0C0C0" stroke-width="0.3" opacity="0.06"/><circle cx="50" cy="50" r="8" fill="none" stroke="#FFFFFF" stroke-width="0.4" opacity="0.06"/><circle cx="50" cy="50" r="3" fill="none" stroke="#C0C0C0" stroke-width="0.2" opacity="0.04"/></pattern></defs><rect width="100%" height="100%" fill="url(#p-mod3)"/></svg>`,
  },
];

export function getCoversByCategory(category: CoverCategory): CoverItem[] {
  return covers.filter((c) => c.category === category);
}

export const coverCategoryLabels: Record<CoverCategory, string> = {
  luxury: 'فاخر',
  floral: 'زهور',
  islamic: 'إسلامي',
  minimal: 'بسيط',
  modern: 'عصري',
};
