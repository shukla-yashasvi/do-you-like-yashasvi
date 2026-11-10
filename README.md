# Are you in love with Yashasvi?

A small personal site. It asks one question, lets No argue for a while, and answers Yes with a short dance.

## The three screens

1. **Introduction.** The page opens on “Check if you are in love with Yashasvi?” and a Begin button. Begin does not count as a No.
2. **Question.** “Do you like Yashasvi?” Yes grows with every No press, through 100 presses, until it covers the viewport. No stays a real button further down the page and can be reached by scrolling.
3. **Ending.** Yes replaces the question with a looping, muted video and the line “He knows. ;)” There are no video controls. Visitors who prefer reduced motion do not get autoplay.

## Stack

Node.js, npm, Vite, React, TypeScript, and plain CSS. There is no router, backend, database, or environment variable.

## Scripts

```bash
npm install
npm run dev
npm test
npm run lint
npm run build
npm run preview
```

`npm run dev` serves the site locally. `npm run build` typechecks the project and writes the static site to `dist/`. `npm run preview` serves that folder. `npm test` runs the refusal rules with Node’s built-in test runner.

## Video

The dance file lives in `assets/` and is imported by the ending screen. Vite copies it into the production build. The page does not use a machine-specific path.

The file currently in use is the original green-screen recording, `PokkoBabyBooDancememe(GreenScreen).mp4`. Removing the green needs FFmpeg, which is not installed on the machine where this was prepared. The original file has not been overwritten.

## Deploy on Vercel

Use the Vite preset:

- Build command: `npm run build`
- Output directory: `dist`
- No environment variables

The build is a static site. Nothing needs to run on a server after the files are uploaded.

## Rights

The words and the interaction belong to this personal project. The dance video is a third-party recording stored with the site. Its creator, licence, and permission to publish it were not verified here. Crediting a source would not by itself make publication allowed. Confirm permission before a public release.
