# Projects page artwork

Both current body layers were recreated on 2026-09-30 using the built-in OpenAI image generation tool. They are optimized transparent 900 × 1350 WebP images, sharing the same full-body open-palms pose.

## Normal anime character

`goutam-presenting.webp` uses `public/me2.jpeg` as the facial identity reference and the supplied anime storyboard as style inspiration. The figure has cel shading, an olive-beige hoodie, charcoal cargo trousers, and off-white sneakers. The complete prompt is in `goutam-presenting.prompt.txt`.

## Silver technology body

`goutam-mesh.webp` was edited from the new normal character to preserve its pose, scale, composition, and silhouette. Its pearl-silver surface has restrained topology, coral connection nodes, and eight technology symbols. The complete prompt is in `goutam-mesh.prompt.txt`.

## Layer interaction

The images are superimposed. `src/scripts/liquid-reveal.js` models a hand disturbing still water: movement leaves a narrow directional wake and low outward ripples across the project stage. Hovering without moving creates no pool; holding still lets all motion settle. Path crossings use the strongest segment rather than adding volume. `src/scripts/liquid-surface.js` renders shallow surface normals, gentle Snell refraction capped below one pixel, and restrained coral/amber light. Ripples are visible beside the body too. Canvas resolution is capped, rendering pauses offscreen, and a sampled Canvas 2D version provides a fallback. The full-layer toggle works on touch devices and with reduced motion.

## Unused draft

`technology-mesh.webp` is the original sphere draft and is not referenced by the site.
