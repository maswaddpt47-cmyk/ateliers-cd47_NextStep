const { defineConfig } = require('@playwright/test');
const fs = require('fs');

const PREINSTALLED = '/opt/pw-browsers/chromium';

module.exports = defineConfig({
  testDir: './e2e',
  timeout: 30000,
  use: {
    launchOptions: {
      executablePath: fs.existsSync(PREINSTALLED) ? PREINSTALLED : undefined,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    },
    baseURL: 'http://localhost:7474',
  },
  webServer: {
    command: 'node e2e/server.js',
    url: 'http://localhost:7474',
    reuseExistingServer: false,
    timeout: 10000,
  },
});
