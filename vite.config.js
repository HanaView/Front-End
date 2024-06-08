import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src/"),
      components: `${path.resolve(__dirname, "./src/components/")}`,
      public: `${path.resolve(__dirname, "./public/")}`,
      pages: path.resolve(__dirname, "./src/pages"),
      types: `${path.resolve(__dirname, "./src/@types")}`
    }
  },
  //scss 전역 사용
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/common/styles/scss/_var.scss" as *;`
      }
    }
  }
  ,server:{
    host:"0.0.0.0",
  }
});
