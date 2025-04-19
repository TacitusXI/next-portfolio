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

## Deployment Options

### Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

### Deploy on Fleek with IPFS

This project is also configured to be deployed on [Fleek](https://fleek.xyz/) using their Next.js adapter, which enables seamless deployment on IPFS.

1. Install the Fleek CLI and Next.js adapter:
   ```bash
   npm install @fleek-platform/cli -g
   npm install @fleek-platform/next -D
   ```

2. Login to Fleek:
   ```bash
   fleek login
   ```

3. Create a new Fleek function:
   ```bash
   fleek functions create
   ```

4. Build your Next.js app with the Fleek adapter:
   ```bash
   npm run build:fleek
   ```

5. Deploy to Fleek:
   ```bash
   npm run deploy:fleek
   ```

For server-side routes, the edge runtime configuration is required. Add the following line to any API routes or server components:
```typescript
export const runtime = 'edge';
```
