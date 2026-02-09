"use client";

import * as React from "react";
import {
  BrandConfig,
  BRAND_STORAGE_KEY,
  THEME_STORAGE_KEY,
} from "@/lib/brand-config";
import { applyBrandConfig, clearBrandFromDocument } from "@/lib/brand-utils";

type Mode = "light" | "dark";

interface BrandContextValue {
  /** Current brand configuration (null = defaults). */
  brand: BrandConfig | null;

  /** Current color mode. */
  mode: Mode;

  /** Merge partial updates into brand config & persist. */
  updateBrand: (partial: Partial<BrandConfig>) => void;

  /** Replace the entire brand config (or null to reset). */
  setBrand: (config: BrandConfig | null) => void;

  /** Switch light/dark mode. */
  setMode: (mode: Mode) => void;

  /** Whether dark mode is allowed by the current brand config. */
  allowDarkMode: boolean;

  /** True once localStorage has been read. Use to avoid FOUC. */
  hydrated: boolean;
}

const BrandContext = React.createContext<BrandContextValue | null>(null);

export function useBrand(): BrandContextValue {
  const ctx = React.useContext(BrandContext);
  if (!ctx) {
    throw new Error("useBrand must be used within a BrandProvider");
  }
  return ctx;
}

/**
 * Safely read and parse brand config from localStorage.
 */
function readBrandFromStorage(): BrandConfig | null {
  try {
    const raw = localStorage.getItem(BRAND_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    // Minimal validation: must have a primary color string
    if (typeof parsed === "object" && typeof parsed.primary === "string") {
      return parsed as BrandConfig;
    }
    return null;
  } catch {
    return null;
  }
}

function readModeFromStorage(brand: BrandConfig | null): Mode {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === "dark" || stored === "light") {
      // If brand disables dark mode, force light
      if (stored === "dark" && brand?.allowDarkMode === false) return "light";
      return stored;
    }
  } catch {
    // no-op
  }
  return brand?.defaultMode ?? "light";
}

function applyMode(mode: Mode) {
  if (typeof document !== "undefined") {
    document.documentElement.classList.toggle("dark", mode === "dark");
  }
}

export function BrandProvider({ children }: { children: React.ReactNode }) {
  const [brand, setBrandState] = React.useState<BrandConfig | null>(null);
  const [mode, setModeState] = React.useState<Mode>("light");
  const [hydrated, setHydrated] = React.useState(false);

  // Track currently-applied CSS vars so we can clean them up on change
  const appliedVarsRef = React.useRef<Record<string, string>>({});

  // --- Initialization (runs once on mount) ---
  React.useEffect(() => {
    const storedBrand = readBrandFromStorage();
    const storedMode = readModeFromStorage(storedBrand);

    setBrandState(storedBrand);
    setModeState(storedMode);
    applyMode(storedMode);
    appliedVarsRef.current = applyBrandConfig(storedBrand, storedMode);
    setHydrated(true);

    // Cross-tab sync
    const handleStorage = (e: StorageEvent) => {
      if (e.key === BRAND_STORAGE_KEY) {
        const nextBrand = readBrandFromStorage();
        setBrandState(nextBrand);
        // Re-derive mode in case allowDarkMode changed
        const currentMode = readModeFromStorage(nextBrand);
        setModeState(currentMode);
        applyMode(currentMode);
        clearBrandFromDocument(appliedVarsRef.current);
        appliedVarsRef.current = applyBrandConfig(nextBrand, currentMode);
      }
      if (e.key === THEME_STORAGE_KEY) {
        const nextMode = readModeFromStorage(brand);
        setModeState(nextMode);
        applyMode(nextMode);
        clearBrandFromDocument(appliedVarsRef.current);
        appliedVarsRef.current = applyBrandConfig(brand, nextMode);
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- Re-apply when brand or mode changes (from user actions in this tab) ---
  const applyCurrentState = React.useCallback(
    (nextBrand: BrandConfig | null, nextMode: Mode) => {
      clearBrandFromDocument(appliedVarsRef.current);
      applyMode(nextMode);
      appliedVarsRef.current = applyBrandConfig(nextBrand, nextMode);
    },
    [],
  );

  const updateBrand = React.useCallback(
    (partial: Partial<BrandConfig>) => {
      setBrandState((prev) => {
        const next = prev
          ? { ...prev, ...partial }
          : ({ primary: "oklch(0.205 0 0)", ...partial } as BrandConfig);

        try {
          localStorage.setItem(BRAND_STORAGE_KEY, JSON.stringify(next));
        } catch {
          // ignore
        }

        // Need to derive mode freshly in case allowDarkMode changed
        const nextMode =
          next.allowDarkMode === false && mode === "dark" ? "light" : mode;
        if (nextMode !== mode) {
          setModeState(nextMode);
          try {
            localStorage.setItem(THEME_STORAGE_KEY, nextMode);
          } catch {
            // ignore
          }
        }

        applyCurrentState(next, nextMode);
        return next;
      });
    },
    [mode, applyCurrentState],
  );

  const setBrand = React.useCallback(
    (config: BrandConfig | null) => {
      setBrandState(config);
      if (config) {
        try {
          localStorage.setItem(BRAND_STORAGE_KEY, JSON.stringify(config));
        } catch {
          // ignore
        }
      } else {
        try {
          localStorage.removeItem(BRAND_STORAGE_KEY);
        } catch {
          // ignore
        }
      }

      const nextMode = readModeFromStorage(config);
      setModeState(nextMode);
      try {
        localStorage.setItem(THEME_STORAGE_KEY, nextMode);
      } catch {
        // ignore
      }

      applyCurrentState(config, nextMode);
    },
    [applyCurrentState],
  );

  const setMode = React.useCallback(
    (next: Mode) => {
      // Respect allowDarkMode
      const effective =
        next === "dark" && brand?.allowDarkMode === false ? "light" : next;

      setModeState(effective);
      applyMode(effective);

      try {
        localStorage.setItem(THEME_STORAGE_KEY, effective);
      } catch {
        // ignore
      }

      clearBrandFromDocument(appliedVarsRef.current);
      appliedVarsRef.current = applyBrandConfig(brand, effective);
    },
    [brand],
  );

  const allowDarkMode = brand?.allowDarkMode !== false;

  const value = React.useMemo<BrandContextValue>(
    () => ({
      brand,
      mode,
      updateBrand,
      setBrand,
      setMode,
      allowDarkMode,
      hydrated,
    }),
    [brand, mode, updateBrand, setBrand, setMode, allowDarkMode, hydrated],
  );

  return (
    <BrandContext.Provider value={value}>{children}</BrandContext.Provider>
  );
}
