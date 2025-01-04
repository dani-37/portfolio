// ThreeBackground.tsx
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ThreeBackground: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Basic Three.js setup
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(
      window.innerWidth / -2,
      window.innerWidth / 2,
      window.innerHeight / 2,
      window.innerHeight / -2,
      -1,
      1
    );

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight * 1.5);

    // Append renderer to the DOM
    if (mountRef.current) {
      mountRef.current.appendChild(renderer.domElement);
    }

    // Geometry and Material
    const geometry = new THREE.PlaneGeometry(window.innerWidth, window.innerHeight * 1.5);

    const uniforms = {
      u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight * 1.5) },
      u_mouse: { value: new THREE.Vector2(0, 0) },
    };

    const vertexShader = `
      void main() {
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      precision mediump float;

      uniform vec2 u_resolution;
      uniform vec2 u_mouse;

      float bayerDither(vec2 position, float brightness) {
        // 4x4 Bayer matrix
        int x = int(mod(position.x, 4.0));
        int y = int(mod(position.y, 4.0));

        int index = x + y * 4;

        float thresholdMatrix[16];
        thresholdMatrix[0] = 0.0 / 16.0;
        thresholdMatrix[1] = 8.0 / 16.0;
        thresholdMatrix[2] = 2.0 / 16.0;
        thresholdMatrix[3] = 10.0 / 16.0;
        thresholdMatrix[4] = 12.0 / 16.0;
        thresholdMatrix[5] = 4.0 / 16.0;
        thresholdMatrix[6] = 14.0 / 16.0;
        thresholdMatrix[7] = 6.0 / 16.0;
        thresholdMatrix[8] = 3.0 / 16.0;
        thresholdMatrix[9] = 11.0 / 16.0;
        thresholdMatrix[10] = 1.0 / 16.0;
        thresholdMatrix[11] = 9.0 / 16.0;
        thresholdMatrix[12] = 15.0 / 16.0;
        thresholdMatrix[13] = 7.0 / 16.0;
        thresholdMatrix[14] = 13.0 / 16.0;
        thresholdMatrix[15] = 5.0 / 16.0;

        float threshold = thresholdMatrix[index];

        return brightness + threshold / 0.22; // Adjust divisor to control graininess
      }

      void main() {
        // Initialize brightness
        float brightness = 0.3;

        // Apply dithering to create graininess
        brightness = bayerDither(gl_FragCoord.xy, brightness);

        // Overlay a single color over everything
        vec3 color = vec3(0.2, 0.3, 0.6);

        // Apply brightness to the color
        color *= brightness;

        // Clamp and output color
        color = clamp(color, 0.0, 1.0);
        gl_FragColor = vec4(color, 1.0);
      }
    `;

    const material: THREE.ShaderMaterial = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
    });
    
    const mesh = new THREE.Mesh(geometry, material as unknown as THREE.MeshBasicMaterial);
    scene.add(mesh);

    // Handle window resize
    const onWindowResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight * 1.5;

      // Update renderer and camera
      renderer.setSize(width, height);
      camera.left = width / -2;
      camera.right = width / 2;
      camera.top = height / 2;
      camera.bottom = height / -2;
      camera.updateProjectionMatrix();

      // Update the geometry
      mesh.geometry = new THREE.PlaneGeometry(width, height);

      // Update shader resolution uniform
      uniforms.u_resolution.value.set(width, height);
    };

    window.addEventListener('resize', onWindowResize);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup on unmount
    return () => {
      window.removeEventListener('resize', onWindowResize);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: -1,
        pointerEvents: 'none',
        filter: 'blur(0.8px)'
      }}
    />
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