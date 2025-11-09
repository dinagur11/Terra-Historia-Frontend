import { useEffect, useRef } from "react";
import createGlobe from "globe.gl";
import * as THREE from "three";
import { Link } from "react-router-dom";
import "./Globe.css"

export default function HomePage() {
  const globeEl = useRef(null);

  useEffect(() => {
    const globe = createGlobe()(globeEl.current)
      .globeImageUrl("https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg")
      .bumpImageUrl("https://unpkg.com/three-globe/example/img/earth-topology.png")
      .backgroundColor("rgba(0,0,0,0)") 
      .pointOfView({ lat: 20, lng: 0, altitude: 2.2 });

    const canvas = globe.renderer().domElement;
    canvas.style.position = "absolute";
    canvas.style.inset = "0";
    canvas.style.zIndex = "1"; // behind the text
    // keep the globe transparent so stars show through

    const scene = globe.scene();
    const tex = new THREE.TextureLoader().load(
      "https://unpkg.com/three-globe/example/img/night-sky.png"
    );
    const stars = new THREE.Mesh(
      new THREE.SphereGeometry(1000, 64, 64),
      new THREE.MeshBasicMaterial({ map: tex, side: THREE.BackSide })
    );
    scene.add(stars);
    const controls = globe.controls();
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.08; 

    const resize = () => {
      const { clientWidth, clientHeight } = globeEl.current;
      globe.width(clientWidth);
      globe.height(clientHeight);
    };
    resize();
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      globe.pauseAnimation();
      globe.renderer().dispose();
    };
  }, []);

  return (
    <div
      style={{
        display: "flex",
        position: "relative",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100vw",
        height: "100vh",
        backgroundColor: "#000",
        overflow: "hidden",
        color: "#fff",
        margin: 0
      }}
    >
      <div className="globe-container"
        ref={globeEl}
        style={{
          flex: "1 1 61%",
          height: "100%",
          position: "relative",
          zIndex: 1,
          margin: 0,
        }}
      />

      <div
        className="text-container"
        style={{
          flex: "1 1 39%",
          padding: "4rem",
          zIndex: 2, // make sure it's above the canvas
        }}
      >
        <h1 style={{ fontSize: "2.6rem", marginBottom: "1.1rem" }}>Terra Historia</h1>
        <p style={{ fontSize: "1.1rem", lineHeight: "1.6" }}>
          Explore the world through time — from ancient empires to modern nations.
          View timelines for different countries, modern or in the past, 
          and discover the evolution of history across centuries.
        </p>
        <Link className="link" to="/map"><p className="map-link" style={{ fontSize: "1.4rem", lineHeight: "1.6" }}>Start Journey →</p></Link>
      </div>
    </div>
  );
}
