# NEON VOLT
### Premium 3D Electric Car Showroom

An interactive 3D electric grand tourer configurator built with **Three.js**, **JavaScript**, and **Vite** as a Computer Graphics university project.

NEON VOLT presents the fictional NV-01 Electric GT inside a futuristic digital showroom. Users can explore the vehicle, change its paint finish, switch lighting environments, inspect individual components, and navigate between predefined camera views.

> **Project type:** University Final Project – Computer Graphics  
> **Vehicle concept:** NV-01 / VOLT GT  
> **Experience:** Interactive 3D Web Application

---

## Features

- **Interactive 3D vehicle:** Procedurally constructed electric GT concept.
- **Paint configurator:** Change the vehicle's body color.
- **Lighting environments:** Studio, Pulse, and Night modes.
- **Camera presets:** Hero, Front, Side, and Top views.
- **Component inspection:** Hover over and select vehicle components.
- **EV components:** Visual battery enclosure and cooling plate.
- **Animated showroom:** Rotating display platform and animated shader ring.
- **PBR materials:** Metallic paint, glass, rubber, and metal surfaces.
- **Responsive interface:** Showroom interface adapts to different viewport sizes.
- **Accessibility:** Keyboard focus indicators and reduced-motion support.

## Technology Stack

| Technology | Purpose |
|---|---|
| JavaScript (ES Modules) | Application logic |
| Three.js | 3D graphics and rendering |
| Vite | Development server and production build |
| GLSL | Custom vertex and fragment shaders |
| HTML5 / CSS3 | Interface and layout |
| WebGL | Hardware-accelerated graphics |

## Getting Started

### Requirements

- Node.js 20.19+ or a compatible current LTS release
- npm
- A modern browser with WebGL support

### Installation

Clone the repository:

```bash
git clone https://github.com/tt32143/NEON-VOLT.git
cd NEON-VOLT
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local URL displayed by Vite, normally:

```text
http://localhost:5173/
```

### Production Build

Create an optimized production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

### Project Verification

Run the project's static verification script:

```bash
npm run verify
```

## User Controls

| Input | Action |
|---|---|
| Mouse drag | Orbit around the vehicle |
| Mouse scroll | Zoom in and out |
| Camera button 01 | Hero view |
| Camera button 02 | Front view |
| Camera button 03 | Side view |
| Camera button 04 | Top view |
| Keyboard 1–4 | Activate camera presets |
| Escape | Clear component selection |
| Paint swatches | Change vehicle paint |
| Studio / Pulse / Night | Change lighting environment |
| Auto rotate platform | Enable or disable platform rotation |
| Show technical grid | Toggle the showroom grid |
| Focus Vehicle | Focus the camera on the vehicle |

## Computer Graphics Techniques

The project demonstrates the seven techniques required by the course assignment.

### 1. Lighting and Shadows

Implemented in `src/lighting.js`.

- Ambient lighting.
- Directional lighting.
- Spot lighting.
- Point lights for accent and fill illumination.
- Shadow casting and receiving.
- Environment lighting using PMREM and `RoomEnvironment`.

### 2. Color Management

Implemented in `src/main.js` and `src/materials.js`.

- sRGB output color space.
- ACES Filmic Tone Mapping.
- Renderer exposure configuration.
- sRGB color texture configuration.

### 3. Textures and UV Mapping

Implemented in `src/materials.js`.

- Procedural Color Map generated using CanvasTexture.
- Procedural Normal Map.
- UV coordinates on geometry.
- Texture repeat wrapping and filtering.
- sRGB color texture configuration.

### 4. Physically Based Rendering (PBR)

Implemented in `src/materials.js` and `src/lighting.js`.

- MeshPhysicalMaterial and MeshStandardMaterial.
- Metalness and roughness configuration.
- Clear-coated automotive paint.
- Glass, rubber, and metallic surfaces.
- Environment reflections using a PMREM-generated environment.

### 5. Custom ShaderMaterial

Implemented in:

- `src/shaders/showroom.vert`
- `src/shaders/showroom.frag`
- `src/showroom.js`

The custom shader demonstrates:

- Vertex deformation.
- Animated color transitions.
- Uniform variables.
- Varying data passed between vertex and fragment shaders.

### 6. Animation

Implemented in `src/animation.js`.

- Delta-time-based animation.
- Smooth and eased motion.
- Animated showroom lighting.
- Rotating display platform.
- Animation behavior designed to avoid large time jumps after pauses.

### 7. Interaction and Raycasting

Implemented in `src/interaction.js`.

- Three.js Raycaster.
- Mouse hover detection.
- Object picking and selection.
- Component highlighting.
- Component information display.
- Selection clearing and click-versus-drag handling.

## Project Structure

```text
NEON-VOLT/
├── docs/
│   ├── FINAL_TEST_CHECKLIST_MK.md
│   ├── TECHNICAL_AUDIT_MK.md
│   └── USER_ACCEPTANCE_TEST_MK.md
├── scripts/
│   └── verify-project.mjs
├── src/
│   ├── shaders/
│   │   ├── showroom.frag
│   │   └── showroom.vert
│   ├── animation.js
│   ├── car.js
│   ├── interaction.js
│   ├── lighting.js
│   ├── main.js
│   ├── materials.js
│   ├── showroom.js
│   └── style.css
├── .gitignore
├── AI-USE.md
├── index.html
├── package.json
└── package-lock.json
```

## Documentation

Additional project documentation is available in the `docs/` directory:

- `TECHNICAL_AUDIT_MK.md` – Implementation audit against the seven course requirements.
- `FINAL_TEST_CHECKLIST_MK.md` – Final testing checklist.
- `USER_ACCEPTANCE_TEST_MK.md` – Manual browser testing record.

AI assistance is documented transparently in `AI-USE.md`.

## Design and Technical Limitations

- The NV-01 is an original procedural concept model, not a photorealistic production vehicle.
- Vehicle performance specifications are fictional demonstration values.
- Battery and cooling components are visual representations, not engineering-accurate designs.
- Paint and floor textures are generated procedurally.
- Visual quality and performance may vary depending on the browser and graphics hardware.

## Assets and Licensing

No external vehicle models or third-party texture assets are included.

The vehicle geometry and procedural textures are generated within the project.

Three.js is used as an external dependency under its applicable license. Refer to the official [Three.js repository](https://github.com/mrdoob/three.js) for licensing information.

## Academic Project

**NEON VOLT – Premium 3D Electric Car Showroom**

Developed as a Computer Graphics university final project.

**GitHub Repository:**  
https://github.com/tt32143/NEON-VOLT