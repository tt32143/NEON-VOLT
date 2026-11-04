import * as THREE from 'three';
import vertexShader from './shaders/showroom.vert?raw';
import fragmentShader from './shaders/showroom.frag?raw';

export function createShowroom(scene, floorMaterial) {
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(50,50), floorMaterial);
  floor.rotation.x = -Math.PI/2;
  floor.position.y = -0.02;
  floor.receiveShadow = true;
  floor.name = 'Reflective showroom floor';
  scene.add(floor);

  const platform = new THREE.Group();
  platform.name = 'Rotating display platform';
  const disk = new THREE.Mesh(new THREE.CylinderGeometry(3.15,3.15,0.18,96), new THREE.MeshStandardMaterial({
    color:0x111b2a, metalness:0.78, roughness:0.25
  }));
  disk.position.y = 0.08; disk.receiveShadow = true; disk.castShadow = true;
  platform.add(disk);

  const ringGeometry = new THREE.TorusGeometry(3.0,0.035,12,128);
  const ringMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uColorA: { value: new THREE.Color('#ff234c') },
      uColorB: { value: new THREE.Color('#28b9ff') }
    },
    vertexShader, fragmentShader, transparent:true, depthWrite:false
  });
  const ring = new THREE.Mesh(ringGeometry, ringMaterial);
  ring.rotation.x = Math.PI/2;
  ring.position.y = 0.19;
  ring.name = 'Animated shader energy ring';
  platform.add(ring);

  // Concentric floor guide rings and a subtle grid.
  const guide = new THREE.GridHelper(40, 40, 0x38506c, 0x1a2a40);
  guide.position.y = 0.005;
  guide.name = 'Technical floor grid';
  scene.add(guide);
  scene.add(platform);
  return { floor, platform, ring, guide };
}
