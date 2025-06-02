import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

const removeConsolePlugin = () => {
  return {
    name: "remove-console",
    transform(code: string, id: string) {
      if (
        process.env.NODE_ENV === "production" &&
        (id.endsWith(".ts") ||
          id.endsWith(".tsx") ||
          id.endsWith(".js") ||
          id.endsWith(".jsx"))
      ) {
        return {
          code: code.replace(
            /console\.(log|debug|info|warn|error|trace|dir|dirxml|table|assert|count|countReset|group|groupCollapsed|groupEnd|time|timeEnd|timeLog|clear)\s*\([^)]*\);?/g,
            ""
          ),
          map: null,
        };
      }
    },
  };
};

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), ...(mode === "production" ? [removeConsolePlugin()] : [])],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
