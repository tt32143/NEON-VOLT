# NEON VOLT — Premium 3D Car Showroom

Interactive Three.js concept showroom for an electric grand tourer. The vehicle is built procedurally from Three.js geometry so the project runs without downloading third-party 3D assets.

## Requirements
- Node.js 20.19+ (or a compatible current LTS release)
- npm
- A browser with WebGL support

## Run locally
```bash
npm install
npm run dev
```
Open the local URL printed by Vite (normally `http://localhost:5173`).

Production build:
```bash
npm run build
npm run preview
```

## Controls
- Drag: orbit camera
- Scroll: zoom
- Camera presets 01–04: hero, front, side and top views (keyboard shortcuts 1–4) with eased transitions; press Escape to clear a selected component
- Click a paint swatch: change body color
- Select STUDIO / PULSE / NIGHT: change lighting
- Hover and click car parts: inspect components, including the EV battery pack and cooling plate
- Auto rotate platform: toggle the display platform
- Show technical grid: toggle floor grid

## Where the seven required techniques are implemented
1. **Lighting** — `src/lighting.js`: AmbientLight, DirectionalLight and SpotLight, plus red rim and cool fill PointLights; shadow casting and receiving are enabled.
2. **Color management** — `src/main.js`: `renderer.outputColorSpace = THREE.SRGBColorSpace`, ACES filmic tone mapping and exposure. `src/materials.js` marks the generated color texture as sRGB.
3. **Textures** — `src/materials.js`: procedural canvas color map and normal map on the showroom floor, with repeat wrapping and mipmap filtering. The floor geometry uses standard UVs.
4. **PBR** — `src/materials.js`: physically based body, glass, tire and metal materials; the body uses a subtle procedural tangent-space normal map for paint micro-surface detail. `src/lighting.js`: PMREM environment generated from `RoomEnvironment`.
5. **Shader** — `src/shaders/showroom.vert` deforms the energy-ring vertices; `src/shaders/showroom.frag` animates color using uniforms and a varying. `src/showroom.js` supplies the uniforms and ShaderMaterial.
6. **Animation** — `src/animation.js`: delta-time update, sinusoidal/eased platform motion and animated light. Delta is clamped to avoid large jumps after pauses.
7. **Interaction** — `src/interaction.js`: Raycaster hover/click selection and visible highlight. `OrbitControls` in `src/main.js` controls the camera.

## Project structure
- `src/main.js` — application entry point, UI wiring and eased camera presets
- `src/style.css` — responsive showroom interface styles
- `src/car.js` — procedural electric GT body shell, panoramic canopy, multi-spoke wheels, brake discs, wheel-arch trim, brake calipers and fasteners, underfloor EV battery pack, cooling plate, hood creases, flush handles, side outlets and lighting details
- `src/showroom.js` — showroom floor, platform and shader ring
- `src/lighting.js` — lights and PMREM environment
- `src/materials.js` — PBR materials and procedural textures
- `src/interaction.js` — Raycaster selection
- `src/animation.js` — time-based animation
- `src/shaders/` — GLSL vertex and fragment shaders

## Defense preparation
See `docs/ODBRANA_MK.md` for a five-minute demo outline and sample technical questions. See `docs/TECHNICAL_AUDIT_MK.md` for a requirement-by-requirement implementation audit, `docs/FINAL_TEST_CHECKLIST_MK.md` for the final browser/build test checklist, and `docs/USER_ACCEPTANCE_TEST_MK.md` for the browser checks reported by the student.

## Assets and licenses
No third-party model or texture assets are included. The vehicle and floor textures are generated in code. Three.js is an external dependency and retains its own license; see the package metadata and the official Three.js license.

## Current limitations / next development tasks
- The car is a stylized procedural concept model, not a production-quality imported GLB model.
- Vehicle specifications are fictional demonstration values.
- The paint Color Map and Normal Map are procedural and intentionally subtle; they are not scanned automotive paint textures. The floor also uses a procedural non-flat normal map.
- The battery enclosure and cooling plate are visual concept components, not an engineering-accurate battery design.
- The car remains an original stylized concept mesh, not a photorealistic production vehicle.
- Next: verify the final result on the university lab computer and tune reflections/shadows to its GPU.

## Accessibility and graphics fallback
- The showroom respects the operating system's `prefers-reduced-motion` setting by disabling automatic platform rotation and animated camera transitions.
- Rendering pixel ratio is capped at 1.75 to balance sharpness and GPU load on high-density displays.
- The animation loop pauses while the browser tab is hidden and resumes with a fresh delta-time sample when visible again.
- Paint, lighting and camera preset buttons expose their selected state through `aria-pressed`; keyboard focus indicators are visible.
- If WebGL initialization fails, the viewport displays a hardware-acceleration/browser guidance message.
- If the WebGL context is lost while running, the viewport displays a reload notice.

## Verification status
The student reported successful manual Chrome checks for the main configurator controls, lighting modes, shadows/reflections, window resizing, and a short stability run. See `docs/USER_ACCEPTANCE_TEST_MK.md` for the recorded scope. A production build remains unconfirmed until `npm run build` succeeds on the submission machine.

## Static verification
Run the project's repeatable source/layout checks with:
```bash
npm run verify
```
This checks required project files, relative local imports and source markers for the seven required techniques. It does **not** replace `npm run build` or a real Chrome/WebGL test.
