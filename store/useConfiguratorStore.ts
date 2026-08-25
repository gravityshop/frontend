import { create } from 'zustand';

export interface MaterialConfig {
    name: string;
    hex: string;
    roughness: number;
    metalness: number;
    priceOffset: number;
    textureUrl?: string;
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
    materials: Record<string, MaterialConfig>;
    activeZone: string;
    customText: string;
    textColor: string;
    decalPos: [number, number, number];
    decalRot: [number, number, number];
    decalScale: [number, number, number];
    cameraView: "PROFILE" | "FRONT" | "HEEL" | "TOP";
    isCheckoutOpen: boolean;
    snapshotImage: string | null;

    setZoneMaterial: (zone: string, mat: MaterialConfig) => void;
    setColor: (zone: string, color: string) => void; // HIER IST DER HEX-PICKER ZURÜCK
    setActiveZone: (zone: string) => void;
    setCustomText: (text: string) => void;
    setTextColor: (color: string) => void;
    setDecalTransform: (type: 'pos' | 'rot' | 'scale', axis: 0 | 1 | 2, value: number) => void;
    setCameraView: (view: "PROFILE" | "FRONT" | "HEEL" | "TOP") => void;
    openCheckout: (image: string) => void;
    closeCheckout: () => void;
}

export const useConfiguratorStore = create<ConfiguratorState>((set) => ({
    materials: {
        All: PREMIUM_MATERIALS[0],
        hinter: PREMIUM_MATERIALS[0],
        "hinter-oben": PREMIUM_MATERIALS[0],
        seiten: PREMIUM_MATERIALS[0],
        "seiten-oben": PREMIUM_MATERIALS[0],
        vorne: PREMIUM_MATERIALS[0],
        "vorne-oben": PREMIUM_MATERIALS[0],
        zohle: PREMIUM_MATERIALS[4],
    },
    activeZone: "zohle",
    customText: "",
    textColor: "#ffffff",
    decalPos: [1.2, 0.5, 0],
    decalRot: [0, Math.PI / 2, 0],
    decalScale: [0.3, 0.3, 0.3],
    cameraView: "PROFILE",
    isCheckoutOpen: false,
    snapshotImage: null,

    setZoneMaterial: (zone, mat) => set((state) => ({ materials: { ...state.materials, [zone]: mat } })),

    // Die neue Super-Funktion: Überschreibt nur die Farbe, behält Glanz/Metall-Werte des aktiven Materials!
    setColor: (zone, color) => set((state) => ({
        materials: {
            ...state.materials,
            [zone]: {
                ...state.materials[zone],
                name: "CUSTOM PAINT",
                hex: color,
                textureUrl: undefined // Entfernt das Tier-Bild, damit die Farbe sichtbar wird
            }
        }
    })),

    setActiveZone: (zone) => set({ activeZone: zone }),
    setCustomText: (text) => set({ customText: text.toUpperCase().slice(0, 10) }),
    setTextColor: (color) => set({ textColor: color }),
    setDecalTransform: (type, axis, value) =>
        set((state) => {
            const key = type === 'pos' ? 'decalPos' : type === 'rot' ? 'decalRot' : 'decalScale';
            const newTransform = [...state[key]] as [number, number, number];
            newTransform[axis] = value;
            return { [key]: newTransform };
        }),
    setCameraView: (view) => set({ cameraView: view }),
    openCheckout: (image) => set({ isCheckoutOpen: true, snapshotImage: image }),
    closeCheckout: () => set({ isCheckoutOpen: false, snapshotImage: null }),
}));