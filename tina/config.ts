import { defineConfig } from "tinacms";
import { PortfolioDashboard } from "./dashboard/PortfolioDashboard";
import { PROJECT_CATEGORIES } from "../src/lib/categories";

const branch =
  process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  "main";


export default defineConfig({
  branch,
  clientId: process.env.TINA_CLIENT_ID,
  token: process.env.TINA_TOKEN,

  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },
  media: {
    tina: {
      mediaRoot: "assets",
      publicFolder: "public",
    },
  },
  schema: {
    collections: [
      // ─── PROJECTS ──────────────────────────────────────────────────────────
      {
        name: "projects",
        label: "Projects",
        path: "src/content/projects",
        format: "mdx",
        ui: {
          router: ({ document }: { document: any }) => {
            const path = document._sys.relativePath.replace('.mdx', '');
            return `/projects/${path}`;
          },
        },
        fields: [
          {
            type: "string",
            name: "_template",
            label: "Template ID",
            ui: {
              component: "hidden",
            },
          },
          {
            type: "string",
            name: "title",
            label: "Title",
            isTitle: true,
            required: true,
          },
          {
            type: "string",
            name: "year",
            label: "Year",
          },
          {
            type: "datetime",
            name: "date",
            label: "Date",
          },
          {
            type: "string",
            name: "type",
            label: "Type",
          },
          {
            type: "string",
            name: "description",
            label: "Description",
          },
          {
            type: "string",
            name: "stack",
            label: "Tech Stack",
            list: true,
          },
          {
            type: "string",
            name: "role",
            label: "Role",
          },
          {
            type: "string",
            name: "client",
            label: "Client / Company",
          },
          {
            type: "number",
            name: "order",
            label: "Order",
          },
          {
            type: "image",
            name: "image",
            label: "Cover Image",
          },
          {
            type: "boolean",
            name: "showInResume",
            label: "Show in Resume",
          },
          {
            type: "boolean",
            name: "showInPortfolio",
            label: "Show in Portfolio",
          },
          {
            type: "string",
            name: "points",
            label: "Experience Points (Resume)",
            list: true,
          },
          {
            type: "string",
            name: "categories",
            label: "Categorías de filtro",
            description: "Seleccioná a qué categorías pertenece este proyecto (para los filtros del portfolio)",
            list: true,
            options: PROJECT_CATEGORIES.map(c => ({ value: c.value, label: c.label })),
          },
          {
            type: "string",
            name: "timeline",
            label: "Timeline",
            description: "Ej: 12 Weeks, 6 Months, 2020 - 2022",
          },
          {
            type: "string",
            name: "codeSnippet",
            label: "Code Blueprint",
            description: "Fragmento de código representativo del proyecto",
            ui: { component: "textarea" },
          },
          {
            type: "rich-text",
            name: "body",
            label: "Body",
            isBody: true,
          },
        ],
      },

      // ─── PAGES ─────────────────────────────────────────────────────────────
      {
        name: "pages",
        label: "Pages",
        path: "src/content/pages",
        format: "mdx",
        ui: {
          router: ({ document }: { document: any }) => {
            const name = document._sys.filename;
            if (name === 'home') return '/';
            if (name === 'about') return '/about';
            if (name === 'archive') return '/archive';
            if (name === 'resume') return '/resume';
            return undefined;
          },
        },
        templates: [
          // ── Home page ────────────────────────────────────────────────────
          {
            name: "home",
            label: "Home Page",
            match: { filename: "home" },
            fields: [
              {
                type: "string",
                name: "title",
                label: "Hero Title",
                description: "Use // to split the accent color (e.g. Compiled // Visions.)",
                isTitle: true,
                required: true,
              },
              {
                type: "string",
                name: "mission",
                label: "Mission / Headline",
              },
              {
                type: "string",
                name: "status",
                label: "Sidebar Status",
              },
              {
                type: "string",
                name: "location",
                label: "Sidebar Location",
              },
              {
                type: "string",
                name: "timezone",
                label: "Sidebar Timezone",
              },
            ],
          },
          // ── About page ───────────────────────────────────────────────────
          {
            name: "about",
            label: "About Page",
            match: { filename: "about" },
            fields: [
              {
                type: "string",
                name: "title",
                label: "Page Title",
                isTitle: true,
                required: true,
              },
              {
                type: "string",
                name: "mission",
                label: "Mission / Tagline",
              },
              {
                type: "rich-text",
                name: "body",
                label: "Bio Text",
                isBody: true,
              },
              {
                type: "object",
                name: "philosophies",
                label: "Core Philosophy Cards",
                list: true,
                ui: {
                  itemProps: (item: any) => ({ label: item?.title || "Philosophy" }),
                },
                fields: [
                  {
                    type: "string",
                    name: "icon",
                    label: "Icon",
                    options: ["beaker", "settings", "monitor"],
                  },
                  {
                    type: "string",
                    name: "accent",
                    label: "Accent Color",
                    options: ["primary", "secondary", "tertiary"],
                  },
                  {
                    type: "string",
                    name: "title",
                    label: "Title",
                    required: true,
                  },
                  {
                    type: "string",
                    name: "description",
                    label: "Description",
                    ui: { component: "textarea" },
                  },
                ],
              },
            ],
          },

          // ── Archive page ─────────────────────────────────────────────────
          {
            name: "archive",
            label: "Archive Page",
            match: { filename: "archive" },
            fields: [
              {
                type: "string",
                name: "title",
                label: "Page Title",
                isTitle: true,
                required: true,
              },
              {
                type: "string",
                name: "subtitle",
                label: "Subtitle / Description",
              },
              {
                type: "rich-text",
                name: "body",
                label: "Body",
                isBody: true,
              },
            ],
          },

          // ── Resume page ──────────────────────────────────────────────────
          {
            name: "resume",
            label: "Resume Page",
            match: { filename: "resume" },
            fields: [
              {
                type: "string",
                name: "title",
                label: "Job Title / Headline",
                isTitle: true,
                required: true,
              },
              {
                type: "string",
                name: "location",
                label: "Location",
              },
              {
                type: "string",
                name: "email",
                label: "Email",
              },
              {
                type: "string",
                name: "status",
                label: "Availability Status",
              },
              // ── Skills ──────────────────────────────────────────────────
              {
                type: "object",
                name: "skillGroups",
                label: "Skill Groups (Section 02)",
                list: true,
                ui: {
                  itemProps: (item: any) => ({ label: item?.category || "Skill Group" }),
                },
                fields: [
                  {
                    type: "string",
                    name: "category",
                    label: "Category Name",
                    required: true,
                  },
                  {
                    type: "object",
                    name: "items",
                    label: "Skills",
                    list: true,
                    ui: {
                      itemProps: (item: any) => ({ label: item?.name || "Skill" }),
                    },
                    fields: [
                      {
                        type: "string",
                        name: "name",
                        label: "Skill Name",
                        required: true,
                      },
                      {
                        type: "string",
                        name: "value",
                        label: "Proficiency (e.g. 95% or Yes)",
                        required: true,
                      },
                    ],
                  },
                ],
              },
              // ── Education ────────────────────────────────────────────────
              {
                type: "object",
                name: "education",
                label: "Education (Section 03)",
                list: true,
                ui: {
                  itemProps: (item: any) => ({ label: item?.degree || "Education Entry" }),
                },
                fields: [
                  {
                    type: "string",
                    name: "degree",
                    label: "Degree / Program",
                  },
                  {
                    type: "string",
                    name: "institution",
                    label: "Institution",
                  },
                  {
                    type: "string",
                    name: "year",
                    label: "Year / Class of",
                  },
                ],
              },
              // ── Body ─────────────────────────────────────────────────────
              {
                type: "rich-text",
                name: "body",
                label: "Short Bio / Intro",
                isBody: true,
              },
            ],
          },
        ],
      },

      // ─── GLOBAL ────────────────────────────────────────────────────────────
      {
        name: "global",
        label: "Global Settings",
        path: "src/content/global",
        format: "mdx",
        fields: [
          {
            type: "string",
            name: "copyright",
            label: "Copyright Text",
          },
          {
            type: "object",
            name: "links",
            label: "Footer Links",
            list: true,
            ui: {
              itemProps: (item: any) => ({ label: item?.name || "Link" }),
            },
            fields: [
              {
                type: "string",
                name: "name",
                label: "Text",
                required: true,
              },
              {
                type: "string",
                name: "url",
                label: "URL",
                required: true,
              },
              {
                type: "string",
                name: "icon",
                label: "Lucide Icon",
                options: [
                  "github", "linkedin", "instagram", "twitter",
                  "facebook", "youtube", "tiktok", "behance",
                  "dribbble", "whatsapp", "telegram", "discord",
                  "bluesky", "pinterest",
                ],
              },
            ],
          },
        ],
      },
    ],
  },

  // ── Screen Plugin: Portfolio Dashboard ─────────────────────────────────────
  cmsCallback: (cms) => {
    cms.plugins.add({
      __type: "screen",
      name: "Portfolio Overview",
      Icon: () => "📊",
      layout: "fullscreen",
      Component: PortfolioDashboard,
    });
    return cms;
  },
});

