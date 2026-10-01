import gsap from 'gsap';

const stage = document.querySelector('#id-stage');
if (stage) {
  const card = document.querySelector('#id-gesture');
  const rig = document.querySelector('#id-rig');
  const turn = document.querySelector('#id-turn');
  const front = turn.querySelector('.id-front');
  const back = turn.querySelector('.id-back');
  const status = document.querySelector('#id-status');
  const svg = stage.querySelector('svg');
  const leftStrap = svg.querySelector('#strap-left');
  const rightStrap = svg.querySelector('#strap-right');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const controller = new AbortController();
  const signal = controller.signal;
  const state = { x: 0, y: 0, rx: 0, ry: 0, rz: -4 };
  const goal = { ...state };
  const velocity = { x: 0, y: 0, rx: 0, ry: 0, rz: 0 };
  let width = 600;
  let height = 650;
  let top = 150;
  let flipped = false;
  let pointer = null;
  let moved = false;
  let suppressClick = false;
  let visible = true;
  let awake = false;
  let time = 0;
  let flipTween;
  const clamp = gsap.utils.clamp;

  function render() {
    gsap.set(rig, { x: state.x, y: state.y, rotationX: state.rx, rotationY: state.ry, rotationZ: state.rz });
    rig.style.setProperty('--shine-x', `${50 + state.ry * 1.3}%`);
    rig.style.setProperty('--shine-y', `${35 - state.rx * 1.5}%`);
    const endX = width / 2 + state.x + state.rz * .45;
    const endY = top - 27 + state.y;
    const ripple = reducedMotion.matches ? 0 : Math.sin(time * 1.45) * 6;
    const bend = state.x * .42 + state.rz * 1.1 + velocity.x * .12 + ripple;
    leftStrap.setAttribute('d', `M${width * .31} -45 C${width * .26 + bend} ${endY * .4} ${endX - 62 + bend} ${endY * .65} ${endX} ${endY}`);
    rightStrap.setAttribute('d', `M${endX} ${endY} C${endX + 73 + bend} ${endY * .68} ${width * .79 + bend * .6} ${endY * .3} ${width * .72} -45`);
  }

  function step(_time, deltaMs) {
    const dt = Math.min(deltaMs / 1000, .032);
    time += dt;
    for (const key of Object.keys(state)) {
      const idle = !pointer && key === 'rz' ? Math.sin(time * 1.15) * 1.1 : 0;
      velocity[key] += ((goal[key] + idle - state[key]) * 90 - velocity[key] * 12) * dt;
      state[key] += velocity[key] * dt;
    }
    render();
  }

  function sync() {
    const shouldAnimate = visible && !document.hidden && !reducedMotion.matches;
    if (shouldAnimate && !awake) { gsap.ticker.add(step); awake = true; }
    if (!shouldAnimate && awake) { gsap.ticker.remove(step); awake = false; }
    if (reducedMotion.matches) {
      flipTween?.kill();
      gsap.set(turn, { rotationY: flipped ? 180 : 0 });
      Object.keys(velocity).forEach(key => { velocity[key] = 0; });
      Object.assign(state, goal);
      render();
    }
  }

  function measure() {
    width = stage.clientWidth;
    height = stage.clientHeight;
    top = card.offsetTop;
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    render();
  }

  function settle() {
    Object.assign(goal, { x: 0, y: 0, rx: 0, ry: 0, rz: -4 });
    if (reducedMotion.matches) { Object.assign(state, goal); render(); }
  }

  function flip() {
    flipped = !flipped;
    flipTween?.kill();
    flipTween = gsap.to(turn, { rotationY: flipped ? 180 : 0, duration: reducedMotion.matches ? 0 : .7, ease: 'power2.inOut' });
    card.setAttribute('aria-pressed', String(flipped));
    front.setAttribute('aria-hidden', String(flipped));
    back.setAttribute('aria-hidden', String(!flipped));
    status.textContent = flipped ? 'Back of the card.' : 'Front of the card.';
  }

  function shake() {
    if (reducedMotion.matches) {
      status.textContent = 'Motion is reduced. Use Flip card to view the reverse.';
      return;
    }
    settle();
    velocity.x = 170;
    velocity.y = -28;
    velocity.rz = 115;
    velocity.ry = -95;
    status.textContent = 'Card shaken.';
  }

  card.addEventListener('pointerdown', event => {
    if (event.button !== 0) return;
    pointer = { id: event.pointerId, x: event.clientX, y: event.clientY };
    moved = false;
    suppressClick = false;
    card.setPointerCapture(event.pointerId);
  }, { signal });

  card.addEventListener('pointermove', event => {
    if (pointer) {
      const dx = event.clientX - pointer.x;
      const dy = event.clientY - pointer.y;
      moved ||= Math.hypot(dx, dy) > 5;
      goal.x = clamp(-75, 75, dx * .3);
      goal.y = clamp(-25, 35, dy * .18);
      goal.rx = clamp(-28, 28, -dy * .2);
      goal.ry = clamp(-48, 48, dx * .27);
      goal.rz = clamp(-12, 12, -4 + dx * .04);
    } else if (event.pointerType === 'mouse') {
      const bounds = card.getBoundingClientRect();
      goal.rx = -((event.clientY - bounds.top) / bounds.height - .5) * 14;
      goal.ry = ((event.clientX - bounds.left) / bounds.width - .5) * 22;
    }
    if (reducedMotion.matches) { Object.assign(state, goal); render(); }
  }, { signal });

  function release(event) {
    if (!pointer || event.pointerId !== pointer.id) return;
    if (card.hasPointerCapture(pointer.id)) card.releasePointerCapture(pointer.id);
    suppressClick = moved;
    pointer = null;
    settle();
  }
  card.addEventListener('pointerup', release, { signal });
  card.addEventListener('pointercancel', release, { signal });
  card.addEventListener('lostpointercapture', () => { if (pointer) { pointer = null; suppressClick = true; settle(); } }, { signal });
  card.addEventListener('pointerleave', () => { if (!pointer) settle(); }, { signal });
  card.addEventListener('click', event => {
    if (suppressClick && event.detail !== 0) { suppressClick = false; return; }
    suppressClick = false;
    flip();
  }, { signal });
  card.addEventListener('keydown', event => {
    const increments = { ArrowLeft: ['ry', -12], ArrowRight: ['ry', 12], ArrowUp: ['rx', -10], ArrowDown: ['rx', 10] };
    if (increments[event.key]) {
      event.preventDefault();
      const [key, delta] = increments[event.key];
      goal[key] = clamp(-40, 40, goal[key] + delta);
      if (reducedMotion.matches) { Object.assign(state, goal); render(); }
    } else if (event.key === 'Home') { event.preventDefault(); settle(); }
  }, { signal });
  document.querySelector('#id-flip').addEventListener('click', flip, { signal });
  document.querySelector('#id-shake').addEventListener('click', shake, { signal });
  document.querySelector('#id-reset').addEventListener('click', () => {
    pointer = null;
    settle();
    if (flipped) flip();
    status.textContent = 'Card reset to its front.';
  }, { signal });

  const resizeObserver = new ResizeObserver(measure);
  resizeObserver.observe(stage);
  const intersectionObserver = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
  intersectionObserver.observe(stage);
  document.addEventListener('visibilitychange', sync, { signal });
  reducedMotion.addEventListener('change', sync, { signal });
  window.addEventListener('pageshow', () => { measure(); sync(); }, { signal });
  window.addEventListener('pagehide', event => {
    gsap.ticker.remove(step);
    awake = false;
    if (event.persisted) return;
    controller.abort();
    resizeObserver.disconnect();
    intersectionObserver.disconnect();
    flipTween?.kill();
  }, { signal });
  measure();
  sync();
}
