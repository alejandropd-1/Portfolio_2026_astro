/**
 * Fuente única de verdad para las categorías de filtro del portfolio.
 * Importado tanto por tina/config.ts (schema CMS) como por ClientHome.tsx (UI).
 * Para agregar/renombrar categorías: modificar solo este archivo.
 */
export const PROJECT_CATEGORIES = [
  { value: "ui-ux",   label: "UI/UX Eng"  },
  { value: "web-dev", label: "Web Dev"     },
  { value: "mobile",  label: "Mobile App"  },
  { value: "systems", label: "Systems"     },
] as const;

export type ProjectCategoryValue = typeof PROJECT_CATEGORIES[number]['value'];
