import { test as base, expect } from '@playwright/test';

type ResourcePolicyWindow = Window & { resourcePolicyViolations?: string[] };
/** Every browser test runs with external network access denied, including font/script assets. */
export const test = base.extend<{ localResourceAudit: void }>({
  localResourceAudit: [
    async ({ context, baseURL }, use) => {
      const origin = new URL(baseURL!).origin;
      const externalRequests: string[] = [];
      context.on('request', (request) => {
        const url = new URL(request.url());
        if (['http:', 'https:'].includes(url.protocol) && url.origin !== origin)
          externalRequests.push(url.href);
      });
      await context.route('**/*', (route) => {
        const url = new URL(route.request().url());
        return ['http:', 'https:'].includes(url.protocol) && url.origin !== origin
          ? route.abort()
          : route.continue();
      });
      await context.addInitScript(() => {
        const target = window as ResourcePolicyWindow;
        target.resourcePolicyViolations = [];
        document.addEventListener('securitypolicyviolation', (event) => {
          target.resourcePolicyViolations?.push(`${event.effectiveDirective}: ${event.blockedURI}`);
        });
      });
      await use();
      expect(externalRequests, 'No external runtime requests should be attempted').toEqual([]);
      for (const page of context.pages()) {
        if (page.isClosed()) continue;
        const violations = await page.evaluate(
          () => (window as ResourcePolicyWindow).resourcePolicyViolations ?? [],
        );
        expect(violations, 'No resources should be blocked by the self-hosted policy').toEqual([]);
      }
    },
    { auto: true },
  ],
});
export { expect };
