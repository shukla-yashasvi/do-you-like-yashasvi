# Project notes

These notes describe the foundation, the content module, the question screen, the Yes/No interaction, and the success screen.

The package name is `valentine-invitation`. It is marked `"private": true`, so npm will refuse to publish it by accident.

## What each tool does here

**Node.js** runs JavaScript on your computer, outside a browser. Visitors to the finished page will not install Node. We use it to run the development server, the type checker, the linter, and the production build. This project was set up with Node.js 24.

**npm** reads `package.json`, downloads the packages we declared, and writes the exact versions it installed to `package-lock.json`. A script such as `npm run dev` does not know how to start a website by itself. It looks up `"dev"` in `package.json` and runs that command, which is `vite`.

**Vite** does two different jobs:

- `npm run dev` starts a local development server. It serves `index.html`, transforms `src/main.tsx` in the browser's module format, and reloads the page when you save a file.
- `npm run build` asks TypeScript to check the project, then asks Vite to write the finished site into `dist/`. Those files are ordinary HTML, CSS, and JavaScript that a static host can serve later. Nothing is deployed in this milestone.

`npm run preview` serves the `dist/` folder locally, so you can look at the production output without a host. `npm run lint` runs ESLint.

**React** is the UI library. A component is a function that returns a description of what to show. `App` chooses what to render. `QuestionView` renders the question screen. React does not replace the HTML file. It fills the empty `<div id="root">` after the page loads.

**TypeScript** checks `.ts` and `.tsx` files before they run. `"strict": true` is set in both compiler projects below. That turns on the checks that catch missing values, wrong argument types, and implicit `any`. Vite strips the types away during the build. The browser never receives TypeScript.

**ESLint** reads `eslint.config.js` and reports risky patterns in the source. The browser source is checked with recommended JavaScript rules, recommended TypeScript rules, the React Hooks rules, and the Vite React refresh rule. `vite.config.ts` is checked as a Node script, because it does not run in the browser. ESLint does not ship in `dist/`.

## How the page starts

1. The browser loads `index.html`.
2. That file contains `<div id="root"></div>` and `<script type="module" src="/src/main.tsx"></script>`.
3. `src/main.tsx` imports the global stylesheet, finds the root element, and tells React to render `<App />` inside it.
4. `src/main.tsx` sets `document.title` from `invitationCopy.documentTitle`.
5. `src/App.tsx` starts on the introduction. Begin opens the question. Yes opens the ending.

`index.html` sets the document title, the link description, the theme colour, and the Open Graph title and description before JavaScript runs. The app then sets the title from `copy.ts`. That module remains the source the interface reads.

## Product

The page opens on an introduction: `Check if you are in love with Yashasvi?` and a Begin button. Begin only reveals the question. It does not change the refusal count. The question is `Do you like Yashasvi?` Every No press changes the reply and makes Yes larger. By the later presses Yes covers the viewport and No sits further down the page, still a real button, reached by scrolling. Yes opens the Pokko Baby Boo video with the closing line `He knows. ;)`.

The browser title and the heading are different on purpose. The title, `Are you in love with Yashasvi?`, is what a tab or a shared link can show. The heading, `Do you like Yashasvi?`, is the question on the page. The title is the sharper line. The page starts with the lighter one. Neither string is written inside a component.

The original ten refusal lines are unchanged. `reservedPersonalPhrases` is saved and is not shown.

## Question screen

`QuestionView` renders one `main`, one `h1`, and two `button` elements. It receives the question, the labels, the Yes emphasis, and the click handlers as props. It does not decide which refusal line comes next.

`src/styles/tokens.css` holds the values we may want to change together: colours, type stacks, sizes, and spacing. Components do not repeat those values. `global.css` imports the tokens and applies them through class names such as `question-screen` and `choice`. The component decides the structure. The stylesheet decides the presentation. A later change to the background is one token, not a hunt through the component.

The layout is mobile-first and stays a vertical stack. `100dvh` follows the visible mobile browser height, with `100vh` first as a fallback. The question screen is at least one viewport tall and is allowed to grow taller. The page does not clip overflow, and neither button is taken out of the document flow. Page padding uses `safe-area-inset` until the later presses remove it. No keeps a band at least 3.5rem tall. Its width stays the full row through press 30, then narrows toward the centre. The column starts at 38rem and widens to the screen as Yes grows.

## Interaction

`src/interaction/refusal.ts` exports `resolveRefusal`. It is a pure function: the same count always returns the same result, and it does not use React or the browser. The sentences still come from `copy.ts`. The function does not contain its own copy of them.

The input is a refusal count, clamped to a whole number from 0 to 100. A negative count, `NaN`, or `Infinity` becomes 0. The output has five fields:

- `noLabel` is the text on the No button.
- `yesEmphasis` starts at 0 and reaches 2 at press 100. 1 is the in-viewport fit, not the maximum.
- `noWidthScale` is the fraction of the button row that No should occupy.
- `originalSequenceComplete` is true once all ten original lines have been used.
- `reachedMaximum` is true at count 100.

Count 0 is the original label, `No`, and emphasis 0. Counts 1 through 10 are the original refusal lines, in order. Count 10 is `My kuchu puchu`. From count 11, the label comes from `continuedRefusalLines`. Those twelve lines answer the question directly, and they repeat in order: the index is `(count - 11)` modulo 12. Count 11 is `Not even a little?`, count 22 is `Okay, but why not?`, and count 23 returns to `Not even a little?`. Count 100 lands on `Surely you like me at least 1%?`. The count then stops, so that line stays. The size does not wait for that line.

`App` stores `refusalCount` for the question, and `accepted` once Yes is chosen. The label, Yes emphasis, and No width are derived by calling `resolveRefusal(refusalCount)` during render. They are not stored beside the count. Pressing No increases the count until `reachedMaximum` is true. Pressing Yes leaves the question screen and shows the success screen.

Yes emphasis is `1 - (1 - count / 30)²` for presses 1 through 30. That ease-out reaches 1 at press 30: count 5 is about 0.31, count 10 is about 0.56, count 15 is 0.75, count 20 is about 0.89, count 25 is about 0.97. Press 30 is the point where Yes fills the viewport while the question and No are still on screen. It is not the end of the growth.

From press 31 the emphasis is `1 + ((count - 30) / 70)²`. It is strictly larger on every later press and finishes at 2 on press 100. The squared term starts flat, where the ease-out also ends flat, then accelerates. Press 50 is about 1.08, press 75 is about 1.41, and press 100 is 2.

`QuestionView` turns that number into three CSS variables. `--yes-fit` is the emphasis capped at 1. `--yes-beyond` is the amount above 1. `--yes-clear` ramps from 0 to 1 at two and a half times that extra, so the question, the gap, and the page padding are gone once the extra reaches 0.4, around press 75. Yes height is the normal button height, plus `--yes-fit` times `max(0px, 100dvh - 15rem)`, plus `--yes-beyond` times `160dvh`. The type grows with the same split and is capped at `28vw` so the word Yes cannot force a horizontal scrollbar. Its top padding follows the in-viewport fit only, so once the button is taller than the screen the word stays in the first viewport instead of sitting in the middle of the tall button. Nothing here uses a transform, fixed position, or absolute position.

No width is a separate number. It stays at 1 through count 30. From count 31 to count 100 it falls in equal steps to 0.22. The step is `(1 - 0.22) / 70`. CSS uses that fraction as the button width, with a floor of 5.5rem so a narrow phone does not turn the button into a sliver. On a 360px screen that floor is a little wider than 22% of the row. The red fill, the minimum height of 3.5rem, and the centred place under Yes stay the same. The type eases down toward 0.9rem and the text wraps inside the button.

Because Yes keeps getting taller after press 30, the document becomes taller than the viewport. No stays in normal flow under Yes, so it moves below the fold. The page can scroll to it. The button is not removed, disabled, or covered.

The changing line is also written into a visually hidden paragraph with `aria-live="polite"`. That paragraph is empty until the first refusal, so the initial word `No` is not announced as a new message. Later presses replace that text. Once count 100 is showing, the text does not change, so a screen reader is not asked to repeat it. Both controls remain native buttons, and the focus outline sits outside them on the dark background.

## Success screen

Choosing Yes renders `SuccessView` instead of the question. The question buttons leave the page. Focus moves to the success `main`, and the window scrolls back to the top. The screen is the video, then the line `He knows. ;)`. There is no other success message.

The video file stays in the project `assets` directory. `SuccessView` imports it, and Vite turns that import into the URL the page requests. The markup is a native `video` element with `playsInline`, `muted`, `loop`, `preload="auto"`, and no controls. The element fills the viewport above the closing line. `object-fit: contain` keeps the 1080×1304 frame intact, so portrait footage on a wide screen has dark space at the sides instead of a stretched or cropped picture. This is the website filling the viewport. It is not the browser's native fullscreen mode.

`muted` is set on the DOM element before `play()`, because a muted autoplay attribute is not always enough. The play promise is caught, so a blocked autoplay does not break the screen. Autoplay is skipped when the visitor has asked for reduced motion. The video and the closing line stay; there is still no control bar. If the file fails to load, the closing line stays, and a short line says the dance could not be played.

The file is 1080 by 1304 pixels and about 12.8 seconds. A preview frame shows the character on a bright green background. FFmpeg is not installed here, so the green was not keyed out and the original file was left unchanged. The page still plays that file. The stage behind it uses the same near-black as the rest of the site.

Yes is green, `#176b3a`, with the paper text `#f3eee6`. No is red, `#9d2f2c`, with the same paper text. Those pairs are the button tokens. The paper text clears the 4.5:1 contrast line on both fills. The colours are still provisional.

`npm test` runs this function through Node's built-in test runner. No test library was added. The test file is excluded from the browser TypeScript project because it imports Node's test tools.

## Provisional design

This direction is a proposal, not a finished identity. The page is a warm near-black field and the question is a large serif. Yes is green and No is red, and Yes grows toward the available space as No is pressed. The type is a built-in serif stack, so the page does not download a font. Colour, type, and the column width can still be replaced without changing the refusal rules.

`main.tsx` wraps `App` in `<StrictMode>`. In development, React renders twice on purpose so unsafe side effects are easier to notice. That double render does not happen in the production build.

If `index.html` ever lost the root element, `main.tsx` throws `The page is missing the root element.` instead of failing later with a less clear message.

## Content

Visible wording lives in `src/content/copy.ts`, not in the components. Choosing No changes the line on the button by reading the next entry from that file. When a line changes, the edit happens in `copy.ts`. The interaction function keeps asking the module for the line.

`invitationCopy` is the wording the page will use:

- `documentTitle` is the browser-tab title.
- `introPrompt` is the introduction, `Check if you are in love with Yashasvi?`
- `beginLabel` is the button that opens the question.
- `question` is the heading on the question screen.
- `yesLabel` and `noLabel` are the initial button labels.
- `refusalLines` is the ordered list of replies to No.
- `successCaption` is the closing line, `He knows.`
- `successSmirk` is the `;)` beside that line.
- `videoLabel` names the video for assistive technology.
- `videoUnavailable` is the line shown if the video cannot be played.
- `continuedRefusalLines` is the twelve lines used from press 11 onward.

`reservedPersonalPhrases` is a separate list. Those phrases are saved for later and are not part of the refusal sequence. `I will die` stays in that list. `I am going to die` stays in `refusalLines`. They are different sentences.

`InvitationCopy` describes the shape: every field is a string, and `refusalLines` is a readonly array. `as const` freezes the actual object, so each sentence is a fixed literal and the refusal list cannot be reordered or extended by accident. `satisfies InvitationCopy` checks that the object still has every required field. Interaction code can read `invitationCopy.refusalLines[0]`. It cannot call `push` on that array. Nothing in the type system corrects spelling or punctuation. The strings are stored exactly as approved.

## Configuration files

`package.json` names the project, lists dependencies, and defines `dev`, `build`, `lint`, `test`, and `preview`.

`package-lock.json` is the exact install record. Commit it later so a future install uses the same versions. Git is not initialised yet.

`vite.config.ts` registers `@vitejs/plugin-react`. That plugin tells Vite how to transform JSX and how to refresh a component after you edit it.

`tsconfig.json` does not compile files itself. `"files": []` keeps it empty, and `"references"` points at the two projects below. `npm run build` runs `tsc -b`, which builds those referenced projects.

`tsconfig.app.json` covers `src/`. It includes the DOM type library, JSX set to `react-jsx`, and `"types": ["vite/client"]` so TypeScript understands a CSS import. `"noEmit": true` means TypeScript only checks this project. Vite is what produces the JavaScript. `"moduleResolution": "bundler"` matches how Vite loads imports, including paths that end in `.tsx`.

`tsconfig.node.json` covers `vite.config.ts` only. It uses Node's module rules and `"types": ["node"]`, which is why `@types/node` is installed.

Both TypeScript projects also set:

- `noUnusedLocals` and `noUnusedParameters`, so unused names fail the build.
- `erasableSyntaxOnly`, so the code stays within the TypeScript features Vite can delete. An `enum`, for example, is rejected because it is real runtime code rather than a type.
- `verbatimModuleSyntax`, so a type-only import has to be written as `import type`. That keeps imports honest once the types are removed.

`eslint.config.js` is the lint setup described above. `dist/` is ignored because it is generated output.

`.gitignore` lists files that should stay out of Git later: `node_modules`, `dist`, local env files, and macOS `.DS_Store`.

## Dependencies

Runtime dependencies, which the page needs in the browser:

- `react` draws the component tree.
- `react-dom` mounts that tree into the root element.

Development dependencies, which stay on your machine:

- `vite` is the dev server and the production bundler.
- `@vitejs/plugin-react` teaches Vite about React.
- `typescript` is the type checker used by `tsc -b`.
- `@types/react` and `@types/react-dom` describe React's types.
- `@types/node` describes Node's types for `vite.config.ts`.
- `eslint` and `@eslint/js` provide the linter and its recommended JavaScript rules.
- `typescript-eslint` lets ESLint understand TypeScript.
- `globals` supplies the list of browser and Node names, so words such as `document` and `process` are not reported as undefined.
- `eslint-plugin-react-hooks` checks the rules of Hooks. `App` and `SuccessView` use state and effects.
- `eslint-plugin-react-refresh` warns if a file exports something that would stop Vite's development refresh from working.

## Decisions worth remembering

The current Vite template installed TypeScript 7. The current `typescript-eslint` release only accepts TypeScript versions below 6.1, so this project uses TypeScript 6.0.3. That is the newest release the linter supports. Forcing TypeScript 7 into the tree would make the lint install report a broken peer dependency.

The same Vite template included Oxlint and a demo page with logos, a counter, and a favicon. Those were removed. Linting uses ESLint, as agreed. The page has no router, Tailwind, animation library, backend, or state-management library.

There is no favicon yet. The document title is "Are you in love with Yashasvi?". The visible heading is "Do you like Yashasvi?".

The npm package name is still `valentine-invitation`. Renaming it is a separate decision. Automated key presses in the embedded browser do not activate the native buttons, because those events are not trusted user input. Enter and Space were not given a second click handler. A real keyboard uses the browser's built-in button behaviour. Tab order still includes No after it has been pushed below the fold, and the browser scrolls a focused button into view.
