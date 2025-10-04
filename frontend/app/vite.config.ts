import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
    // envDir: "../../.env",
    plugins: [
        react(),
        // ...,
    ],
    server: {
        host: "0.0.0.0",
        port: 3000,
        allowedHosts: ["frontend-production-aa55.up.railway.app"],
    },
    // These build options make the build more resilient in CI environments
    build: {
        // Generate sourcemaps for better debugging
        sourcemap: true,
        // Continue build despite warnings
        reportCompressedSize: false,
    },
});
