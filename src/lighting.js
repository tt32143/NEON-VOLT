import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

export function setupLighting(renderer, scene) {
  const pmrem = new THREE.PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const env = pmrem.fromScene(room, 0.04);
  scene.environment = env.texture;
  room.dispose();
  pmrem.dispose();

  const ambient = new THREE.AmbientLight(0x91a9cc, 0.55);
  ambient.name = 'Ambient fill';
  scene.add(ambient);

  const key = new THREE.DirectionalLight(0xffe5df, 3.0);
  key.position.set(4, 8, 5);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.camera.left = -8; key.shadow.camera.right = 8;
  key.shadow.camera.top = 8; key.shadow.camera.bottom = -8;
  key.shadow.bias = -0.00015;
  key.name = 'Directional key light';
  scene.add(key);

  const spot = new THREE.SpotLight(0x4d9dff, 150, 22, Math.PI / 5, 0.45, 1.4);
  spot.position.set(-2, 7, -4);
  spot.target.position.set(0, 0, 0);
  spot.castShadow = true;
  spot.shadow.mapSize.set(1024, 1024);
  spot.name = 'Blue showroom spotlight';
  scene.add(spot, spot.target);

  const fill = new THREE.PointLight(0x4d9dff, 18, 14);
  fill.position.set(4, 2.2, -4);
  fill.name = 'Cool side fill';
  scene.add(fill);

  const redRim = new THREE.PointLight(0xff2548, 32, 10);
  redRim.position.set(-4, 2, 2);
  redRim.name = 'Red rim light';
  scene.add(redRim);

  return { ambient, key, spot, redRim, fill };
}
