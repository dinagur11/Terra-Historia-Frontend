import { useEffect, useRef } from "react";
import * as THREE from "three";

function makeStarTexture() {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext("2d");
  const cx = size / 2;
  const cy = size / 2;

  const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, size / 2);
  g.addColorStop(0.0, "rgba(255,255,255,1)");
  g.addColorStop(0.2, "rgba(255,255,255,0.9)");
  g.addColorStop(0.5, "rgba(255,255,255,0.35)");
  g.addColorStop(1.0, "rgba(255,255,255,0)");

  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export default function StarsBackground() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mountEl = mountRef.current;
    if (!mountEl) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 1;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    const canvas = renderer.domElement;
    mountEl.appendChild(canvas);

    // ---- stars ----
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 2200;

    const positions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 200;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 200;
      positions[i * 3 + 2] = -Math.random() * 200;
    }
    starGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const starTexture = makeStarTexture();

    const starMaterial = new THREE.PointsMaterial({
      map: starTexture,
      transparent: true,
      alphaTest: 0.2,     // trims faint square edges
      size: 0.6,
      sizeAttenuation: true,
      depthWrite: false,
      opacity: 0.9,
      color: 0xffffff,
    });

    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    let rafId = 0;
    let t = 0;
    const animate = () => {
        t += 0.0020;
        stars.rotation.y = Math.sin(t) * 0.05;
        stars.rotation.x = Math.cos(t * 0.7) * 0.03;
        renderer.render(scene, camera);
        rafId = requestAnimationFrame(animate);
    };

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener("resize", onResize);
    animate();

    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(rafId);

      starGeometry.dispose();
      starMaterial.dispose();
      starTexture.dispose();
      renderer.dispose();

      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}
