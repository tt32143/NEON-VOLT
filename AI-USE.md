# AI Use Log – NEON VOLT

This document records the use of AI assistance during the development of the NEON VOLT Computer Graphics final project.

The purpose of this log is to transparently document AI tools, their contributions, verification activities, changes made, and learning outcomes.

## Entry 001 – Initial Project Scaffold

- **AI tool:** ChatGPT.
- **Purpose:** Assistance with the initial Vite + Three.js project structure, procedural electric-car concept, showroom layout, and initial implementation of the seven required Computer Graphics techniques.
- **What was checked:** The implementation was compared against the seven techniques in the course final-project rubric. Source structure, imports, and Three.js API usage were reviewed.
- **Changes made or rejected:** A procedural concept vehicle was used instead of an externally downloaded model to avoid uncertain asset licensing and additional asset dependencies.
- **Learning outcome:** Understanding how a Three.js project separates geometry, materials, lighting, animation, shaders, and interaction.

## Entry 002 – Fix Vite CSS Path and Platform Assembly

- **AI tool:** ChatGPT.
- **Purpose:** Resolve a Vite import-analysis error involving the stylesheet path and correct the vehicle's relationship with the rotating display platform.
- **What was checked:** The relative import path from `src/main.js` and the project directory structure.
- **Changes made:** Moved the stylesheet to `src/style.css`, parented the vehicle to the rotating platform, and adjusted its vertical position.
- **Learning outcome:** Understanding relative module imports and how parent-child relationships in Three.js affect object transformations.

## Entry 003 – Refine the NV-01 Vehicle Model and Picking

- **AI tool:** ChatGPT.
- **Purpose:** Improve the procedural vehicle geometry and component selection.
- **What was checked:** BufferGeometry vertex and index construction, face winding, material definitions, and Raycaster component descriptions.
- **Changes made or rejected:** Replaced the box-dominated vehicle silhouette with a custom cross-section body mesh and added wheel spokes, brake discs, headlamps, mirrors, aerodynamic details, door seams, and a charging-port detail. Kept the vehicle procedural instead of using an external model with uncertain licensing.
- **Learning outcome:** Understanding custom BufferGeometry construction, mesh composition, and Raycaster selection metadata.

## Entry 004 – Improve Paint, Wheels, and Studio Lighting

- **AI tool:** ChatGPT.
- **Purpose:** Improve the appearance of automotive paint, wheel details, and showroom lighting.
- **What was checked:** JavaScript syntax, local import paths, material definitions, and lighting configuration.
- **Changes made:** Added a subtle procedural tangent-space normal map to the body paint, brake calipers, wheel fasteners, and additional showroom fill lighting.
- **Learning outcome:** Understanding how normal maps affect lighting without changing geometry and how fill lighting reveals object shape.

## Entry 005 – Add EV Underfloor Components and Refine Animation

- **AI tool:** ChatGPT.
- **Purpose:** Add electric-vehicle details and improve animation control.
- **What was checked:** Material exports, selectable mesh names, Raycaster descriptions, and animation update logic.
- **Changes made:** Added a visual battery enclosure and cooling plate, hood lines, door handles, and side air outlets. Refactored animation so the display platform can pause independently of the shader ring and accent lighting.
- **Learning outcome:** Understanding independent animation channels and the visual representation of an EV battery layout.

## Entry 006 – Add Guided Camera Views

- **AI tool:** ChatGPT.
- **Purpose:** Add predefined camera views and keyboard shortcuts.
- **What was checked:** Camera positions, OrbitControls target, button states, JavaScript syntax, and local imports.
- **Changes made:** Added Hero, Front, Side, and Top camera presets with eased transitions and keyboard shortcuts 1–4.
- **Learning outcome:** Understanding the relationship between camera position and OrbitControls target.

## Entry 007 – Lighting, Interaction, and Defense Readiness

- **AI tool:** ChatGPT.
- **Purpose:** Review the implementation against the assignment rubric, improve interaction edge cases, and prepare a defense guide.
- **What was checked:** Camera presets, Raycaster interaction, delta-time animation, lighting, materials, shaders, and README technique mapping.
- **Changes made:** Improved lighting-mode animation, keyboard shortcut handling, Escape selection clearing, manual camera interaction, and resize handling. Added `docs/ODBRANA_MK.md`.
- **Learning outcome:** Understanding the importance of consistent animation states, keyboard interaction, and technical presentation.

## Entry 008 – Raycaster Interaction and Technical Audit

- **AI tool:** ChatGPT.
- **Purpose:** Improve component selection and prepare a requirement-by-requirement technical audit.
- **What was checked:** Intersection sorting, selectable mesh filtering, hover and selection material restoration.
- **Changes made:** Improved Escape behavior, hover clearing, tooltip and cursor reset, and click-versus-drag detection. Added `docs/TECHNICAL_AUDIT_MK.md`.
- **Learning outcome:** Understanding how Raycaster intersections are ordered and why drag gestures must be distinguished from clicks.

## Entry 009 – Accessibility and WebGL Resilience

- **AI tool:** ChatGPT.
- **Purpose:** Improve accessibility and provide feedback when WebGL is unavailable or lost.
- **What was checked:** Reduced-motion handling, WebGL initialization, context-loss handling, and resize observer cleanup.
- **Changes made:** Added `prefers-reduced-motion` support, WebGL error messages, context-loss feedback, and resize observer cleanup.
- **Learning outcome:** Understanding graceful error handling and accessibility considerations in 3D web applications.

## Entry 010 – Improve Color and Normal Texture Implementation

- **AI tool:** ChatGPT.
- **Purpose:** Strengthen the implementation of the required texture techniques.
- **What was checked:** Body UV attributes, sRGB texture configuration, and floor normal-map data.
- **Changes made:** Added a procedural body Color Map with a subtle metallic-flake pattern and a generated floor Normal Map.
- **Learning outcome:** Understanding the difference between color textures and normal textures and why they use different color-space handling.

## Entry 011 – Performance and Accessibility Improvements

- **AI tool:** ChatGPT.
- **Purpose:** Reduce unnecessary rendering and improve keyboard accessibility.
- **What was checked:** Animation scheduling, renderer pixel ratio, and interface button states.
- **Changes made:** Added a pixel-ratio limit, pause/resume behavior when switching browser tabs, `aria-pressed` attributes, and visible keyboard focus styles.
- **Learning outcome:** Understanding rendering performance and accessible interface controls.

## Entry 012 – Automated Static Project Verification

- **AI tool:** ChatGPT.
- **Purpose:** Create a repeatable verification script for required files, local imports, and source-level evidence of the seven techniques.
- **What was checked:** Executed `npm run verify` and reviewed the verification script output.
- **Changes made:** Added `scripts/verify-project.mjs` and the `npm run verify` command.
- **Learning outcome:** Understanding the difference between static source verification, production builds, and browser testing.

## Entry 013 – README and Project Documentation

- **AI tool:** ChatGPT.
- **Purpose:** Improve the GitHub README and organize the project documentation.
- **What was checked:** Project structure, package scripts, documented controls, and the seven required techniques.
- **Changes made:** Prepared a structured README covering the project overview, installation, technologies, controls, graphics techniques, project structure, and limitations.
- **Learning outcome:** Understanding how technical documentation helps explain and maintain a software project.

## Entry 014 – Git and GitHub Setup

- **AI tool:** ChatGPT.
- **Purpose:** Provide guidance for creating a Git repository and publishing the project on GitHub.
- **What was checked:** Git installation, repository status, `.gitignore`, commit history, remote configuration, and push results.
- **Changes made:** Initialized the local Git repository, configured author identity, created the initial commit, connected the GitHub remote, and pushed the project to the `main` branch.
- **Learning outcome:** Understanding Git initialization, commits, remotes, branches, and pushing changes to GitHub.

## Student Verification Record

The following checks were performed by the student during local testing:

- [x] `npm run verify` completed successfully.
- [x] `npm run build` completed successfully.
- [x] `npm run preview` started successfully.
- [x] Vehicle paint selection was tested in Chrome.
- [x] All four camera presets were tested.
- [x] Raycaster component selection was tested.
- [x] All three lighting modes were tested.
- [x] Platform rotation and technical grid controls were tested.
- [x] Focus Vehicle and Escape controls were tested.
- [x] Shadows and reflections were visually checked.
- [x] Browser window resizing was tested.
- [x] Application stability was checked during a 2–3 minute session.


### Personal Reflection

**1. What was the most important technical concept you learned?**

The most important technical concept that I have learned was the creation of an interactive 3D environment using Three.js. I have learned the principles behind geometry, materials, lighting, camera, and animation.

**2. Which part of the implementation was most difficult for you to understand?**

The difficult part for me was figuring out how Raycaster functions and how could I use the mouse to pick specific 3D objects. It was also important for me to know how various light settings would influence material appearance.

**3. How would you explain the use of Raycaster in this project?**

Raycaster helps identify the 3D object that the mouse is pointing at. The Raycaster in NEON VOLT allows the user to position the mouse cursor over the wheels, body, or battery parts of the car and it will show the information of the selected part.

**4. How would you explain the difference between a Color Map and a Normal Map?**

The Color Map determines how the color and texture of the object will look like. Normal Map modifies the behavior of light on the surface of the object which makes it look like it has a lot of detail.

**5. What would you improve if you continued developing NEON VOLT?**

If I decide to further develop NEON VOLT, then I will make the car model more detailed, add more details to the interior, improve quality of reflections and materials, and add new interaction possibilities.

---

**Transparency statement:** ChatGPT was used as an AI-assisted development and documentation tool. The student performed the listed local verification and browser tests. The student is responsible for understanding the implementation and explaining the technical decisions during the project defense.