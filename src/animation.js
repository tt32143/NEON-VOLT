export function createAnimation({ platform, ringMaterial, lights }) {
  let elapsed = 0;

  return function updateAnimation(delta) {
    // Delta time keeps motion consistent across refresh rates. Clamp large tab-resume jumps.
    const dt = Math.min(Math.max(delta, 0), 0.05);
    elapsed += dt;
    const easing = 0.5 - 0.5 * Math.cos(Math.min(elapsed * 0.22, Math.PI));

    // The display can be paused without stopping the shader or showroom lighting.
    if (platform.userData.autoRotate !== false) {
      platform.rotation.y += dt * 0.18;
      platform.position.y = 0.015 * Math.sin(elapsed * 1.2) * easing;
    }
    ringMaterial.uniforms.uTime.value = elapsed;
    const rimBase = lights.redRim.userData.baseIntensity ?? 32;
    lights.redRim.intensity = rimBase * (0.88 + 0.12 * Math.sin(elapsed * 1.8));
  };
}
