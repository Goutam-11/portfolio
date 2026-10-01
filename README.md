# Goutam Kumar Sharma — portfolio

A responsive, single-stage Astro portfolio with a scroll-scrubbed character film, Tailwind CSS styling, GSAP ScrollTrigger choreography, and interactive project case studies.

Live site: [goutamsharma.antideploy.app](https://goutamsharma.antideploy.app)

## Run locally

```sh
npm install
npm run dev
```

Astro prints the local preview URL when the server starts. Build the static site with `npm run build`; preview the built output with `npm run preview`.

The main story is one sticky stage inside a tall scroll journey. Scrolling advances an 80-frame WebP sequence extracted from `public/Man_throwing_ball_animation_20260929195852.mp4`. Only opening frames are preloaded; the rest load near the current scroll position. `src/scripts/story.js` owns the GSAP timeline and frame cache. The page falls back to a readable static flow when motion is reduced or JavaScript is unavailable; reduced-motion visitors can opt into the animation with the visible control. Tailwind classes in `src/pages/index.astro` and `src/scripts/book.js` own the interface styling; `src/styles/site.css` contains the Tailwind theme and the small set of state and motion rules the stage needs.

The refreshed image-to-video guide is `docs/video-generation-prompt.md`, with its consistent six-pose character storyboard at `public/storyboard/goutam-video-storyboard.png`. Use both as references when generating a replacement film; the current extracted frame sequence still comes from the original film.

## Update the content

- Project summaries, stacks, case-study copy, concept art paths, captions, and verified links: `src/data/projects.js`.
- Email, phone, WhatsApp, GitHub, and LinkedIn destinations: `src/data/site.js`.
- The 80 compressed story frames live in `public/frames/`. The source film, original portrait, and pose-sheet assets remain in `public/` as source material.
- The project SVGs in `public/images/projects/` are clearly presented as concept illustrations. Replace each `image` path and `caption` in `src/data/projects.js` when real screenshots are ready.
- The case study book is laid out in `src/scripts/book.js` as a cover plus ruled editorial pages; replace the concept images and project copy through `src/data/projects.js`. Page turns hinge at the center seam on desktop and simplify to one page at a time on mobile. The page sound can be muted in the book controls.

Hyusk and DG Converter descriptions are based on project documentation available in the workspace. The other entries use the editable descriptions provided for this portfolio. Add project links only after verifying their destinations.
