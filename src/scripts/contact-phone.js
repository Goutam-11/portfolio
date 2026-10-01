import gsap from 'gsap';

const scene = document.querySelector('#contact-phone-scene');
if (scene) {
  const phone = document.querySelector('#contact-phone');
  const content = document.querySelector('#phone-content');
  const sleep = document.querySelector('#phone-sleep');
  const power = document.querySelector('#phone-power');
  const status = document.querySelector('#phone-status');
  const clock = document.querySelector('#phone-clock');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const controller = new AbortController();
  const signal = controller.signal;
  let awake = true;
  const tiltX = gsap.quickTo(phone, 'rotationX', { duration: .45, ease: 'power3.out' });
  const tiltY = gsap.quickTo(phone, 'rotationY', { duration: .45, ease: 'power3.out' });
  const tiltZ = gsap.quickTo(phone, 'rotationZ', { duration: .45, ease: 'power3.out' });

  function restore() {
    if (reducedMotion.matches) {
      tiltX.tween.pause();
      tiltY.tween.pause();
      tiltZ.tween.pause();
      gsap.set(phone, { rotationX: 0, rotationY: 0, rotationZ: 0 });
    } else {
      tiltX(0);
      tiltY(-5);
      tiltZ(2);
    }
    phone.style.setProperty('--light-x', '35%');
    phone.style.setProperty('--light-y', '15%');
  }

  scene.addEventListener('pointermove', event => {
    if (event.pointerType !== 'mouse' || reducedMotion.matches) return;
    const bounds = scene.getBoundingClientRect();
    const x = gsap.utils.clamp(-.5, .5, (event.clientX - bounds.left) / bounds.width - .5);
    const y = gsap.utils.clamp(-.5, .5, (event.clientY - bounds.top) / bounds.height - .5);
    tiltX(-y * 12);
    tiltY(x * 18);
    tiltZ(x * 3);
    phone.style.setProperty('--light-x', `${50 + x * 70}%`);
    phone.style.setProperty('--light-y', `${35 + y * 65}%`);
  }, { signal });
  scene.addEventListener('pointerleave', restore, { signal });
  scene.addEventListener('focusin', () => {
    if (reducedMotion.matches) { restore(); return; }
    tiltX(0);
    tiltY(0);
    tiltZ(0);
  }, { signal });

  function setAwake(next, focusApp = false) {
    awake = next;
    content.inert = !awake;
    content.setAttribute('aria-hidden', String(!awake));
    sleep.hidden = awake;
    phone.classList.toggle('is-asleep', !awake);
    power.setAttribute('aria-pressed', String(awake));
    power.textContent = awake ? 'Sleep screen' : 'Wake screen';
    status.textContent = awake ? 'Phone screen is awake. Contact apps are available.' : 'Phone screen is asleep. Activate Wake screen to restore the apps.';
    if (awake && focusApp) content.querySelector('a').focus({ preventScroll: true });
  }
  power.addEventListener('click', () => setAwake(!awake), { signal });
  document.querySelector('#phone-wake').addEventListener('click', () => setAwake(true, true), { signal });

  function updateClock() {
    if (document.hidden) return;
    clock.textContent = new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date());
  }
  let clockInterval;
  function startClock() {
    clearInterval(clockInterval);
    updateClock();
    clockInterval = setInterval(updateClock, 60000);
  }
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) clearInterval(clockInterval);
    else startClock();
  }, { signal });
  reducedMotion.addEventListener('change', restore, { signal });
  window.addEventListener('pagehide', event => {
    clearInterval(clockInterval);
    if (event.persisted) return;
    controller.abort();
    tiltX.tween.kill();
    tiltY.tween.kill();
    tiltZ.tween.kill();
  }, { signal });
  window.addEventListener('pageshow', () => { restore(); startClock(); }, { signal });
  restore();
  startClock();
}
