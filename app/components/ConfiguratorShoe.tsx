"use client";

import * as THREE from "three";
import React, { useMemo, useEffect, useState, JSX } from "react";
import { useGLTF, Text } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { GLTF } from "three-stdlib";
import gsap from "gsap";
import { useConfiguratorStore } from "@/store/useConfiguratorStore";

type GLTFResult = GLTF & {
  nodes: { [key: string]: THREE.Mesh };
};

// Responsiver Camera-Rig (Zieht die Kamera auf dem Handy etwas zurück)
function CameraRig() {
  const { camera } = useThree();
  const { cameraView } = useConfiguratorStore();
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  useEffect(() => {
    // Auf Mobile zoomen wir etwas weiter raus, damit der Schuh Platz hat
    const m = isMobile ? 1.3 : 1;
    const positions = {
      PROFILE: { x: 3.5 * m, y: 1.0, z: 4.5 * m },
      FRONT: { x: 0, y: 1.0, z: 6 * m },
      HEEL: { x: 0, y: 1.5, z: -6 * m },
      TOP: { x: 0, y: 6 * m, z: 0.1 },
    };
    const target = positions[cameraView];

    gsap.to(camera.position, {
      x: target.x,
      y: target.y,
      z: target.z,
      duration: 1.5,
      ease: "power3.inOut",
    });
  }, [cameraView, camera, isMobile]);

  return null;
}

export function ConfiguratorShoe(props: JSX.IntrinsicElements["group"]) {
  const { nodes } = useGLTF(
    "/3d_model/raw_shoe_v1.glb",
  ) as unknown as GLTFResult;
  const {
    materials,
    setActiveZone,
    customText,
    textColor,
    decalPos,
    decalRot,
    decalScale,
  } = useConfiguratorStore();

  const baseMaterial = useMemo(() => new THREE.MeshStandardMaterial(), []);

  const MeshZone = ({
    name,
    geometry,
  }: {
    name: keyof typeof materials;
    geometry: THREE.BufferGeometry;
  }) => {
    const matConfig = materials[name];
    const [texture, setTexture] = useState<THREE.Texture | null>(null);

    // Lädt Texturen sicher im Hintergrund (verhindert Abstürze, falls das Bild nicht da ist)
    useEffect(() => {
      if (matConfig.textureUrl) {
        new THREE.TextureLoader().load(
          matConfig.textureUrl,
          (tex) => {
            tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
            tex.repeat.set(3, 3); // Wie oft sich das Muster wiederholt
            setTexture(tex);
          },
          undefined,
          () => setTexture(null),
        ); // Fehlerfall ignorieren
      } else {
        setTexture(null);
      }
    }, [matConfig.textureUrl]);

    const material = baseMaterial.clone();
    material.color = new THREE.Color(matConfig.hex);
    material.roughness = matConfig.roughness;
    material.metalness = matConfig.metalness;
    if (texture) material.map = texture;

    return (
      <mesh
        geometry={geometry}
        material={material}
        onClick={(e) => {
          e.stopPropagation();
          setActiveZone(name);
        }}
        onPointerOver={() => (document.body.style.cursor = "pointer")}
        onPointerOut={() => (document.body.style.cursor = "auto")}
      />
    );
  };

  return (
    <group {...props} dispose={null}>
      <CameraRig />
      <group position={[0, 0, 0]}>
        <MeshZone name="All" geometry={nodes.All.geometry} />
        <MeshZone name="hinter" geometry={nodes.hinter.geometry} />
        <MeshZone name="hinter-oben" geometry={nodes["hinter-oben"].geometry} />
        <MeshZone name="seiten" geometry={nodes.seiten.geometry} />
        <MeshZone name="seiten-oben" geometry={nodes["seiten-oben"].geometry} />
        <MeshZone name="vorne" geometry={nodes.vorne.geometry} />
        <MeshZone name="vorne-oben" geometry={nodes["vorne-oben"].geometry} />
        <MeshZone name="zohle" geometry={nodes.zohle.geometry} />

        {customText && (
          <Text
            position={decalPos}
            rotation={decalRot}
            scale={decalScale}
            color={textColor}
            fontSize={1}
            anchorX="center"
            anchorY="middle"
            material-toneMapped={false}
          >
            {customText}
          </Text>
        )}
      </group>
    </group>
  );
}

useGLTF.preload("/3d_model/raw_shoe_v1.glb");
