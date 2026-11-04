uniform float uTime;
varying float vPulse;
void main() {
  vec3 transformed = position;
  float wave = sin(position.x * 7.0 + uTime * 2.0) * 0.035;
  transformed.y += wave;
  vPulse = 0.5 + 0.5 * sin(position.x * 4.0 - uTime * 2.5);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
}
