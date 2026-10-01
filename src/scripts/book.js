import { projects } from '../data/projects.js';
import gsap from 'gsap';

const dialog = document.querySelector('#casebook');

if (dialog) {
  const content = document.querySelector('#book-content');
  const previous = document.querySelector('#book-prev');
  const next = document.querySelector('#book-next');
  const pageLabel = document.querySelector('#book-page-label');
  const pageTotal = document.querySelector('#book-page-total');
  const pageFill = document.querySelector('#book-progress-fill');
  const bookIndex = document.querySelector('#book-index');
  const soundButton = document.querySelector('#book-sound');
  let pages = [];
  let spread = 0;
  let opener;
  let isTurning = false;
  let soundEnabled = true;
  let audioContext;

  const escapeHTML = (value) => String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
  const label = 'mb-4 text-[9px] font-bold tracking-[.16em] text-accent uppercase';
  const title = 'mb-4 text-[clamp(26px,3vw,44px)] leading-[1.02] font-semibold tracking-[-.035em]';
  const copy = 'max-w-[46ch] text-[12px] leading-[1.75] text-[#55534d]';
  const pageClass = 'book-leaf-page flex h-full min-h-0 flex-col';
  const illustration = (project, extra = '') => `<figure class="book-image min-h-0 overflow-hidden bg-[#e9e7df] ${extra}"><img class="h-full w-full object-contain" src="${escapeHTML(project.image)}" alt="${escapeHTML(project.caption)}" width="1400" height="710" decoding="async" /><figcaption class="mt-2 text-[8px] tracking-[.08em] text-[#77736b]">${escapeHTML(project.caption)}</figcaption></figure>`;
  const ruledLines = '<div class="book-writing-lines" aria-hidden="true"></div>';
  const textPage = (eyebrow, heading, paragraphs, extra = '') => `<section class="${pageClass} ${extra}"><div class="min-h-0 flex-1 overflow-y-auto"><p class="${label}">${eyebrow}</p><h2 class="${title}">${heading}</h2>${paragraphs}</div>${ruledLines}</section>`;

  function buildPages(project, index) {
    const number = String(index + 1).padStart(2, '0');
    const paragraph = value => `<p class="${copy} mt-3">${escapeHTML(value)}</p>`;
    const coverNote = project.imageKind === 'screenshot' ? 'Project screenshot' : project.caption;
    const result = [
      `<section class="${pageClass} book-cover-page"><div class="book-cover-art">${illustration(project)}</div><div class="book-cover-copy"><p class="${label}">CASE FILE ${number} · ${escapeHTML(project.category)}</p><h2 class="mb-3 font-serif text-[clamp(32px,4vw,58px)] leading-[.95] tracking-[-.035em]">${escapeHTML(project.name)}</h2><p class="text-[10px] leading-relaxed text-[#66635b]">${escapeHTML(project.subtitle)}</p><span class="mt-3 block text-[8px] tracking-[.1em] text-[#77736b]">${escapeHTML([project.status, coverNote].filter(Boolean).join(' · '))}</span></div></section>`,
      textPage('Overview', 'An idea, made useful', paragraph(project.summary) + paragraph(project.purpose)),
    ];
    if (project.problem && project.problem !== project.purpose) {
      result.push(textPage('Context', escapeHTML(project.problemHeading), paragraph(project.problem)));
    }
    if (project.approach && project.approach !== project.purpose) {
      result.push(textPage('Approach', 'How it comes together', project.approach.split('\n\n').map(paragraph).join('')));
    }
    const contributions = project.contributions || project.decisions;
    for (let start = 0; start < contributions.length; start += 3) {
      const list = contributions.slice(start, start + 3).map(item => `<li class="border-b border-[#d9d5ca] py-3 text-[12px] leading-relaxed text-[#55534d]">${escapeHTML(item)}</li>`).join('');
      result.push(textPage('My contribution', start ? 'Connecting the pieces' : project.status === 'Design stage' ? 'What I designed' : 'What I built', `<ul class="border-t border-[#d9d5ca]">${list}</ul>`));
    }
    const features = project.features || [];
    for (let start = 0; start < features.length; start += 3) {
      const list = features.slice(start, start + 3).map(item => `<li class="border-b border-[#d9d5ca] py-3 text-[12px] leading-relaxed text-[#55534d]">${escapeHTML(item)}</li>`).join('');
      result.push(textPage('Feature highlights', 'Inside the workflow', `<ul class="border-t border-[#d9d5ca]">${list}</ul>`));
    }
    const stack = project.stack.map(tag => `<span class="border-b border-accent px-1 pb-1 text-[10px]">${escapeHTML(tag)}</span>`).join('');
    const links = project.links.map(link => `<a class="border-b border-ink pb-1 text-[11px] hover:text-accent" href="${escapeHTML(link.url)}" target="_blank" rel="noreferrer">${escapeHTML(link.label)} ↗</a>`).join('');
    result.push(textPage('Materials', project.stackLabel || (project.stack.length ? 'Tools and references' : 'Project references'), `<div class="mb-5 flex flex-wrap gap-x-4 gap-y-3">${stack}</div>${project.notes ? paragraph(project.notes) : ''}${links ? `<div class="mt-5 flex flex-wrap gap-4">${links}</div>` : ''}`));
    const gallery = project.gallery.length ? project.gallery : [project];
    gallery.forEach((capture, captureIndex) => {
      result.push(`<section class="${pageClass}"><p class="${label}">${project.imageKind === 'screenshot' ? 'Inside the project' : 'Visual study'} · ${String(captureIndex + 1).padStart(2, '0')}</p><h2 class="${title}">${escapeHTML(capture.caption)}</h2>${illustration(capture, 'book-screenshot flex-1')}${ruledLines}</section>`);
    });
    return result;
  }

  function spreadBounds(index) {
    return index === 0 ? { left: -1, right: 0 } : { left: index * 2 - 1, right: index * 2 };
  }

  const isMobileBook = () => window.matchMedia('(max-width: 650px)').matches;
  const positionCount = () => isMobileBook() ? pages.length : Math.ceil((pages.length + 1) / 2);

  function renderPage(index) {
    if (index < 0 || index >= pages.length) return '<div class="book-blank-page" aria-hidden="true"></div>';
    return pages[index];
  }

  function createPage(index, side, labelText) {
    const element = document.createElement('div');
    element.className = `book-leaf-static book-${side}-page`;
    element.setAttribute('aria-label', labelText);
    element.innerHTML = renderPage(index);
    return element;
  }

  function createSpread(index) {
    const element = document.createElement('div');
    element.className = 'book-spread';
    element.setAttribute('aria-live', 'polite');
    if (isMobileBook()) {
      element.classList.add('book-single');
      element.append(createPage(index, 'right', `Page ${index + 1}`));
      return element;
    }
    const bounds = spreadBounds(index);
    element.append(createPage(bounds.left, 'left', 'Left page'));
    element.append(createPage(bounds.right, 'right', 'Right page'));
    const spine = document.createElement('div');
    spine.className = 'book-spine-shadow';
    spine.setAttribute('aria-hidden', 'true');
    element.append(spine);
    return element;
  }

  function paintSpread() {
    content.replaceChildren(createSpread(spread));
    content.scrollTop = 0;
  }

  function decodeImages(container) {
    return Promise.all([...container.querySelectorAll('img')].map((image) => image.decode().catch(() => {})));
  }

  function updateControls() {
    const totalSpreads = positionCount();
    pageLabel.textContent = String(spread + 1).padStart(2, '0');
    pageTotal.textContent = String(totalSpreads).padStart(2, '0');
    pageFill.style.width = `${((spread + 1) / totalSpreads) * 100}%`;
    previous.disabled = spread === 0 || isTurning;
    next.disabled = spread === totalSpreads - 1 || isTurning;
    previous.setAttribute('aria-disabled', String(previous.disabled));
    next.setAttribute('aria-disabled', String(next.disabled));
  }

  function playPageSound() {
    if (!soundEnabled) return;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    audioContext ??= new AudioContextClass();
    if (audioContext.state === 'suspended') void audioContext.resume().catch(() => {});

    const duration = .22;
    const buffer = audioContext.createBuffer(1, Math.ceil(audioContext.sampleRate * duration), audioContext.sampleRate);
    const samples = buffer.getChannelData(0);
    for (let index = 0; index < samples.length; index++) {
      const progress = index / samples.length;
      const envelope = Math.sin(Math.PI * progress) ** 1.5;
      samples[index] = (Math.random() * 2 - 1) * envelope;
    }
    const source = audioContext.createBufferSource();
    const filter = audioContext.createBiquadFilter();
    const gain = audioContext.createGain();
    source.buffer = buffer;
    filter.type = 'bandpass';
    filter.frequency.value = 1450;
    filter.Q.value = .45;
    gain.gain.setValueAtTime(.0001, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(.035, audioContext.currentTime + .035);
    gain.gain.exponentialRampToValueAtTime(.0001, audioContext.currentTime + duration);
    source.connect(filter).connect(gain).connect(audioContext.destination);
    source.start();
    source.stop(audioContext.currentTime + duration);
  }

  async function turn(direction) {
    const mobile = isMobileBook();
    const totalSpreads = positionCount();
    const target = Math.max(0, Math.min(totalSpreads - 1, spread + direction));
    if (target === spread || isTurning) return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const bounds = mobile ? { left: -1, right: spread } : spreadBounds(spread);
    const nextBounds = mobile ? { left: -1, right: target } : spreadBounds(target);
    const currentPosition = spread;
    const frontIndex = mobile ? currentPosition : direction > 0 ? bounds.right : bounds.left;
    const backIndex = mobile ? target : direction > 0 ? nextBounds.left : nextBounds.right;
    const isNext = direction > 0;
    isTurning = true;
    updateControls();
    playPageSound();
    const currentSpread = content.querySelector('.book-spread');
    const oldLeft = mobile ? null : currentSpread?.querySelector('.book-left-page');
    const oldRight = currentSpread?.querySelector('.book-right-page');
    const targetBounds = spreadBounds(target);
    const destinationLeft = mobile ? null : createPage(targetBounds.left, 'left', 'Left page');
    const destinationRight = createPage(mobile ? target : targetBounds.right, 'right', mobile ? `Page ${target + 1}` : 'Right page');
    const leaf = document.createElement('div');
    leaf.className = `book-turning-leaf ${mobile ? 'turn-mobile' : ''} ${isNext ? 'turn-forward' : 'turn-backward'}`;
    leaf.style.transformOrigin = isNext ? 'left center' : 'right center';
    leaf.style.setProperty('--fold-shadow', '.14');
    const frontSide = mobile ? '' : isNext ? 'face-page-right' : 'face-page-left';
    const backSide = mobile ? '' : isNext ? 'face-page-left' : 'face-page-right';
    leaf.innerHTML = `<div class="book-leaf-face book-leaf-front ${frontSide}">${renderPage(frontIndex)}</div><div class="book-leaf-face book-leaf-back ${backSide}">${renderPage(backIndex)}</div>`;
    await Promise.all([decodeImages(destinationRight), decodeImages(destinationLeft || document.createElement('div')), decodeImages(leaf)]);
    if (!dialog.open) {
      isTurning = false;
      return;
    }
    if (reducedMotion) {
      spread = target;
      content.replaceChildren(createSpread(target));
      isTurning = false;
      updateControls();
      return;
    }

    // Put only the destination page beneath the leaf that is turning. Leave
    // the opposite page untouched until the sheet has crossed the spine.
    // This keeps the visible spread stable throughout the animation.
    if (mobile) {
      oldRight?.replaceWith(destinationRight);
    } else if (isNext) {
      oldRight?.replaceWith(destinationRight);
    } else {
      oldLeft?.replaceWith(destinationLeft);
    }
    currentSpread?.append(leaf);

    const finish = () => {
      if (!mobile && isNext) oldLeft?.replaceWith(destinationLeft);
      if (!mobile && !isNext) oldRight?.replaceWith(destinationRight);
      leaf.remove();
      spread = target;
      isTurning = false;
      updateControls();
    };
    const turnAnimation = gsap.timeline({ onComplete: finish });
    turnAnimation.to(leaf, {
      rotationY: isNext ? -180 : 180,
      z: 1,
      duration: .78,
      ease: 'power1.inOut',
    }, 0);
    turnAnimation.to(leaf, {
      '--fold-shadow': .36,
      duration: .22,
      yoyo: true,
      repeat: 1,
      ease: 'sine.inOut',
    }, 0);
  }

  document.querySelectorAll('.project-open').forEach((button) => button.addEventListener('click', async () => {
    const project = projects.find((item) => item.id === button.dataset.project);
    if (!project) return;
    opener = button;
    const preload = new Image();
    preload.src = project.image;
    try { await preload.decode(); } catch { /* Keep the page usable if artwork is unavailable. */ }
    pages = buildPages(project, projects.indexOf(project));
    spread = 0;
    bookIndex.textContent = project.index;
    document.querySelector('#book-dialog-title').textContent = `${project.name} case study`;
    paintSpread();
    updateControls();
    dialog.showModal();
    dialog.querySelector('.book-close').focus();
  }));
  dialog.querySelector('.book-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => opener?.focus());
  dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
  previous.addEventListener('click', () => turn(-1));
  next.addEventListener('click', () => turn(1));
  soundButton.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    soundButton.setAttribute('aria-pressed', String(soundEnabled));
    soundButton.setAttribute('aria-label', soundEnabled ? 'Mute page-turn sound' : 'Enable page-turn sound');
    soundButton.textContent = soundEnabled ? 'SOUND ON' : 'SOUND OFF';
  });
  dialog.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') { event.preventDefault(); turn(1); }
    if (event.key === 'ArrowLeft') { event.preventDefault(); turn(-1); }
  });
  let touchStart = null;
  content.addEventListener('touchstart', (event) => { touchStart = event.changedTouches[0].clientX; }, { passive: true });
  content.addEventListener('touchend', (event) => {
    if (touchStart === null) return;
    const delta = event.changedTouches[0].clientX - touchStart;
    if (Math.abs(delta) > 55) turn(delta < 0 ? 1 : -1);
    touchStart = null;
  }, { passive: true });
  window.addEventListener('resize', () => {
    if (!dialog.open || isTurning) return;
    spread = Math.min(spread, positionCount() - 1);
    paintSpread();
    updateControls();
  }, { passive: true });
}
