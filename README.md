# 台灣護理工作環境比較

A static, Traditional Chinese search interface for nursing students comparing work-life-balance conditions. Light/dark mode initially follows the device preference and remembers a manual choice on that device. **All included hospitals and attributes are fictional examples**, not a ranking or a source of real employment information. Verify current conditions with hospitals and nurses before making decisions.

## Run locally

Requires Node.js 22.12 or newer and npm.

```sh
npm ci
npm run dev
```

To build the production site without development dependencies:

```sh
npm ci --omit=dev
npm run build
```

The build tools are production dependencies so this also works with `NODE_ENV=production npm ci`. To test the built site, install development dependencies (including Playwright) separately:

```sh
npm ci --include=dev
npx playwright install --with-deps chromium
npm run test:e2e
```

## Configure the data

Edit `data/hospitals.json`. Each item in `conditions` has a unique `id`, a display `label`, and either `options` (with unique `value` and display `label` pairs) for dropdown filters or `"type": "text"` (with an optional `placeholder`) for open-ended text filters. Each hospital has a `name`, `city`, and an `attributes` object mapping condition IDs to option values or text values. Add or remove conditions and options there to change both the filters and the details displayed on each card. An absent or unrecognized attribute is displayed as 未提供 and does not match a selected option. Search matches hospital name or city; selected filters are combined with AND.

Replace the example entries with responsibly sourced, up-to-date information before using the site for real comparisons. Avoid publishing personal or confidential information.

## Deploy to GitHub Pages

In the repository settings, choose **Pages → Build and deployment → GitHub Actions**. The workflow builds without development dependencies, then installs Playwright and tests the built assets for pull requests and pushes to `main`. It deploys the built artifact on pushes to `main` or manual runs. The relative asset base also supports project Pages URLs.
