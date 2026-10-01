const stage = document.querySelector('#stage');
const canvas = document.querySelector('#scene-canvas');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const motionToggle = document.querySelector('#motion-toggle');
const dockLinks = [...document.querySelectorAll('[data-dock-section]')];
const contactFooter = document.querySelector('#contact');
let dockSection = '';
let dockActive = 0;
let dockPosition = 0;
function updateDock(active, position) {
  dockActive = active;
  dockPosition = position;
  const atFooter = contactFooter && contactFooter.getBoundingClientRect().top <= window.innerHeight * .65;
  const section = atFooter ? 'contact' : active === 5 ? 'projects' : active > 0 ? 'about' : 'home';
  if (section === dockSection) return;
  dockSection = section;
  dockLinks.forEach(link => {
    const current = link.dataset.dockSection === section;
    link.classList.toggle('is-current', current);
    if (current) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
}

if (stage && canvas) {
  if (reducedMotion) {
    motionToggle.hidden = false;
    motionToggle.addEventListener('click', () => {
      motionToggle.hidden = true;
      launchStory();
    }, { once: true });
  } else {
    launchStory();
  }
}

function launchStory() {
  startStory().catch((error) => {
    console.error('Portfolio animation could not start:', error);
    if (document.documentElement.classList.contains('motion-ready')) return;
    document.documentElement.classList.remove('motion-ready');
    stage.querySelectorAll('.beat, .gallery, .project-card, .burst-piece, .scene-media').forEach((element) => element.removeAttribute('style'));
    const gallery = stage.querySelector('.gallery');
    gallery.inert = false;
    gallery.removeAttribute('aria-hidden');
    stage.querySelectorAll('.beat').forEach((element) => element.removeAttribute('aria-hidden'));
  });
}

async function startStory() {
  const media = stage.querySelector('.scene-media');
  const journey = stage.closest('.journey');
  const gallery = stage.querySelector('.gallery');
  const cards = [...stage.querySelectorAll('.project-card')];
  const beats = [...stage.querySelectorAll('.beat')];
  const impactRing = stage.querySelector('.impact-ring');
  const progressFill = document.querySelector('#progress-fill');
  const ctx2d = canvas.getContext('2d', { alpha: true });
  if (!ctx2d) return;

  const FRAME_TOTAL = 80;
  const imageCache = new Map();
  let desiredFrame = 0;
  let drawnFrame = -1;
  let viewportWidth = 0;
  let viewportHeight = 0;
  let lastDrawnImage;
  let destroyed = false;
  let context;
  const controller = new AbortController();
  const frameUrl = (index) => `/frames/${String(index).padStart(3, '0')}.webp`;

  function loadFrame(index) {
    if (index < 0 || index >= FRAME_TOTAL || imageCache.has(index)) return;
    const image = new Image();
    image.decoding = 'async';
    image.onload = () => {
      if (!destroyed && (index === Math.floor(desiredFrame) || index === Math.ceil(desiredFrame) || drawnFrame < 0)) drawFrame(desiredFrame);
    };
    image.onerror = () => imageCache.delete(index);
    image.src = frameUrl(index);
    imageCache.set(index, image);
  }

  function loadNearby(index) {
    const offsets = [0, 1, -1, 2, -2, 3, -3, 4, 5, 6, 7, 8];
    offsets.forEach((offset) => loadFrame(index + offset));
    if (index % 8 === 0) {
      for (const cachedIndex of imageCache.keys()) {
        if (Math.abs(cachedIndex - index) > 22) imageCache.delete(cachedIndex);
      }
    }
  }

  function resizeCanvas() {
    viewportWidth = Math.max(1, media.clientWidth);
    viewportHeight = Math.max(1, media.clientHeight);
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(viewportWidth * ratio);
    canvas.height = Math.round(viewportHeight * ratio);
    ctx2d.setTransform(ratio, 0, 0, ratio, 0, 0);
    ctx2d.imageSmoothingEnabled = true;
    ctx2d.imageSmoothingQuality = 'high';
    drawnFrame = -1;
    // A resize clears the backing buffer. Retain the visible image while the
    // new scroll position's exact frame is still loading.
    if (lastDrawnImage) paintImage(lastDrawnImage, desiredFrame);
    drawFrame(desiredFrame);
  }

  function drawFrame(index) {
    desiredFrame = Math.max(0, Math.min(FRAME_TOTAL - 1, Number(index)));
    const frameIndex = Math.round(desiredFrame);
    loadNearby(frameIndex);
    const source = imageCache.get(frameIndex);
    // Keep the last complete frame until this exact frame has decoded. Drawing
    // one frame at a time avoids the ghosted edges caused by crossfading poses.
    if (!source?.complete || !source.naturalWidth || !viewportWidth || !viewportHeight) return;
    if (drawnFrame === frameIndex) return;

    paintImage(source, desiredFrame);
    document.documentElement.classList.add('frames-ready');
    lastDrawnImage = source;
    drawnFrame = frameIndex;
  }

  function paintImage(source, index) {
    const mobile = viewportWidth < 650;
    const scale = Math.max(viewportWidth / source.naturalWidth, viewportHeight / source.naturalHeight);
    const drawWidth = source.naturalWidth * scale;
    const drawHeight = source.naturalHeight * scale;
    const mobilePan = Math.max(0, Math.min(1, (index - 60) / 19));
    const sourceCenter = mobile ? 830 - mobilePan * 30 : 430;
    const x = Math.max(viewportWidth - drawWidth, Math.min(0, viewportWidth / 2 - sourceCenter * scale));
    const y = (viewportHeight - drawHeight) / 2;
    ctx2d.clearRect(0, 0, viewportWidth, viewportHeight);
    ctx2d.globalCompositeOperation = 'source-over';
    ctx2d.globalAlpha = 1;
    ctx2d.drawImage(source, x, y, drawWidth, drawHeight);
  }

  // Only the opening frames are fetched at startup. Later frames follow the playhead.
  for (let index = 0; index < 7; index++) loadFrame(index);
  document.documentElement.classList.add('motion-ready');
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas, { passive: true, signal: controller.signal });

  const journeyTop = () => window.scrollY + journey.getBoundingClientRect().top;
  const scrollRange = () => Math.max(1, journey.offsetHeight - stage.offsetHeight);
  const progress = () => Math.max(0, Math.min(1, (window.scrollY - journeyTop()) / scrollRange()));
  const starts = [0, 1.22, 2.56, 3.83, 4.94, 5.82];
  function updateFrameFromScroll() {
    const time = progress() * 8;
    drawFrame(Math.min(1, time / 5.65) * (FRAME_TOTAL - 1));
    updateDock(dockActive, dockPosition);
  }
  window.addEventListener('scroll', updateFrameFromScroll, { passive: true, signal: controller.signal });
  window.addEventListener('resize', updateFrameFromScroll, { passive: true, signal: controller.signal });

  // The frame sequence also has a native scroll driver. If GSAP cannot load,
  // the story still progresses instead of staying on the opening image.
  function updateFallback() {
    const position = progress();
    const time = position * 8;
    const active = starts.reduce((found, start, index) => time >= start ? index : found, 0);
    updateFrameFromScroll();
    beats.forEach((beat, index) => {
      beat.style.visibility = index === active ? 'visible' : 'hidden';
      beat.style.opacity = index === active ? '1' : '0';
      beat.setAttribute('aria-hidden', String(index !== active));
    });
    media.style.opacity = time >= 5.82 ? '0' : '1';
    gallery.style.visibility = active === 5 ? 'visible' : 'hidden';
    gallery.style.opacity = active === 5 ? '1' : '0';
    gallery.inert = active !== 5;
    gallery.setAttribute('aria-hidden', String(active !== 5));
    cards.forEach((card) => {
      card.style.visibility = active === 5 ? 'visible' : 'hidden';
      card.style.opacity = active === 5 ? '1' : '0';
    });
    progressFill.style.transform = `scaleX(${position})`;
    updateDock(active, position);
  }
  window.addEventListener('scroll', updateFallback, { passive: true, signal: controller.signal });
  document.querySelectorAll('[data-jump]').forEach((link) => link.addEventListener('click', (event) => {
    event.preventDefault();
    const point = Number(link.dataset.jump);
    window.scrollTo({ top: journeyTop() + point * scrollRange(), behavior: 'smooth' });
  }, { signal: controller.signal }));
  updateFallback();

  const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
    import('gsap'),
    import('gsap/ScrollTrigger'),
  ]);
  gsap.registerPlugin(ScrollTrigger);
  beats.forEach((beat) => { beat.style.visibility = ''; beat.style.opacity = ''; });
  gallery.style.visibility = '';
  gallery.style.opacity = '';
  media.style.opacity = '';
  cards.forEach((card) => { card.style.visibility = ''; card.style.opacity = ''; });

  gsap.set(beats.slice(1), { autoAlpha: 0, y: 22 });
  gsap.set(gallery, { autoAlpha: 0 });
  gsap.set(cards, { autoAlpha: 0 });
  gsap.set(impactRing, { autoAlpha: 0, scale: .1 });
  gallery.inert = true;
  gallery.setAttribute('aria-hidden', 'true');

  context = gsap.context(() => {
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: journey,
        start: 'top top',
        end: () => `+=${scrollRange()}`,
        scrub: .32,
        invalidateOnRefresh: true,
      },
    });
    gsap.set(media, { transformOrigin: '54% 52%' });

    timeline.to(media, { scale: 1.01, xPercent: -.5, rotation: .1, duration: 1.3, ease: 'none' }, 0);
    timeline.to(media, { scale: 1, xPercent: .5, rotation: -.1, duration: 1.4, ease: 'none' }, 1.3);
    timeline.to(media, { scale: 1.02, xPercent: -.4, rotation: .15, duration: 1.4, ease: 'none' }, 2.7);
    timeline.to(media, { scale: 1, xPercent: .35, rotation: -.1, duration: 1.5, ease: 'none' }, 4.1);

    timeline.to(beats[0], { autoAlpha: 0, y: -20, duration: .25 }, 1.16);
    showBeat(timeline, beats[1], 1.22, 2.56);
    showBeat(timeline, beats[2], 2.56, 3.83);
    showBeat(timeline, beats[3], 3.83, 4.94);
    showBeat(timeline, beats[4], 4.94, 5.82);

    const stageBounds = stage.getBoundingClientRect();
    const impactX = stageBounds.width * .51;
    const impactY = stageBounds.height * .43;
    const targetOffsets = cards.map((card) => {
      const bounds = card.getBoundingClientRect();
      return {
        x: impactX - (bounds.left - stageBounds.left + bounds.width / 2),
        y: impactY - (bounds.top - stageBounds.top + bounds.height / 2),
      };
    });
    gsap.set(cards, { transformOrigin: '50% 50%', transformPerspective: 900 });
    timeline.fromTo(impactRing, { scale: .1, autoAlpha: 0 }, {
      scale: 18, autoAlpha: .56, duration: .32, ease: 'power2.out',
    }, 5.62);
    timeline.to(impactRing, { autoAlpha: 0, scale: 22, duration: .24, ease: 'power1.out' }, 5.9);
    timeline.to(media, { autoAlpha: 0, duration: .26, ease: 'power1.out' }, 5.7);
    timeline.to(gallery, { autoAlpha: 1, duration: .2, ease: 'power2.out' }, 5.78);
    timeline.fromTo(cards, {
      x: (index) => targetOffsets[index].x,
      y: (index) => targetOffsets[index].y,
      rotation: (index) => [-10, 8, -7, 11][index],
      scale: .16,
      autoAlpha: 0,
      filter: 'blur(5px)',
    }, {
      x: 0,
      y: -140,
      rotation: (index) => [-7, 6, -5, 8][index],
      scale: .82,
      autoAlpha: 1,
      filter: 'blur(0px)',
      duration: .38,
      stagger: .055,
      ease: 'power3.out',
    }, 5.78);
    timeline.to(cards, {
      y: 0,
      rotation: 0,
      scale: 1,
      duration: .5,
      stagger: .13,
      ease: 'bounce.out',
    }, 6.14);
    timeline.to({ hold: 0 }, { hold: 1, duration: 1.2 }, 6.8);

    function updateStoryState() {
      const time = timeline.time();
      const active = starts.reduce((found, start, index) => time >= start ? index : found, 0);
      progressFill.style.transform = `scaleX(${timeline.progress()})`;
      updateDock(active, timeline.progress());
      beats.forEach((beat, index) => beat.setAttribute('aria-hidden', String(index !== active)));
      const galleryReady = time >= 5.82;
      gallery.inert = !galleryReady;
      gallery.setAttribute('aria-hidden', String(!galleryReady));
    }
    timeline.eventCallback('onUpdate', updateStoryState);
    updateStoryState();
  }, stage);
  ScrollTrigger.refresh();
  window.removeEventListener('scroll', updateFallback);
  const initialJump = { '#home': 0, '#about': .18, '#skills': .34, '#projects': .8 }[window.location.hash];
  if (initialJump !== undefined) {
    window.scrollTo({ top: journeyTop() + initialJump * scrollRange(), behavior: 'instant' });
    ScrollTrigger.update();
  } else if (window.location.hash === '#contact') {
    contactFooter.scrollIntoView({ behavior: 'instant', block: 'start' });
    ScrollTrigger.update();
  }
  updateFrameFromScroll();

  function showBeat(timeline, element, enter, exit) {
    timeline.fromTo(element, { autoAlpha: 0, y: 24, filter: 'blur(7px)', scale: .985 }, { autoAlpha: 1, y: 0, filter: 'blur(0px)', scale: 1, duration: .3, ease: 'power2.out' }, enter);
    timeline.to(element, { autoAlpha: 0, y: -20, filter: 'blur(5px)', scale: .99, duration: .26 }, exit);
  }

  const cleanup = () => {
    destroyed = true;
    controller.abort();
    context?.revert();
    imageCache.clear();
    lastDrawnImage = undefined;
  };
  // Back/forward cache restores this same document and its script instances.
  // Destroy only pages that the browser is actually discarding.
  window.addEventListener('pagehide', (event) => {
    if (!event.persisted) cleanup();
  }, { signal: controller.signal });
  window.addEventListener('pageshow', (event) => {
    if (!event.persisted || destroyed) return;
    resizeCanvas();
    ScrollTrigger.refresh();
    updateFrameFromScroll();
  }, { signal: controller.signal });
  document.addEventListener('astro:before-swap', cleanup, { once: true });
}
