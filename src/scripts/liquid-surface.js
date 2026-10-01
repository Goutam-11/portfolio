const vertexSource = `
attribute vec2 aPosition;
varying vec2 vUv;
void main() {
  vUv = aPosition * .5 + .5;
  gl_Position = vec4(aPosition, 0., 1.);
}`;

const fragmentSource = `
precision highp float;
varying vec2 vUv;
uniform vec2 uSize;
uniform vec4 uImage;
uniform vec4 uWakes[16];
uniform vec4 uWakeData[16];
uniform vec4 uRipples[8];
uniform float uTime;
uniform sampler2D uBase;
uniform sampler2D uMesh;

vec4 figureAt(sampler2D image, vec2 point) {
  vec2 uv = (point - uImage.xy) / uImage.zw;
  if (uv.x < 0. || uv.x > 1. || uv.y < 0. || uv.y > 1.) return vec4(0.);
  vec4 color = texture2D(image, vec2(uv.x, 1. - uv.y));
  return vec4(color.rgb * color.a, color.a);
}

void main() {
  vec2 point = vec2(vUv.x, 1. - vUv.y) * uSize;
  float field = 0.;
  vec2 gradient = vec2(0.);
  for (int i = 0; i < 16; i++) {
    vec4 wake = uWakes[i];
    vec2 segment = wake.zw - wake.xy;
    float along = clamp(dot(point - wake.xy, segment) / max(dot(segment, segment), 1.), 0., 1.);
    vec2 delta = point - wake.xy - segment * along;
    float width2 = max(uWakeData[i].x * uWakeData[i].x, 1.);
    float contribution = uWakeData[i].y * exp(-2.4 * dot(delta, delta) / width2);
    // Max, rather than addition, keeps the wake flat even where paths cross.
    if (contribution > field) {
      field = contribution;
      gradient = contribution * -4.8 * delta / width2;
    }
  }
  float wave = 0.;
  vec2 waveGradient = vec2(0.);
  for (int i = 0; i < 8; i++) {
    vec4 ripple = uRipples[i];
    vec2 delta = point - ripple.xy;
    float distance = length(delta);
    float front = distance - (8. + ripple.z * 52.);
    float envelope = exp(-front * front / 110.) * ripple.w * exp(-ripple.z * 2.4);
    wave += sin(front * .32) * envelope;
    float slope = (cos(front * .32) * .32 - sin(front * .32) * 2. * front / 110.) * envelope;
    waveGradient += delta / max(distance, 1.) * slope;
  }
  float coverage = smoothstep(.08, .4, field);
  if (coverage < .002 && abs(wave) < .004) { gl_FragColor = vec4(0.); return; }

  // A shallow surface disturbed by a hand, without a thick liquid lens.
  vec3 normal = normalize(vec3(-gradient * 3. + waveGradient * .6, 1.));
  vec3 ray = refract(vec3(0., 0., -1.), normal, 1. / 1.333);
  float thickness = 1.8 * coverage + abs(wave) * .8;
  vec2 displacement = clamp(ray.xy / max(abs(ray.z), .1) * thickness, vec2(-.7), vec2(.7));
  vec2 bentPoint = point + displacement;
  float softness = .35 + abs(wave) * .25;

  vec4 mesh = figureAt(uMesh, bentPoint);
  vec4 softMesh = (figureAt(uMesh, bentPoint + vec2(softness, 0.))
                + figureAt(uMesh, bentPoint - vec2(softness, 0.))
                + figureAt(uMesh, bentPoint + vec2(0., softness))
                + figureAt(uMesh, bentPoint - vec2(0., softness))) * .25;
  mesh = mix(mesh, softMesh, abs(wave) * .15);
  vec4 base = figureAt(uBase, bentPoint);
  vec4 image = mix(base, mesh, smoothstep(.08, .25, field));

  vec3 lightDirection = normalize(vec3(-.65 + sin(uTime * .55) * .18, -.7, 1.2));
  float specular = pow(max(dot(reflect(-lightDirection, normal), vec3(0., 0., 1.)), 0.), 46.);
  float broadLight = pow(max(dot(normal, lightDirection), 0.), 6.);
  float caustic = abs(wave);
  vec3 coral = vec3(.925, .298, .204);
  vec3 amber = vec3(1., .77, .47);
  vec3 pearl = vec3(1., .94, .85);
  vec3 water = mix(coral, amber, broadLight * .3 + caustic * .5);
  water = mix(water, pearl, max(0., wave) * .25 + specular * .3);
  float waterAlpha = coverage * (.04 + specular * .035) + abs(wave) * .26;

  // Thin ripples remain visible beside the body, without a filled round puddle.
  float imageAlpha = image.a * coverage;
  vec3 imageColor = image.rgb / max(image.a, .001);
  imageColor = mix(imageColor, water, .035 + caustic * .025);
  float alpha = imageAlpha + waterAlpha * (1. - imageAlpha);
  vec3 color = (imageColor * imageAlpha + water * waterAlpha * (1. - imageAlpha)) / max(alpha, .001);
  gl_FragColor = vec4(color, alpha);
}`;

// WebGL stays inside an offscreen surface. The visible 2D canvas preserves a
// predictable fallback and lets the rest of the page remain ordinary HTML.
export function createLiquidSurface(baseImage, meshImage) {
  const surface = document.createElement('canvas');
  const gl = surface.getContext('webgl', { alpha: true, premultipliedAlpha: false, antialias: false, preserveDrawingBuffer: true });
  if (!gl) return null;
  const compile = (type, source) => {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) { gl.deleteShader(shader); return null; }
    return shader;
  };
  const vertex = compile(gl.VERTEX_SHADER, vertexSource);
  const fragment = compile(gl.FRAGMENT_SHADER, fragmentSource);
  if (!vertex || !fragment) return null;
  const program = gl.createProgram();
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;
  gl.useProgram(program);
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
  const position = gl.getAttribLocation(program, 'aPosition');
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
  const locations = Object.fromEntries(['uSize', 'uImage', 'uWakes[0]', 'uWakeData[0]', 'uRipples[0]', 'uTime', 'uBase', 'uMesh'].map(name => [name, gl.getUniformLocation(program, name)]));
  const textures = [gl.createTexture(), gl.createTexture()];
  const wakePositions = new Float32Array(16 * 4);
  const wakeData = new Float32Array(16 * 4);
  const rippleData = new Float32Array(8 * 4);
  let available = true;
  surface.addEventListener('webglcontextlost', event => { event.preventDefault(); available = false; });

  return {
    resize(width, height, ratio, imageBounds) {
      surface.width = Math.round(width * ratio);
      surface.height = Math.round(height * ratio);
      gl.viewport(0, 0, surface.width, surface.height);
      gl.uniform2f(locations.uSize, width, height);
      gl.uniform4f(locations.uImage, imageBounds.x, imageBounds.y, imageBounds.width, imageBounds.height);
    },
    upload() {
      [baseImage, meshImage].forEach((image, index) => {
        gl.activeTexture(gl.TEXTURE0 + index);
        gl.bindTexture(gl.TEXTURE_2D, textures[index]);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      });
      gl.uniform1i(locations.uBase, 0);
      gl.uniform1i(locations.uMesh, 1);
    },
    draw(wakes, ripples, time) {
      if (!available) return null;
      wakePositions.fill(0);
      wakeData.fill(0);
      rippleData.fill(0);
      wakes.slice(0, 16).forEach((wake, index) => {
        wakePositions.set([wake.x, wake.y, wake.endX, wake.endY], index * 4);
        wakeData.set([wake.width, wake.amount, wake.age, 0], index * 4);
      });
      ripples.slice(0, 8).forEach((ripple, index) => rippleData.set([ripple.x, ripple.y, ripple.age, ripple.energy], index * 4));
      gl.uniform4fv(locations['uWakes[0]'], wakePositions);
      gl.uniform4fv(locations['uWakeData[0]'], wakeData);
      gl.uniform4fv(locations['uRipples[0]'], rippleData);
      gl.uniform1f(locations.uTime, time);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      return surface;
    },
    destroy() {
      textures.forEach(texture => gl.deleteTexture(texture));
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    },
  };
}
