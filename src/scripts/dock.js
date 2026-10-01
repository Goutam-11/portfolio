import gsap from 'gsap';

const dock = document.querySelector('.dock-nav');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (dock && !reducedMotion && window.matchMedia('(hover: hover)').matches) {
  const controller = new AbortController();
  const items = [...dock.querySelectorAll('.dock-link')].map(link => {
    const keycap = link.querySelector('.dock-keycap');
    return {
      link, keycap,
      scale: gsap.quickTo(keycap, 'scale', { duration: .22, ease: 'power3.out' }),
      y: gsap.quickTo(keycap, 'y', { duration: .22, ease: 'power3.out' }),
      tilt: gsap.quickTo(keycap, 'rotationX', { duration: .22, ease: 'power3.out' }),
    };
  });
  items.forEach(item => gsap.set(item.keycap, { transformPerspective: 450, transformOrigin: '50% 100%' }));
  const reset = () => items.forEach(item => { item.scale(1); item.y(0); item.tilt(0); });
  dock.addEventListener('pointermove', event => {
    if (event.pointerType !== 'mouse') return;
    items.forEach(item => {
      const bounds = item.link.getBoundingClientRect();
      const distance = Math.abs(event.clientX - bounds.left - bounds.width / 2);
      const influence = Math.exp(-distance * distance / 3800);
      item.scale(1 + influence * .045);
      item.y(-influence * 2.5);
      item.tilt(influence * 2);
    });
  }, { signal: controller.signal });
  dock.addEventListener('pointerleave', reset, { signal: controller.signal });
  dock.addEventListener('focusin', reset, { signal: controller.signal });
  window.addEventListener('pagehide', event => {
    reset();
    if (event.persisted) return;
    controller.abort();
    items.forEach(item => { item.scale.tween.kill(); item.y.tween.kill(); item.tilt.tween.kill(); });
  }, { signal: controller.signal });
}
