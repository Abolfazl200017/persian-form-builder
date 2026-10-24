# Persian Form Panel

Next.js **16.4.3**, App Router, React 19, TypeScript, **MUI 9.5.0**, FormEngine **11.1.0**, **React Hook Form 7 + Zod 4**, and pnpm. A Persian-first RTL administration panel with a horizontal navigation, Home and Forms pages, and an Add Form page where the FormEngine designer runs at full panel width.

## Start

Requires Node.js 22+ and pnpm 11.25.0.

```sh
corepack enable
pnpm install --frozen-lockfile
cp .env.example .env.local
# Set NEXT_PUBLIC_FORMENGINE_LICENSE_KEY if you have a designer license.
pnpm dev
```

Open http://localhost:3000. `/` is Home, `/forms` is the Forms page, and `/forms/new` adds a form: metadata fields plus the embedded designer. The designer needs a vendor-issued commercial license for licensed use. The key is intentionally public and must be bound to your intended domains. Without a key, FormEngine runs in unlicensed mode according to the vendor's own rules. Follow the vendor's localhost/HTTPS requirements and EULA.

```sh
pnpm typecheck
pnpm lint
pnpm test
pnpm build
pnpm start
pnpm exec playwright install chromium
pnpm test:e2e
```

If Playwright's browser download is unavailable, reuse an installed browser instead: `PLAYWRIGHT_CHANNEL=chrome pnpm test:e2e` (or `msedge`).

## Layout and theme

- The sidebar was replaced with a horizontal top navigation, so the main content and the designer use the full panel width. On mobile the same navigation opens in a drawer; the menu contains exactly **Home** (خانه) and **Forms** (فرم‌ها). The header sits at `z-index: 10`.
- The MUI theme mirrors FormEngine's RSuite light and dark themes: primary `#3498ff` / `#34c3ff`, green accent `#37ab3c` / `#58b15b`, canvas `#f7f7fa` / `#0f131a`, white and `#1a1d24` surfaces, matching borders, 6px radii, 14px type, compact 36px controls and flat surfaces. A single toggle button in the header switches the panel and the embedded designer together. The designer chrome uses the panel's Vazirmatn typeface, including its portals; Monaco keeps its code font.
- The designer can take the whole viewport with a **تمام‌صفحه** control and return with **حالت پنجره** or Escape. Portaled vendor pickers, modals and tooltips are layered above this fullscreen shell.
- The form canvas scrolls when a form is taller than the designer viewport, with a styled, visible scrollbar. This replaces FormEngine's clipped `overflow: hidden` so long forms remain reachable in both windowed and fullscreen modes.
- The **چیدمان** palette includes **شبکه** (Grid): a CSS-grid container with 1–12 columns for mobile, tablet, and desktop. Inputs and layout items expose a column span for each mode. Column counts follow the designer's device mode (with a viewport fallback for standalone rendering), and spans clamp to the active column count. This works in the builder and in preview mode.
- Field labels ending in `*` render that marker in red. The Add Form page's bottom **ثبت فرم** action validates the metadata with React Hook Form + Zod and logs `{ formName, code, type, jsonData }` to the browser console with a snackbar; nothing is persisted.
- FormEngine's built-in component names, component properties and form settings are translated to Persian through component-library descriptions and locale overrides, including a few vendor strings that bypass i18n.
- The built-in **Modal** uses the standard RSuite dialog adapter (`RsModal`) in the shared designer/viewer registry. Dialogs are centered horizontally and vertically in the viewport, with scrolling for tall content; the full-size option fills the viewport. Adding a Modal selects it automatically; Settings → Modal also exposes it. Set the Modal template to a named form, open it with `openModal` and its `modalKey`, and close it with `closeModal`, Escape, or the backdrop. Size, focus, backdrop, keyboard behavior, and open/close events remain editable in the native modal properties.
- The palette contains **61 components**: the complete RSuite catalog, table components, rich text, signature, QR code, print controls, Google Maps, FormEngine's built-in structure/template components, and the existing Persian controls. Designer and viewer share the same metadata and bundled RTL styles. Modal and error renderers remain available through form settings, as intended by FormEngine.
- Form labels and rich-text content, lists, and picker controls follow RTL in the designer and viewer. Explicit rich-text alignment is preserved, and email/numeric inputs keep their LTR direction. A scoped radio sizing correction prevents the designer's pseudo-element reset from expanding the outer ring and offsetting the selected dot.
- All runtime assets are local; see the asset sections below.

## Integration decisions

- MUI's Next.js App Router cache provider collects Emotion styles during streaming SSR. HTML `lang="fa"` / `dir="rtl"`, MUI `direction: 'rtl'`, and the RTL Stylis plugin cover document layout, component styles, and portals. Vazirmatn is bundled locally through Fontsource; no Google Fonts request is needed.
- FormEngine does not support SSR. The designer runtime is dynamically imported with `ssr: false` from a client boundary. The panel shell and the Home and Forms pages remain independently renderable.
- The full FormEngine **11.1.0 RSuite component library** and its table, QR, rich-text, signature, print, and Google Maps extensions are registered alongside the custom MUI 9 Persian controls. The upstream `components-material-ui@11.1.0` requires MUI 7 and MUI X 7, so that alternative UI library is not loaded into the MUI 9 panel. Existing forms using upstream `MuiTextField` and other `Mui*` names still require matching adapters or migration.
- The administration panel uses MUI 9. **The embedded FormEngine designer chrome uses RSuite internally.** Its official Persian translation and RSuite locale are loaded via the `i18n` API. Making the vendor's entire editor chrome MUI requires a separate supported vendor customization effort; changing the form registry does not replace that chrome.
- One metadata registry feeds the designer, so custom types round-trip correctly. Stable type names are part of your stored schema contract.
- RSuite controls use the same Persian locale and theme as the designer. Custom Persian controls keep their inline MUI validation messages; other controls retain engine validation messages. The centered `RsModal` adapter replaces only the vendor's renderer of that same type.
- The Add Form metadata is validated with React Hook Form and a shared Zod schema: the name is required, the code must be a lowercase slug, and the type is restricted to `mobile` or `web`. Errors render inline and block submission until the draft is valid. The bottom action then logs the page data to the console.
- The Add Form page is a drafting surface: Name, Code, Form Type (`mobile` | `web`) and the designer, with no save action or data table yet. The designer is backed by `MemoryFormRepository`, so drafts stay in page memory and browser storage is untouched. `LocalFormRepository` remains the browser-storage adapter for when persistence is specified. `persistFormName` is off, so the designer does not write its form name to localStorage either.

## Components

| Stored type     | Purpose                                                            |
| --------------- | ------------------------------------------------------------------ |
| `PersianText`   | Text, email, and multiline input                                   |
| `IranMobile`    | Persian numeral display with canonical 11-digit mobile values      |
| `NationalId`    | 10-digit identifier preserving leading zeroes; checksum validation |
| `PersianAmount` | Integer amount with Persian numerals and thousands separators      |
| `Consent`       | Boolean acceptance with optional required acceptance rule          |
| `SectionTitle`  | Section heading and description                                    |
| `FormSection`   | Ref-compatible container for nested form elements                  |
| `FormGrid`      | Responsive CSS grid with per-device columns and item spans         |
| `SubmitButton`  | Event-driven validate-then-submit action                           |
| `Rs*`          | Full RSuite fields, layout, navigation, modal layout, wizard, table and cell components |
| `RichTextEditor` | Quill rich-text editor with native toolbar and feature settings |
| `RsSignature`  | Canvas signature capture and clearing |
| `FastQR`       | QR generation using a same-origin WebAssembly asset |
| `PageBreak`, `PrintSettings` | Print page breaks, headers, footers and page numbers |
| `GoogleMap`    | Map and marker configuration; live maps require a Google API key and network setup |

Google Maps initially shows its missing-key message without contacting Google. To display a live map, supply your Google Maps API key and explicitly allow the required Google services in `src/config/resource-policy.ts`; the default same-origin policy does not enable external map loading. Upload controls likewise need a configured upload endpoint; no backend is added by registering them.

FastQR's `?url` WebAssembly import is configured as a Turbopack asset in `next.config.ts`. Next.js emits the `.wasm` file into its own static assets, so QR generation requires no CDN or separate asset copy step.

Numeric fields accept English, Persian, and Arabic digits and keep their engine values as English digit **strings**. Identifiers preserve leading zeroes; amounts avoid JavaScript floating-point precision loss. The submission boundary recursively normalizes string digits without modifying object keys or primitive types. Extend formatting separately for decimal or negative currency amounts if needed.

## Structure and extension

- `src/app`: routes (`/`, `/forms`, `/forms/new`), layout, providers, error pages, and the app icon.
- `src/components`: horizontal app shell, link button, and inline icons.
- `src/theme`: shared MUI tokens and component defaults aligned with RSuite.
- `src/features/forms/domain`: starter document, Zod draft schema, sample schema, form boundary guard, validation, and repository interface. No engine or UI dependency.
- `src/features/forms/infrastructure`: browser-storage and session-only repositories.
- `src/features/forms/engine`: component adapters, responsive grid, registry, Persian localization, validators, Monaco setup, and designer storage bridge.
- `src/features/forms/ui`: Add Form view, metadata fields, designer wrapper/runtime, and the Create Form button.
- `src/lib/digits.ts` and `src/lib/labels.ts`: numeral normalization and required-label handling.
- `tests`: domain/storage unit tests and browser integration tests.

To add a component: implement a controlled MUI control, expose primitive `onChange(value)` rather than a DOM event, read validation with `useErrorMessage()`, describe value/events/editable properties using `define()`, and add it to the shared registry. Add a validation rule and sample schema usage where appropriate. Container controls forward their refs so designer drag-and-drop can target the DOM node.

The `FormRepository` interface keeps persistence separate from FormEngine. The session-only repository is used today; swap in `LocalFormRepository` or an HTTP adapter, and pass it to `createDesignerStorage`, when save and the Forms table are specified. The demo stores nothing on a server and is not multi-user storage.

## Submission and production scope

The panel does not submit or persist forms yet. The designer's preview submit action is intentionally a no-op; the Add Form bottom action validates the metadata with Zod and only logs the metadata and JSON to the browser console, and the Forms page only provides the Create Form entry point. **No API request or backend persistence is implemented.** Add the save flow, authentication, authorization, loading/error states, and server-side validation before exposing real business forms. No auth backend was specified or invented.

Repository writes run `parseFormDocument`, which checks size, basic node structure, unique keys, and tree complexity. This is intentionally a structural guard, not full FormEngine JSON-schema validation and not an expression sandbox. FormEngine definitions may contain executable expressions/actions: only load trusted definitions. Unknown component types need a matching registry entry. The guard preserves other engine metadata instead of silently stripping it.

## References

- https://formengine.io/documentation/
- https://formengine.io/documentation/usage-with-nextjs/
- https://formengine.io/documentation/formengine-designer/features/custom-components/
- https://formengine.io/documentation/formengine-designer/features/designer-localization/
- https://formengine.io/documentation/formengine-designer/license-key/
- https://github.com/optimajet/formengine
- https://mui.com/material-ui/integrations/nextjs/
- https://mui.com/material-ui/customization/right-to-left/

Dependency versions and APIs were checked when this project was generated. The lockfile records exact resolutions. ESLint 9 and TypeScript 6 are selected to satisfy the current Next.js lint plugin peer ranges.

## Verified delivery

- Production build, strict TypeScript check, and ESLint passed.
- Ten unit tests passed, including session-only draft storage, required-marker splitting, Zod draft validation, and responsive grid column/span math.
- Nineteen Chromium integration tests passed with external traffic blocked and audited. Coverage includes RTL labels and rich text, radio-dot centering in designer/preview across themes and sizes, the 61-component palette, native field interaction and validation, local QR WebAssembly, rich-text editing, signature drawing and clearing, table data, print settings, the missing-key map state, centered/fullscreen modal behavior, and the existing panel, metadata, localization, theme, navigation, and locally served Monaco checks.
- Home, Forms, and Add Form were rendered and visually inspected at desktop, tablet, and mobile sizes, in light and dark modes, including the fullscreen designer and the responsive grid in each device mode and preview.

The designer was tested without a supplied license. License activation and deployment-domain checks require your own valid key.

## Self-hosted Monaco (no Monaco CDN requests)

The designer uses `@monaco-editor/react`. Its default loader URL is jsDelivr's Monaco **0.55.1** distribution. This project pins that asset version locally and serves the entire `min/vs` tree under:

```text
public/vendor/monaco/0.55.1/vs/
```

`pnpm dev` and `pnpm build` automatically run `scripts/copy-monaco.mjs`. The copy includes scripts, styles, fonts, language modules, and worker files, together with Monaco's license. Do not copy only `editor.main.js`: it needs the other files and their relative paths.

`configureMonaco()` runs inside the client-only dynamic import callback **before importing the designer**, because the vendor initializes Monaco at module evaluation time. It sets:

```ts
loader.config({
  paths: { vs: new URL('/vendor/monaco/0.55.1/vs', window.location.origin).href },
});
```

The resulting request is to your own application's `/vendor/monaco/0.55.1/vs/editor/editor.main.js`. No Monaco files need to be loaded from jsDelivr at runtime.

To deploy the app under a URL base path, set this build-time environment variable in `.env.local` and rebuild:

```dotenv
# For a Next.js app mounted under /panel:
NEXT_PUBLIC_MONACO_VS_PATH=/panel/vendor/monaco/0.55.1/vs
```

The asset path must stay on the application's origin. If assets are stored on a separate internal server, expose them through a same-origin reverse proxy path. The loader validates the configured origin and the resource policy also rejects external origins. Do not configure the loader in a React effect after importing the designer; that allows the default CDN request to start first.

Verified by opening the Add Form page and its JSON editor while blocking every external HTTP/HTTPS request: the local `editor.main.js` loaded successfully, the Monaco editor rendered the form JSON, and no external request was attempted. This check covers this project's registered controls; separately added components that use remote resources need their own configuration.

## All runtime assets are local

This setting applies to all asset classes in the included panel and designer:

| Asset                                                      | Local source                             | Runtime delivery                                                |
| ---------------------------------------------------------- | ---------------------------------------- | --------------------------------------------------------------- |
| Next.js, React, MUI, Emotion, Core and designer JavaScript | pnpm dependencies and application source | Application's `/_next/static/` bundles                          |
| MUI/RSuite/FormEngine styles                               | Package/app source                       | Same-origin bundles, inline styles, or embedded data-URL styles |
| Persian fonts (Vazirmatn)                                  | `@fontsource/vazirmatn` package          | Application's hashed font files                                 |
| Icons                                                      | Component/package source                 | Bundled SVGs and locally rendered symbols                       |
| Persian designer translation and RSuite locale             | Installed designer/RSuite packages       | Application JavaScript bundles                                  |
| Monaco scripts, CSS, language modules, fonts, workers      | Pinned local `monaco-editor` package     | `public/vendor/monaco/0.55.1/vs/`, with local/blob workers      |
| QR WebAssembly                                             | Pinned `fast_qr` dependency                | Same-origin `/_next/static/` asset emitted by Turbopack       |
| Form definitions                                           | Page-memory drafts                       | Local data; no hosted form service                              |

`src/config/resource-policy.ts` defines a Content Security Policy, sent through `next.config.ts`, that permits same-origin resource loading and rejects external runtime origins. Data/blob URLs are allowed where embedded styles, images, and workers need them. Inline styles/scripts and evaluation remain permitted for the current framework/editor behavior; this policy enforces the local-asset requirement rather than being a full strict-CSP configuration. API connections are also same-origin; add a same-origin API route or reverse proxy when connecting a separate backend.

`tests/e2e/fixtures.ts` audits all browser tests, not only Monaco: it denies external HTTP/HTTPS traffic, records attempted outbound requests, and checks CSP violations. All nineteen browser tests pass with this audit enabled. This prevents a blocked CDN dependency from being mistaken for successful local hosting. Configured Google Maps, remote content URLs, and other external integrations require their own explicit network policy; the tests use the map's missing-key state.

Runtime use needs no third-party CDN access. Initial package installation still downloads dependencies from your configured pnpm registry unless they are already cached or served by your internal registry. Documentation/pricing links remain normal links; they are not automatically fetched assets.
