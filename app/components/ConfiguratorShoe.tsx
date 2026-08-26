"use client";

import * as THREE from "three";
import React, { useEffect, useState, useRef, JSX } from "react";
import {
  useGLTF,
  Decal,
  RenderTexture,
  PerspectiveCamera,
  Text,
} from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { GLTF } from "three-stdlib";
import gsap from "gsap";
import { useConfiguratorStore } from "@/store/useConfiguratorStore";

// KOMMENTAR: Definiert die Struktur der 3D-Datei für TypeScript
type GLTFResult = GLTF & {
  nodes: { [key: string]: THREE.Mesh };
};

// KOMMENTAR: Kamera-Rig, das sanft animiert, wenn du auf "Profile", "Top", etc. klickst
function CameraRig() {
  const { camera } = useThree();
  const { cameraView } = useConfiguratorStore();
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  useEffect(() => {
    const m = isMobile ? 1.3 : 1;
    const positions = {
      PROFILE: { x: 3.5 * m, y: 1.0, z: 4.5 * m },
      LEFT_SIDE: { x: 0, y: 1.0, z: 6 * m },
      RIGHT_SIDE: { x: 0, y: 1.5, z: -6 * m },
      TOP: { x: 0, y: 6 * m, z: 0.1 },
    };

    gsap.to(camera.position, {
      x: positions[cameraView].x,
      y: positions[cameraView].y,
      z: positions[cameraView].z,
      duration: 1.5,
      ease: "power3.inOut",
    });
  }, [cameraView, camera, isMobile]);

  return null;
}

// KOMMENTAR: Diese interne Komponente baut jedes Einzelteil des Schuhs
const MeshZone = ({
  meshId,
  name,
  geometry,
}: {
  meshId: string;
  name: string;
  geometry: THREE.BufferGeometry;
}) => {
  const matConfig = useConfiguratorStore((state) => state.materials[name]);
  const setActiveZone = useConfiguratorStore((state) => state.setActiveZone);
  const editMode = useConfiguratorStore((state) => state.editMode);
  const addDecal = useConfiguratorStore((state) => state.addDecal);
  const allDecals = useConfiguratorStore((state) => state.decals);

  const decals = allDecals.filter((d) => d.meshId === meshId);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  const matRef = useRef<THREE.MeshStandardMaterial>(null);

  // KOMMENTAR: Texturen (wie Zebra) sicher laden
  useEffect(() => {
    if (matConfig?.textureUrl) {
      new THREE.TextureLoader().load(
        matConfig.textureUrl,
        (tex) => {
          tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
          tex.repeat.set(4, 4);
          tex.colorSpace = THREE.SRGBColorSpace;
          setTexture(tex);
        },
        undefined,
        () => setTexture(null),
      );
    } else {
      setTexture(null);
    }
  }, [matConfig?.textureUrl]);

  // KOMMENTAR: Zwingt die Grafikkarte, neue Bilder direkt anzuzeigen
  useEffect(() => {
    if (matRef.current) {
      matRef.current.needsUpdate = true;
    }
  }, [texture]);

  if (!matConfig) return null;

  return (
    <mesh
      geometry={geometry}
      onClick={(e) => {
        e.stopPropagation();
        if (editMode === "MATERIALS") {
          setActiveZone(name);
        }
      }}
      onDoubleClick={(e) => {
        e.stopPropagation();
        if (editMode === "TEXT") {
          const newId = Math.random().toString(36).substring(2, 9);
          const localPos = e.object.worldToLocal(e.point.clone());
          const localNormal =
            e.face?.normal?.clone() || new THREE.Vector3(0, 0, 1);

          const dummy = new THREE.Object3D();
          dummy.position.copy(localPos);
          dummy.lookAt(localPos.clone().add(localNormal));

          addDecal({
            id: newId,
            meshId: meshId,
            text: "NEW",
            color: "#ffffff",
            pos: [localPos.x, localPos.y, localPos.z],
            rot: [dummy.rotation.x, dummy.rotation.y, dummy.rotation.z],
            scale: [0.6, 0.2, 0.6],
          });
        }
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor =
          editMode === "TEXT" ? "crosshair" : "pointer";
      }}
      onPointerOut={() => {
        document.body.style.cursor = "auto";
      }}
    >
      <meshStandardMaterial
        ref={matRef}
        color={matConfig.hex}
        roughness={matConfig.roughness}
        metalness={matConfig.metalness}
        map={texture || null}
      />

      {decals.map((decal) => (
        <Decal
          key={decal.id}
          position={decal.pos}
          rotation={decal.rot}
          scale={decal.scale}
        >
          <meshStandardMaterial
            transparent
            polygonOffset
            polygonOffsetFactor={-1}
            roughness={0.4}
            metalness={0.1}
          >
            <RenderTexture attach="map">
              <PerspectiveCamera
                makeDefault
                manual
                aspect={3}
                position={[0, 0, 5]}
              />
              <Text
                fontSize={2.5}
                color={decal.color}
                anchorX="center"
                anchorY="middle"
              >
                {decal.text}
              </Text>
            </RenderTexture>
          </meshStandardMaterial>
        </Decal>
      ))}
    </mesh>
  );
};

export function ConfiguratorShoe(props: JSX.IntrinsicElements["group"]) {
  const { nodes } = useGLTF(
    "/3d_model/sheos_material_new.glb",
  ) as unknown as GLTFResult;

  return (
    <group {...props} dispose={null}>
      <CameraRig />
      <group position={[0, 0, 0]}>
        {/* ========================================================
            DER FIX: Die Zeile mit "MeshZone meshId=All" 
            wurde hier KOMPLETT gelöscht. Der zweite Schuh ist weg!
            ======================================================== */}

        <MeshZone
          meshId="hinter"
          name="hinter"
          geometry={nodes.hinter.geometry}
        />
        <MeshZone
          meshId="hinter-oben"
          name="hinter-oben"
          geometry={nodes["hinter-oben"].geometry}
        />
        <MeshZone meshId="innen" name="innen" geometry={nodes.innen.geometry} />
        <MeshZone
          meshId="schnuehsenkel"
          name="schnuehsenkel"
          geometry={nodes.schnuehsenkel.geometry}
        />
        <MeshZone
          meshId="schuhzuenge"
          name="schuhzuenge"
          geometry={nodes.schuhzuenge.geometry}
        />
        <MeshZone
          meshId="seiten"
          name="seiten"
          geometry={nodes.seiten.geometry}
        />
        <MeshZone
          meshId="seiten-hinter"
          name="seiten-hinter"
          geometry={nodes["seiten-hinter"].geometry}
        />
        <MeshZone
          meshId="seiten-oben"
          name="seiten-oben"
          geometry={nodes["seiten-oben"].geometry}
        />
        <MeshZone
          meshId="seiten-unten"
          name="seiten-unten"
          geometry={nodes["seiten-unten"].geometry}
        />
        <MeshZone meshId="unten" name="unten" geometry={nodes.unten.geometry} />
        <MeshZone meshId="vorne" name="vorne" geometry={nodes.vorne.geometry} />
        <MeshZone
          meshId="vorne-oben"
          name="vorne-oben"
          geometry={nodes["vorne-oben"].geometry}
        />

        <MeshZone
          meshId="sohle_0"
          name="sohle"
          geometry={nodes.tmpf02s7d6_ply001.geometry}
        />
        <MeshZone
          meshId="sohle_1"
          name="sohle"
          geometry={nodes.tmpf02s7d6_ply001_1.geometry}
        />
        <MeshZone
          meshId="sohle_2"
          name="sohle"
          geometry={nodes.tmpf02s7d6_ply001_2.geometry}
        />
      </group>
    </group>
  );
}

useGLTF.preload("/3d_model/sheos_material_new.glb");
