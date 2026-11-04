# AI Use Log

Keep this file updated during development. The course rubric asks for concrete examples of AI assistance, verification, corrections, and learning.

## Entry 001 — Initial project scaffold
- **Tools:** ChatGPT.
- **For what:** Initial Vite + Three.js project structure, procedural electric-car concept, showroom layout, and first implementations of the seven required techniques.
- **What I checked:** Compared the implementation checklist with the seven techniques in the course final-project rubric; ran a code review for imports, module boundaries, and expected Three.js APIs.
- **What I changed or rejected:** The first version uses a procedural concept car instead of an externally downloaded model, avoiding unclear asset licensing and ensuring the project starts without extra asset files.
- **What I learned:** How the scene separates lighting, materials, geometry, animation, shaders, and Raycaster interaction.

## Student verification notes
Add your own notes here after running the project:
- A bug or incorrect AI suggestion I found:
- How I verified it:
- What I changed:
- What I learned:


## Entry 002 — Fix Vite CSS path and platform assembly
- **Tools:** ChatGPT.
- **For what:** Fixed the Vite import-analysis error caused by `main.js` importing `./style.css` while the stylesheet was outside `src/`.
- **What I checked:** Confirmed the relative import path from `src/main.js` and checked the updated project tree.
- **What I changed or rejected:** Moved the stylesheet to `src/style.css`. Also parented the car to the rotating platform so it rotates with the display, and adjusted its vertical position to sit on the platform.
- **What I learned:** Relative module imports resolve from the importing file, and grouping objects under a Three.js `Group` makes them inherit its transforms.


## Entry 003 — Refine the NV-01 vehicle model and picking
- **Tools:** ChatGPT.
- **For what:** Reworked the car from a box-dominated silhouette into a custom cross-section body mesh and added wheel spokes, brake discs, wheel-arch trim, headlamp lenses, aerodynamic trim, mirrors, door seams and a charging-port detail.
- **What I checked:** Reviewed the geometry's vertex/index construction, corrected face winding for outward-facing body normals, checked that every new material key is returned by `createMaterials()`, and updated the Raycaster component descriptions.
- **What I changed or rejected:** Kept the vehicle as an original procedural concept instead of adding an external model with uncertain licensing. Updated click picking so clicking empty space clears the selected component and its description.
- **What I learned:** How a BufferGeometry can be assembled from longitudinal cross-sections, how wheel assemblies can be composed from separate meshes, and how Raycaster picking depends on names and selectable mesh metadata.


## Entry 004 — Improve paint response, wheel details and studio lighting
- **Tools:** ChatGPT.
- **For what:** Added a subtle procedural tangent-space normal map to the clear-coated body paint, added visible brake calipers and wheel fasteners, refined front/rear intake and light details, and added a cool fill light to the showroom lighting rig.
- **What I checked:** Ran Node.js syntax checks on all JavaScript modules and checked local import paths. A full Vite production build could not be completed in this environment because `npm install` timed out while trying to retrieve dependencies.
- **What I changed or rejected:** Kept all geometry and textures procedural and local rather than adding third-party assets with uncertain licenses. The paint normal detail is deliberately low intensity so it does not make the body look rough or damaged.
- **What I learned:** A normal map changes the way light reacts to a surface without changing its silhouette; additional fill and rim lighting can reveal form without relying only on stronger ambient light.


## Entry 005 — Add EV underfloor components and refine animation controls
- **Tools:** ChatGPT.
- **For what:** Added a selectable underfloor battery enclosure and cooling plate, plus hood character lines, flush door handles and side air outlets. Refactored the animation loop so the display platform can pause while the shader ring and accent lighting continue smoothly.
- **What I checked:** Verified the new material is exported by `createMaterials()`, checked the new selectable mesh names against the Raycaster description map, and ran JavaScript syntax and local-import checks.
- **What I changed or rejected:** Kept the battery as a visual concept component and did not present it as an engineering-accurate pack. Removed duplicate paused/unpaused animation logic in favour of one delta-time update function.
- **What I learned:** EV skateboard batteries are commonly packaged under the passenger floor; in a Three.js scene, independent animation channels can be paused separately without stopping the entire render loop.


## Entry 006 — Add guided camera views
- **Tools:** ChatGPT.
- **For what:** Added four camera presets (hero, front, side and top) with smooth eased transitions, plus keyboard shortcuts 1–4.
- **What I checked:** Checked that each preset uses a valid Three.js Vector3 position, that the camera target remains centred on the vehicle, and that the buttons update their active state. Ran JavaScript syntax and local import checks.
- **What I changed or rejected:** Used built-in Three.js camera interpolation rather than adding a camera-animation dependency.
- **What I learned:** Camera position and OrbitControls target must be moved together to avoid the camera orbiting around an unintended point.


## Entry 007 — interaction, lighting and defense-readiness pass
- **Tool:** ChatGPT.
- **Purpose:** Review the current implementation against the assignment rubric, correct a lighting-mode animation conflict, improve keyboard/camera interaction edge cases, and draft a Macedonian defense guide.
- **What was checked:** Source files for camera presets, Raycaster picking, delta-time animation, lighting, materials, shaders, and the README mapping to the seven techniques.
- **Changes made:** Red rim animation now modulates the selected lighting mode's base intensity instead of overriding it; keyboard shortcuts ignore editable fields; Escape clears selection; manual pointer interaction cancels a camera preset transition; resize dimensions are guarded against zero; added `docs/ODBRANA_MK.md`.
- **What the student should verify and learn:** Run the project locally, test all four camera presets, test Escape and clicking empty space, compare all three lighting modes, and explain the seven techniques in their own words. Replace this line with your own notes after testing.

## Entry 008 — Raycaster interaction hardening and rubric audit
- **Tools:** ChatGPT.
- **For what:** Reviewed the Raycaster selection lifecycle and prepared a requirement-by-requirement technical audit against the course brief.
- **What I checked:** Checked that intersections are distance-sorted, that only selectable meshes can be picked, and that hover/selection material clones are restored.
- **What I changed or rejected:** Improved Escape clearing so it also resets hover, tooltip, cursor and component instructions. Added a small drag threshold so orbiting the model does not accidentally select a part. Added `docs/TECHNICAL_AUDIT_MK.md` with implementation locations and remaining manual checks.
- **What I learned:** Raycaster returns intersections ordered by distance; a drag gesture must be distinguished from a click when orbit controls and picking share the same canvas.

## Entry 009 — Accessibility and WebGL resilience
- **Tool:** ChatGPT assistance for code review and implementation.
- **Purpose:** Improve behavior for users who prefer reduced motion and provide visible feedback when WebGL is unavailable or lost.
- **Files changed:** `src/main.js`, `README.md`, `docs/TECHNICAL_AUDIT_MK.md`.
- **Implementation:** Respect `prefers-reduced-motion`, add WebGL initialization/context-loss messages, and disconnect the resize observer on page unload.
- **Student verification required:** Test with reduced-motion enabled in the operating system/browser and test on a machine/browser with WebGL disabled or hardware acceleration unavailable.
- **Learning outcome:** A 3D web application should provide graceful feedback when graphics hardware features are unavailable and should respect accessibility preferences.


## Entry 010 — Strengthen color and normal texture evidence
- **Tools:** ChatGPT assistance for implementation and code review.
- **For what:** Add an explicit sRGB procedural body Color Map with a subtle metallic-flake pattern and replace the flat floor normal texture with a generated tangent-space normal map.
- **What I checked:** Confirmed that the body geometry supplies UV attributes, the body map is tagged with `THREE.SRGBColorSpace`, and the floor normal map is not a constant flat normal. Also corrected the initial component panel text so it does not imply a selection before the user clicks.
- **What I changed or rejected:** Kept textures generated in code to avoid external asset licensing and preserve offline startup.
- **What I learned:** Color maps encode surface color and should use sRGB; normal maps encode directions rather than visible color and should remain in linear texture data.
- **Student verification required:** Run the showroom, change all four paint colors, and compare the floor/body appearance under all three lighting modes.


### Entry 010 — Performance and accessibility pass
- **AI tool:** ChatGPT.
- **Purpose:** Reduce unnecessary rendering while the browser tab is hidden and improve keyboard/screen-reader state for configurator controls.
- **What was checked:** Source-level animation scheduling, renderer pixel-ratio configuration, and UI button state attributes.
- **What was changed:** Added a 1.75 pixel-ratio cap, pause/resume behavior for the render loop on `visibilitychange`, `aria-pressed` state for paint/light/camera buttons, and visible keyboard focus styles.
- **What the student should verify/learn:** Open the app in a browser, switch to another tab and return, test keyboard navigation with Tab/Enter, and explain why a hidden tab should not continuously render. Add personal notes after performing these checks.

## Entry 011 — Add repeatable static project verification
- **Tools:** ChatGPT assistance for creating a small Node.js verification script.
- **Purpose:** Make it easier to repeat checks of required files, relative imports and source-level evidence for the seven assignment techniques before submission.
- **What was checked:** Ran `node scripts/verify-project.mjs`; all required files, relative imports and seven technique checks passed. Also ran JavaScript syntax checks on each source module.
- **What changed or was rejected:** Added `scripts/verify-project.mjs` and an `npm run verify` script. This is explicitly a static check; it is not represented as a Vite build or browser test.
- **What I learned:** Static source checks can catch missing files and broken local imports early, but runtime behavior still needs a successful build and browser testing.
- **Student verification required:** Run `npm install`, `npm run verify`, `npm run build`, then test the app in Chrome and write your own results here.
