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

type GLTFResult = GLTF & {
  nodes: { [key: string]: THREE.Mesh };
};

function CameraRig() {
  const { camera } = useThree();
  const { cameraView } = useConfiguratorStore();
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  useEffect(() => {
    const m = isMobile ? 1.3 : 1;
    const positions = {
      PROFILE: { x: 3.5 * m, y: 1.0, z: 4.5 * m },
      FRONT: { x: 0, y: 1.0, z: 6 * m },
      HEEL: { x: 0, y: 1.5, z: -6 * m },
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
  const [hovered, setHovered] = useState(false); // NEU: State für den Hover-Glow

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

  useEffect(() => {
    if (matRef.current) {
      matRef.current.needsUpdate = true;
    }
  }, [texture]);

  // ==========================================
  // SENIOR UX: INTERACTIVE HOVER GLOW
  // ==========================================
  useEffect(() => {
    if (matRef.current) {
      gsap.to(matRef.current, {
        emissiveIntensity: hovered ? 0.2 : 0, // Leuchtet beim Hovern auf
        duration: 0.3,
      });
    }
  }, [hovered]);

  // ==========================================
  // SENIOR UX: WAKE-UP SCAN SHIMMER
  // ==========================================
  useEffect(() => {
    if (matRef.current) {
      // Setzt die Leuchtfarbe auf reines Weiß
      matRef.current.emissive = new THREE.Color(0xffffff);

      // Jedes Teil leuchtet auf und fadet sanft ab.
      // Math.random() sorgt dafür, dass die Teile nicht exakt gleichzeitig,
      // sondern in einer coolen, schimmernden Sequenz (Wave) aufleuchten.
      gsap.fromTo(
        matRef.current,
        { emissiveIntensity: 0.6 },
        {
          emissiveIntensity: 0,
          duration: 1.2,
          ease: "power2.out",
          delay: 0.2 + Math.random() * 0.4,
        },
      );
    }
  }, [editMode]); // Feuert beim ersten Laden UND beim Wechsel der Tabs!

  if (!matConfig) return null;

  return (
    <mesh
      geometry={geometry}
      onClick={(e) => {
        e.stopPropagation();
        if (editMode === "MATERIALS") setActiveZone(name);
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
        setHovered(true); // Hover-Status aktivieren
        document.body.style.cursor =
          editMode === "TEXT" ? "crosshair" : "pointer";
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setHovered(false); // Hover-Status deaktivieren
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
    "/3d_model/shoes_material_new.glb",
  ) as unknown as GLTFResult;

  return (
    <group {...props} dispose={null}>
      <CameraRig />
      <group position={[0, 0, 0]}>
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

// FIX: Pfad aktualisiert, damit exakt die Datei gepreloadet wird, die auch benutzt wird!
useGLTF.preload("/3d_model/shoes_material_new.glb");
