import { defineConfig } from 'vitest/config'
import { webdriverio } from "@vitest/browser-webdriverio"

export default defineConfig({
  test: {
    alias: {
      "@": "./src"
    },
    include: ['**/*.{test,spec}.?(c|m)[jt]s?(x)'],
    browser: {
      enabled: true,
      provider: webdriverio(),
      // https://vitest.dev/guide/browser/webdriverio
      instances: [
        {
          "browser": "chrome"
        }
      ],
    },
  },
})
