import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    browser: {
      enabled: true,
      provider: 'webdriverio',
      // https://vitest.dev/guide/browser/webdriverio
      instances: [
        {
          "browser": "chrome"
        }
      ],
    },
  },
})
