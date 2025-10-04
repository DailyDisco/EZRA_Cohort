export class StyleConstants {
    // Grid Breakpoints (Ant Design convention)
    static XS_BREAKPOINT: number = 24;
    static SM_BREAKPOINT: number = 12;
    static LG_BREAKPOINT: number = 6;

    static SM_LABEL_COL: number = 8;
    static SM_WRAPPER_COL: number = 16;

    // Modern Spacing Scale (matches CSS custom properties)
    static SPACING = {
        XS: "0.25rem", // 4px
        SM: "0.5rem", // 8px
        MD: "1rem", // 16px
        LG: "1.5rem", // 24px
        XL: "2rem", // 32px
        "2XL": "3rem", // 48px
    } as const;

    // Border Radius Scale
    static RADIUS = {
        SM: "0.375rem", // 6px
        MD: "0.5rem", // 8px
        LG: "0.75rem", // 12px
        XL: "1rem", // 16px
    } as const;

    // Shadow Scale
    static SHADOW = {
        SM: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        MD: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        LG: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    } as const;

    // Typography Scale
    static TYPOGRAPHY = {
        FONT_FAMILY: '"Poppins", system-ui, Avenir, Helvetica, Arial, sans-serif',
        FONT_SIZES: {
            XS: "0.75rem", // 12px
            SM: "0.875rem", // 14px
            BASE: "1rem", // 16px
            LG: "1.125rem", // 18px
            XL: "1.25rem", // 20px
            "2XL": "1.5rem", // 24px
            "3XL": "1.875rem", // 30px
            "4XL": "2.25rem", // 36px
            "5XL": "3rem", // 48px
        },
        FONT_WEIGHTS: {
            NORMAL: 400,
            MEDIUM: 500,
            SEMIBOLD: 600,
            BOLD: 700,
        },
        LINE_HEIGHTS: {
            TIGHT: 1.25,
            NORMAL: 1.5,
            RELAXED: 1.625,
            LOOSE: 2,
        },
    } as const;

    // Color Palette (matches SCSS variables)
    static COLORS = {
        PRIMARY: {
            50: "#f0fdf9",
            100: "#ccfbf1",
            200: "#99f6e4",
            300: "#5eead4",
            400: "#2dd4bf",
            500: "#14b8a6",
            600: "#00674f",
            700: "#0f766e",
            800: "#115e59",
            900: "#134e4a",
        },
        SECONDARY: {
            50: "#eff6ff",
            100: "#dbeafe",
            200: "#bfdbfe",
            300: "#93c5fd",
            400: "#60a5fa",
            500: "#3b82f6",
            600: "#2563eb",
            700: "#1d4ed8",
            800: "#1e40af",
            900: "#1e3a8a",
        },
        ACCENT: {
            50: "#fef2f2",
            100: "#fee2e2",
            200: "#fecaca",
            300: "#fca5a5",
            400: "#f87171",
            500: "#ef4444",
            600: "#dc2626",
            700: "#b91c1c",
            800: "#991b1b",
            900: "#7f1d1d",
        },
        GRAY: {
            50: "#f8fafc",
            100: "#f1f5f9",
            200: "#e2e8f0",
            300: "#cbd5e1",
            400: "#94a3b8",
            500: "#64748b",
            600: "#475569",
            700: "#334155",
            800: "#1e293b",
            900: "#0f172a",
        },
        SUCCESS: "#10b981",
        WARNING: "#f59e0b",
        ERROR: "#ef4444",
        INFO: "#3b82f6",
    } as const;

    // Animation Durations
    static ANIMATION = {
        FAST: "150ms",
        NORMAL: "300ms",
        SLOW: "500ms",
    } as const;

    // Z-Index Scale
    static Z_INDEX = {
        DROPDOWN: 1000,
        STICKY: 1020,
        FIXED: 1030,
        MODAL_BACKDROP: 1040,
        MODAL: 1050,
        POPOVER: 1060,
        TOOLTIP: 1070,
        TOAST: 1080,
    } as const;
}
