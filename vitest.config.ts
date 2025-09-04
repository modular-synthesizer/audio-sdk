import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['**/*.{test,spec}.?(c|m)[jt]s?(x)'],
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
