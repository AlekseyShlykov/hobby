This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Deploy to GitHub Pages

The app is built as a **static export** and can be hosted on GitHub Pages.

### One-time setup

1. **Enable GitHub Pages** in the repo: **Settings → Pages → Build and deployment → Source**: choose **GitHub Actions**.
2. **Workflow**: If the app lives in a subfolder (e.g. `hobby-finder/`), use the workflow in the repo root (e.g. `.github/workflows/deploy-pages.yml`). It runs `npm run build` inside `hobby-finder/` (with the API route temporarily moved aside for static export) and deploys the `out/` folder.
3. **If your repo root is the app** (no subfolder): put the same workflow in `.github/workflows/` but remove `defaults.run.working-directory`, use `path: out` for the artifact, and run the API move/restore from the repo root.

### Build locally (optional)

From the app directory (`hobby-finder/`):

```bash
BASE_PATH=/your-repo-name npm run build
```

Output is in `out/`. For GitHub Pages, the site will be at `https://<user>.github.io/<your-repo-name>/`.

### Notes

- Saving results to the database is disabled on the static host (`NEXT_PUBLIC_DISABLE_SAVE=true` in CI). The test and results UI work without it.
- A `.nojekyll` file is added in the built output so that the `_next/` folder is not ignored by Jekyll.
