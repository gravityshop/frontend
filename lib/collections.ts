// lib/collections.ts
import { MaterialConfig, DecalObj } from "@/store/useConfiguratorStore";

export interface CollectionShoe {
    id: string;
    name: string;
    tagline: string; // Kurz und knackig für das Grid
    story: string;   // Die Marketing-Story für die Detailseite
    price: number;
    imageUrl: string;
    config: {
        materials: Record<string, MaterialConfig>;
        decals: DecalObj[];
    };
}

const defMat = { name: "PITCH BLACK (MATTE)", hex: "#111111", roughness: 0.9, metalness: 0.1, priceOffset: 0 };
const defaultMaterials = {
    "schnuehsenkel": defMat,
    "schuhzuenge": defMat,
    "sohle": { name: "BONE WHITE", hex: "#f5f5f5", roughness: 0.8, metalness: 0.05, priceOffset: 0 },
    "unten": defMat,
    "vorne": defMat,
    "vorne-oben": defMat,
    "seiten": defMat,
    "seiten-oben": defMat,
    "seiten-hinter": defMat,
    "seiten-unten": defMat,
    "hinter": defMat,
    "hinter-oben": defMat,
    "innen": defMat
};

export const COLLECTION_DATA: CollectionShoe[] = [
    {
        id: "concept-001",
        name: "THE BLOOD CROC",
        tagline: "Savage Elegance.",
        story: "Forged in the underground. The 'Blood Croc' edition merges premium, hand-selected synthetic crocodile leather with deep crimson accents. A statement piece designed for those who dictate the pace of the city.",
        price: 440, // Basis 290 + 150 für Kroko
        imageUrl: "/collections/collection_shoe_1.png",
        config: {
            "materials": {
                "hinter": { "name": "BLOOD RED", "hex": "#7f1d1d", "roughness": 0.6, "metalness": 0.3, "priceOffset": 20 },
                "hinter-oben": { "name": "CROCODILE LEATHER", "hex": "#ffffff", "roughness": 0.4, "metalness": 0.1, "priceOffset": 150, "textureUrl": "/textures/krokodil.avif" },
                "innen": { "name": "CROCODILE LEATHER", "hex": "#ffffff", "roughness": 0.4, "metalness": 0.1, "priceOffset": 150, "textureUrl": "/textures/krokodil.avif" },
                "schnuehsenkel": { "name": "CROCODILE LEATHER", "hex": "#ffffff", "roughness": 0.4, "metalness": 0.1, "priceOffset": 150, "textureUrl": "/textures/krokodil.avif" },
                "schuhzuenge": { "name": "BLOOD RED", "hex": "#7f1d1d", "roughness": 0.6, "metalness": 0.3, "priceOffset": 20 },
                "seiten": { "name": "CROCODILE LEATHER", "hex": "#ffffff", "roughness": 0.4, "metalness": 0.1, "priceOffset": 150, "textureUrl": "/textures/krokodil.avif" },
                "seiten-hinter": { "name": "BLOOD RED", "hex": "#7f1d1d", "roughness": 0.6, "metalness": 0.3, "priceOffset": 20 },
                "seiten-oben": { "name": "BLOOD RED", "hex": "#7f1d1d", "roughness": 0.6, "metalness": 0.3, "priceOffset": 20 },
                "seiten-unten": { "name": "BLOOD RED", "hex": "#7f1d1d", "roughness": 0.6, "metalness": 0.3, "priceOffset": 20 },
                "unten": { "name": "CROCODILE LEATHER", "hex": "#ffffff", "roughness": 0.4, "metalness": 0.1, "priceOffset": 150, "textureUrl": "/textures/krokodil.avif" },
                "vorne": { "name": "BLOOD RED", "hex": "#7f1d1d", "roughness": 0.6, "metalness": 0.3, "priceOffset": 20 },
                "vorne-oben": { "name": "CROCODILE LEATHER", "hex": "#ffffff", "roughness": 0.4, "metalness": 0.1, "priceOffset": 150, "textureUrl": "/textures/krokodil.avif" },
                "sohle": { "name": "CROCODILE LEATHER", "hex": "#ffffff", "roughness": 0.4, "metalness": 0.1, "priceOffset": 150, "textureUrl": "/textures/krokodil.avif" } // <-- BUGFIX: zohle statt sohle!
            },
            "decals": []
        }
    },
    {
        id: "concept-002",
        name: "ONYX PURE",
        tagline: "Stealth Architecture.",
        story: "Stripped down to the absolute essentials. The Onyx Pure relies on deep, light-absorbing matte blacks contrasted with subtle gloss finishes. Maximum impact, zero noise.",
        price: 290,
        imageUrl: "/collections/collection_shoe_2.png",
        config: { materials: { ...defaultMaterials }, decals: [] }
    },
    {
        id: "concept-003",
        name: "NEON GHOST",
        tagline: "Electric Footsteps.",
        story: "A vibrant clash of bone-white mesh and highly saturated neon accents. Built to stand out in the concrete jungle, reflecting the hyper-speed of modern life.",
        price: 310,
        imageUrl: "/collections/collection_shoe_3.png",
        config: { materials: { ...defaultMaterials }, decals: [] }
    },
    {
        id: "concept-004",
        name: "CHROME PHASE",
        tagline: "Industrial Future.",
        story: "Liquid titanium meets rugged tactical mesh. The Chrome Phase reflects its environment, acting as a mirror to the city streets while providing unmatched durability.",
        price: 370,
        imageUrl: "/collections/collection_shoe_4.png",
        config: { materials: { ...defaultMaterials }, decals: [] }
    },
    // Für die Performance und Lesbarkeit hier Platzhalter 5-19. 
    // Fülle diese später mit deinen exportierten JSONs und eigenen Texten!
    ...Array.from({ length: 15 }, (_, i) => ({
        id: `concept-${String(i + 5).padStart(3, '0')}`,
        name: `LIMITED DROP 0${i + 5}`,
        tagline: "Archival Release.",
        story: "Exclusively curated from our internal design vaults. Featuring hand-picked materials and a silhouette engineered for the bold.",
        price: 350,
        imageUrl: `/collections/collection_shoe_${i + 5}.png`,
        config: { materials: { ...defaultMaterials }, decals: [] }
    }))
];