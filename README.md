# Persian Form Panel

Next.js **16.4.0**, App Router, React 19, TypeScript, **MUI 9.5.0**, FormEngine **11.1.0**, and pnpm. Persian-first responsive administration shell with a visual designer and JSON-driven viewer.

## Start

Requires Node.js 22+ and pnpm 11.25.0.

```sh
corepack enable
pnpm install --frozen-lockfile
cp .env.example .env.local
# Set NEXT_PUBLIC_FORMENGINE_LICENSE_KEY if you have a designer license.
pnpm dev
```

Open http://localhost:3000. `/designer` edits forms; `/viewer` renders and validates them. The viewer and sample form work independently of the designer license. The designer needs a vendor-issued commercial license for licensed use. The key is intentionally public and must be bound to your intended domains. Follow the vendor's localhost/HTTPS requirements.

```sh
pnpm typecheck
pnpm lint
pnpm test
pnpm build
pnpm start
pnpm exec playwright install chromium
pnpm test:e2e
```

## Integration decisions

- MUI's Next.js App Router cache provider collects Emotion styles during streaming SSR. HTML `lang="fa"` / `dir="rtl"`, MUI `direction: 'rtl'`, and the RTL Stylis plugin cover document layout, component styles, and portals. Vazirmatn is bundled locally through Fontsource; no Google Fonts request is needed.
- FormEngine does not support SSR. Entire designer/viewer workspaces are dynamically imported with `ssr: false` from a client boundary. The panel shell remains independently renderable.
- The upstream `@react-form-builder/components-material-ui@11.1.0` declares `@mui/material: ^7.3.2` and MUI X 7. This project deliberately uses the documented `define()` API to build a shared **MUI 9 adapter registry**, rather than forcing unsupported peer versions or loading two MUI majors. Existing forms using upstream `MuiTextField` and other `Mui*` names must be migrated to this registry's types before use.
- The administration panel and all registered form controls use MUI 9. **The embedded FormEngine designer chrome uses RSuite internally.** Its official Persian translation and RSuite locale are loaded via the `i18n` API. Making the vendor's entire editor chrome MUI requires a separate supported vendor customization effort; changing the form registry does not replace that chrome.
- One metadata registry feeds both `BuilderView` and `createView`, so custom types round-trip between editing and rendering. Stable type names are part of your stored schema contract.

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
| `SubmitButton`  | Event-driven validate-then-submit action                           |

Numeric fields accept English, Persian, and Arabic digits and keep their engine values as English digit **strings**. Identifiers preserve leading zeroes; amounts avoid JavaScript floating-point precision loss. The submission boundary recursively normalizes string digits without modifying object keys or primitive types. Extend formatting separately for decimal or negative currency amounts if needed.

## Structure and extension

- `src/app`: routes, global layout, providers, and error pages.
- `src/theme`: shared MUI tokens and component defaults.
- `src/components`: responsive panel shell.
- `src/features/forms/domain`: sample schema, form boundary guard, validation, and repository interface. No engine or UI dependency.
- `src/features/forms/infrastructure`: browser storage implementation.
- `src/features/forms/engine`: component adapters, registry, Persian localization, validators, and designer storage bridge.
- `src/features/forms/ui`: client workspaces and error boundary.
- `src/lib/digits.ts`: reusable numeral normalization.
- `tests`: domain/storage unit tests and browser integration tests.

To add a component: implement a controlled MUI control, expose primitive `onChange(value)` rather than a DOM event, read validation with `useErrorMessage()`, describe value/events/editable properties using `define()`, and add it to the shared registry. Add a validation rule and sample schema usage where appropriate. Container controls forward their refs so designer drag-and-drop can target the DOM node.

The `FormRepository` interface keeps persistence separate from FormEngine. Replace `LocalFormRepository` with an HTTP adapter when connecting your backend; pass it to `createDesignerStorage`. The demo stores named definitions in this browser, not on a server. It is not multi-user storage. Browser storage can fail or fill up; the UI surfaces save failures. The built-in sample remains available as a fallback.

## Submission and production scope

The viewer's `submit` custom action runs after FormEngine's `validate` action with `failOnError: true`. It displays the normalized payload locally. **No API request or backend persistence is implemented.** Replace that action with your API client, loading/error states, and server-side validation. Add authentication and authorization before exposing real business forms. No auth backend was specified or invented.

The importer checks size, basic node structure, unique keys, and tree complexity. This is intentionally a structural guard, not full FormEngine JSON-schema validation and not an expression sandbox. FormEngine definitions may contain executable expressions/actions: import only trusted definitions. Unknown component types need a matching registry entry. This guard preserves other engine metadata instead of silently stripping it.

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

- Production build and strict TypeScript check passed.
- ESLint passed; pnpm reports no peer dependency issues.
- Six unit tests passed.
- Nine Chromium integration tests passed: numeral round-trip, failed validation, Persian palette, designer save/viewer reopen/export, JSON import/read-only mode, mobile layout, right-hand desktop sidebar, self-hosted Monaco, and local fonts/resource policy. Every browser test blocks and audits external requests.
- Dashboard, viewer, and designer were rendered and visually inspected.

The designer was tested without a supplied license and displays the vendor's unlicensed-use notice. License activation and deployment-domain checks require your own valid key. This does not affect the standalone Core viewer.

## Self-hosted Monaco (no Monaco CDN requests)

The designer uses `@monaco-editor/react`. Its default loader URL is jsDelivr's Monaco **0.55.1** distribution. This project now pins that asset version locally and serves the entire `min/vs` tree under:

```text
public/vendor/monaco/0.55.1/vs/
```

`pnpm dev` and `pnpm build` automatically run `scripts/copy-monaco.mjs`. The archive also includes these generated assets. The copy includes scripts, styles, fonts, language modules, and worker files, together with Monaco's license. Do not copy only `editor.main.js`: it needs the other files and their relative paths.

`configureMonaco()` runs inside the client-only dynamic import callback **before importing the designer**, because the vendor initializes Monaco at module evaluation time. It sets:

```ts
loader.config({
  paths: { vs: new URL('/vendor/monaco/0.55.1/vs', window.location.origin).href },
});
```

The resulting request is to your own application's `/vendor/monaco/0.55.1/vs/editor/editor.main.js`. No Monaco files need to be loaded from jsDelivr at runtime. The viewer uses the Core renderer and does not import the designer or Monaco setup module.

To deploy the app under a URL base path, set this build-time environment variable in `.env.local` and rebuild:

```dotenv
# For a Next.js app mounted under /panel:
NEXT_PUBLIC_MONACO_VS_PATH=/panel/vendor/monaco/0.55.1/vs
```

The asset path must stay on the application's origin. If assets are stored on a separate internal server, expose them through a same-origin reverse proxy path. The loader validates the configured origin and the resource policy also rejects external origins. Do not configure the loader in a React effect after importing the designer; that allows the default CDN request to start first.

Verified by opening the designer and its JSON editor while blocking every external HTTP/HTTPS request: the local `editor.main.js` loaded successfully, the Monaco editor rendered the form JSON, and no external request was attempted. This check covers this project's registered controls; separately added components that use remote resources need their own configuration.

## All runtime assets are local

This setting applies to all asset classes in the included panel, designer, and viewer:

| Asset                                                      | Local source                             | Runtime delivery                                                |
| ---------------------------------------------------------- | ---------------------------------------- | --------------------------------------------------------------- |
| Next.js, React, MUI, Emotion, Core and designer JavaScript | pnpm dependencies and application source | Application's `/_next/static/` bundles                          |
| MUI/RSuite/FormEngine styles                               | Package/app source                       | Same-origin bundles, inline styles, or embedded data-URL styles |
| Persian fonts (Vazirmatn)                                  | `@fontsource/vazirmatn` package          | Application's hashed font files                                 |
| Icons                                                      | Component/package source                 | Bundled SVGs and locally rendered symbols                       |
| Persian designer translation and RSuite locale             | Installed designer/RSuite packages       | Application JavaScript bundles                                  |
| Monaco scripts, CSS, language modules, fonts, workers      | Pinned local `monaco-editor` package     | `public/vendor/monaco/0.55.1/vs/`, with local/blob workers      |
| Form definitions                                           | Browser storage and imported JSON        | Local data; no hosted form service                              |

`src/config/resource-policy.ts` defines a Content Security Policy, sent through `next.config.ts`, that permits same-origin resource loading and rejects external runtime origins. Data/blob URLs are allowed where embedded styles, images, and workers need them. Inline styles/scripts and evaluation remain permitted for the current framework/editor behavior; this policy enforces the local-asset requirement rather than being a full strict-CSP configuration. API connections are also same-origin; add a same-origin API route or reverse proxy when connecting a separate backend.

`tests/e2e/fixtures.ts` audits all browser tests, not only Monaco: it denies external HTTP/HTTPS traffic, records attempted outbound requests, and checks CSP violations. The included nine browser tests pass with this audit enabled. This prevents a blocked CDN dependency from being mistaken for successful local hosting. The tested scope is the included component registry and flows; external services introduced by future custom components need equivalent local handling.

Runtime use needs no third-party CDN access. Initial package installation still downloads dependencies from your configured pnpm registry unless they are already cached or served by your internal registry. Documentation/pricing links remain normal links; they are not automatically fetched assets.
