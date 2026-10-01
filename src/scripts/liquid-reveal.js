import gsap from 'gsap';
import { createLiquidSurface } from './liquid-surface.js';

// Edit these RGB colors to change the water without changing the illustrations.
const WATER = {
  tint: [236, 76, 52],
  highlight: [255, 196, 119],
  shadow: [162, 44, 37],
};

// Movement disturbs a still surface. Segment wakes reveal the second layer;
// low ripples travel outward, and an idle cursor leaves the water completely calm.
export function createLiquidReveal(stage, figure, image, canvas, signal) {
  const context = canvas.getContext('2d');
  if (!context) return { setEnabled() {}, destroy() {} };
  const baseImage = figure.querySelector('.presenter-art');
  const surface = createLiquidSurface(baseImage, image);
  canvas.dataset.renderer = surface ? 'webgl' : 'canvas';
  const mask = document.createElement('canvas');
  const maskContext = mask.getContext('2d');
  const texture = document.createElement('canvas');
  const textureContext = texture.getContext('2d');
  const rim = document.createElement('canvas');
  const rimContext = rim.getContext('2d');
  const gridWidth = 88;
  let width = 0, height = 0, ratio = 1, gridHeight = 132;
  let field, maskPixels, rimPixels;
  let frame = 0, previousTime = 0, lastDrop = 0, lastRipple = 0, visible = true, enabled = true;
  const imagesReady = () => [baseImage, image].every(asset => asset.complete && asset.naturalWidth > 0);
  let inside = false, ready = imagesReady();
  let energy = 0;
  const head = { x: 0, y: 0 };
  const pointer = { x: 0, y: 0 };
  const lastHead = { x: 0, y: 0 };
  const emitted = { x: 0, y: 0 };
  let wakes = [], ripples = [];
  const moveX = gsap.quickTo(head, 'x', { duration: .1, ease: 'power2.out' });
  const moveY = gsap.quickTo(head, 'y', { duration: .1, ease: 'power2.out' });

  function imageBounds() {
    const bounds = stage.getBoundingClientRect();
    const figureBounds = figure.getBoundingClientRect();
    const scale = Math.min(figureBounds.width / 900, figureBounds.height / 1350);
    return {
      x: figureBounds.left - bounds.left + (figureBounds.width - 900 * scale) / 2,
      y: figureBounds.top - bounds.top + figureBounds.height - 1350 * scale,
      width: 900 * scale,
      height: 1350 * scale,
    };
  }

  function updateTexture() {
    textureContext.clearRect(0, 0, texture.width, texture.height);
    if (!ready || !width) return;
    const bounds = imageBounds();
    textureContext.drawImage(image, bounds.x * ratio, bounds.y * ratio, bounds.width * ratio, bounds.height * ratio);
    surface?.upload();
  }

  function resize() {
    const bounds = stage.getBoundingClientRect();
    width = bounds.width;
    height = bounds.height;
    if (!width || !height) return;
    ratio = Math.min(window.devicePixelRatio || 1, 1.5, Math.sqrt(1200000 / (width * height)));
    canvas.width = texture.width = Math.round(width * ratio);
    canvas.height = texture.height = Math.round(height * ratio);
    gridHeight = Math.round(gridWidth * height / width);
    mask.width = rim.width = gridWidth;
    mask.height = rim.height = gridHeight;
    field = new Float32Array(gridWidth * gridHeight);
    maskPixels = maskContext.createImageData(gridWidth, gridHeight);
    rimPixels = rimContext.createImageData(gridWidth, gridHeight);
    surface?.resize(width, height, ratio, imageBounds());
    updateTexture();
  }

  function start(resetClock = true) {
    if (!frame && visible && enabled && ready && !document.hidden) {
      if (resetClock) previousTime = performance.now();
      frame = requestAnimationFrame(draw);
    }
  }

  function addWake(wake) {
    const sx = gridWidth / width;
    const sy = gridHeight / height;
    const reach = wake.width * 1.5;
    const left = Math.max(0, Math.floor((Math.min(wake.x, wake.endX) - reach) * sx));
    const right = Math.min(gridWidth, Math.ceil((Math.max(wake.x, wake.endX) + reach) * sx));
    const top = Math.max(0, Math.floor((Math.min(wake.y, wake.endY) - reach) * sy));
    const bottom = Math.min(gridHeight, Math.ceil((Math.max(wake.y, wake.endY) + reach) * sy));
    const vx = wake.endX - wake.x, vy = wake.endY - wake.y;
    const length2 = Math.max(vx * vx + vy * vy, 1);
    for (let row = top; row < bottom; row++) {
      for (let column = left; column < right; column++) {
        const px = column / sx - wake.x, py = row / sy - wake.y;
        const along = Math.max(0, Math.min(1, (px * vx + py * vy) / length2));
        const dx = px - vx * along, dy = py - vy * along;
        const value = Math.exp(-(dx * dx + dy * dy) * 2.4 / (wake.width * wake.width)) * wake.amount;
        // Use the strongest segment, so crossings never inflate into a blob.
        const index = row * gridWidth + column;
        field[index] = Math.max(field[index], value);
      }
    }
  }

  function draw(now) {
    frame = 0;
    if (!enabled || !visible || document.hidden) return;
    const dt = Math.max(.002, Math.min((now - previousTime) / 1000, .04));
    previousTime = now;
    const time = now / 1000;
    const dx = head.x - lastHead.x, dy = head.y - lastHead.y;
    const distance = Math.hypot(dx, dy);
    const speed = distance / dt;
    const targetEnergy = inside && speed > 18 ? Math.min(1, speed / 420) : 0;
    energy += (targetEnergy - energy) * Math.min(dt * (targetEnergy > energy ? 14 : 10), 1);
    if (inside && distance > .5 && now - lastDrop > 28) {
      wakes.push({ x: emitted.x, y: emitted.y, endX: head.x, endY: head.y, width: 30 + energy * 9, age: 0, initial: .7 + energy * .35 });
      emitted.x = head.x;
      emitted.y = head.y;
      if (wakes.length > 16) wakes.shift();
      lastDrop = now;
      if (now - lastRipple > 115) {
        ripples.push({ x: head.x, y: head.y, age: 0, energy: .35 + energy * .65 });
        if (ripples.length > 8) ripples.shift();
        lastRipple = now;
      }
    }
    lastHead.x = head.x;
    lastHead.y = head.y;
    wakes = wakes.filter(wake => wake.age < 1.05);
    for (const wake of wakes) {
      wake.age += dt;
      wake.amount = wake.initial * Math.pow(Math.max(0, 1 - wake.age / 1.05), 1.5);
    }
    ripples = ripples.filter(ripple => ripple.age < 1.35);
    ripples.forEach(ripple => { ripple.age += dt; });
    if (energy < .01) { emitted.x = head.x; emitted.y = head.y; }
    const active = energy > .01 || wakes.length || ripples.length;
    const refractedSurface = surface?.draw(wakes, ripples, time);
    if (refractedSurface) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(refractedSurface, 0, 0);
      if (active) start(false);
      else context.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }
    field.fill(0);
    wakes.forEach(addWake);
    for (let index = 0; index < field.length; index++) {
      const value = field[index];
      const edge = Math.max(0, Math.min(1, (value - .29) / .35));
      const alpha = edge * edge * (3 - 2 * edge);
      const pixel = index * 4;
      maskPixels.data[pixel] = maskPixels.data[pixel + 1] = maskPixels.data[pixel + 2] = 255;
      maskPixels.data[pixel + 3] = alpha * 255;
      // The field gradient acts as a surface normal. Moving light and crossed
      // waves refract through that surface, producing warm traveling caustics.
      const column = index % gridWidth;
      const row = Math.floor(index / gridWidth);
      const normalX = (field[index + (column < gridWidth - 1 ? 1 : 0)] - field[index - (column > 0 ? 1 : 0)]) * 2;
      const normalY = (field[index + (row < gridHeight - 1 ? gridWidth : 0)] - field[index - (row > 0 ? gridWidth : 0)]) * 2;
      const x = column * width / gridWidth;
      const y = row * height / gridHeight;
      const rayX = x + normalX * 4;
      const rayY = y + normalY * 4;
      const wave = Math.sin(rayX * .105 + rayY * .073 - time * 3.1)
        * Math.cos(rayY * .087 - rayX * .052 + time * 2.3);
      const caustic = Math.pow(Math.max(0, wave), 8);
      const edgeLight = Math.max(0, 1 - Math.abs(value - .58) * 5);
      const light = Math.min(1, caustic * 1.5 + Math.max(0, normalX * -.45 + normalY * -.6) * .35);
      const shade = Math.min(.45, Math.max(0, normalX * .6 + normalY * .4));
      for (let channel = 0; channel < 3; channel++) {
        const tint = WATER.tint[channel] + (WATER.shadow[channel] - WATER.tint[channel]) * shade;
        rimPixels.data[pixel + channel] = tint + (WATER.highlight[channel] - tint) * light;
      }
      let rippleLight = 0;
      for (const ripple of ripples) {
        const distance = Math.hypot(x - ripple.x, y - ripple.y);
        const front = distance - (8 + ripple.age * 52);
        rippleLight += Math.sin(front * .32) * Math.exp(-front * front / 110) * ripple.energy * Math.exp(-ripple.age * 2.4);
      }
      rimPixels.data[pixel + 3] = alpha * (13 + edgeLight * 13 + caustic * 22) + Math.abs(rippleLight) * 34;
    }
    maskContext.putImageData(maskPixels, 0, 0);
    rimContext.putImageData(rimPixels, 0, 0);
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.globalCompositeOperation = 'source-over';
    // Fine, continuous scanlines bend the source with the water's wave phase.
    // The displacement is bounded to preserve the character's registration.
    const band = 2 * ratio;
    for (let y = 0; y < canvas.height; y += band) {
      const bandHeight = Math.min(band, canvas.height - y);
      const offset = (Math.sin(y / ratio * .055 - time * 4.2)
        + Math.sin(y / ratio * .032 + time * 2.1) * .35) * .35 * ratio;
      context.drawImage(texture, 0, y, texture.width, bandHeight, offset, y, texture.width, bandHeight);
    }
    context.globalCompositeOperation = 'destination-in';
    context.drawImage(mask, 0, 0, canvas.width, canvas.height);
    // The fallback water surface also extends beyond the body's alpha.
    context.globalCompositeOperation = 'source-over';
    context.drawImage(rim, 0, 0, canvas.width, canvas.height);
    context.globalCompositeOperation = 'source-over';
    if (active) start(false);
    else context.clearRect(0, 0, canvas.width, canvas.height);
  }

  function follow(event) {
    if (event.pointerType !== 'mouse' || !enabled) return;
    if (event.target.closest('.project-bubble')) { inside = false; start(); return; }
    const bounds = stage.getBoundingClientRect();
    pointer.x = event.clientX - bounds.left;
    pointer.y = event.clientY - bounds.top;
    if (!inside) {
      head.x = lastHead.x = pointer.x;
      head.y = lastHead.y = pointer.y;
      emitted.x = pointer.x;
      emitted.y = pointer.y;
    }
    inside = true;
    moveX(pointer.x);
    moveY(pointer.y);
    start();
  }

  stage.addEventListener('pointerenter', follow, { signal });
  stage.addEventListener('pointermove', follow, { signal });
  stage.addEventListener('pointerleave', () => { inside = false; start(); }, { signal });
  [baseImage, image].forEach(asset => asset.addEventListener('load', () => { ready = imagesReady(); updateTexture(); start(); }, { signal }));
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(stage);
  resizeObserver.observe(figure);
  const visibilityObserver = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) start();
    else { cancelAnimationFrame(frame); frame = 0; }
  });
  visibilityObserver.observe(stage);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { cancelAnimationFrame(frame); frame = 0; }
    else start();
  }, { signal });
  window.addEventListener('pagehide', () => {
    inside = false;
    energy = 0;
    wakes = [];
    ripples = [];
    cancelAnimationFrame(frame);
    frame = 0;
    context.clearRect(0, 0, canvas.width, canvas.height);
  }, { signal });
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
      resize();
      start();
    }
  }, { signal });
  resize();

  return {
    setEnabled(value) {
      enabled = value;
      canvas.hidden = !value;
      inside = false;
      energy = 0;
      wakes = [];
      ripples = [];
      cancelAnimationFrame(frame);
      frame = 0;
      context.clearRect(0, 0, canvas.width, canvas.height);
    },
    destroy() {
      cancelAnimationFrame(frame);
      moveX.tween.kill();
      moveY.tween.kill();
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      surface?.destroy();
    },
  };
}
