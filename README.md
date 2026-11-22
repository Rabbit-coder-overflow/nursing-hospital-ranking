# 台灣護理工作環境比較

A static, Traditional Chinese search interface for nursing students comparing work-life-balance conditions. **All included hospitals and attributes are fictional examples**, not a ranking or a source of real employment information. Verify current conditions with hospitals and nurses before making decisions.

## Run locally

Requires Node.js 22.12 or newer and npm.

```sh
npm ci
npm run dev
```

To build and test the production site:

```sh
npm run build
npx playwright install --with-deps chromium
npm run test:e2e
```

## Configure the data

Edit `data/hospitals.json`. Each item in `conditions` has a unique `id`, a display `label`, and `options` with unique `value` and display `label` pairs. Each hospital has a `name`, `city`, and an `attributes` object mapping condition IDs to option values. Add or remove conditions and options there to change both the filters and the details displayed on each card. An absent or unrecognized attribute is displayed as 未提供 and does not match a selected option. Search matches hospital name or city; selected filters are combined with AND.

Replace the example entries with responsibly sourced, up-to-date information before using the site for real comparisons. Avoid publishing personal or confidential information.

## Deploy to GitHub Pages

In the repository settings, choose **Pages → Build and deployment → GitHub Actions**. The workflow builds and runs the browser tests for pull requests and pushes to `main`, and deploys the built artifact on pushes to `main` or manual runs. The relative asset base also supports project Pages URLs.
