// store/useConfiguratorStore.ts
import { create } from 'zustand';

export interface MaterialConfig {
    name: string;
    hex: string;
    roughness: number;
    metalness: number;
    priceOffset: number;
    textureUrl?: string;
}

export interface DecalObj {
    id: string;
    meshId: string;
    text: string;
    color: string;
    pos: [number, number, number];
    rot: [number, number, number];
    scale: [number, number, number];
}

export const PREMIUM_MATERIALS: MaterialConfig[] = [
    { name: "PITCH BLACK (MATTE)", hex: "#111111", roughness: 0.9, metalness: 0.1, priceOffset: 0 },
    { name: "LIQUID ONYX (GLOSS)", hex: "#050505", roughness: 0.05, metalness: 0.9, priceOffset: 40 },
    { name: "TITANIUM CHROME", hex: "#e2e8f0", roughness: 0.1, metalness: 1.0, priceOffset: 80 },
    { name: "24K GOLD", hex: "#fbbf24", roughness: 0.15, metalness: 1.0, priceOffset: 120 },
    { name: "BONE WHITE", hex: "#f5f5f5", roughness: 0.8, metalness: 0.05, priceOffset: 0 },
    { name: "BLOOD RED", hex: "#7f1d1d", roughness: 0.6, metalness: 0.3, priceOffset: 20 },
    { name: "TACTICAL GREEN", hex: "#2f4f4f", roughness: 0.9, metalness: 0.1, priceOffset: 20 },
    { name: "ZEBRA SKIN", hex: "#ffffff", roughness: 0.9, metalness: 0.0, priceOffset: 90, textureUrl: "/textures/zebra.jpg" },
    { name: "BENGAL TIGER", hex: "#ffffff", roughness: 0.9, metalness: 0.0, priceOffset: 90, textureUrl: "/textures/tiger.avif" },
    { name: "CROCODILE LEATHER", hex: "#ffffff", roughness: 0.4, metalness: 0.1, priceOffset: 150, textureUrl: "/textures/krokodil.avif" },
];

interface ConfiguratorState {
    editMode: "MATERIALS" | "TEXT";
    setEditMode: (mode: "MATERIALS" | "TEXT") => void;

    materials: Record<string, MaterialConfig>;
    activeZone: string;

    decals: DecalObj[];
    selectedDecalId: string | null;

    cameraView: "PROFILE" | "FRONT" | "HEEL" | "TOP";
    isCheckoutOpen: boolean;
    snapshotImage: string | null;

    setZoneMaterial: (zone: string, mat: MaterialConfig) => void;
    setColor: (zone: string, color: string) => void;
    setActiveZone: (zone: string) => void;

    addDecal: (decal: DecalObj) => void;
    updateDecal: (id: string, updates: Partial<DecalObj>) => void;
    removeDecal: (id: string) => void;
    setSelectedDecalId: (id: string | null) => void;

    setCameraView: (view: "PROFILE" | "FRONT" | "HEEL" | "TOP") => void;
    openCheckout: (image: string) => void;
    closeCheckout: () => void;

    // NEU: Diese Funktion lädt eine gespeicherte JSON-Konfiguration in den Live-Store
    loadConfiguration: (config: { materials: Record<string, MaterialConfig>; decals: DecalObj[] }) => void;
}

export const useConfiguratorStore = create<ConfiguratorState>((set) => ({
    editMode: "MATERIALS",
    setEditMode: (mode) => set({ editMode: mode }),

    materials: {
        All: PREMIUM_MATERIALS[0],
        hinter: PREMIUM_MATERIALS[0],
        "hinter-oben": PREMIUM_MATERIALS[0],
        innen: PREMIUM_MATERIALS[0],
        schnuehsenkel: PREMIUM_MATERIALS[4],
        schuhzuenge: PREMIUM_MATERIALS[0],
        seiten: PREMIUM_MATERIALS[0],
        "seiten-hinter": PREMIUM_MATERIALS[0],
        "seiten-oben": PREMIUM_MATERIALS[0],
        "seiten-unten": PREMIUM_MATERIALS[0],
        unten: PREMIUM_MATERIALS[0],
        vorne: PREMIUM_MATERIALS[0],
        "vorne-oben": PREMIUM_MATERIALS[0],
        sohle: PREMIUM_MATERIALS[4],
    },
    activeZone: "seiten",

    decals: [],
    selectedDecalId: null,

    cameraView: "PROFILE",
    isCheckoutOpen: false,
    snapshotImage: null,

    setZoneMaterial: (zone, mat) => set((state) => ({ materials: { ...state.materials, [zone]: mat } })),
    setColor: (zone, color) => set((state) => ({
        materials: {
            ...state.materials,
            [zone]: { ...state.materials[zone], name: "CUSTOM PAINT", hex: color, textureUrl: undefined }
        }
    })),
    setActiveZone: (zone) => set({ activeZone: zone }),

    addDecal: (decal) => set((state) => ({ decals: [...state.decals, decal], selectedDecalId: decal.id })),
    updateDecal: (id, updates) => set((state) => ({
        decals: state.decals.map(d => d.id === id ? { ...d, ...updates } : d)
    })),
    removeDecal: (id) => set((state) => {
        const newDecals = state.decals.filter(d => d.id !== id);
        return { decals: newDecals, selectedDecalId: state.selectedDecalId === id ? null : state.selectedDecalId };
    }),
    setSelectedDecalId: (id) => set({ selectedDecalId: id }),

    setCameraView: (view) => set({ cameraView: view }),
    openCheckout: (image) => set({ isCheckoutOpen: true, snapshotImage: image }),
    closeCheckout: () => set({ isCheckoutOpen: false, snapshotImage: null }),

    // NEU: Überschreibt das aktuelle Material und die Texte mit den Daten aus der Collection
    loadConfiguration: (config) => set((state) => ({
        materials: { ...state.materials, ...config.materials },
        decals: config.decals || []
    })),
}));