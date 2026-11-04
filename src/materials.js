import * as THREE from 'three';

export function createMaterials() {
  const bodyColor = createPaintColorMap();
  const bodyNormal = createPaintNormalMap();
  const body = new THREE.MeshPhysicalMaterial({
    color: 0xe52d45, map: bodyColor, metalness: 0.82, roughness: 0.22,
    normalMap: bodyNormal, normalScale: new THREE.Vector2(0.045, 0.045),
    clearcoat: 1, clearcoatRoughness: 0.12, envMapIntensity: 1.55
  });
  const glass = new THREE.MeshPhysicalMaterial({
    color: 0x172a3d, metalness: 0.25, roughness: 0.08,
    transmission: 0.08, transparent: true, opacity: 0.92,
    envMapIntensity: 1.5
  });
  const tire = new THREE.MeshStandardMaterial({ color: 0x11151c, roughness: 0.88, metalness: 0.02 });
  const rim = new THREE.MeshStandardMaterial({ color: 0xb9c5d4, roughness: 0.24, metalness: 0.92 });
  const darkMetal = new THREE.MeshStandardMaterial({ color: 0x202b3a, roughness: 0.35, metalness: 0.78 });
  const carbon = new THREE.MeshStandardMaterial({ color: 0x101722, roughness: 0.42, metalness: 0.62 });
  const brake = new THREE.MeshStandardMaterial({ color: 0x7d2630, roughness: 0.52, metalness: 0.72 });
  const caliper = new THREE.MeshStandardMaterial({ color: 0xe52d45, roughness: 0.34, metalness: 0.58 });
  const headlamp = new THREE.MeshPhysicalMaterial({ color: 0xc9e8ff, emissive: 0x5a9dff, emissiveIntensity: 1.4, roughness: 0.12, metalness: 0.15, transmission: 0.12 });
  const emissiveRed = new THREE.MeshBasicMaterial({ color: 0xff2548 });
  const floor = createFloorMaterial();
  return { body, glass, tire, rim, darkMetal, carbon, brake, caliper, headlamp, emissiveRed, floor };
}

// A subtle tangent-space normal texture gives the clear-coated paint fine surface breakup.
function createPaintColorMap() {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');
  // Neutral high-value base lets the selected body material color remain dominant.
  ctx.fillStyle = '#f7f7f7';
  ctx.fillRect(0, 0, size, size);
  // Fine, low-contrast metallic flakes create a subtle automotive paint response.
  for (let i = 0; i < 1500; i++) {
    const x = (i * 73) % size;
    const y = (i * 151 + (i % 17) * 11) % size;
    const alpha = 0.025 + ((i * 19) % 10) / 250;
    ctx.fillStyle = `rgba(255,255,255,${alpha})`;
    ctx.fillRect(x, y, 1, 1);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 1);
  texture.anisotropy = 4;
  texture.needsUpdate = true;
  return texture;
}

function createPaintNormalMap() {
  const size = 128;
  const data = new Uint8Array(size * size * 4);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4;
      const grain = Math.sin(x * 1.73 + y * 0.37) * 2.2 + Math.cos(y * 2.11 - x * 0.29) * 1.8;
      data[i] = Math.max(0, Math.min(255, 128 + grain));
      data[i + 1] = Math.max(0, Math.min(255, 128 + Math.sin(x * 0.41 + y * 1.91) * 2.0));
      data[i + 2] = 255;
      data[i + 3] = 255;
    }
  }
  const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(3, 2);
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  return texture;
}

// Procedural canvas textures avoid external assets and provide explicit UV/color-space setup.
function createFloorMaterial() {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 256;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#202a39'; ctx.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 256; i += 16) {
    ctx.strokeStyle = i % 32 === 0 ? '#354256' : '#293547';
    ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 256); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(256, i); ctx.stroke();
  }
  const colorMap = new THREE.CanvasTexture(canvas);
  colorMap.colorSpace = THREE.SRGBColorSpace;
  colorMap.wrapS = colorMap.wrapT = THREE.RepeatWrapping;
  colorMap.repeat.set(12, 12);
  colorMap.generateMipmaps = true;
  colorMap.minFilter = THREE.LinearMipmapLinearFilter;
  colorMap.magFilter = THREE.LinearFilter;

  const normalMap = createFloorNormalMap();
  return new THREE.MeshStandardMaterial({
    color: 0xffffff, map: colorMap, normalMap, roughness: 0.28, metalness: 0.48
  });
}

// Procedural tangent-space normal map derived from a repeating low-amplitude height field.
function createFloorNormalMap() {
  const size = 128;
  const data = new Uint8Array(size * size * 4);
  const heightAt = (x, y) =>
    Math.sin((x / size) * Math.PI * 16) * 0.035 +
    Math.cos((y / size) * Math.PI * 16) * 0.035 +
    Math.sin(((x + y) / size) * Math.PI * 24) * 0.012;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx = heightAt((x + 1) % size, y) - heightAt((x - 1 + size) % size, y);
      const dy = heightAt(x, (y + 1) % size) - heightAt(x, (y - 1 + size) % size);
      const nx = -dx * 18;
      const ny = -dy * 18;
      const length = Math.sqrt(nx * nx + ny * ny + 1);
      const i = (y * size + x) * 4;
      data[i] = Math.round((nx / length * 0.5 + 0.5) * 255);
      data[i + 1] = Math.round((ny / length * 0.5 + 0.5) * 255);
      data[i + 2] = Math.round((1 / length * 0.5 + 0.5) * 255);
      data[i + 3] = 255;
    }
  }
  const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(12, 12);
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  return texture;
}
