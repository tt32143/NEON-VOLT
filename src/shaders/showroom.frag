uniform float uTime;
uniform vec3 uColorA;
uniform vec3 uColorB;
varying float vPulse;
void main() {
  float glow = 0.55 + 0.45 * sin(uTime * 2.0 + vPulse * 6.2831);
  vec3 color = mix(uColorA, uColorB, vPulse);
  color *= 0.75 + 0.45 * glow;
  gl_FragColor = vec4(color, 0.88);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
