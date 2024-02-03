import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
    clearScreen: false,
    server: {
        strictPort: true
    },
    envPrefix: [
        "VITE_",
        "TAURI_PLATFORM",
        "TAURI_ARCH",
        "TAURI_FAMILY",
        "TAURI_PLATFORM_VERSION",
        "TAURI_PLATFORM_TYPE",
        "TAURI_DEBUG"
    ],
    build: {
        target:
            process.env.TAURI_PLATFORM == "windows" ? "chrome105" : "safari13",
        minify: !process.env.TAURI_DEBUG ? "esbuild" : false,
        sourcemap: !!process.env.TAURI_DEBUG
    },
    plugins: [svelte(), tsconfigPaths()]
});
