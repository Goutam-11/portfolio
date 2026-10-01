import gsap from 'gsap';
import { createLiquidReveal } from './liquid-reveal.js';

const stage = document.querySelector('#project-stage');

if (stage) {
  const portrait = stage.querySelector('.presenter-figure');
  const mesh = stage.querySelector('.presenter-mesh');
  const toggle = document.querySelector('#mesh-toggle');
  const bubbles = [...stage.querySelectorAll('.project-bubble')];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const controller = new AbortController();
  let showFullMesh = false;
  const liquid = reducedMotion ? null : createLiquidReveal(stage, portrait, mesh, stage.querySelector('.presenter-liquid'), controller.signal);

  toggle.addEventListener('click', () => {
    showFullMesh = !showFullMesh;
    portrait.classList.toggle('mesh-visible', showFullMesh);
    liquid?.setEnabled(!showFullMesh);
    toggle.setAttribute('aria-pressed', String(showFullMesh));
    toggle.innerHTML = showFullMesh
      ? 'Show illustration <span class="text-accent" aria-hidden="true">↗</span>'
      : 'Reveal the mesh <span class="text-accent" aria-hidden="true">↗</span>';
  }, { signal: controller.signal });

  const animations = [];
  let stageVisible = true;
  const syncPlayback = () => animations.forEach(animation => {
    if (stageVisible && !document.hidden) animation.resume();
    else animation.pause();
  });
  const visibilityObserver = new IntersectionObserver(([entry]) => {
    stageVisible = entry.isIntersecting;
    syncPlayback();
  });
  visibilityObserver.observe(stage);
  document.addEventListener('visibilitychange', syncPlayback, { signal: controller.signal });
  if (!reducedMotion) {
    bubbles.forEach((bubble, index) => {
      const float = gsap.to(bubble, {
        y: index % 2 ? -12 : -17,
        rotation: index % 2 ? 1.1 : -1.1,
        duration: 3 + index * .26,
        delay: index * .18,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
      animations.push(float);
      bubble.addEventListener('pointerenter', () => {
        float.pause();
        gsap.to(bubble, { scale: 1.05, duration: .3, ease: 'power3.out' });
      }, { signal: controller.signal });
      bubble.addEventListener('pointerleave', () => {
        gsap.to(bubble, { scale: 1, duration: .36, ease: 'power3.out', onComplete: syncPlayback });
      }, { signal: controller.signal });
      bubble.addEventListener('focus', () => float.pause(), { signal: controller.signal });
      bubble.addEventListener('blur', syncPlayback, { signal: controller.signal });
    });
  }

  window.addEventListener('pageshow', syncPlayback, { signal: controller.signal });
  window.addEventListener('pagehide', (event) => {
    if (event.persisted) {
      animations.forEach(animation => animation.pause());
      return;
    }
    controller.abort();
    liquid?.destroy();
    visibilityObserver.disconnect();
    animations.forEach((animation) => animation.kill());
    gsap.killTweensOf(bubbles);
  }, { signal: controller.signal });
}
