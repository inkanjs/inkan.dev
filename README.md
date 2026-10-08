# inkan.dev

The website of [inkan](https://github.com/inkanjs/inkan), the API framework for Node where the
docs can't lie: the landing page, the docs, and a playground that talks to a real inkan app.

It runs on Next.js, and its API is an inkan app (`server/app.ts`) served through
[`@inkanjs/next`](https://github.com/inkanjs/integrations/tree/main/packages/next). The docs
are MDX under `content/docs`, read by [Fumadocs](https://fumadocs.dev). The animations are
[Motion](https://motion.dev), the clips under "under the hood" are
[Remotion](https://www.remotion.dev) scenes played in the page.

## Develop

```sh
npm install
npm run dev
```

`http://localhost:3000` is the site, `/docs` the docs, `/api/docs` the docs of the playground
API. `npm run check` runs the API's examples as tests.

## Run it

```sh
npm ci
npm run build
npm start
```

The build is a standalone Next.js server in `.next/standalone`, with `public/` and
`.next/static` copied next to it: the folder is the whole site. `npm start` runs it on `PORT`
(default 3000) and `HOSTNAME` (default `0.0.0.0`):

```sh
PORT=3000 npm start
```

Kept running by systemd, pm2 or a container like any Node server, or under
[warden](https://github.com/vxnsin/warden): `warden run -- npm start`.

Build on the machine it runs on (a Raspberry Pi builds it fine, only slower): the standalone
folder carries the `node_modules` it needs, for the platform it was built on.

## Layout

```
app/              pages: the landing page, /docs, /api (the inkan app), /api/search
components/       the landing page's sections, the Remotion scenes, the code windows
content/docs/     the docs, as MDX
server/app.ts     the playground API, an inkan app
scripts/          the step after next build that makes .next/standalone whole
```
