import * as THREE from 'three';

function mesh(geometry, material, name, position, scale) {
  const object = new THREE.Mesh(geometry, material);
  object.name = name;
  if (position) object.position.set(...position);
  if (scale) object.scale.set(...scale);
  object.castShadow = true;
  object.receiveShadow = true;
  return object;
}

// A smooth, closed body shell built from cross-sections along the car's length.
// The front of the vehicle points toward +X; width is along Z.
function createBodyGeometry() {
  const stations = [
    [-2.22, 0.52, 0.17], [-2.02, 0.78, 0.29], [-1.55, 0.88, 0.34],
    [-0.95, 0.91, 0.34], [0.0, 0.91, 0.31], [0.85, 0.89, 0.30],
    [1.48, 0.82, 0.27], [1.92, 0.66, 0.21], [2.18, 0.36, 0.12]
  ];
  const radialSegments = 32;
  const vertices = [];
  const uvs = [];
  const indices = [];
  stations.forEach(([x, width, height], i) => {
    for (let j = 0; j <= radialSegments; j++) {
      const a = (j / radialSegments) * Math.PI * 2;
      // A slightly flattened lower half gives the shell a road-car stance.
      const sin = Math.sin(a);
      const y = 0.79 + sin * height * (sin < 0 ? 0.88 : 1.0);
      const z = Math.cos(a) * width;
      vertices.push(x, y, z);
      uvs.push(i / (stations.length - 1), j / radialSegments);
    }
  });
  for (let i = 0; i < stations.length - 1; i++) {
    for (let j = 0; j < radialSegments; j++) {
      const a = i * (radialSegments + 1) + j;
      const b = a + radialSegments + 1;
      indices.push(a, b, a + 1, a + 1, b, b + 1);
    }
  }
  // Close the front and rear ends with triangle fans.
  const frontCenter = vertices.length / 3;
  vertices.push(stations[0][0], 0.79, 0);
  uvs.push(0, 0.5);
  const rearCenter = vertices.length / 3;
  vertices.push(stations.at(-1)[0], 0.79, 0);
  uvs.push(1, 0.5);
  for (let j = 0; j < radialSegments; j++) {
    indices.push(frontCenter, j, j + 1);
    const last = (stations.length - 1) * (radialSegments + 1) + j;
    indices.push(rearCenter, last + 1, last);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function addWheel(car, x, z, index, materials) {
  const wheel = new THREE.Group();
  wheel.name = `Wheel ${index}`;
  wheel.position.set(x, 0.57, z);
  const tire = mesh(new THREE.CylinderGeometry(0.47, 0.47, 0.30, 48), materials.tire, 'Performance tire');
  tire.rotation.x = Math.PI / 2;
  wheel.add(tire);

  const rim = mesh(new THREE.CylinderGeometry(0.315, 0.315, 0.315, 48), materials.rim, 'Forged alloy rim');
  rim.rotation.x = Math.PI / 2;
  wheel.add(rim);
  const brake = mesh(new THREE.CylinderGeometry(0.245, 0.245, 0.325, 40), materials.brake, 'Ventilated brake disc');
  brake.rotation.x = Math.PI / 2;
  wheel.add(brake);
  const caliper = mesh(new THREE.BoxGeometry(0.13, 0.29, 0.12), materials.caliper, 'Performance brake caliper', [0.19, 0.02, 0.19]);
  wheel.add(caliper);

  // Small hub fasteners make the wheel face read as a machined assembly.
  for (let bolt = 0; bolt < 5; bolt++) {
    const angle = (bolt / 5) * Math.PI * 2;
    const fastener = mesh(new THREE.SphereGeometry(0.018, 8, 6), materials.darkMetal, 'Wheel locking fastener', [Math.cos(angle) * 0.115, Math.sin(angle) * 0.115, 0.177]);
    wheel.add(fastener);
  }

  // Ten slim spokes on both visible wheel faces.
  for (const face of [-1, 1]) {
    for (let i = 0; i < 10; i++) {
      const spoke = mesh(new THREE.BoxGeometry(0.065, 0.255, 0.035), materials.rim, 'Alloy wheel spoke', [0, 0, face * 0.17]);
      spoke.rotation.z = (i / 10) * Math.PI * 2;
      wheel.add(spoke);
    }
    const hub = mesh(new THREE.CylinderGeometry(0.085, 0.085, 0.34, 24), materials.darkMetal, 'Center-lock wheel hub', [0, 0, 0]);
    hub.rotation.x = Math.PI / 2;
    wheel.add(hub);
  }
  car.add(wheel);

  // Metallic arch trim visually frames the wheel opening.
  for (const side of [-1, 1]) {
    const arch = mesh(new THREE.TorusGeometry(0.505, 0.035, 10, 56), materials.darkMetal, 'Wheel arch trim', [x, 0.57, side * 0.925]);
    car.add(arch);
  }
}

export function createCar(materials) {
  const car = new THREE.Group();
  car.name = 'NV-01 Electric GT';

  car.add(mesh(createBodyGeometry(), materials.body, 'Sculpted aerodynamic body'));

  // Low panoramic canopy and roof create a continuous GT silhouette.
  const canopy = mesh(new THREE.SphereGeometry(1, 40, 24), materials.glass, 'Panoramic glass canopy', [-0.22, 1.31, 0], [1.22, 0.48, 0.70]);
  car.add(canopy);
  const roofSpine = mesh(new THREE.BoxGeometry(0.88, 0.045, 0.12), materials.body, 'Carbon roof spine', [-0.25, 1.77, 0]);
  car.add(roofSpine);

  // Flat underfloor battery enclosure: a key EV component, visible from low orbit angles.
  car.add(mesh(new THREE.BoxGeometry(2.85, 0.16, 1.48), materials.carbon, 'EV skateboard battery pack', [-0.05, 0.49, 0]));
  car.add(mesh(new THREE.BoxGeometry(1.55, 0.035, 1.12), materials.darkMetal, 'Battery cooling plate', [-0.05, 0.395, 0]));

  // Lower front intake and rear diffuser details.
  car.add(mesh(new THREE.BoxGeometry(0.12, 0.13, 1.16), materials.darkMetal, 'Front cooling intake', [2.02, 0.72, 0]));
  car.add(mesh(new THREE.BoxGeometry(0.10, 0.12, 0.82), materials.darkMetal, 'Rear diffuser channel', [-2.14, 0.61, 0]));

  // Front and rear aerodynamic elements.
  car.add(mesh(new THREE.BoxGeometry(0.72, 0.075, 1.95), materials.darkMetal, 'Front carbon splitter', [1.98, 0.51, 0]));
  car.add(mesh(new THREE.BoxGeometry(0.62, 0.10, 1.78), materials.darkMetal, 'Rear diffuser', [-2.05, 0.51, 0]));
  car.add(mesh(new THREE.BoxGeometry(0.12, 0.055, 1.72), materials.darkMetal, 'Rear active aero wing', [-2.05, 1.18, 0]));

  // Wheels sit outside the body so the car reads clearly from every orbit angle.
  [[-1.35, 0.96], [1.35, 0.96], [-1.35, -0.96], [1.35, -0.96]].forEach(([x, z], i) => addWheel(car, x, z, i + 1, materials));

  // Headlamp lenses and continuous LED signatures.
  const lampMaterial = materials.emissiveRed;
  car.add(mesh(new THREE.BoxGeometry(0.10, 0.085, 0.58), materials.headlamp, 'Left matrix headlamp', [1.88, 0.94, 0.58]));
  car.add(mesh(new THREE.BoxGeometry(0.10, 0.085, 0.58), materials.headlamp, 'Right matrix headlamp', [1.88, 0.94, -0.58]));
  car.add(mesh(new THREE.BoxGeometry(0.045, 0.055, 1.42), lampMaterial, 'Front LED light signature', [2.04, 0.91, 0]));
  car.add(mesh(new THREE.BoxGeometry(0.045, 0.06, 1.48), lampMaterial, 'Rear LED light signature', [-2.20, 0.94, 0]));
  car.add(mesh(new THREE.BoxGeometry(0.055, 0.035, 0.34), materials.headlamp, 'Left rear light blade', [-2.18, 1.02, 0.52]));
  car.add(mesh(new THREE.BoxGeometry(0.055, 0.035, 0.34), materials.headlamp, 'Right rear light blade', [-2.18, 1.02, -0.52]));

  // Hood creases, lower aero vanes and side details add readable body surfacing.
  for (const side of [-1, 1]) {
    const crease = mesh(new THREE.BoxGeometry(1.05, 0.018, 0.025), materials.darkMetal, 'Hood character line', [1.18, 1.035, side * 0.43]);
    crease.rotation.z = -0.025;
    car.add(crease);
    car.add(mesh(new THREE.BoxGeometry(0.42, 0.045, 0.035), materials.carbon, 'Front aero vane', [1.58, 0.59, side * 0.72]));
  }

  // Side skirts, mirrors, door seams and charging-port detail.
  for (const side of [-1, 1]) {
    car.add(mesh(new THREE.BoxGeometry(2.25, 0.075, 0.09), materials.darkMetal, 'Carbon side skirt', [0, 0.57, side * 0.91]));
    const mirror = mesh(new THREE.SphereGeometry(0.12, 18, 12), materials.body, 'Digital side mirror', [0.55, 1.28, side * 0.82], [1.35, 0.55, 0.8]);
    car.add(mirror);
    const doorLine = mesh(new THREE.BoxGeometry(0.72, 0.012, 0.012), materials.darkMetal, 'Flush door seam', [-0.05, 0.92, side * 0.905]);
    doorLine.rotation.z = -0.04;
    car.add(doorLine);
    car.add(mesh(new THREE.BoxGeometry(0.25, 0.035, 0.025), materials.rim, 'Flush door handle', [-0.42, 1.015, side * 0.91]));
    car.add(mesh(new THREE.BoxGeometry(0.52, 0.055, 0.035), materials.carbon, 'Side air outlet', [0.88, 0.78, side * 0.89]));
  }
  car.add(mesh(new THREE.CircleGeometry(0.075, 24), materials.rim, 'Charging port', [-1.55, 1.02, 0.89]));

  car.traverse((obj) => {
    if (obj.isMesh) {
      obj.userData.originalEmissive = obj.material?.emissive?.clone?.() ?? null;
      obj.userData.isSelectable = true;
    }
  });
  return car;
}
