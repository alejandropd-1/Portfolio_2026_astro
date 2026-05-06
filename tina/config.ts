import { defineConfig } from "tinacms";

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
      mediaRoot: "src/assets",
      publicFolder: "",
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
        templates: [
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
    ],
  },
});
