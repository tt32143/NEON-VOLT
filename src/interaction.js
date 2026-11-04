import * as THREE from 'three';

const descriptions = {
  'Sculpted aerodynamic body': ['SCULPTED BODY', 'Multi-section aerodynamic shell with a low, wide electric GT stance.'],
  'Panoramic glass canopy': ['PANORAMIC CANOPY', 'Smoked panoramic glazing with a reflective premium finish.'],
  'Performance tire': ['PERFORMANCE TIRE', 'Wide low-profile tire designed for confident road contact.'],
  'Forged alloy rim': ['FORGED ALLOY WHEEL', 'Metallic multi-spoke wheel face with a lightweight performance look.'],
  'Ventilated brake disc': ['BRAKE SYSTEM', 'Ventilated performance disc visible behind the alloy spokes.'],
  'Alloy wheel spoke': ['ALLOY SPOKE', 'Individual forged-style spoke forming the multi-spoke wheel design.'],
  'Front LED light signature': ['FRONT LED SIGNATURE', 'Continuous red concept light strip across the front fascia.'],
  'Rear LED light signature': ['REAR LED SIGNATURE', 'Full-width rear light signature for the NV-01 concept.'],
  'Carbon side skirt': ['CARBON SIDE SKIRT', 'Low side aerodynamic trim connecting the front and rear wheel areas.'],
  'Digital side mirror': ['DIGITAL SIDE MIRROR', 'Compact camera-style mirror housing.'],
  'Charging port': ['CHARGING PORT', 'Illustrative charging-port detail on the rear quarter panel.'],
  'EV skateboard battery pack': ['EV BATTERY PACK', 'Flat underfloor battery enclosure lowers the center of gravity in this electric GT concept.'],
  'Battery cooling plate': ['BATTERY COOLING PLATE', 'Underfloor thermal-management plate for the concept battery system.'],
  'Flush door handle': ['FLUSH DOOR HANDLE', 'Retractable-style handle integrated into the clean side profile.'],
  'Side air outlet': ['SIDE AIR OUTLET', 'Decorative aero outlet behind the front wheel arch.'],
  'Hood character line': ['HOOD CHARACTER LINE', 'Raised hood detail that catches the studio lighting and emphasizes the front profile.']
};

export function setupInteraction({ camera, renderer, car, tooltip }) {
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  let hovered = null;
  let selected = null;
  let pointerDown = null;

  function setInfo(object) {
    const info = object
      ? (descriptions[object.name] || [object.name?.toUpperCase() || 'VEHICLE COMPONENT', 'Interactive vehicle component.'])
      : ['SELECT A COMPONENT', 'Move over the vehicle and click a part to inspect it.'];
    document.querySelector('#part-title').textContent = info[0];
    document.querySelector('#part-description').textContent = info[1];
  }

  function restore(object) {
    if (!object?.isMesh || !object.userData.originalMaterial) return;
    const highlightedMaterial = object.material;
    object.material = object.userData.originalMaterial;
    delete object.userData.originalMaterial;
    if (highlightedMaterial !== object.material) highlightedMaterial.dispose?.();
  }

  function highlight(object, color) {
    if (!object?.isMesh || !object.material?.clone || object.userData.originalMaterial) return;
    object.userData.originalMaterial = object.material;
    const material = object.material.clone();
    if (material.emissive) material.emissive.set(color);
    else if (material.color) material.color.lerp(new THREE.Color(color), 0.35);
    object.material = material;
  }

  function pick(event) {
    const rect = renderer.domElement.getBoundingClientRect();
    if (!rect.width || !rect.height) return null;
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    // Raycaster sorts intersections by distance; the first selectable hit is the nearest part.
    return raycaster.intersectObject(car, true).find(hit => hit.object.userData.isSelectable)?.object ?? null;
  }

  function clearSelection() {
    if (selected) restore(selected);
    selected = null;
    if (hovered) restore(hovered);
    hovered = null;
    tooltip.style.display = 'none';
    renderer.domElement.style.cursor = 'grab';
    setInfo(null);
  }

  renderer.domElement.addEventListener('pointerdown', event => {
    pointerDown = { x: event.clientX, y: event.clientY };
  });

  renderer.domElement.addEventListener('pointermove', event => {
    const hit = pick(event);
    if (hit !== hovered) {
      if (hovered && hovered !== selected) restore(hovered);
      hovered = hit;
      if (hovered && hovered !== selected) highlight(hovered, '#ff3155');
      renderer.domElement.style.cursor = hovered ? 'pointer' : 'grab';
    }
    if (hovered) {
      tooltip.style.display = 'block';
      tooltip.textContent = hovered.name || 'Vehicle component';
      const bounds = renderer.domElement.getBoundingClientRect();
      tooltip.style.left = `${event.clientX - bounds.left + 14}px`;
      tooltip.style.top = `${event.clientY - bounds.top + 14}px`;
    } else {
      tooltip.style.display = 'none';
    }
  });

  renderer.domElement.addEventListener('click', event => {
    // OrbitControls also produces a click after a drag. Ignore it if the pointer moved.
    if (pointerDown) {
      const moved = Math.hypot(event.clientX - pointerDown.x, event.clientY - pointerDown.y);
      pointerDown = null;
      if (moved > 6) return;
    }
    if (selected) restore(selected);
    if (hovered && hovered !== selected) restore(hovered);
    selected = pick(event);
    hovered = selected;
    if (selected) {
      highlight(selected, '#ff3155');
      setInfo(selected);
    } else {
      tooltip.style.display = 'none';
      renderer.domElement.style.cursor = 'grab';
      setInfo(null);
    }
  });

  renderer.domElement.addEventListener('pointerleave', () => {
    if (hovered && hovered !== selected) restore(hovered);
    hovered = selected;
    tooltip.style.display = 'none';
    renderer.domElement.style.cursor = 'grab';
  });

  return { clearSelection };
}
