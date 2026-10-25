# Persian Form Panel

Next.js App Router, React, TypeScript, FormEngine, React Hook Form, Zod, shadcn-style local UI primitives, and Tailwind CSS 4. The panel is Persian-first and RTL. Its app UI and registered form controls use local React components styled with Tailwind utilities and shared CSS variables.

## Start

Requires Node.js 22+ and pnpm 11.25.0.

```sh
corepack enable
pnpm install --frozen-lockfile
pnpm dev
```

Open `http://localhost:3000`. `/` is Home, `/forms` is Forms, and `/forms/new` contains form metadata and the embedded designer. Set `NEXT_PUBLIC_FORMENGINE_LICENSE_KEY` in `.env.local` for a licensed FormEngine deployment.

## UI and theme

- `src/components/ui.tsx` contains the local shadcn-style Button, Input, Textarea, Label, Card, Alert, and Separator primitives; `src/components/autocomplete.tsx` provides the shared searchable dropdown.
- Tailwind CSS 4 is configured through `postcss.config.mjs`; `src/app/globals.css` defines the light and dark glass themes, Vazirmatn typography, RTL defaults, and the Tailwind import.
- The theme toggle applies the selected light or dark glass palette to the panel and embedded designer, including editor panels and portaled menus and dialogs.
- The built-in responsive `FormGrid` takes mobile, tablet, and desktop column counts. `GridItem` and field span properties configure each child span. The same components follow the designer device mode and the preview viewport.
- FormEngine's vendor designer editing chrome is supplied by `@react-form-builder/designer`, which includes its own RSuite-based editor UI. That vendor chrome cannot be restyled into shadcn component implementations through this project's component registry. The app pages and registered form controls use the local Tailwind components.

## Form component palette

The designer and viewer share one registry in `src/features/forms/engine/registry.ts`. Standard form controls are local Tailwind renderers:

| Stored type                                                                                            | Use                                 |
| ------------------------------------------------------------------------------------------------------ | ----------------------------------- |
| `ShadcnInput`, `ShadcnTextarea`, `ShadcnDatePicker`, `ShadcnCalendar`                                  | Text, multiline, and date inputs    |
| `ShadcnSelect`, `ShadcnCombobox`, `ShadcnCheckbox`, `ShadcnRadioGroup`, `ShadcnSwitch`, `ShadcnSlider` | Choice controls                     |
| `ShadcnButton`, `ShadcnCard`, `ShadcnDialog`, `ShadcnSeparator`                                        | Actions, centered modal, and layout |
| `ShadcnLabel`, `ShadcnBadge`, `ShadcnAlert`, `ShadcnProgress`, `ShadcnTooltip`                         | Display and feedback                |
| `PersianText`, `IranMobile`, `NationalId`, `PersianAmount`, `Consent`                                  | Persian controls and validation     |
| `SectionTitle`, `FormGrid`, `GridItem`, `FormSection`, `SubmitButton`                                  | Form layout and actions             |
| `RichTextEditor`, `RsSignature`, `FastQR`, `GoogleMap`, print controls                                 | Specialized FormEngine add-ons      |

Choice component options use FormEngine's editable string-array property, so designers can add and remove each option as a list item. Select and combobox controls filter options as the user types and can clear their selected value; clearing is enabled by default. Existing string values with comma or newline separators remain readable. `FormGrid` and per-control span options accept values from 1 to 12. The grid clamps spans to the active column count.

The specialized FormEngine add-ons retain their own package renderers and styles. Google Maps needs its configured API key and network access for live map tiles; QR code generation uses a local WebAssembly asset. `src/config/resource-policy.ts` controls external resource access.

## RTL and localization

The document uses Persian (`lang="fa"`) and RTL direction. App controls use logical Tailwind spacing and alignment. Form labels preserve required markers; email inputs and identifiers retain their appropriate input direction. Designer palette translations and custom control names are configured in `src/features/forms/engine/registry.ts` and `src/features/forms/engine/i18n.ts`.

## Data flow

The Add Form page validates name, code, and type using React Hook Form and Zod. The form schema is structurally checked and submission currently logs `{ formName, code, type, jsonData }` to the browser console; no backend save API is implemented. The designer uses `MemoryFormRepository`, so drafts stay in page memory.

`src/features/forms/domain` defines form data and validation. `src/features/forms/infrastructure` contains the session-only repository and a browser-storage adapter. `src/features/forms/engine` contains the component adapters, shared registry, grid, localization, and designer storage bridge.

## Monaco assets

The designer uses a local Monaco distribution at `public/vendor/monaco/0.55.1/vs/`. `pnpm dev` and `pnpm build` run `scripts/copy-monaco.mjs` before starting Next.js. For a deployment under a path prefix, configure `NEXT_PUBLIC_MONACO_VS_PATH` at build time.
