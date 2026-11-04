import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { createMaterials } from './materials.js';
import { createCar } from './car.js';
import { setupLighting } from './lighting.js';
import { createShowroom } from './showroom.js';
import { setupInteraction } from './interaction.js';
import { createAnimation } from './animation.js';
import './style.css';

const viewport = document.querySelector('.viewport');
const loading = document.querySelector('#loading');
const tooltip = document.querySelector('#tooltip');

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0b1220);
scene.fog = new THREE.Fog(0x0b1220, 15, 38);

const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
camera.position.set(7.6, 4.3, 8.4);

let renderer;
try {
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
} catch (error) {
  console.error('WebGL initialization failed:', error);
  loading.textContent = 'WEBGL IS NOT AVAILABLE — ENABLE HARDWARE ACCELERATION OR TRY A MODERN BROWSER.';
  loading.style.display = 'grid';
  throw error;
}
// Cap device pixel ratio to keep antialiasing crisp without excessive GPU fill cost.
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.domElement.setAttribute('aria-label', 'Interactive 3D electric vehicle');
renderer.domElement.setAttribute('role', 'img');
viewport.appendChild(renderer.domElement);
renderer.domElement.addEventListener('webglcontextlost', event => {
  event.preventDefault();
  loading.textContent = 'GRAPHICS CONTEXT PAUSED — RELOAD THE PAGE TO RESTORE THE SHOWROOM.';
  loading.style.display = 'grid';
});
renderer.domElement.addEventListener('webglcontextrestored', () => {
  loading.style.display = 'none';
});

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.06;
controls.minDistance = 5;
controls.maxDistance = 17;
controls.maxPolarAngle = Math.PI * 0.48;
controls.target.set(0, 0.8, 0);

const materials = createMaterials();
const lights = setupLighting(renderer, scene);
const showroom = createShowroom(scene, materials.floor);
const car = createCar(materials);
showroom.platform.add(car);
car.position.y = 0.07;

const clock = new THREE.Clock();
const updateAnimation = createAnimation({
  platform: showroom.platform, ringMaterial: showroom.ring.material, lights
});
const interaction = setupInteraction({ camera, renderer, scene, car, tooltip });
lights.redRim.userData.baseIntensity = lights.redRim.intensity;

function resize() {
  const width = Math.max(viewport.clientWidth, 1);
  const height = Math.max(viewport.clientHeight, 1);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height, false);
}
const resizeObserver = new ResizeObserver(resize);
resizeObserver.observe(viewport);
window.addEventListener('beforeunload', () => resizeObserver.disconnect(), { once: true });
resize();

const colorNames = {
  '#e52d45':'VOLT RED', '#1769d2':'ELECTRIC BLUE',
  '#d8dde5':'ARCTIC SILVER', '#171c27':'OBSIDIAN BLACK'
};
document.querySelectorAll('.swatch').forEach(button => {
  button.setAttribute('aria-pressed', String(button.classList.contains('active')));
  button.addEventListener('click', () => {
    document.querySelectorAll('.swatch').forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
    button.classList.add('active');
    button.setAttribute('aria-pressed', 'true');
    materials.body.color.set(button.dataset.color);
    document.querySelector('#paint-name').textContent = colorNames[button.dataset.color];
  });
});

document.querySelectorAll('.mode').forEach(button => {
  button.setAttribute('aria-pressed', String(button.classList.contains('active')));
  button.addEventListener('click', () => {
    document.querySelectorAll('.mode').forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
    button.classList.add('active');
    button.setAttribute('aria-pressed', 'true');
    const mode = button.dataset.mode;
    lights.ambient.intensity = mode === 'night' ? 0.2 : mode === 'pulse' ? 0.75 : 0.55;
    lights.key.intensity = mode === 'night' ? 1.0 : mode === 'pulse' ? 3.8 : 3.0;
    lights.spot.intensity = mode === 'night' ? 220 : mode === 'pulse' ? 95 : 150;
    lights.fill.intensity = mode === 'night' ? 8 : mode === 'pulse' ? 26 : 18;
    lights.redRim.userData.baseIntensity = mode === 'night' ? 38 : mode === 'pulse' ? 48 : 32;
    lights.redRim.intensity = lights.redRim.userData.baseIntensity;
    scene.background.set(mode === 'night' ? 0x03060d : mode === 'pulse' ? 0x111b31 : 0x0b1220);
  });
});

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
showroom.platform.userData.autoRotate = !reduceMotion;
const rotateToggle = document.querySelector('#auto-rotate');
rotateToggle.checked = !reduceMotion;
if (reduceMotion) rotateToggle.setAttribute('aria-label', 'Auto rotation disabled because reduced motion is preferred');
rotateToggle.addEventListener('change', e => {
  showroom.platform.userData.autoRotate = e.target.checked;
});
document.querySelector('#show-grid').addEventListener('change', e => showroom.guide.visible = e.target.checked);
const cameraViews = {
  hero: new THREE.Vector3(7.6, 4.3, 8.4),
  front: new THREE.Vector3(8.8, 2.0, 0.001),
  side: new THREE.Vector3(0.001, 2.3, 9.5),
  top: new THREE.Vector3(0.001, 11.5, 0.001)
};
const cameraTarget = new THREE.Vector3(0, 0.8, 0);
let cameraTransition = null;
function setCameraView(view) {
  const destination = cameraViews[view] || cameraViews.hero;
  if (reduceMotion) {
    camera.position.copy(destination);
    controls.target.copy(cameraTarget);
    controls.update();
    cameraTransition = null;
    document.querySelectorAll('.camera-view').forEach(button => {
      const active = button.dataset.view === view;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    return;
  }
  cameraTransition = {
    startPosition: camera.position.clone(),
    endPosition: destination.clone(),
    startTarget: controls.target.clone(),
    endTarget: cameraTarget.clone(),
    elapsed: 0,
    duration: 0.65
  };
  document.querySelectorAll('.camera-view').forEach(button => {
    const active = button.dataset.view === view;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
}
document.querySelectorAll('.camera-view').forEach(button => {
  button.setAttribute('aria-pressed', String(button.classList.contains('active')));
  button.addEventListener('click', () => setCameraView(button.dataset.view));
});
document.querySelector('#focus-car').addEventListener('click', () => setCameraView('hero'));
document.querySelector('#reset-camera').addEventListener('click', () => setCameraView('hero'));
window.addEventListener('keydown', event => {
  if (event.altKey || event.ctrlKey || event.metaKey) return;
  const target = event.target;
  if (target instanceof HTMLElement && (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))) return;
  if (event.key === 'Escape') { interaction.clearSelection(); return; }
  const viewByKey = { '1': 'hero', '2': 'front', '3': 'side', '4': 'top' };
  if (viewByKey[event.key]) setCameraView(viewByKey[event.key]);
});

// If the user starts orbiting manually during a preset transition, hand control back immediately.
renderer.domElement.addEventListener('pointerdown', () => { cameraTransition = null; });

// The platform's optional rotation is independent from camera orbit.
let animationFrameId = 0;
function animate() {
  animationFrameId = requestAnimationFrame(animate);
  const delta = clock.getDelta();
  updateAnimation(delta);
  if (cameraTransition) {
    cameraTransition.elapsed = Math.min(cameraTransition.elapsed + delta, cameraTransition.duration);
    const t = cameraTransition.elapsed / cameraTransition.duration;
    const eased = t * t * (3 - 2 * t);
    camera.position.lerpVectors(cameraTransition.startPosition, cameraTransition.endPosition, eased);
    controls.target.lerpVectors(cameraTransition.startTarget, cameraTransition.endTarget, eased);
    if (t >= 1) cameraTransition = null;
  }
  controls.update();
  renderer.render(scene, camera);
}

// Stop the render loop in a background tab to avoid wasting GPU/CPU time.
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = 0;
  } else if (animationFrameId === 0) {
    clock.getDelta(); // discard time accumulated while the tab was hidden
    animate();
  }
});
animate();
loading.style.display = 'none';
