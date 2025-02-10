// ThreeBackground.tsx
import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export const vertexShader = `
  void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const fragmentShader = `
  precision mediump float;
  uniform vec2 u_resolution;
  uniform float u_time;
  uniform sampler2D u_offsetField;
  uniform float u_gridDensity;

  // Pseudo-random generator.
  vec2 random2(vec2 st) {
    st = vec2(dot(st, vec2(127.1,311.7)),
              dot(st, vec2(269.5,183.3)));
    return fract(sin(st) * 43758.5453123);
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    float gridDensity = u_gridDensity;
    vec2 st = uv * gridDensity;
    vec2 cell = floor(st);
    vec2 fcell = fract(st);

    float dotVisible = 0.0;
    // Loop over neighboring cells so dots are smooth at cell boundaries.
    for (int j = -1; j <= 1; j++) {
      for (int i = -1; i <= 1; i++) {
        vec2 neighbor = vec2(float(i), float(j));
        vec2 currentCell = cell + neighbor;
        vec2 rnd = random2(currentCell);

        // Base dot center with time‐varying noise.
        vec2 baseCenter = 0.7 + 0.2 * sin(u_time + 6.2831 * rnd);

        // Sample the offset from the offset field.
        // (Center of cell → (cell + 0.5) / gridDensity)
        vec2 cellCoord = (currentCell + 0.5) / gridDensity;
        vec2 fieldOffset = texture2D(u_offsetField, cellCoord).rg;

        // Add the offset to the dot's base center.
        vec2 dotCenter = baseCenter + fieldOffset;

        // Determine if fragment is inside the dot radius.
        vec2 candidate = neighbor + dotCenter;
        float d = length(candidate - fcell);
        float dotRadius = 0.2 * rnd.x;
        float contribution = step(d, dotRadius);
        dotVisible = max(dotVisible, contribution);
      }
    }

    // Final color
    vec3 bgColor = vec3(16.0 / 255.0, 17.0 / 255.0, 17.0 / 255.0);
    vec3 dotColor = vec3(0.12);
    vec3 color = mix(bgColor, dotColor, dotVisible);
    gl_FragColor = vec4(color, 1.0);
  }
`;

const ThreeBackground: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  const pathRef1 = useRef<SVGPathElement | null>(null);
  const pathRef2 = useRef<SVGPathElement | null>(null);

  useEffect(() => {
    const playedBefore = sessionStorage.getItem("lineAnimationPlayed");

    if (pathRef1.current && pathRef2.current) {
      const totalLength1 = pathRef1.current.getTotalLength();
      const totalLength2 = pathRef2.current.getTotalLength();

      // Always set dasharray
      pathRef1.current.style.strokeDasharray = `${totalLength1}`;
      pathRef2.current.style.strokeDasharray = `${totalLength2}`;

      if (playedBefore) {
        // If animation has played before, just show the lines fully.
        pathRef1.current.style.strokeDashoffset = "0";
        pathRef1.current.style.opacity = "1";

        pathRef2.current.style.strokeDashoffset = "0";
        pathRef2.current.style.opacity = "1";
      } else {
        // If animation hasn't played, hide them first:
        pathRef1.current.style.strokeDashoffset = `${totalLength1}`;
        pathRef1.current.style.opacity = "0";

        pathRef2.current.style.strokeDashoffset = `${totalLength2}`;
        pathRef2.current.style.opacity = "0";

        // Animate on the next frame for smoothness:
        requestAnimationFrame(() => {
          pathRef1.current!.style.transition =
            "stroke-dashoffset 1s ease-in-out, opacity 0.5s";
          pathRef1.current!.style.strokeDashoffset = "0";
          pathRef1.current!.style.opacity = "1";

          pathRef2.current!.style.transition =
            "stroke-dashoffset 1.2s ease-in-out, opacity 0.5s";
          pathRef2.current!.style.strokeDashoffset = "0";
          pathRef2.current!.style.opacity = "1";

          // Store the flag so it doesn't animate again on refresh
          sessionStorage.setItem("lineAnimationPlayed", "true");
        });
      }
    }
  }, []);

  useEffect(() => {
    const width = window.innerWidth;
    const height = window.innerHeight * 1.5;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(
      width / -2,
      width / 2,
      height / 2,
      height / -2,
      -1,
      1
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    mountRef.current?.appendChild(renderer.domElement);

    // Grid resolution for offset sampling.
    const gridDensity = 180;
    const gridSize = gridDensity;

    // Offset field: 2 floats (x,y) per cell, stored in a Float32Array.
    const offsetFieldData = new Float32Array(gridSize * gridSize * 2);

    // Create a DataTexture to hold offset vectors, in RG float format.
    const offsetFieldTexture = new THREE.DataTexture(
      offsetFieldData,
      gridSize,
      gridSize,
      THREE.RGFormat,
      THREE.FloatType
    );
    offsetFieldTexture.magFilter = THREE.NearestFilter;
    offsetFieldTexture.minFilter = THREE.NearestFilter;
    offsetFieldTexture.needsUpdate = true;

    // Uniforms
    const uniforms: Record<string, any> = {
      u_resolution: { value: new THREE.Vector2(width, height) },
      u_time: { value: 0 },
      u_offsetField: { value: offsetFieldTexture },
      u_gridDensity: { value: gridDensity },
      u_mouse: { value: new THREE.Vector2(0, 0) },
    };

    // Plane covering the whole view.
    const geometry = new THREE.PlaneGeometry(1, 1);
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.scale.set(width, height, 1);
    scene.add(mesh);

    // Resize handling
    const onWindowResize = () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight * 1.5;
      renderer.setSize(newWidth, newHeight);

      camera.left = newWidth / -2;
      camera.right = newWidth / 2;
      camera.top = newHeight / 2;
      camera.bottom = newHeight / -2;
      camera.updateProjectionMatrix();

      mesh.scale.set(newWidth, newHeight, 1);
      uniforms.u_resolution.value.set(newWidth, newHeight);
    };
    window.addEventListener("resize", onWindowResize);

    // Track mouse (flip Y to match WebGL).
    window.addEventListener("mousemove", (event: MouseEvent) => {
      const x = event.clientX;
      const y = uniforms.u_resolution.value.y - event.clientY;
      uniforms.u_mouse.value.set(x, y);
    });

    // For velocity tracking, to decide if the mouse is moving.
    const lastMouseGrid = new THREE.Vector2();
    let hasLastMouse = false;

    // Offset field parameters
    const threshold = 12; // radius of mouse influence (in grid cells)
    const influenceFactor = 0.02; // how strongly cells are nudged
    const decay = 0.99; // how fast offsets decay each frame
    const minVelocity = 0.0; // skip pushing offsets if mouse velocity < this
    const maxOffset = 0.7; // clamp maximum offset magnitude

    renderer.setAnimationLoop(() => {
      // 1) Update time
      uniforms.u_time.value = performance.now() * 0.001;

      // 2) Convert mouse to grid space
      const res = uniforms.u_resolution.value;
      const mouse = uniforms.u_mouse.value;
      const mouseGrid = new THREE.Vector2(
        (mouse.x / res.x) * gridSize,
        (mouse.y / res.y) * gridSize
      );

      // 3) Decay every cell’s offset a bit each frame
      for (let i = 0; i < offsetFieldData.length; i++) {
        offsetFieldData[i] *= decay;
      }

      // 4) Only push offset if mouse is moving
      if (hasLastMouse) {
        const velocity = mouseGrid.clone().sub(lastMouseGrid);
        const speed = velocity.length();
        // For each cell in range, add a push toward the mouse
        for (let y = 0; y < gridSize; y++) {
          for (let x = 0; x < gridSize; x++) {
            const index = (y * gridSize + x) * 2;
            const cellCenterX = x + 0.5;
            const cellCenterY = y + 0.5;
            const dx = mouseGrid.x - cellCenterX;
            const dy = mouseGrid.y - cellCenterY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < threshold) {
              const falloff = (1000.0 - dist / threshold) * influenceFactor;
              offsetFieldData[index] += dx * falloff;
              offsetFieldData[index + 1] += dy * falloff;

              // Clamp offset magnitude
              const ox = offsetFieldData[index];
              const oy = offsetFieldData[index + 1];
              const mag = Math.sqrt(ox * ox + oy * oy);
              if (mag > maxOffset) {
                offsetFieldData[index] = (ox / mag) * maxOffset;
                offsetFieldData[index + 1] = (oy / mag) * maxOffset;
              }
            }
          }
        }
      } else {
        // First valid mouse reading
        lastMouseGrid.copy(mouseGrid);
        hasLastMouse = true;
      }

      // Remember current mouse position for next frame's velocity
      lastMouseGrid.copy(mouseGrid);

      // 5) Mark DataTexture for upload
      offsetFieldTexture.needsUpdate = true;

      // 6) Render
      renderer.render(scene, camera);
    });

    return () => {
      window.removeEventListener("resize", onWindowResize);
      renderer.setAnimationLoop(null);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: -1,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        overflow: "hidden",
      }}>
      {/* 3JS background */}
      <div ref={mountRef} style={{ width: "100%", height: "100%" }} />

      <svg
        width="1103"
        height="1041"
        viewBox="0 0 1103 1041"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute md:-top-24 -top-32 -right-10 md:right-20 opacity-20 md:rotate-0 rotate-12">
        <path
          ref={pathRef1}
          d="M0.499714 2.50023C682 -23.4988 1214 342 1080.5 1040.5"
          stroke="#FFFFE1"
          strokeWidth="1.5"
        />
      </svg>

      <svg
        width="813"
        height="673"
        viewBox="0 0 813 673"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute -bottom-8 -right-24 opacity-20 transition-all">
        <path
          ref={pathRef2}
          d="M0.499999 657.5C556.5 745.5 725.895 417.129 811.5 1.00017"
          stroke="#FFFFE1"
          strokeWidth="1.5"
        />
      </svg>
    </div>
  );
};

export default ThreeBackground;
// // Second ball
// vec2 center1 = u_resolution * 0.5 + vec2(-300.0, 220.0);
// float radius1 = 30.0;
// float distCenter1 = distance(gl_FragCoord.xy, center1);

// // Brightness contribution from second ball
// if (distCenter1 < radius1) {
//     float distFragmentToMouse1 = distMouse;
//     float distCenterToMouse1 = distance(center1, u_mouse);

//     float minDist1 = abs(distCenterToMouse1 - radius1);
//     float maxDist1 = distCenterToMouse1 + radius1;

//     // Avoid division by zero
//     float range1 = maxDist1 - minDist1;
//     float normalizedDist1 = 0.0;
//     if (range1 > 0.0) { normalizedDist1 = (distFragmentToMouse1 - minDist1) / range1; }
//     // Clamp normalizedDist1 between 0 and 1
//     normalizedDist1 = clamp(normalizedDist1, 0.0, 1.0);

//     // Set brightness contribution from second ball
//     brightness += normalizedDist1 - 0.5;
// }
